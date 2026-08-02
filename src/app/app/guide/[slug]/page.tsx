import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GUIDE_CHAPTERS, chapterBySlug } from "@/lib/data/guide";
import { ChapterView } from "@/components/app/chapter-view";

export function generateStaticParams() {
  return GUIDE_CHAPTERS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const chapter = chapterBySlug(slug);
  if (!chapter) return { title: "Chapter not found" };
  return { title: chapter.title, description: chapter.summary };
}

export default async function GuideChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chapter = chapterBySlug(slug);
  if (!chapter) notFound();

  const index = GUIDE_CHAPTERS.findIndex((c) => c.slug === slug);
  const previous = index > 0 ? GUIDE_CHAPTERS[index - 1] : null;
  const next = index < GUIDE_CHAPTERS.length - 1 ? GUIDE_CHAPTERS[index + 1] : null;

  return (
    <ChapterView
      chapter={chapter}
      previous={previous ? { slug: previous.slug, title: previous.title } : null}
      next={next ? { slug: next.slug, title: next.title } : null}
    />
  );
}
