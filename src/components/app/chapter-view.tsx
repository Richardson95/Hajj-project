"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  Clock,
  Copy,
  Lightbulb,
  Share2,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, Pill } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { useToast } from "@/components/ui/toast";
import { AudioNarration } from "./audio-narration";
import type { GuideChapter } from "@/lib/types";
import { cn } from "@/lib/cn";

export function ChapterView({
  chapter,
  previous,
  next,
}: {
  chapter: GuideChapter;
  previous: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
}) {
  const { toast } = useToast();
  const [read, setRead] = useState<string[]>([]);

  const pct = Math.round((read.length / chapter.steps.length) * 100);

  function toggle(id: string) {
    setRead((r) => (r.includes(id) ? r.filter((x) => x !== id) : [...r, id]));
  }

  const narrationParagraphs = [
    `${chapter.title}. ${chapter.summary}`,
    ...chapter.steps.map(
      (s) => `Step ${s.order}. ${s.title}. ${s.body}${s.tip ? ` Note: ${s.tip}` : ""}`,
    ),
  ];

  return (
    <>
      <Link
        href="/app/guide"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-ink"
      >
        <ChevronLeft className="size-4" />
        Guide library
      </Link>

      {/* Header */}
      <Card className="mt-4 overflow-hidden">
        <div className="relative bg-forest-900 p-6 text-white sm:p-8">
          <div className="pattern-islamic pointer-events-none absolute inset-0 opacity-40" />
          <div className="pointer-events-none absolute -right-16 -bottom-20 size-60 rounded-full bg-gold-500/15 blur-3xl" />

          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="gold">{chapter.stage}</Badge>
              <span className="inline-flex items-center gap-1.5 text-xs text-white/60">
                <Clock className="size-3.5" />
                {chapter.readMinutes} min read
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-white/60">
                <BookOpen className="size-3.5" />
                {chapter.steps.length} steps
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {chapter.title}
            </h1>
            <p
              lang="ar"
              dir="rtl"
              className="font-serif mt-1 text-2xl text-gold-300 sm:text-3xl"
            >
              {chapter.arabicTitle}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70">
              {chapter.summary}
            </p>
          </div>
        </div>

        <CardBody className="space-y-4">
          <ProgressBar value={pct} label="Steps marked as understood" showValue />
          <AudioNarration
            title={chapter.title}
            paragraphs={narrationParagraphs}
            languages={chapter.audioLanguages}
          />
        </CardBody>
      </Card>

      {/* Steps */}
      <section className="mt-6">
        <h2 className="text-lg font-bold text-ink">How to perform it</h2>
        <p className="mt-0.5 mb-4 text-sm text-muted">
          Follow the steps in order. Tick each one as you understand it.
        </p>

        <ol className="space-y-4">
          {chapter.steps.map((step) => {
            const done = read.includes(step.id);
            return (
              <li key={step.id}>
                <Card
                  className={cn(
                    "transition",
                    done && "border-forest-800/25 bg-forest-50/40 dark:bg-forest-950/30",
                  )}
                >
                  <CardBody className="flex gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <span
                        className={cn(
                          "tabular grid size-9 shrink-0 place-items-center rounded-xl text-sm font-bold",
                          done
                            ? "bg-forest-800 text-white"
                            : "bg-forest-50 text-forest-800 dark:bg-forest-950 dark:text-gold-300",
                        )}
                      >
                        {step.order}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggle(step.id)}
                        aria-pressed={done}
                        aria-label={`Mark step ${step.order} as ${done ? "not read" : "read"}`}
                        className={cn(
                          "grid size-6 place-items-center rounded-lg border-2 transition",
                          done
                            ? "border-forest-800 bg-forest-800 text-white dark:border-forest-500 dark:bg-forest-600"
                            : "border-line-strong hover:border-forest-700",
                        )}
                      >
                        {done ? <Check className="size-3.5" strokeWidth={3} /> : null}
                      </button>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-ink">{step.title}</h3>
                        <Pill
                          tone={
                            step.obligation === "Fard"
                              ? "danger"
                              : step.obligation === "Wajib"
                                ? "warning"
                                : "neutral"
                          }
                        >
                          {step.obligation}
                        </Pill>
                      </div>
                      <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                        {step.body}
                      </p>
                      {step.tip ? (
                        <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-gold-500/30 bg-gold-50/60 p-3.5 dark:bg-gold-950/25">
                          <Lightbulb className="mt-0.5 size-4 shrink-0 text-gold-700 dark:text-gold-400" />
                          <p className="text-[0.8125rem] leading-relaxed text-ink/80">
                            {step.tip}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </CardBody>
                </Card>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Du'ās */}
      <section id="duas" className="mt-8 scroll-mt-24">
        <h2 className="text-lg font-bold text-ink">Du&apos;ās for this rite</h2>
        <p className="mt-0.5 mb-4 text-sm text-muted">
          Arabic, transliteration and meaning — memorise what you can, read the rest.
        </p>

        <div className="space-y-4">
          {chapter.duas.map((d) => (
            <Card key={d.id}>
              <CardHeader
                title={d.title}
                description={d.occasion}
                action={
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard?.writeText(
                        `${d.arabic}\n\n${d.transliteration}\n\n${d.translation}`,
                      );
                      toast({ title: "Du'ā copied", tone: "info" });
                    }}
                  >
                    <Copy className="size-3.5" />
                    Copy
                  </Button>
                }
              />
              <CardBody className="space-y-4">
                <p
                  lang="ar"
                  dir="rtl"
                  className="font-serif rounded-2xl bg-surface-muted p-5 text-2xl leading-loose text-ink sm:text-[1.75rem]"
                >
                  {d.arabic}
                </p>
                <div>
                  <p className="text-[0.6875rem] font-semibold tracking-wider text-muted uppercase">
                    Transliteration
                  </p>
                  <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted italic">
                    {d.transliteration}
                  </p>
                </div>
                <div>
                  <p className="text-[0.6875rem] font-semibold tracking-wider text-muted uppercase">
                    Translation
                  </p>
                  <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink/85">
                    {d.translation}
                  </p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Share + navigation */}
      <Card className="mt-8">
        <CardBody className="flex flex-wrap items-center gap-3">
          <p className="min-w-0 flex-1 text-sm text-muted">
            Send this chapter to someone travelling with you.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const url = `${window.location.origin}/app/guide/${chapter.slug}`;
              navigator.clipboard?.writeText(url);
              toast({ title: "Link copied", description: url, tone: "info" });
            }}
          >
            <Share2 className="size-3.5" />
            Copy link
          </Button>
        </CardBody>
      </Card>

      <nav className="mt-5 grid gap-3 sm:grid-cols-2">
        {previous ? (
          <ButtonLink
            href={`/app/guide/${previous.slug}`}
            variant="outline"
            className="h-auto justify-start px-5 py-4 text-left"
          >
            <ArrowLeft className="size-4 shrink-0" />
            <span className="min-w-0">
              <span className="block text-[0.6875rem] tracking-wider text-muted uppercase">
                Previous
              </span>
              <span className="block truncate text-sm font-semibold">
                {previous.title}
              </span>
            </span>
          </ButtonLink>
        ) : (
          <span />
        )}
        {next ? (
          <ButtonLink
            href={`/app/guide/${next.slug}`}
            variant="outline"
            className="h-auto justify-end px-5 py-4 text-right sm:col-start-2"
          >
            <span className="min-w-0">
              <span className="block text-[0.6875rem] tracking-wider text-muted uppercase">
                Next
              </span>
              <span className="block truncate text-sm font-semibold">{next.title}</span>
            </span>
            <ArrowRight className="size-4 shrink-0" />
          </ButtonLink>
        ) : null}
      </nav>
    </>
  );
}
