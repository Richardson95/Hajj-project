import type { PlanFrequency, SavingsPlan, TravelYear } from "./types";

/**
 * Provisional airlift dates — the first Nigerian departures usually leave about
 * three weeks before Yawm Arafah. Confirmed against the NAHCON airlift schedule
 * once the Hijri calendar is settled by moon sighting.
 */
export const DEPARTURE_DATES: Record<TravelYear, string> = {
  2026: "2026-05-01T00:00:00.000Z",
  2027: "2027-04-20T00:00:00.000Z",
  2028: "2028-04-09T00:00:00.000Z",
};

/** Yawm Arafah (9 Dhul-Hijjah) — provisional, subject to moon sighting. */
export const ARAFAH_DATES: Record<TravelYear, string> = {
  2026: "2026-05-26T00:00:00.000Z",
  2027: "2027-05-15T00:00:00.000Z",
  2028: "2028-05-04T00:00:00.000Z",
};

/** Deposit windows remaining per year, by frequency. */
export const CYCLES_PER_YEAR: Record<PlanFrequency, number> = {
  weekly: 52,
  monthly: 12,
  quarterly: 4,
};

export const FREQUENCY_LABEL: Record<PlanFrequency, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
};

export const FREQUENCY_SUFFIX: Record<PlanFrequency, string> = {
  weekly: "/week",
  monthly: "/month",
  quarterly: "/quarter",
};

export function daysUntil(iso: string, from: Date = new Date()): number {
  const ms = new Date(iso).getTime() - from.getTime();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

export interface Countdown {
  days: number;
  months: number;
  remainderDays: number;
  weeks: number;
}

export function countdownTo(iso: string, from: Date = new Date()): Countdown {
  const days = daysUntil(iso, from);
  const months = Math.floor(days / 30.44);
  return {
    days,
    months,
    remainderDays: Math.max(0, days - Math.round(months * 30.44)),
    weeks: Math.floor(days / 7),
  };
}

/** Number of contribution cycles left before departure. */
export function cyclesRemaining(
  frequency: PlanFrequency,
  departureIso: string,
  from: Date = new Date(),
): number {
  const days = daysUntil(departureIso, from);
  const perCycleDays = { weekly: 7, monthly: 30.44, quarterly: 91.31 }[frequency];
  return Math.max(0, Math.floor(days / perCycleDays));
}

/**
 * The contribution needed each cycle to close the gap before departure.
 * Rounded up to the nearest ₦500 so the figure is bank-transfer friendly.
 */
export function requiredPerCycle(
  target: number,
  balance: number,
  frequency: PlanFrequency,
  departureIso: string,
  from: Date = new Date(),
): number {
  const gap = Math.max(0, target - balance);
  const cycles = cyclesRemaining(frequency, departureIso, from);
  if (cycles <= 0) return gap;
  return Math.ceil(gap / cycles / 500) * 500;
}

export function progressPct(balance: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((balance / target) * 1000) / 10);
}

/** Projected balance if the pilgrim keeps to their current plan. */
export function projectedBalance(
  plan: Pick<SavingsPlan, "balance" | "amountPerCycle" | "frequency" | "travelYear">,
  from: Date = new Date(),
): number {
  const cycles = cyclesRemaining(plan.frequency, DEPARTURE_DATES[plan.travelYear], from);
  return plan.balance + cycles * plan.amountPerCycle;
}

export type PlanHealth = "on-track" | "slightly-behind" | "at-risk" | "goal-met";

export function planHealth(
  plan: Pick<SavingsPlan, "balance" | "amountPerCycle" | "frequency" | "travelYear">,
  target: number,
  from: Date = new Date(),
): PlanHealth {
  if (plan.balance >= target) return "goal-met";
  const projected = projectedBalance(plan, from);
  const ratio = projected / target;
  if (ratio >= 1) return "on-track";
  if (ratio >= 0.85) return "slightly-behind";
  return "at-risk";
}

export const PLAN_HEALTH_COPY: Record<
  PlanHealth,
  { label: string; detail: string; tone: "positive" | "warning" | "danger" }
> = {
  "goal-met": {
    label: "Goal reached",
    detail: "You are eligible to submit your Hajj application.",
    tone: "positive",
  },
  "on-track": {
    label: "On track",
    detail: "Keep your current plan and you will meet the goal before departure.",
    tone: "positive",
  },
  "slightly-behind": {
    label: "Slightly behind",
    detail: "A small top-up now keeps your departure year within reach.",
    tone: "warning",
  },
  "at-risk": {
    label: "Needs attention",
    detail: "Raise your contribution or move to a later travel year.",
    tone: "danger",
  },
};

/** Month-by-month savings curve used by the dashboard chart. */
export function buildSavingsCurve(
  plan: Pick<SavingsPlan, "balance" | "amountPerCycle" | "frequency" | "travelYear" | "startDate">,
  months = 12,
  from: Date = new Date(),
): { label: string; actual: number | null; projected: number }[] {
  const perMonth =
    plan.amountPerCycle * { weekly: 4.33, monthly: 1, quarterly: 1 / 3 }[plan.frequency];
  const points: { label: string; actual: number | null; projected: number }[] = [];
  const past = 6;
  for (let i = -past; i < months - past; i++) {
    const d = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + i, 1));
    const value = Math.max(0, plan.balance + perMonth * i);
    points.push({
      label: d.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" }),
      actual: i <= 0 ? Math.round(value) : null,
      projected: Math.round(value),
    });
  }
  return points;
}
