"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { CornerDownLeft, Search, X } from "lucide-react";
import { ALL_NAV_ITEMS } from "./nav-config";
import { GUIDE_CHAPTERS } from "@/lib/data/guide";
import { PRODUCTS } from "@/lib/data/marketplace";
import { POIS } from "@/lib/data/map";
import { ITINERARY } from "@/lib/data/itinerary";
import { cn } from "@/lib/cn";

interface Result {
  id: string;
  label: string;
  detail: string;
  group: string;
  href: string;
}

const INDEX: Result[] = [
  ...ALL_NAV_ITEMS.map((i) => ({
    id: `nav-${i.href}`,
    label: i.label,
    detail: "Go to page",
    group: "Navigate",
    href: i.href,
  })),
  ...GUIDE_CHAPTERS.map((c) => ({
    id: `guide-${c.id}`,
    label: c.title,
    detail: c.summary,
    group: "Guide library",
    href: `/app/guide/${c.slug}`,
  })),
  ...GUIDE_CHAPTERS.flatMap((c) =>
    c.duas.map((d) => ({
      id: `dua-${d.id}`,
      label: d.title,
      detail: d.translation,
      group: "Du'ās",
      href: `/app/guide/${c.slug}#duas`,
    })),
  ),
  ...ITINERARY.map((d) => ({
    id: `day-${d.id}`,
    label: d.title,
    detail: `${d.hijri} · ${d.subtitle}`,
    group: "Itinerary",
    href: `/app/planner#${d.id}`,
  })),
  ...PRODUCTS.map((p) => ({
    id: `prd-${p.id}`,
    label: p.name,
    detail: p.description,
    group: "Marketplace",
    href: `/app/marketplace/${p.id}`,
  })),
  ...POIS.map((p) => ({
    id: `poi-${p.id}`,
    label: p.name,
    detail: `${p.zone} · ${p.description}`,
    group: "Map",
    href: `/app/map?poi=${p.id}`,
  })),
];

export function AppSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  /* Mounting only while open means the panel's state starts fresh every time,
     with no effect needed to reset it. */
  if (!open) return null;
  return <SearchPanel onClose={onClose} />;
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQueryValue] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  function setQuery(next: string) {
    setQueryValue(next);
    setCursor(0);
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return INDEX.filter((r) => r.group === "Navigate").slice(0, 8);
    }
    return INDEX.filter(
      (r) =>
        r.label.toLowerCase().includes(q) ||
        r.detail.toLowerCase().includes(q) ||
        r.group.toLowerCase().includes(q),
    ).slice(0, 12);
  }, [query]);

  useEffect(() => {
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setCursor((c) => Math.min(c + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setCursor((c) => Math.max(c - 1, 0));
      }
      if (e.key === "Enter" && results[cursor]) {
        e.preventDefault();
        router.push(results[cursor].href);
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [results, cursor, router, onClose]);

  if (typeof document === "undefined") return null;

  let lastGroup = "";

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-start justify-center p-4 pt-[8vh]">
      <div
        className="absolute inset-0 animate-[fade-in_0.15s_ease-out] bg-forest-950/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search HajjPath"
        className="relative flex max-h-[70vh] w-full max-w-xl animate-[scale-in_0.18s_cubic-bezier(0.22,1,0.36,1)] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="size-4 shrink-0 text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search rituals, du'ās, products, places…"
            className="w-full bg-transparent py-4 text-sm text-ink outline-none placeholder:text-muted/70"
            aria-label="Search"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="rounded-lg p-1.5 text-muted transition hover:bg-surface-muted hover:text-ink"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-3 py-10 text-center text-sm text-muted">
              Nothing matched “{query}”.
            </p>
          ) : (
            results.map((r, i) => {
              const showGroup = r.group !== lastGroup;
              lastGroup = r.group;
              return (
                <div key={r.id}>
                  {showGroup ? (
                    <p className="px-3 pt-3 pb-1 text-[0.625rem] font-bold tracking-[0.14em] text-muted uppercase">
                      {r.group}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => {
                      router.push(r.href);
                      onClose();
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition",
                      i === cursor ? "bg-forest-50 dark:bg-forest-950/70" : "",
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink">
                        {r.label}
                      </span>
                      <span className="block truncate text-xs text-muted">{r.detail}</span>
                    </span>
                    {i === cursor ? (
                      <CornerDownLeft className="size-3.5 shrink-0 text-muted" />
                    ) : null}
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-line bg-surface-muted/50 px-4 py-2.5 text-[0.6875rem] text-muted">
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-line bg-surface px-1.5 py-0.5 font-semibold">
              ↑↓
            </kbd>
            navigate
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-line bg-surface px-1.5 py-0.5 font-semibold">
              ↵
            </kbd>
            open
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-line bg-surface px-1.5 py-0.5 font-semibold">
              esc
            </kbd>
            close
          </span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
