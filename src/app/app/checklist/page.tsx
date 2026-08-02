"use client";

import { useMemo, useState } from "react";
import {
  Check,
  CircleCheck,
  Download,
  Info,
  ListChecks,
  RotateCcw,
  ShoppingBag,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { PageHeader, Stat } from "@/components/ui/misc";
import { ProgressBar } from "@/components/ui/progress";
import { SegmentedControl } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { useApp } from "@/lib/store";
import { CHECKLIST, CHECKLIST_GROUPS } from "@/lib/data/guide";
import { cn } from "@/lib/cn";

type Filter = "all" | "todo" | "done";

export default function ChecklistPage() {
  const { checklistDone, toggleChecklist } = useApp();
  const { toast } = useToast();
  const [filter, setFilter] = useState<Filter>("all");

  const donePct = Math.round((checklistDone.length / CHECKLIST.length) * 100);
  const remaining = CHECKLIST.length - checklistDone.length;

  const grouped = useMemo(
    () =>
      CHECKLIST_GROUPS.map((group) => {
        const items = CHECKLIST.filter((c) => c.group === group).filter((c) => {
          if (filter === "todo") return !checklistDone.includes(c.id);
          if (filter === "done") return checklistDone.includes(c.id);
          return true;
        });
        const total = CHECKLIST.filter((c) => c.group === group).length;
        const done = CHECKLIST.filter(
          (c) => c.group === group && checklistDone.includes(c.id),
        ).length;
        return { group, items, total, done };
      }).filter((g) => g.items.length > 0),
    [filter, checklistDone],
  );

  function exportList() {
    const lines = CHECKLIST_GROUPS.flatMap((group) => [
      `\n## ${group}`,
      ...CHECKLIST.filter((c) => c.group === group).map(
        (c) => `[${checklistDone.includes(c.id) ? "x" : " "}] ${c.label}${c.note ? ` — ${c.note}` : ""}`,
      ),
    ]);
    const text = `HajjPath packing checklist\n${checklistDone.length}/${CHECKLIST.length} packed\n${lines.join("\n")}\n`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hajjpath-packing-checklist.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Checklist downloaded", description: "Print it and keep it in your case." });
  }

  function resetAll() {
    checklistDone.forEach((id) => toggleChecklist(id));
    toast({ title: "Checklist cleared", tone: "info" });
  }

  return (
    <>
      <PageHeader
        title="Packing checklist"
        description="Twenty-six things that make the difference between a hard Hajj and a manageable one."
        action={
          <>
            <Button variant="outline" onClick={exportList}>
              <Download className="size-4" />
              Export
            </Button>
            <ButtonLink href="/app/marketplace">
              <ShoppingBag className="size-4" />
              Buy what&apos;s missing
            </ButtonLink>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="Packed"
          value={`${checklistDone.length}/${CHECKLIST.length}`}
          detail={`${donePct}% of your checklist complete`}
          icon={<CircleCheck className="size-4" />}
          tone="positive"
        />
        <Stat
          label="Still to pack"
          value={remaining}
          detail={remaining === 0 ? "You are ready to travel" : "Tick items as you pack them"}
          icon={<ListChecks className="size-4" />}
        />
        <Stat
          label="Categories"
          value={CHECKLIST_GROUPS.length}
          detail="Documents, Ihram, health, money and essentials"
          icon={<Info className="size-4" />}
          tone="info"
        />
      </div>

      <Card className="mt-5">
        <CardBody>
          <ProgressBar
            value={donePct}
            label="Overall readiness"
            showValue
            tone={donePct === 100 ? "positive" : donePct > 50 ? "brand" : "warning"}
          />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <SegmentedControl
              size="sm"
              items={[
                { id: "all", label: "All", count: CHECKLIST.length },
                { id: "todo", label: "To pack", count: remaining },
                { id: "done", label: "Packed", count: checklistDone.length },
              ]}
              value={filter}
              onChange={(f) => setFilter(f as Filter)}
              className="w-auto"
            />
            {checklistDone.length > 0 ? (
              <Button variant="ghost" size="sm" onClick={resetAll} className="ml-auto">
                <RotateCcw className="size-3.5" />
                Clear all
              </Button>
            ) : null}
          </div>
        </CardBody>
      </Card>

      <div className="mt-6 space-y-5">
        {grouped.map(({ group, items, total, done }) => (
          <Card key={group}>
            <CardHeader
              title={group}
              description={`${done} of ${total} packed`}
              action={
                <Badge tone={done === total ? "positive" : "neutral"}>
                  {done === total ? "Complete" : `${total - done} left`}
                </Badge>
              }
            />
            <ul className="divide-y divide-line">
              {items.map((item) => {
                const checked = checklistDone.includes(item.id);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => toggleChecklist(item.id)}
                      aria-pressed={checked}
                      className="flex w-full items-start gap-3.5 px-5 py-3.5 text-left transition hover:bg-surface-muted/60"
                    >
                      <span
                        className={cn(
                          "mt-0.5 grid size-5.5 shrink-0 place-items-center rounded-md border-2 transition",
                          checked
                            ? "border-forest-800 bg-forest-800 text-white dark:border-forest-500 dark:bg-forest-600"
                            : "border-line-strong",
                        )}
                      >
                        {checked ? <Check className="size-3.5" strokeWidth={3} /> : null}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block text-[0.9375rem] font-medium",
                            checked ? "text-muted line-through" : "text-ink",
                          )}
                        >
                          {item.label}
                        </span>
                        {item.note ? (
                          <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                            {item.note}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>
        ))}
      </div>

      <Card className="mt-6 border-gold-500/30 bg-gold-50/50 dark:bg-gold-950/25">
        <CardBody className="flex flex-wrap items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold-500 text-forest-950">
            <Info className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink">The three most-forgotten items</p>
            <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted">
              Unscented toiletries (scented products are forbidden in Ihram), oral
              rehydration salts, and a small drawstring bag for your Jamarat pebbles.
              Everything on this list is available from verified vendors in the marketplace
              and can be delivered to your hotel or your tent.
            </p>
          </div>
          <ButtonLink href="/app/marketplace" variant="outline" size="sm">
            Open marketplace
          </ButtonLink>
        </CardBody>
      </Card>
    </>
  );
}
