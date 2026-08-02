"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Info } from "lucide-react";
import { HAJJ_PACKAGES } from "@/lib/data/packages";
import {
  CYCLES_PER_YEAR,
  DEPARTURE_DATES,
  FREQUENCY_LABEL,
  FREQUENCY_SUFFIX,
  cyclesRemaining,
  requiredPerCycle,
} from "@/lib/savings";
import { formatDate, naira } from "@/lib/format";
import type { PlanFrequency, TravelYear } from "@/lib/types";
import { ButtonLink } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/tabs";
import { cn } from "@/lib/cn";

const YEARS: TravelYear[] = [2026, 2027, 2028];
const FREQUENCIES: PlanFrequency[] = ["weekly", "monthly", "quarterly"];

export function SavingsCalculator() {
  const [packageId, setPackageId] = useState(HAJJ_PACKAGES[0].id);
  const [year, setYear] = useState<TravelYear>(2027);
  const [frequency, setFrequency] = useState<PlanFrequency>("monthly");
  const [opening, setOpening] = useState(0);

  const pkg = HAJJ_PACKAGES.find((p) => p.id === packageId) ?? HAJJ_PACKAGES[0];
  const departure = DEPARTURE_DATES[year];

  const result = useMemo(() => {
    const perCycle = requiredPerCycle(pkg.priceNGN, opening, frequency, departure);
    const cycles = cyclesRemaining(frequency, departure);
    return { perCycle, cycles };
  }, [pkg.priceNGN, opening, frequency, departure]);

  const feasible = result.cycles > 0;

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_2px_4px_-1px_rgba(1,68,33,0.06),0_24px_60px_-30px_rgba(1,68,33,0.35)]">
      <div className="grid lg:grid-cols-[1.1fr_1fr]">
        {/* Controls */}
        <div className="space-y-6 p-6 sm:p-8">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-gold-600 uppercase dark:text-gold-400">
              Plan estimator
            </p>
            <h3 className="mt-2 text-2xl font-bold text-ink">
              What would your Hajj plan look like?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Pick a package and a travel year. We work backwards from the departure date
              to the contribution that gets you there.
            </p>
          </div>

          <div className="space-y-2.5">
            <p className="text-[0.8125rem] font-semibold text-ink">Choose your package</p>
            <div className="grid gap-2.5 sm:grid-cols-3">
              {HAJJ_PACKAGES.map((p) => {
                const active = p.id === packageId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPackageId(p.id)}
                    aria-pressed={active}
                    className={cn(
                      "rounded-xl border p-3 text-left transition",
                      active
                        ? "border-forest-700 bg-forest-50 ring-2 ring-forest-800/15 dark:bg-forest-950/70"
                        : "border-line bg-surface hover:border-forest-800/30",
                    )}
                  >
                    <span className="block text-[0.8125rem] font-semibold text-ink">
                      {p.tier}
                    </span>
                    <span className="tabular mt-0.5 block text-xs text-muted">
                      {naira(p.priceNGN)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2.5">
              <p className="text-[0.8125rem] font-semibold text-ink">Travel year</p>
              <SegmentedControl
                size="sm"
                items={YEARS.map((y) => ({ id: String(y), label: String(y) }))}
                value={String(year)}
                onChange={(v) => setYear(Number(v) as TravelYear)}
              />
            </div>
            <div className="space-y-2.5">
              <p className="text-[0.8125rem] font-semibold text-ink">How often</p>
              <SegmentedControl
                size="sm"
                items={FREQUENCIES.map((f) => ({ id: f, label: FREQUENCY_LABEL[f] }))}
                value={frequency}
                onChange={setFrequency}
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-baseline justify-between gap-3">
              <label
                htmlFor="opening-deposit"
                className="text-[0.8125rem] font-semibold text-ink"
              >
                Amount you already have
              </label>
              <span className="tabular text-sm font-bold text-forest-800 dark:text-gold-300">
                {naira(opening)}
              </span>
            </div>
            <input
              id="opening-deposit"
              type="range"
              min={0}
              max={pkg.priceNGN}
              step={50_000}
              value={Math.min(opening, pkg.priceNGN)}
              onChange={(e) => setOpening(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-muted accent-forest-800 dark:accent-gold-400"
            />
            <div className="flex justify-between text-[0.6875rem] text-muted">
              <span>₦0</span>
              <span>{naira(pkg.priceNGN)}</span>
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="relative overflow-hidden bg-forest-900 p-6 text-white sm:p-8">
          <div className="pattern-islamic pointer-events-none absolute inset-0 opacity-50" />
          <div className="pointer-events-none absolute -right-16 -bottom-16 size-64 rounded-full bg-gold-500/15 blur-3xl" />

          <div className="relative flex h-full flex-col">
            <p className="text-xs font-bold tracking-[0.16em] text-gold-400 uppercase">
              Your contribution
            </p>

            {feasible ? (
              <>
                <p className="mt-4 flex items-baseline gap-1.5">
                  <span
                    suppressHydrationWarning
                    className="tabular text-4xl font-extrabold tracking-tight sm:text-[2.75rem]"
                  >
                    {naira(result.perCycle)}
                  </span>
                  <span className="text-base font-medium text-white/60">
                    {FREQUENCY_SUFFIX[frequency]}
                  </span>
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  <span suppressHydrationWarning>{result.cycles}</span>{" "}
                  {frequency === "weekly"
                    ? "weekly"
                    : frequency === "monthly"
                      ? "monthly"
                      : "quarterly"}{" "}
                  contributions between today and the first{" "}
                  <span suppressHydrationWarning>{formatDate(departure)}</span> airlift.
                </p>
              </>
            ) : (
              <>
                <p className="mt-4 text-2xl font-bold">Too close to departure</p>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  The {year} airlift is already within one contribution cycle. Choose a
                  later travel year to build a realistic plan.
                </p>
              </>
            )}

            <dl className="mt-7 space-y-3 border-t border-white/15 pt-5 text-sm">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-white/60">Package</dt>
                <dd className="text-right font-semibold">{pkg.name}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-white/60">Total goal</dt>
                <dd className="tabular text-right font-semibold">
                  {naira(pkg.priceNGN)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-white/60">Still to save</dt>
                <dd className="tabular text-right font-semibold">
                  {naira(Math.max(0, pkg.priceNGN - opening))}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-white/60">Cycles in a year</dt>
                <dd className="tabular text-right font-semibold">
                  {CYCLES_PER_YEAR[frequency]}
                </dd>
              </div>
            </dl>

            <p className="mt-5 flex items-start gap-2 rounded-xl bg-white/8 p-3 text-xs leading-relaxed text-white/65">
              <Info className="mt-0.5 size-3.5 shrink-0 text-gold-400" />
              Contributions are rounded up to the nearest ₦500. Fares are indicative and
              reconciled against the gazetted NAHCON figure each season.
            </p>

            <ButtonLink href="/auth/register" variant="gold" className="mt-6" block>
              Start this plan
              <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
