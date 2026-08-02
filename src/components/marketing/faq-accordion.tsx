"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { FAQS, type Faq } from "@/lib/data/marketing";
import { SegmentedControl } from "@/components/ui/tabs";
import { cn } from "@/lib/cn";

const GROUPS: (Faq["group"] | "All")[] = [
  "All",
  "Savings",
  "Compliance",
  "In Makkah",
  "Account",
];

export function FaqAccordion({ limit }: { limit?: number }) {
  const [group, setGroup] = useState<(typeof GROUPS)[number]>("All");
  const [open, setOpen] = useState<string | null>(FAQS[0].question);

  const visible = useMemo(() => {
    const filtered = group === "All" ? FAQS : FAQS.filter((f) => f.group === group);
    return limit ? filtered.slice(0, limit) : filtered;
  }, [group, limit]);

  return (
    <div className="space-y-6">
      <SegmentedControl
        items={GROUPS.map((g) => ({ id: g, label: g }))}
        value={group}
        onChange={(g) => setGroup(g as (typeof GROUPS)[number])}
        className="mx-auto w-fit max-w-full"
      />

      <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
        {visible.map((faq) => {
          const isOpen = open === faq.question;
          return (
            <div key={faq.question}>
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : faq.question)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start justify-between gap-4 px-5 py-4.5 text-left transition hover:bg-surface-muted/60"
                >
                  <span className="text-[0.9375rem] font-semibold text-ink">
                    {faq.question}
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg border border-line text-muted transition-transform duration-300",
                      isOpen && "rotate-45 border-forest-700 bg-forest-800 text-white",
                    )}
                  >
                    <Plus className="size-3.5" />
                  </span>
                </button>
              </h3>
              <div
                className={cn(
                  "grid transition-all duration-300 ease-out",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
