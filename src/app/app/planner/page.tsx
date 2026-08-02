"use client";

import { useMemo, useState } from "react";
import {
  Bed,
  BookOpen,
  Bus,
  Check,
  CircleCheck,
  Clock,
  Coffee,
  Info,
  MapPin,
  Megaphone,
  Sparkles,
  Sun,
  UtensilsCrossed,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, Pill } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader, Stat } from "@/components/ui/misc";
import { ProgressBar } from "@/components/ui/progress";
import { SegmentedControl } from "@/components/ui/tabs";
import { Kaaba, Mosque } from "@/components/brand-icons";
import { useApp } from "@/lib/store";
import { ITINERARY, STAGE_ORDER } from "@/lib/data/itinerary";
import { DEPARTURE_DATES, countdownTo } from "@/lib/savings";
import { formatLongDate } from "@/lib/format";
import type { ActivityCategory, RitualStage } from "@/lib/types";
import { cn } from "@/lib/cn";

const CATEGORY_META: Record<
  ActivityCategory,
  { label: string; icon: React.ComponentType<{ className?: string }>; tone: string }
> = {
  ritual: {
    label: "Rite",
    icon: Kaaba,
    tone: "bg-forest-50 text-forest-800 dark:bg-forest-950 dark:text-forest-200",
  },
  travel: {
    label: "Travel",
    icon: Bus,
    tone: "bg-sky-50 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
  },
  rest: {
    label: "Rest",
    icon: Bed,
    tone: "bg-violet-50 text-violet-800 dark:bg-violet-950 dark:text-violet-200",
  },
  meal: {
    label: "Meal",
    icon: UtensilsCrossed,
    tone: "bg-orange-50 text-orange-800 dark:bg-orange-950 dark:text-orange-200",
  },
  briefing: {
    label: "Briefing",
    icon: Megaphone,
    tone: "bg-gold-50 text-gold-800 dark:bg-gold-950 dark:text-gold-200",
  },
  free: {
    label: "Free time",
    icon: Coffee,
    tone: "bg-surface-muted text-muted",
  },
};

const STAGE_ICON: Record<RitualStage, React.ComponentType<{ className?: string }>> = {
  Preparation: Sparkles,
  Madinah: Mosque,
  Makkah: Kaaba,
  Mina: Bed,
  Arafat: Sun,
  Muzdalifah: Sun,
  Jamarat: MapPin,
};

