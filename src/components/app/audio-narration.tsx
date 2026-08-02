"use client";

import { useCallback, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Info, Pause, Play, Square, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/tabs";
import { LANGUAGES } from "@/lib/data/guide";
import { useHydrated } from "@/lib/client-hooks";
import type { LanguageCode } from "@/lib/types";

const BCP47: Record<LanguageCode, string> = {
  en: "en-GB",
  ha: "ha-NG",
  yo: "yo-NG",
  ig: "ig-NG",
  ar: "ar-SA",
};

/* ---- Installed speech voices, exposed as an external store ---- */

const NO_VOICES: SpeechSynthesisVoice[] = [];
let voiceCache: SpeechSynthesisVoice[] = NO_VOICES;

function supportsSpeech(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function subscribeVoices(callback: () => void) {
  if (!supportsSpeech()) return () => {};
  const update = () => {
    voiceCache = window.speechSynthesis.getVoices();
    callback();
  };
  update();
  window.speechSynthesis.addEventListener("voiceschanged", update);
  return () => window.speechSynthesis.removeEventListener("voiceschanged", update);
}

const getVoices = () => voiceCache;
const getServerVoices = () => NO_VOICES;

/**
 * Narrates the chapter using the browser's built-in speech synthesis.
 * Where the device has no voice for the chosen language we say so plainly
 * rather than pretending to play something.
 */
export function AudioNarration({
  title,
  paragraphs,
  languages,
}: {
  title: string;
  paragraphs: string[];
  languages: LanguageCode[];
}) {
  const hydrated = useHydrated();
  const voices = useSyncExternalStore(subscribeVoices, getVoices, getServerVoices);

  const [language, setLanguage] = useState<LanguageCode>(languages[0] ?? "en");
  const [state, setState] = useState<"idle" | "playing" | "paused">("idle");
  const [progress, setProgress] = useState(0);
  const indexRef = useRef(0);

  const voice = useMemo(() => {
    const tag = BCP47[language];
    return (
      voices.find((v) => v.lang.toLowerCase() === tag.toLowerCase()) ??
      voices.find((v) => v.lang.toLowerCase().startsWith(language)) ??
      null
    );
  }, [voices, language]);

  const stop = useCallback(() => {
    if (supportsSpeech()) window.speechSynthesis.cancel();
    indexRef.current = 0;
    setProgress(0);
    setState("idle");
  }, []);

  const speakFrom = useCallback(
    (start: number) => {
      const synth = window.speechSynthesis;
      synth.cancel();
      paragraphs.slice(start).forEach((text, i) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = BCP47[language];
        if (voice) utterance.voice = voice;
        utterance.rate = 0.95;
        utterance.onend = () => {
          const done = start + i + 1;
          indexRef.current = done;
          setProgress(Math.round((done / paragraphs.length) * 100));
          if (done >= paragraphs.length) {
            indexRef.current = 0;
            setState("idle");
            setProgress(0);
          }
        };
        synth.speak(utterance);
      });
      setState("playing");
    },
    [paragraphs, language, voice],
  );

  function toggle() {
    if (!supportsSpeech()) return;
    const synth = window.speechSynthesis;
    if (state === "playing") {
      synth.pause();
      setState("paused");
      return;
    }
    if (state === "paused") {
      synth.resume();
      setState("playing");
      return;
    }
    speakFrom(indexRef.current);
  }

  function changeLanguage(next: LanguageCode) {
    stop();
    setLanguage(next);
  }

  const unavailable = hydrated && (!supportsSpeech() || (voices.length > 0 && !voice));

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-forest-50 text-forest-800 dark:bg-forest-950 dark:text-gold-300">
          <Volume2 className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">Listen to this chapter</p>
          <p className="truncate text-xs text-muted">{title}</p>
        </div>
        <SegmentedControl
          size="sm"
          items={LANGUAGES.filter((l) => languages.includes(l.code)).map((l) => ({
            id: l.code,
            label: l.native,
          }))}
          value={language}
          onChange={changeLanguage}
          className="w-auto"
        />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Button size="sm" onClick={toggle} disabled={unavailable}>
          {state === "playing" ? <Pause className="size-4" /> : <Play className="size-4" />}
          {state === "playing" ? "Pause" : state === "paused" ? "Resume" : "Play"}
        </Button>
        {state !== "idle" ? (
          <Button variant="ghost" size="sm" onClick={stop}>
            <Square className="size-3.5" />
            Stop
          </Button>
        ) : null}
        <div
          className="ml-auto h-1.5 w-full max-w-48 overflow-hidden rounded-full bg-surface-muted"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Narration progress"
        >
          <div
            className="h-full rounded-full bg-forest-800 transition-[width] duration-500 dark:bg-gold-400"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {unavailable ? (
        <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted">
          <Info className="mt-0.5 size-3.5 shrink-0 text-amber-600" />
          {supportsSpeech()
            ? `Your device has no ${LANGUAGES.find((l) => l.code === language)?.label} voice installed, so live narration is unavailable in this language. Recorded narrations are added to the library ahead of each season.`
            : "This browser does not support speech synthesis, so narration is unavailable."}
        </p>
      ) : null}
    </div>
  );
}
