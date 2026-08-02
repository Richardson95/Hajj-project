"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  Clock,
  Languages,
  ListChecks,
  Search,
  Volume2,
  WifiOff,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, Pill } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, PageHeader, Stat } from "@/components/ui/misc";
import { TextInput } from "@/components/ui/field";
import { SegmentedControl } from "@/components/ui/tabs";
import { Kaaba } from "@/components/brand-icons";
import { ALL_DUAS, GUIDE_CHAPTERS, LANGUAGES } from "@/lib/data/guide";
import type { LanguageCode } from "@/lib/types";

export default function GuideLibraryPage() {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState<LanguageCode>("en");

  const chapters = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GUIDE_CHAPTERS;
    return GUIDE_CHAPTERS.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.stage.toLowerCase().includes(q) ||
        c.steps.some((s) => s.title.toLowerCase().includes(q)),
    );
  }, [query]);

  const totalSteps = GUIDE_CHAPTERS.reduce((n, c) => n + c.steps.length, 0);
  const totalMinutes = GUIDE_CHAPTERS.reduce((n, c) => n + c.readMinutes, 0);

  return (
    <>
      <PageHeader
        title="Hajj guide library"
        description="Every rite explained step by step, with the authentic du'ā for each moment and audio in four languages."
        action={
          <ButtonLink href="/app/checklist" variant="outline">
            <ListChecks className="size-4" />
            Packing checklist
          </ButtonLink>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Chapters"
          value={GUIDE_CHAPTERS.length}
          detail="From entering Ihram to the farewell Tawaf"
          icon={<BookOpen className="size-4" />}
        />
        <Stat
          label="Ordered steps"
          value={totalSteps}
          detail="Each labelled Fard, Wajib or Sunnah"
          icon={<Kaaba className="size-4" />}
          tone="positive"
        />
        <Stat
          label="Du'ās"
          value={ALL_DUAS.length}
          detail="Arabic with transliteration and translation"
          icon={<Volume2 className="size-4" />}
          tone="gold"
        />
        <Stat
          label="Reading time"
          value={`${totalMinutes} min`}
          detail="Available offline once cached"
          icon={<Clock className="size-4" />}
          tone="info"
        />
      </div>

      {/* Language + offline */}
      <Card className="mt-5">
        <CardBody className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-forest-50 text-forest-800 dark:bg-forest-950 dark:text-gold-300">
              <Languages className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">Audio narration language</p>
              <p className="text-xs text-muted">
                Applies to every chapter you open from here.
              </p>
            </div>
          </div>
          <SegmentedControl
            items={LANGUAGES.filter((l) => l.code !== "ig").map((l) => ({
              id: l.code,
              label: l.native,
            }))}
            value={language}
            onChange={setLanguage}
            size="sm"
            className="lg:ml-auto lg:w-auto"
          />
          <Badge tone="positive" icon={<WifiOff className="size-3" />}>
            Cached offline
          </Badge>
        </CardBody>
      </Card>

      {/* Search */}
      <div className="relative mt-6 max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
        <TextInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search rites, steps or stages…"
          className="pl-9"
          aria-label="Search the guide library"
        />
      </div>

      {/* Chapters */}
      {chapters.length === 0 ? (
        <EmptyState
          className="mt-6"
          icon={<BookOpen className="size-6" />}
          title="No chapters matched"
          description={`Nothing in the library matches “${query}”. Try a rite name such as Tawaf or Arafat.`}
        />
      ) : (
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {chapters.map((c) => (
            <Link key={c.id} href={`/app/guide/${c.slug}`} className="group">
              <Card className="h-full transition duration-300 group-hover:-translate-y-1 group-hover:border-forest-800/25 group-hover:shadow-[0_22px_50px_-36px_rgba(1,68,33,0.7)]">
                <CardBody>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="brand">{c.stage}</Badge>
                        <span className="text-xs text-muted">{c.readMinutes} min read</span>
                      </div>
                      <h2 className="mt-2.5 text-lg font-bold text-ink">{c.title}</h2>
                      <p
                        lang="ar"
                        dir="rtl"
                        className="font-serif mt-0.5 text-lg text-gold-700 dark:text-gold-400"
                      >
                        {c.arabicTitle}
                      </p>
                    </div>
                    <ChevronRight className="mt-1 size-5 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-forest-800 dark:group-hover:text-gold-300" />
                  </div>

                  <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted">
                    {c.summary}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                    <Pill tone="neutral">{c.steps.length} steps</Pill>
                    <Pill tone="gold">
                      {c.duas.length} {c.duas.length === 1 ? "du'ā" : "du'ās"}
                    </Pill>
                    <Pill tone="info" icon={<Volume2 className="size-3" />}>
                      {c.audioLanguages.length} languages
                    </Pill>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Du'ā quick reference */}
      <Card className="mt-8">
        <CardHeader
          title="Du'ā quick reference"
          description="The supplications you will need most, in one place."
          icon={<Volume2 className="size-4" />}
        />
        <CardBody className="space-y-5">
          {ALL_DUAS.slice(0, 3).map((d) => (
            <div key={d.id} className="rounded-2xl border border-line bg-surface-muted/50 p-5">
              <p className="text-[0.8125rem] font-bold text-ink">{d.title}</p>
              <p
                lang="ar"
                dir="rtl"
                className="font-serif mt-3 text-2xl leading-[1.9] text-ink"
              >
                {d.arabic}
              </p>
              <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted italic">
                {d.transliteration}
              </p>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink/80">
                {d.translation}
              </p>
            </div>
          ))}
          <ButtonLink href="/app/guide/arafah" variant="outline" size="sm">
            See all du&apos;ās
            <ChevronRight className="size-3.5" />
          </ButtonLink>
        </CardBody>
      </Card>
    </>
  );
}