export default function PlannerPage() {
  const { activityDone, toggleActivity, plans } = useApp();
  const [stage, setStage] = useState<RitualStage | "All">("All");

  const primary = plans.find((p) => p.isPrimary) ?? plans[0];
  const departure = DEPARTURE_DATES[primary?.travelYear ?? 2027];
  const countdown = countdownTo(departure);

  const totalActivities = ITINERARY.reduce((n, d) => n + d.activities.length, 0);
  const donePct = Math.round((activityDone.length / totalActivities) * 100);

  const days = useMemo(
    () => (stage === "All" ? ITINERARY : ITINERARY.filter((d) => d.stage === stage)),
    [stage],
  );

  const stages = useMemo(() => {
    const present = STAGE_ORDER.filter((s) => ITINERARY.some((d) => d.stage === s));
    return [
      { id: "All" as const, label: "Full journey", count: ITINERARY.length },
      ...present.map((s) => ({
        id: s,
        label: s,
        count: ITINERARY.filter((d) => d.stage === s).length,
      })),
    ];
  }, []);

  const ritualCount = ITINERARY.reduce(
    (n, d) => n + d.activities.filter((a) => a.category === "ritual").length,
    0,
  );

  return (
    <>
      <PageHeader
        title="Hajj tour planner"
        description="Your complete 1448 AH itinerary — every movement, every rite, with the obligation level marked."
        action={
          <ButtonLink href="/app/guide" variant="outline">
            <BookOpen className="size-4" />
            Guide library
          </ButtonLink>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Departure in"
          value={<span suppressHydrationWarning>{countdown.days} days</span>}
          detail={<span suppressHydrationWarning>{formatLongDate(departure)}</span>}
          icon={<Clock className="size-4" />}
          tone="gold"
        />
        <Stat
          label="Days planned"
          value={ITINERARY.length}
          detail="Madinah, Makkah and the five days of Hajj"
          icon={<MapPin className="size-4" />}
        />
        <Stat
          label="Rites to perform"
          value={ritualCount}
          detail="Fard, Wajib and Sunnah acts across the journey"
          icon={<Kaaba className="size-4" />}
          tone="positive"
        />
        <Stat
          label="Marked complete"
          value={`${activityDone.length}/${totalActivities}`}
          detail="Tick each item as you complete it in the field"
          icon={<CircleCheck className="size-4" />}
          tone="info"
        />
      </div>

      <Card className="mt-5">
        <CardBody>
          <ProgressBar
            value={donePct}
            label="Journey progress"
            showValue
            tone={donePct === 100 ? "positive" : "brand"}
          />
          <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted">
            <Info className="mt-0.5 size-3.5 shrink-0 text-forest-700 dark:text-gold-400" />
            Hijri dates are provisional until the crescent of Dhul-Hijjah is sighted. Your
            group admin confirms the final schedule before you leave Nigeria, and the
            itinerary updates automatically.
          </p>
        </CardBody>
      </Card>

      <SegmentedControl
        items={stages}
        value={stage}
        onChange={(s) => setStage(s as RitualStage | "All")}
        className="mt-6"
      />

      {/* Timeline */}
      <div className="mt-6 space-y-5">
        {days.map((day) => {
          const StageIcon = STAGE_ICON[day.stage];
          const dayDone = day.activities.filter((a) => activityDone.includes(a.id)).length;
          const complete = dayDone === day.activities.length;

          return (
            <Card key={day.id} id={day.id} className="scroll-mt-24 overflow-hidden">
              <div
                className={cn(
                  "flex flex-wrap items-center gap-4 border-b border-line px-5 py-4",
                  complete && "bg-forest-50/60 dark:bg-forest-950/40",
                )}
              >
                <span
                  className={cn(
                    "grid size-12 shrink-0 place-items-center rounded-2xl",
                    complete
                      ? "bg-forest-800 text-white"
                      : "bg-forest-50 text-forest-800 dark:bg-forest-950 dark:text-gold-300",
                  )}
                >
                  <StageIcon className="size-5" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="tabular text-[0.6875rem] font-bold tracking-wider text-muted uppercase">
                      Day {day.dayNumber}
                    </span>
                    <Badge tone="brand">{day.stage}</Badge>
                    <Badge tone="gold">{day.hijri}</Badge>
                  </div>
                  <h2 className="mt-1.5 text-lg font-bold text-ink">{day.title}</h2>
                  <p className="text-[0.8125rem] text-muted">{day.subtitle}</p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-xs font-medium text-muted">
                    {formatLongDate(day.gregorian)}
                  </p>
                  <p className="tabular mt-1 text-xs font-semibold text-ink">
                    {dayDone}/{day.activities.length} complete
                  </p>
                </div>
              </div>

              <CardBody className="space-y-0 p-0">
                <ol className="divide-y divide-line">
                  {day.activities.map((a) => {
                    const meta = CATEGORY_META[a.category];
                    const done = activityDone.includes(a.id);
                    return (
                      <li key={a.id}>
                        <div className="flex gap-4 px-5 py-4">
                          <div className="flex w-14 shrink-0 flex-col items-start pt-0.5">
                            <span className="tabular text-xs font-bold text-forest-800 dark:text-gold-400">
                              {a.time}
                            </span>
                            <span className="mt-1 text-[0.625rem] text-muted">
                              {a.durationMins >= 60
                                ? `${Math.round(a.durationMins / 60)}h`
                                : `${a.durationMins}m`}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleActivity(a.id)}
                            aria-pressed={done}
                            aria-label={`Mark "${a.title}" as ${done ? "not done" : "done"}`}
                            className={cn(
                              "mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg border-2 transition",
                              done
                                ? "border-forest-800 bg-forest-800 text-white dark:border-forest-500 dark:bg-forest-600"
                                : "border-line-strong hover:border-forest-700",
                            )}
                          >
                            {done ? <Check className="size-3.5" strokeWidth={3} /> : null}
                          </button>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3
                                className={cn(
                                  "text-[0.9375rem] font-semibold",
                                  done ? "text-muted line-through" : "text-ink",
                                )}
                              >
                                {a.title}
                              </h3>
                              {a.obligation ? (
                                <Pill
                                  tone={
                                    a.obligation === "Fard"
                                      ? "danger"
                                      : a.obligation === "Wajib"
                                        ? "warning"
                                        : "neutral"
                                  }
                                >
                                  {a.obligation}
                                </Pill>
                              ) : null}
                            </div>
                            <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted">
                              {a.description}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-[0.6875rem] text-muted">
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-semibold",
                                  meta.tone,
                                )}
                              >
                                <meta.icon className="size-3" />
                                {meta.label}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="size-3" />
                                {a.location}
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6 border-gold-500/30 bg-gold-50/50 dark:bg-gold-950/25">
        <CardHeader
          title="Ritual obligation levels"
          description="What happens if an act is missed."
          icon={<Info className="size-4" />}
        />
        <CardBody className="grid gap-4 sm:grid-cols-3">
          {[
            {
              tone: "danger" as const,
              label: "Fard",
              body: "A pillar. If it is missed the Hajj is invalid and must be repeated.",
            },
            {
              tone: "warning" as const,
              label: "Wajib",
              body: "Obligatory. Missing it requires a compensatory sacrifice (dam), but the Hajj remains valid.",
            },
            {
              tone: "neutral" as const,
              label: "Sunnah",
              body: "Recommended. Following it earns reward; omitting it carries no penalty.",
            },
          ].map((o) => (
            <div key={o.label}>
              <Pill tone={o.tone}>{o.label}</Pill>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">{o.body}</p>
            </div>
          ))}
        </CardBody>
      </Card>
    </>
  );
}
