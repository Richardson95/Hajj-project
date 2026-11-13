"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  Languages,
  ListChecks,
  Search,
  Volume2,
  WifiOff } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, PageHeader } from "@/components/ui/misc";
import { TextInput } from "@/components/ui/field";
import { SegmentedControl } from "@/components/ui/tabs";
import { ALL_DUAS, GUIDE_CHAPTERS, LANGUAGES } from "@/lib/data/guide";
import { CHAPTER_PHOTOS } from "@/lib/data/photos";
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
        title="Guide"
        description={`${GUIDE_CHAPTERS.length} chapters · ${totalSteps} steps · ${totalMinutes} min`}
        action={
          <ButtonLink href="/app/checklist" variant="outline">
            <ListChecks className="size-4" />
            Packing checklist
          </ButtonLink>
        }
      />

      {/* Language + offline */}
      <Card className="mt-5">
        <CardBody className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex items-center gap-3">
            <Languages className="size-5 shrink-0 text-muted" />
            <p className="text-sm font-medium text-ink">Audio language</p>
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
            Offline
          </Badge>
        </CardBody>
      </Card>

      {/* Search */}
      <div className="relative mt-6 max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
        <TextInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
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
          description={`Nothing matches “${query}”.`}
        />
      ) : (
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {chapters.map((c) => (
            <Link key={c.id} href={`/app/guide/${c.slug}`} className="group">
              <Card className="h-full overflow-hidden transition-colors group-hover:border-forest-800/25">
                {CHAPTER_PHOTOS[c.slug] ? (
                  <div className="relative aspect-21/9 bg-surface-muted">
                    <Image
                      src={CHAPTER_PHOTOS[c.slug]!.src}
                      alt={CHAPTER_PHOTOS[c.slug]!.alt}
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover"
                      style={{ objectPosition: CHAPTER_PHOTOS[c.slug]!.position }}
                    />
                  </div>
                ) : null}
                <CardBody>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs text-muted">
                        {c.stage} · {c.readMinutes} min · {c.steps.length} steps
                      </p>
                      <h2 className="mt-1 text-lg font-semibold text-ink">{c.title}</h2>
                    </div>
                    <p
                      lang="ar"
                      dir="rtl"
                      className="font-serif shrink-0 text-lg text-gold-700 dark:text-gold-400"
                    >
                      {c.arabicTitle}
                    </p>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{c.summary}</p>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Du'ā quick reference */}
      <Card className="mt-8">
        <CardHeader
          title="Common du'ās"
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
