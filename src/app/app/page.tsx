"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  CircleCheck,
  Compass,
  ListChecks,
  Megaphone,
  Plus,
  Store,
  TriangleAlert,
  Users,
  Wallet,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, Pill } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Avatar, Stat } from "@/components/ui/misc";
import { ProgressBar, ProgressRing } from "@/components/ui/progress";
import { DepositModal } from "@/components/app/deposit-modal";
import { SavingsChart } from "@/components/app/savings-chart";
import { Kaaba } from "@/components/brand-icons";
import { useApp } from "@/lib/store";
import { packageById } from "@/lib/data/packages";
import { ITINERARY } from "@/lib/data/itinerary";
import { ANNOUNCEMENTS } from "@/lib/data/comms";
import { CHECKLIST } from "@/lib/data/guide";
import { GROUP_MEMBERS, PILGRIM_GROUP } from "@/lib/data/map";
import {
  ARAFAH_DATES,
  DEPARTURE_DATES,
  FREQUENCY_SUFFIX,
  PLAN_HEALTH_COPY,
  buildSavingsCurve,
  countdownTo,
  cyclesRemaining,
  planHealth,
  progressPct,
  requiredPerCycle,
} from "@/lib/savings";
import { formatDate, formatDateTime, naira, relativeTime } from "@/lib/format";
import { cn } from "@/lib/cn";

const TXN_TONE: Record<string, string> = {
  successful: "text-emerald-700 dark:text-emerald-400",
  pending: "text-amber-700 dark:text-amber-400",
  failed: "text-rose-700 dark:text-rose-400",
};

