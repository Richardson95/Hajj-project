import type { Metadata } from "next";
import {
  ArrowRight,
  BedDouble,
  Building2,
  CircleCheck,
  Coins,
  Info,
  MapPin,
  Plane,
  Sparkles,
  Tent,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/misc";
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
      <section className="relative overflow-hidden border-b border-line bg-forest-950 text-white">
        <div className="pattern-islamic pointer-events-none absolute inset-0 opacity-45" />
        <div className="pointer-events-none absolute -top-20 left-1/3 size-120 rounded-full bg-forest-700/30 blur-[110px]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <p className="text-xs font-bold tracking-[0.18em] text-gold-400 uppercase">
            Plans & packages
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-5xl">
            Three ways to travel. One way to save.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70">
            Every package below is a complete Hajj fare — flight, visa, accommodation,
            Mashaer services and feeding. Choose the one that fits, and HajjPath works out
            the contribution that gets you there.
          </p>
          <p className="mt-6 inline-flex items-start gap-2 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs leading-relaxed text-white/60">
            <Info className="mt-0.5 size-3.5 shrink-0 text-gold-400" />
            Fares are indicative and reconciled against the gazetted NAHCON figure each
            season. Any difference is refunded or topped up before departure.
          </p>
        </div>
      </section>

      {/* Package cards */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {HAJJ_PACKAGES.map((pkg, index) => {
            const featured = index === 1;
            return (
              <article
                key={pkg.id}
                className={cn(
                  "relative flex flex-col overflow-hidden rounded-3xl border transition duration-300 hover:-translate-y-1.5",
                  featured
                    ? "border-gold-500/50 bg-surface shadow-[0_30px_70px_-40px_rgba(201,162,39,0.7)] lg:-mt-4 lg:mb-4"
                    : "border-line bg-surface hover:shadow-[0_24px_60px_-40px_rgba(1,68,33,0.6)]",
                )}
              >
                {pkg.highlight ? (
                  <div
                    className={cn(
                      "px-6 py-2 text-center text-[0.6875rem] font-bold tracking-[0.16em] uppercase",
                      featured
                        ? "bg-gold-500 text-forest-950"
                        : "bg-forest-800 text-white",
                    )}
                  >
                    {pkg.highlight}
                  </div>
                ) : null}

                <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-ink">{pkg.name}</h2>
                      <p className="mt-1 text-xs text-muted">{pkg.operator}</p>
                    </div>
                    <Badge tone={featured ? "gold" : "brand"}>{pkg.tier}</Badge>
                  </div>

                  <p className="tabular mt-6 text-4xl font-extrabold tracking-tight text-ink">
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
          <SectionHeading
            align="center"
            eyebrow="Side by side"
            title="What actually differs between the packages"
            description="The rites are identical for every pilgrim. What you are choosing is distance to the Haram, comfort in Mina, and how much support you want along the way."
          />

          <div className="mt-12 overflow-x-auto rounded-2xl border border-line bg-surface">
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
        <SectionHeading
          align="center"
          eyebrow="Build your plan"
          title="Adjust the numbers until they feel possible"
        />
        <div className="mt-12">
          <SavingsCalculator />
        </div>
      </section>

      {/* Included everywhere */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-line bg-surface p-8 sm:p-10">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-gold-50 text-gold-700 dark:bg-gold-950 dark:text-gold-300">
              <Sparkles className="size-5" />
            </span>
            <h2 className="text-xl font-bold text-ink">
              Included with every package, at no extra cost
            </h2>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Coins,
                title: "The full HajjPath app",
                body: "Savings, itinerary, guides, maps, Find Me, marketplace, SOS and your post-Hajj badge.",
              },
              {
                icon: Tent,
                title: "Group assignment",
                body: "Placement with a NAHCON-licensed operator and a named group admin before departure.",
              },
              {
                icon: Building2,
                title: "Compliance pack",
                body: "Your verified identity, passport details and savings history, formatted for NAHCON.",
              },
              {
                icon: MapPin,
                title: "Offline essentials",
                body: "Maps, guides, du'ās and your itinerary cached to your device before you fly.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-surface-muted p-5">
                <item.icon className="size-5 text-forest-700 dark:text-gold-400" />
                <h3 className="mt-3 text-[0.9375rem] font-bold text-ink">{item.title}</h3>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
