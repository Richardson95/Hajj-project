import type { Metadata } from "next";
import {
  ArrowRight,
  BedDouble,
  Building2,
  CircleCheck,
  Info,
  MapPin,
  Plane,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/misc";
import { PageHero } from "@/components/marketing/page-hero";
import { SavingsCalculator } from "@/components/marketing/savings-calculator";
import { HAJJ_PACKAGES } from "@/lib/data/packages";
import { DEPARTURE_DATES, FREQUENCY_LABEL, requiredPerCycle } from "@/lib/savings";
import { formatDate, naira } from "@/lib/format";
import type { PlanFrequency } from "@/lib/types";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Plans & packages",
  description:
    "Compare the Baytullah Standard, Sakinah Premium and Kiswah Executive Hajj packages, see what each fare includes, and find the contribution that fits your income.",
};

const FREQUENCIES: PlanFrequency[] = ["weekly", "monthly", "quarterly"];

const COMPARE_ROWS: { label: string; key: keyof typeof ROW_VALUES }[] = [
  { label: "Flight class", key: "flight" },
  { label: "Nights in Makkah", key: "makkah" },
  { label: "Nights in Madinah", key: "madinah" },
  { label: "Room occupancy", key: "room" },
  { label: "Distance to the Haram", key: "distance" },
  { label: "Mina tent category", key: "tent" },
  { label: "Feeding", key: "feeding" },
  { label: "Guidance", key: "guide" },
  { label: "Ziyarah tour", key: "ziyarah" },
];

const ROW_VALUES = {
  flight: ["Economy", "Economy + 46kg", "Business"],
  makkah: ["26 nights", "24 nights", "22 nights"],
  madinah: ["8 nights", "8 nights", "7 nights"],
  room: ["4 per room", "3 per room", "2 per room"],
  distance: ["1.8km · shuttle", "600m · walking", "Haram-view tower"],
  tent: ["Category C", "Category B · cooled", "Category A · en-suite"],
  feeding: ["Full board", "Buffet + Zamzam", "À la carte · concierge"],
  guide: ["Group Mutawwif", "Hausa / Yoruba guide", "Private scholar"],
  ziyarah: ["Not included", "Madinah only", "Makkah & Madinah"],
} as const;