export default function DashboardPage() {
  const { user, plans, transactions, checklistDone } = useApp();
  const [depositOpen, setDepositOpen] = useState(false);

  const primary = plans.find((p) => p.isPrimary) ?? plans[0];
  const target = primary ? packageById(primary.packageId).priceNGN : 0;
  const pct = primary ? progressPct(primary.balance, target) : 0;
  const health = primary ? planHealth(primary, target) : "on-track";
  const healthCopy = PLAN_HEALTH_COPY[health];
  const departure = primary ? DEPARTURE_DATES[primary.travelYear] : DEPARTURE_DATES[2027];
  const countdown = countdownTo(departure);
  const cycles = primary ? cyclesRemaining(primary.frequency, departure) : 0;
  const needed = primary
    ? requiredPerCycle(target, primary.balance, primary.frequency, departure)
    : 0;

  const curve = primary ? buildSavingsCurve(primary, 12) : [];

  const portfolio = plans.reduce((sum, p) => sum + p.balance, 0);
  const portfolioTarget = plans.reduce(
    (sum, p) => sum + packageById(p.packageId).priceNGN,
    0,
  );

  const thisMonth = useMemo(() => {
    const now = new Date();
    return transactions
      .filter(
        (t) =>
          t.status === "successful" &&
          !["withdrawal", "fee"].includes(t.type) &&
          new Date(t.date).getUTCMonth() === now.getUTCMonth() &&
          new Date(t.date).getUTCFullYear() === now.getUTCFullYear(),
      )
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const nextDay = ITINERARY.find((d) => d.stage === "Mina") ?? ITINERARY[0];
  const pinned = ANNOUNCEMENTS.filter((a) => a.pinned).slice(0, 2);
  const checklistPct = Math.round((checklistDone.length / CHECKLIST.length) * 100);
  const needsAttention = GROUP_MEMBERS.filter((m) => m.status === "assistance");

  const QUICK_ACTIONS = [
    { href: "/app/savings", label: "Savings", icon: Wallet, tone: "from-forest-700 to-forest-900" },
    { href: "/app/planner", label: "Planner", icon: CalendarDays, tone: "from-gold-500 to-gold-700" },
    { href: "/app/find-me", label: "Find Me", icon: Compass, tone: "from-sky-600 to-sky-800" },
    { href: "/app/marketplace", label: "Market", icon: Store, tone: "from-violet-600 to-violet-800" },
  ];

  return (
    <>
      {/* Greeting */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">As-salamu alaykum,</p>
          <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {user.honorific ? `${user.honorific} ` : ""}
            {user.firstName} {user.lastName}
          </h1>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            {user.kyc.status === "verified" ? (
              <Badge tone="positive" icon={<BadgeCheck className="size-3" />}>
                KYC verified
              </Badge>
            ) : user.kyc.status === "in-review" ? (
              <Badge tone="warning">KYC in review</Badge>
            ) : (
              <Badge tone="danger">KYC required</Badge>
            )}
            <Badge tone="brand">{PILGRIM_GROUP.name}</Badge>
            <Badge tone="neutral">Tag {user.tagCode}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setDepositOpen(true)}>
            <Plus className="size-4" />
            Add money
          </Button>
          <ButtonLink href="/app/savings" variant="outline">
            View plans
          </ButtonLink>
        </div>
      </div>

      {/* KYC / attention banners */}
      {user.kyc.status === "in-review" ? (
        <Card className="mb-5 border-amber-500/40 bg-amber-50/60 dark:bg-amber-950/25">
          <CardBody className="flex flex-wrap items-center gap-4 py-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-500 text-white">
              <TriangleAlert className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink">
                Your identity documents are being reviewed
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted">
                Verification usually completes within one working day. You can fund your
                plan in the meantime — withdrawals unlock once verification passes.
              </p>
            </div>
            <ButtonLink href="/app/profile" variant="outline" size="sm">
              View status
            </ButtonLink>
          </CardBody>
        </Card>
      ) : null}

      {needsAttention.length > 0 ? (
        <Card className="mb-5 border-rose-500/40 bg-rose-50/60 dark:bg-rose-950/25">
          <CardBody className="flex flex-wrap items-center gap-4 py-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-rose-600 text-white">
              <TriangleAlert className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink">
                {needsAttention[0].name} has requested assistance
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted">
                Raised near {needsAttention[0].zone} · last seen{" "}
                {needsAttention[0].lastSeen} · battery {needsAttention[0].batteryPct}%
              </p>
            </div>
            <ButtonLink href="/app/find-me" variant="danger" size="sm">
              Open Find Me
            </ButtonLink>
          </CardBody>
        </Card>
      ) : null}

      {/* Hero */}
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card className="overflow-hidden">
          <div className="relative bg-forest-900 p-6 text-white sm:p-7">
            <div className="pattern-islamic pointer-events-none absolute inset-0 opacity-40" />
            <div className="pointer-events-none absolute -right-12 -bottom-16 size-56 rounded-full bg-gold-500/15 blur-3xl" />

            <div className="relative flex flex-col items-center gap-7 sm:flex-row sm:items-center">
              <ProgressRing value={pct} size={168} stroke={13} trackClassName="stroke-white/12">
                <div className="text-center">
                  <p className="tabular text-3xl font-extrabold">{pct.toFixed(1)}%</p>
                  <p className="text-[0.625rem] tracking-[0.14em] text-white/55 uppercase">
                    funded
                  </p>
                </div>
              </ProgressRing>

              <div className="min-w-0 flex-1 text-center sm:text-left">
                <p className="text-xs font-bold tracking-[0.16em] text-gold-400 uppercase">
                  Saved so far
                </p>
                <p className="tabular mt-2 text-4xl font-extrabold tracking-tight">
                  {primary ? naira(primary.balance) : naira(0)}
                </p>
                <p className="mt-1 text-sm text-white/60">
                  of {naira(target)} ·{" "}
                  {primary ? packageById(primary.packageId).name : "No plan yet"}
                </p>

                <div className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold",
                      healthCopy.tone === "positive"
                        ? "bg-emerald-400/15 text-emerald-300"
                        : healthCopy.tone === "warning"
                          ? "bg-amber-400/15 text-amber-300"
                          : "bg-rose-400/15 text-rose-300",
                    )}
                  >
                    {healthCopy.tone === "positive" ? (
                      <CircleCheck className="size-3.5" />
                    ) : (
                      <TriangleAlert className="size-3.5" />
                    )}
                    {healthCopy.label}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white/75">
                    <ArrowUpRight className="size-3.5" />
                    {naira(Math.max(0, target - (primary?.balance ?? 0)))} to go
                  </span>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-white/55">
                  {healthCopy.detail}
                </p>
              </div>
            </div>
          </div>

          <CardBody className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-[0.6875rem] font-semibold tracking-wider text-muted uppercase">
                Contribution
              </p>
              <p className="tabular mt-1 text-lg font-bold text-ink">
                {primary ? naira(primary.amountPerCycle) : "—"}
                <span className="text-xs font-medium text-muted">
                  {primary ? FREQUENCY_SUFFIX[primary.frequency] : ""}
                </span>
              </p>
            </div>
            <div>
              <p className="text-[0.6875rem] font-semibold tracking-wider text-muted uppercase">
                Needed per cycle
              </p>
              <p suppressHydrationWarning className="tabular mt-1 text-lg font-bold text-ink">
                {naira(needed)}
              </p>
            </div>
            <div>
              <p className="text-[0.6875rem] font-semibold tracking-wider text-muted uppercase">
                Cycles remaining
              </p>
              <p suppressHydrationWarning className="tabular mt-1 text-lg font-bold text-ink">
                {cycles}
              </p>
            </div>
          </CardBody>
        </Card>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <Stat
            label="Departure in"
            value={<span suppressHydrationWarning>{countdown.days} days</span>}
            detail={
              <span suppressHydrationWarning>
                First airlift {formatDate(departure)} · Arafah{" "}
                {primary ? formatDate(ARAFAH_DATES[primary.travelYear]) : "—"}
              </span>
            }
            icon={<CalendarDays className="size-4" />}
            tone="gold"
          />
          <Stat
            label="Contributed this month"
            value={naira(thisMonth)}
            detail={`${transactions.filter((t) => t.status === "successful").length} successful transactions on record`}
            icon={<Wallet className="size-4" />}
          />
          <Stat
            label="All plans combined"
            value={naira(portfolio)}
            detail={`${plans.length} plans · ${progressPct(portfolio, portfolioTarget).toFixed(0)}% of ${naira(portfolioTarget)}`}
            icon={<Users className="size-4" />}
            tone="info"
          />
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-5 grid grid-cols-4 gap-3">
        {QUICK_ACTIONS.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-surface p-4 transition hover:-translate-y-0.5 hover:border-forest-800/25 hover:shadow-[0_16px_36px_-28px_rgba(1,68,33,0.6)]"
          >
            <span
              className={`grid size-10 place-items-center rounded-xl bg-linear-to-br ${a.tone} text-white`}
            >
              <a.icon className="size-5" />
            </span>
            <span className="text-xs font-semibold text-ink">{a.label}</span>
          </Link>
        ))}
      </div>

      {/* Chart */}
      <Card className="mt-5">
        <CardHeader
          title="Your savings trajectory"
          description="Solid to today, dashed for the projection at your current plan."
          icon={<ArrowUpRight className="size-4" />}
          action={
            <ButtonLink href="/app/savings" variant="ghost" size="sm">
              Full ledger
              <ChevronRight className="size-3.5" />
            </ButtonLink>
          }
        />
        <CardBody>
          {curve.length > 0 ? (
            <SavingsChart points={curve} goal={target} />
          ) : (
            <p className="py-10 text-center text-sm text-muted">
              Create a plan to see your trajectory.
            </p>
          )}
        </CardBody>
      </Card>

      {/* Two-column lower section */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* Next in itinerary */}
        <Card>
          <CardHeader
            title="Next in your itinerary"
            description={`${nextDay.hijri} · ${nextDay.title}`}
            icon={<Kaaba className="size-4" />}
            action={
              <ButtonLink href="/app/planner" variant="ghost" size="sm">
                Open planner
                <ChevronRight className="size-3.5" />
              </ButtonLink>
            }
          />
          <CardBody className="space-y-3.5">
            {nextDay.activities.slice(0, 4).map((a) => (
              <div key={a.id} className="flex gap-3.5">
                <span className="tabular w-12 shrink-0 pt-0.5 text-xs font-bold text-forest-800 dark:text-gold-400">
                  {a.time}
                </span>
                <div className="min-w-0 flex-1 border-l border-line pl-3.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-ink">{a.title}</p>
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
                  <p className="mt-0.5 text-xs leading-relaxed text-muted">
                    {a.description}
                  </p>
                  <p className="mt-1 text-[0.6875rem] text-muted">{a.location}</p>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Recent transactions */}
        <Card>
          <CardHeader
            title="Recent activity"
            description="Every naira in and out of your plans."
            icon={<Wallet className="size-4" />}
            action={
              <ButtonLink href="/app/savings" variant="ghost" size="sm">
                See all
                <ChevronRight className="size-3.5" />
              </ButtonLink>
            }
          />
          <ul className="divide-y divide-line">
            {transactions.slice(0, 6).map((t) => (
              <li key={t.id} className="flex items-center gap-3 px-5 py-3">
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-xl text-sm font-bold",
                    t.status === "failed"
                      ? "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                      : "bg-forest-50 text-forest-800 dark:bg-forest-950 dark:text-forest-200",
                  )}
                >
                  {t.type === "referral-bonus" || t.type === "profit-share" ? "+" : "₦"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.8125rem] font-semibold text-ink">
                    {t.narration}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {formatDateTime(t.date)} · {t.channel}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p
                    className={cn(
                      "tabular text-[0.8125rem] font-bold",
                      TXN_TONE[t.status],
                    )}
                  >
                    {["withdrawal", "fee"].includes(t.type) ? "−" : "+"}
                    {naira(t.amount)}
                  </p>
                  <p className="text-[0.6875rem] text-muted capitalize">{t.status}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader
            title="Group broadcasts"
            icon={<Megaphone className="size-4" />}
            action={
              <ButtonLink href="/app/announcements" variant="ghost" size="sm">
                All
              </ButtonLink>
            }
          />
          <CardBody className="space-y-4">
            {pinned.map((a) => (
              <Link key={a.id} href="/app/announcements" className="block group">
                <div className="flex items-center gap-2">
                  <Pill tone={a.priority === "critical" ? "danger" : "warning"}>
                    {a.priority}
                  </Pill>
                  <span className="text-[0.6875rem] text-muted">
                    {relativeTime(a.date)}
                  </span>
                </div>
                <p className="mt-1.5 text-[0.8125rem] leading-snug font-semibold text-ink group-hover:text-forest-800 dark:group-hover:text-gold-300">
                  {a.title}
                </p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
                  {a.body}
                </p>
              </Link>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Packing checklist"
            icon={<ListChecks className="size-4" />}
            action={
              <ButtonLink href="/app/checklist" variant="ghost" size="sm">
                Open
              </ButtonLink>
            }
          />
          <CardBody>
            <ProgressBar value={checklistPct} showValue label="Items packed" />
            <p className="mt-3 text-xs leading-relaxed text-muted">
              {checklistDone.length} of {CHECKLIST.length} items ready. The Ihram-safe
              toiletries and rehydration salts are the ones pilgrims most often forget.
            </p>
            <div className="mt-4 space-y-2">
              {CHECKLIST.filter((c) => !checklistDone.includes(c.id))
                .slice(0, 3)
                .map((c) => (
                  <div key={c.id} className="flex items-center gap-2.5">
                    <span className="size-4 shrink-0 rounded-md border border-line-strong" />
                    <span className="truncate text-xs text-muted">{c.label}</span>
                  </div>
                ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Your group"
            description={PILGRIM_GROUP.campZone}
            icon={<Users className="size-4" />}
            action={
              <ButtonLink href="/app/find-me" variant="ghost" size="sm">
                Locate
              </ButtonLink>
            }
          />
          <CardBody>
            <div className="flex -space-x-2">
              {GROUP_MEMBERS.slice(0, 7).map((m) => (
                <Avatar
                  key={m.id}
                  initials={m.initials}
                  tone={m.avatarTone}
                  size="sm"
                  ring
                />
              ))}
              <span className="tabular grid size-9 place-items-center rounded-full bg-surface-muted text-xs font-bold text-muted ring-2 ring-surface">
                +{PILGRIM_GROUP.memberCount - 7}
              </span>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              {PILGRIM_GROUP.memberCount} pilgrims led by {PILGRIM_GROUP.adminName}.
              Emergency line {PILGRIM_GROUP.emergencyLine}.
            </p>
            <ButtonLink href="/app/find-me" variant="outline" size="sm" className="mt-4" block>
              Open group map
              <ArrowRight className="size-3.5" />
            </ButtonLink>
          </CardBody>
        </Card>
      </div>

      <DepositModal open={depositOpen} onClose={() => setDepositOpen(false)} />
    </>
  );
}
