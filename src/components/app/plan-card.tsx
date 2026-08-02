"use client";

import { CalendarDays, Landmark, Pause, Pencil, Play, Plus, Repeat } from "lucide-react";
import { Card, CardBody, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { useApp } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import { packageById } from "@/lib/data/packages";
import {
  DEPARTURE_DATES,
  FREQUENCY_SUFFIX,
  PLAN_HEALTH_COPY,
  countdownTo,
  planHealth,
  progressPct,
  requiredPerCycle,
} from "@/lib/savings";
import { formatDate, naira } from "@/lib/format";
import type { SavingsPlan } from "@/lib/types";

export function PlanCard({
  plan,
  onEdit,
  onDeposit,
}: {
  plan: SavingsPlan;
  onEdit: (plan: SavingsPlan) => void;
  onDeposit: (plan: SavingsPlan) => void;
}) {
  const { plans, updatePlan } = useApp();
  const { toast } = useToast();

  const pkg = packageById(plan.packageId);
  const pct = progressPct(plan.balance, pkg.priceNGN);
  const departure = DEPARTURE_DATES[plan.travelYear];
  const countdown = countdownTo(departure);
  const health = planHealth(plan, pkg.priceNGN);
  const copy = PLAN_HEALTH_COPY[health];
  const needed = requiredPerCycle(pkg.priceNGN, plan.balance, plan.frequency, departure);

  const paused = plan.status === "paused";
  const completed = plan.status === "completed" || plan.balance >= pkg.priceNGN;

  return (
    <Card className="overflow-hidden">
      <CardBody className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-ink">{plan.beneficiaryName}</h3>
              {plan.isPrimary ? <Badge tone="brand">Primary</Badge> : null}
              <Badge tone="neutral">{plan.relationship}</Badge>
            </div>
            <p className="mt-1 text-xs text-muted">
              {pkg.name} · {pkg.tier} · {plan.travelYear}
            </p>
          </div>
          <Badge
            tone={
              completed
                ? "positive"
                : paused
                  ? "neutral"
                  : copy.tone === "positive"
                    ? "positive"
                    : copy.tone === "warning"
                      ? "warning"
                      : "danger"
            }
          >
            {completed ? "Goal reached" : paused ? "Paused" : copy.label}
          </Badge>
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-3">
            <p className="tabular text-2xl font-extrabold tracking-tight text-ink">
              {naira(plan.balance)}
            </p>
            <p className="tabular text-sm text-muted">of {naira(pkg.priceNGN)}</p>
          </div>
          <ProgressBar
            value={pct}
            className="mt-3"
            tone={completed ? "positive" : copy.tone === "danger" ? "danger" : "brand"}
          />
          <p className="tabular mt-2 text-xs text-muted">
            {pct.toFixed(1)}% funded · {naira(Math.max(0, pkg.priceNGN - plan.balance))} to
            go
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-4 border-t border-line pt-4 sm:grid-cols-4">
          <div>
            <dt className="text-[0.625rem] font-semibold tracking-wider text-muted uppercase">
              Contribution
            </dt>
            <dd className="tabular mt-0.5 text-sm font-bold text-ink">
              {naira(plan.amountPerCycle)}
              <span className="text-[0.6875rem] font-medium text-muted">
                {FREQUENCY_SUFFIX[plan.frequency]}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-[0.625rem] font-semibold tracking-wider text-muted uppercase">
              Needed
            </dt>
            <dd suppressHydrationWarning className="tabular mt-0.5 text-sm font-bold text-ink">
              {completed ? "—" : naira(needed)}
            </dd>
          </div>
          <div>
            <dt className="text-[0.625rem] font-semibold tracking-wider text-muted uppercase">
              Departs
            </dt>
            <dd className="mt-0.5 text-sm font-bold text-ink">
              <span suppressHydrationWarning>{formatDate(departure)}</span>
            </dd>
          </div>
          <div>
            <dt className="text-[0.625rem] font-semibold tracking-wider text-muted uppercase">
              Countdown
            </dt>
            <dd suppressHydrationWarning className="tabular mt-0.5 text-sm font-bold text-ink">
              {countdown.days} days
            </dd>
          </div>
        </dl>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <Landmark className="size-3.5" />
            {plan.bankName}
          </span>
          <span className="flex items-center gap-1.5">
            <Repeat className="size-3.5" />
            {plan.autoDebit ? "Standing order active" : "Manual deposits"}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            Started <span suppressHydrationWarning>{formatDate(plan.startDate)}</span>
          </span>
        </div>
      </CardBody>

      <CardFooter>
        <Button size="sm" onClick={() => onDeposit(plan)} disabled={completed}>
          <Plus className="size-3.5" />
          Add money
        </Button>
        <Button variant="outline" size="sm" onClick={() => onEdit(plan)}>
          <Pencil className="size-3.5" />
          Edit plan
        </Button>
        {!completed ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              updatePlan(plan.id, { status: paused ? "active" : "paused" });
              toast({
                title: paused ? "Plan resumed" : "Plan paused",
                description: paused
                  ? `Contributions for ${plan.beneficiaryName} restart on the next cycle.`
                  : `You can pause for up to three months without losing your travel year.`,
                tone: paused ? "success" : "info",
              });
            }}
          >
            {paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
            {paused ? "Resume" : "Pause"}
          </Button>
        ) : null}
        {!plan.isPrimary ? (
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={() => {
              plans.forEach((p) =>
                updatePlan(p.id, { isPrimary: p.id === plan.id }),
              );
              toast({
                title: "Primary plan updated",
                description: `${plan.beneficiaryName} now leads your dashboard.`,
                tone: "info",
              });
            }}
          >
            Make primary
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}