export default function PackagesPage() {
  return (
    <>
      <PageHero
        image="/images/makkah-clock-tower.jpg"
        imageAlt="The Kaaba and the Abraj Al-Bait clock tower in Makkah"
        imagePosition="center 30%"
        title="Packages"
        description="Each fare covers flight, visa, hotels, Mashaer services and meals."
      />

      {/* Package cards */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {HAJJ_PACKAGES.map((pkg, index) => {
            const featured = index === 1;
            return (
              <article
                key={pkg.id}
                className={cn(
                  "relative flex flex-col overflow-hidden rounded-2xl border",
                  featured
                    ? "border-forest-800 bg-surface ring-1 ring-forest-800 dark:border-gold-500 dark:ring-gold-500"
                    : "border-line bg-surface",
                )}
              >
                {pkg.highlight ? (
                  <div
                    className={cn(
                      "px-6 py-2 text-center text-xs font-medium",
                      featured
                        ? "bg-forest-800 text-white dark:bg-gold-500 dark:text-forest-950"
                        : "bg-surface-muted text-ink",
                    )}
                  >
                    {pkg.highlight}
                  </div>
                ) : null}

                <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-ink">{pkg.name}</h2>
                      <p className="mt-1 text-xs text-muted">{pkg.operator}</p>
                    </div>
                    <Badge tone={featured ? "gold" : "brand"}>{pkg.tier}</Badge>
                  </div>

                  <p className="tabular mt-6 text-3xl font-semibold tracking-tight text-ink">
                    {naira(pkg.priceNGN)}
                  </p>
                  <p className="mt-1 text-xs text-muted">All-inclusive fare per pilgrim</p>

                  <div className="mt-5 grid grid-cols-3 gap-2 border-y border-line py-4 text-center">
                    {[
                      { icon: BedDouble, v: `${pkg.nights.makkah}n`, l: "Makkah" },
                      { icon: Building2, v: `${pkg.nights.madinah}n`, l: "Madinah" },
                      { icon: Plane, v: pkg.tier === "Executive" ? "Business" : "Economy", l: "Flight" },
                    ].map((s) => (
                      <div key={s.l}>
                        <s.icon className="mx-auto size-4 text-muted" />
                        <p className="tabular mt-1.5 text-sm font-bold text-ink">{s.v}</p>
                        <p className="text-[0.625rem] tracking-wide text-muted uppercase">
                          {s.l}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted">
                    <MapPin className="mt-0.5 size-3.5 shrink-0 text-forest-700 dark:text-gold-400" />
                    {pkg.hotelDistance}
                  </p>

                  <ul className="mt-5 flex-1 space-y-2.5">
                    {pkg.inclusions.map((inc) => (
                      <li key={inc} className="flex items-start gap-2.5 text-sm text-ink/80">
                        <CircleCheck className="mt-0.5 size-4 shrink-0 text-forest-700 dark:text-gold-400" />
                        {inc}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 space-y-2 rounded-2xl bg-surface-muted p-4">
                    <p className="text-[0.6875rem] font-semibold tracking-wider text-muted uppercase">
                      Contribution for a 2027 departure
                    </p>
                    {FREQUENCIES.map((f) => (
                      <div
                        key={f}
                        className="flex items-baseline justify-between gap-3 text-sm"
                      >
                        <span className="text-muted">{FREQUENCY_LABEL[f]}</span>
                        <span
                          suppressHydrationWarning
                          className="tabular font-bold text-ink"
                        >
                          {naira(
                            requiredPerCycle(
                              pkg.priceNGN,
                              0,
                              f,
                              DEPARTURE_DATES[2027],
                            ),
                          )}
                        </span>
                      </div>
                    ))}
                    <p
                      suppressHydrationWarning
                      className="pt-1 text-[0.6875rem] text-muted"
                    >
                      Starting today, departing {formatDate(DEPARTURE_DATES[2027])}
                    </p>
                  </div>

                  <ButtonLink
                    href="/auth/register"
                    variant={featured ? "gold" : "primary"}
                    className="mt-5"
                    block
                  >
                    Choose {pkg.tier}
                    <ArrowRight className="size-4" />
                  </ButtonLink>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Comparison table */}
      <section className="border-y border-line bg-surface-muted/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading title="Compare" />

          <div className="mt-8 overflow-x-auto rounded-xl border border-line bg-surface">
            <table className="w-full min-w-160 border-collapse text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="px-5 py-4 text-left text-[0.6875rem] font-bold tracking-wider text-muted uppercase">
                    Feature
                  </th>
                  {HAJJ_PACKAGES.map((p) => (
                    <th key={p.id} className="px-5 py-4 text-left">
                      <span className="block text-sm font-bold text-ink">{p.tier}</span>
                      <span className="tabular block text-xs font-medium text-muted">
                        {naira(p.priceNGN)}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, i) => (
                  <tr
                    key={row.key}
                    className={cn(
                      "border-b border-line last:border-0",
                      i % 2 === 1 && "bg-surface-muted/40",
                    )}
                  >
                    <th
                      scope="row"
                      className="px-5 py-3.5 text-left text-[0.8125rem] font-medium text-muted"
                    >
                      {row.label}
                    </th>
                    {ROW_VALUES[row.key].map((value, j) => (
                      <td
                        key={j}
                        className="px-5 py-3.5 text-[0.8125rem] font-medium text-ink"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading title="Work out your contribution" />
        <div className="mt-10">
          <SavingsCalculator />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <p className="flex items-start gap-2 text-sm text-muted">
          <Info className="mt-0.5 size-4 shrink-0" />
          Fares are indicative and matched to the NAHCON figure each season. Any difference
          is settled before departure.
        </p>
      </section>
    </>
  );
}
