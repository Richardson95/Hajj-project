"use client";

import { useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  Eye,
  EyeOff,
  NotebookPen,
  Plus,
  Share2,
  Trash2,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, Pill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader, Stat } from "@/components/ui/misc";
import { Field, Select, TextArea, TextInput } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { SegmentedControl } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { Mosque } from "@/components/brand-icons";
import { useApp } from "@/lib/store";
import { MOOD_META } from "@/lib/data/journey";
import { STAGE_ORDER } from "@/lib/data/itinerary";
import { PILGRIM_GROUP } from "@/lib/data/map";
import { formatLongDate } from "@/lib/format";
import type { JournalEntry, RitualStage } from "@/lib/types";
import { cn } from "@/lib/cn";

type Filter = "all" | "shared" | "private";

const MOODS: JournalEntry["mood"][] = ["grateful", "reflective", "joyful", "humbled"];

export default function JournalPage() {
  const { journal, addJournalEntry, removeJournalEntry, user } = useApp();
  const { toast } = useToast();

  const [filter, setFilter] = useState<Filter>("all");
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState({
    title: "",
    body: "",
    stage: "Makkah" as RitualStage,
    mood: "grateful" as JournalEntry["mood"],
    shared: false,
  });
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({});

  const visible = useMemo(
    () =>
      journal.filter((e) => {
        if (filter === "shared") return e.shared;
        if (filter === "private") return !e.shared;
        return true;
      }),
    [journal, filter],
  );

  const words = journal.reduce((n, e) => n + e.body.split(/\s+/).length, 0);

  function save() {
    const next: typeof errors = {};
    if (draft.title.trim().length < 3) next.title = "Give this entry a title.";
    if (draft.body.trim().length < 20)
      next.body = "Write a little more — at least 20 characters.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    addJournalEntry({
      title: draft.title.trim(),
      body: draft.body.trim(),
      stage: draft.stage,
      mood: draft.mood,
      shared: draft.shared,
      date: new Date().toISOString(),
    });
    setDraft({ title: "", body: "", stage: "Makkah", mood: "grateful", shared: false });
    setComposerOpen(false);
    toast({ title: "Entry saved to your journal" });
  }

  return (
    <>
      <PageHeader
        title="Testimonial journal"
        description="Write it down while it is still fresh. In twenty years this will matter more than the photographs."
        action={
          <Button onClick={() => setComposerOpen(true)}>
            <Plus className="size-4" />
            New entry
          </Button>
        }
      />

      {/* Badge card */}
      <Card className="mb-5 overflow-hidden">
        <div className="relative bg-linear-to-br from-gold-500 via-gold-600 to-forest-900 p-6 text-white sm:p-7">
          <div className="pattern-islamic pointer-events-none absolute inset-0 opacity-35" />
          <div className="relative flex flex-wrap items-center gap-5">
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <Mosque className="size-8" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold tracking-[0.16em] text-white/70 uppercase">
                Pilgrimage completion badge
              </p>
              <p className="mt-1.5 text-2xl font-extrabold">
                {user.hajjCompleted
                  ? `${user.honorific ?? "Al-Hajji"} ${user.firstName} ${user.lastName}`
                  : "Awaiting your return"}
              </p>
              <p className="mt-1 text-sm text-white/75">
                {user.hajjCompleted
                  ? `Verified · 1448 AH · ${PILGRIM_GROUP.name}`
                  : "Your Al-Hajji badge unlocks automatically once your group manifest is confirmed landed in Nigeria."}
              </p>
            </div>
            <Badge tone="gold" className="bg-white/20 text-white ring-white/30">
              {user.hajjCompleted ? "Verified" : "Locked"}
            </Badge>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="Entries written"
          value={journal.length}
          detail={`${words.toLocaleString("en-NG")} words recorded`}
          icon={<NotebookPen className="size-4" />}
        />
        <Stat
          label="Shared publicly"
          value={journal.filter((e) => e.shared).length}
          detail="Visible on the community wall"
          icon={<Share2 className="size-4" />}
          tone="gold"
        />
        <Stat
          label="Kept private"
          value={journal.filter((e) => !e.shared).length}
          detail="Only you can ever read these"
          icon={<EyeOff className="size-4" />}
          tone="info"
        />
      </div>

      <SegmentedControl
        className="mt-5"
        items={[
          { id: "all", label: "All entries", count: journal.length },
          {
            id: "shared",
            label: "Shared",
            count: journal.filter((e) => e.shared).length,
          },
          {
            id: "private",
            label: "Private",
            count: journal.filter((e) => !e.shared).length,
          },
        ]}
        value={filter}
        onChange={(f) => setFilter(f as Filter)}
      />

      {visible.length === 0 ? (
        <EmptyState
          className="mt-5"
          icon={<BookOpen className="size-6" />}
          title="Nothing written yet"
          description="Even three sentences a day will become something you treasure."
          action={<Button onClick={() => setComposerOpen(true)}>Write your first entry</Button>}
        />
      ) : (
        <div className="mt-5 space-y-4">
          {visible.map((entry) => {
            const mood = MOOD_META[entry.mood];
            return (
              <Card key={entry.id}>
                <CardBody>
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill tone="brand">{entry.stage}</Pill>
                    <span
                      className={cn(
                        "rounded-lg px-2 py-1 text-xs font-medium",
                        mood.tone,
                      )}
                    >
                      {mood.label}
                    </span>
                    <Pill tone={entry.shared ? "gold" : "neutral"} icon={entry.shared ? <Eye className="size-3" /> : <EyeOff className="size-3" />}>
                      {entry.shared ? "Shared" : "Private"}
                    </Pill>
                    <span
                      suppressHydrationWarning
                      className="ml-auto text-[0.6875rem] text-muted"
                    >
                      {formatLongDate(entry.date)}
                    </span>
                  </div>

                  <h2 className="mt-3 text-lg font-bold text-ink">{entry.title}</h2>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed whitespace-pre-line text-muted">
                    {entry.body}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard?.writeText(`${entry.title}\n\n${entry.body}`);
                        toast({ title: "Entry copied", tone: "info" });
                      }}
                    >
                      <Share2 className="size-3.5" />
                      Copy
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      onClick={() => {
                        removeJournalEntry(entry.id);
                        toast({ title: "Entry deleted", tone: "info" });
                      }}
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </Button>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="mt-6">
        <CardHeader
          title="Prompts, if the words will not come"
          description="Pick one and write for five minutes without stopping."
          icon={<Award className="size-4" />}
        />
        <CardBody className="grid gap-3 sm:grid-cols-2">
          {[
            "What did you feel the first time you saw the Ka'bah?",
            "Who asked you to pray for them, and what did you ask for?",
            "What was the hardest hour, and what got you through it?",
            "Describe one act of kindness from a stranger.",
            "What will you do differently when you get home?",
            "What would you tell someone saving for their first Hajj?",
          ].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setDraft((d) => ({ ...d, title: p }));
                setComposerOpen(true);
              }}
              className="rounded-xl border border-line bg-surface-muted/50 p-3.5 text-left text-[0.8125rem] leading-relaxed text-muted transition hover:border-forest-800/30 hover:text-ink"
            >
              {p}
            </button>
          ))}
        </CardBody>
      </Card>

      {/* Composer */}
      <Modal
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        title="New journal entry"
        description="Nobody sees this unless you choose to share it."
        footer={
          <>
            <Button variant="ghost" onClick={() => setComposerOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>Save entry</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Title" required error={errors.title} htmlFor="jr-title">
            <TextInput
              id="jr-title"
              value={draft.title}
              onChange={(e) => {
                setDraft((d) => ({ ...d, title: e.target.value }));
                setErrors((x) => ({ ...x, title: undefined }));
              }}
              placeholder="The night I finally saw it"
              invalid={Boolean(errors.title)}
            />
          </Field>

          <Field label="Your reflection" required error={errors.body} htmlFor="jr-body">
            <TextArea
              id="jr-body"
              value={draft.body}
              onChange={(e) => {
                setDraft((d) => ({ ...d, body: e.target.value }));
                setErrors((x) => ({ ...x, body: undefined }));
              }}
              placeholder="Write freely. There is no wrong way to do this."
              rows={8}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Stage of the journey" htmlFor="jr-stage">
              <Select
                id="jr-stage"
                value={draft.stage}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, stage: e.target.value as RitualStage }))
                }
              >
                {STAGE_ORDER.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
            </Field>
            <Field label="How did it feel?" htmlFor="jr-mood">
              <Select
                id="jr-mood"
                value={draft.mood}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    mood: e.target.value as JournalEntry["mood"],
                  }))
                }
              >
                {MOODS.map((m) => (
                  <option key={m} value={m}>
                    {MOOD_META[m].label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <SegmentedControl
            items={[
              { id: "private", label: "Keep private" },
              { id: "shared", label: "Share to the wall" },
            ]}
            value={draft.shared ? "shared" : "private"}
            onChange={(v) => setDraft((d) => ({ ...d, shared: v === "shared" }))}
          />
        </div>
      </Modal>
    </>
  );
}
