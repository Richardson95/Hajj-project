import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
  ChartLine,
  CircleCheck,
  Clock,
  HandCoins,
  Package,
  ShieldCheck,
  Star,
  Store,
  Truck,
  Users,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/misc";
import { CATEGORY_META, VENDORS } from "@/lib/data/marketplace";
import { Icon } from "@/components/icon";

export const metadata: Metadata = {
  title: "For vendors",
  description:
    "Sell to Nigerian pilgrims in Makkah and Madinah. Verified storefront, escrow-protected payments, delivery to hotels and Mina tents, and a dashboard that shows you real demand.",
};

type IconType = React.ComponentType<{ className?: string }>;

const BENEFITS: { icon: IconType; title: string; body: string }[] = [
  {
    icon: Users,
    title: "Reach pilgrims before they reach the souq",
    body: "Nigerian pilgrims arrive with a list and no idea where to shop. Your storefront sits inside the app they already open twenty times a day.",
  },
  {
    icon: HandCoins,
    title: "Escrow means you always get paid",
    body: "Funds are held by HajjPath the moment an order is placed and released to you on confirmed delivery. No chasing, no disputes at the hotel door.",
  },
  {
    icon: Truck,
    title: "Delivery logistics handled",
    body: "Riders cover the Haram district, Aziziyah, the Mina camps and central Madinah. You pack; we move it to the tent or the room number.",
  },
  {
    icon: ChartLine,
    title: "Demand you can plan around",
    body: "See what is selling, when the airlift peaks, and which camps are ordering. Stock the right quantity before Dhul-Hijjah rather than guessing.",
  },
  {
    icon: BadgeCheck,
    title: "Verification that means something",
    body: "Physical inspection, valid Saudi commercial registration and seasonal re-verification. Buyers trust the badge, so the badge is worth having.",
  },
  {
    icon: Store,
    title: "A digital presence you keep",
    body: "Ratings, reviews and order history build across seasons. Your reputation follows you into the next Hajj instead of resetting every year.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Apply with your registration",
    body: "Submit your Saudi commercial registration, shop address and the categories you supply.",
  },
  {
    n: "02",
    title: "Pass physical inspection",
    body: "A HajjPath field agent visits the premises in Makkah or Madinah to confirm stock and capacity.",
  },
  {
    n: "03",
    title: "List your catalogue",
    body: "Upload products with Riyal pricing, stock levels, delivery windows and the zones you serve.",
  },
  {
    n: "04",
    title: "Fulfil and get paid",
    body: "Accept orders in the vendor dashboard, hand off to a rider, and receive settlement on confirmed delivery.",
  },
];

export default function VendorsPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-forest-950 text-white">
        <div className="pattern-islamic pointer-events-none absolute inset-0 opacity-45" />
        <div className="pointer-events-none absolute -top-24 left-1/4 size-120 rounded-full bg-gold-600/15 blur-[110px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-gold-400 uppercase">
                For Makkah & Madinah vendors
              </p>
              <h1 className="mt-4 text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-5xl">
                Your shop is forty minutes away. Your customers are on their phone.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
                Thousands of Nigerian pilgrims arrive each season needing Ihram, food,
                medicine, a certified ram and a hundred small things. HajjPath puts your
                catalogue in front of them and guarantees your payment.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/contact" variant="gold" size="lg">
                  Apply to sell
                  <ArrowRight className="size-4" />
                </ButtonLink>
                <ButtonLink
                  href="/app/vendor"
                  size="lg"
                  className="border border-white/20 bg-white/8 text-white hover:bg-white/15"
                >
                  See the vendor dashboard
                </ButtonLink>
              </div>

              <dl className="mt-11 grid max-w-lg grid-cols-3 gap-6 border-t border-white/12 pt-7">
                {[
                  { v: "41", l: "Verified vendors" },
                  { v: "0%", l: "Chargeback losses" },
                  { v: "3.2×", l: "Median revenue lift" },
                ].map((s) => (
                  <div key={s.l}>
                    <dt className="tabular text-2xl font-extrabold tracking-tight">
                      {s.v}
                    </dt>
                    <dd className="mt-1 text-xs leading-snug text-white/55">{s.l}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Vendor card preview */}
            <div className="rounded-3xl border border-white/12 bg-white/5 p-6 backdrop-blur-sm">
              <p className="text-xs font-bold tracking-[0.16em] text-gold-400 uppercase">
                Vendors already on HajjPath
              </p>
              <ul className="mt-5 space-y-3">
                {VENDORS.slice(0, 4).map((v) => (
                  <li
                    key={v.id}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5"
                  >
                    <span
                      className={`grid size-10 shrink-0 place-items-center rounded-xl bg-linear-to-br ${v.tone} text-sm font-bold text-white`}
                    >
                      {v.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1.5 truncate text-sm font-semibold">
                        {v.name}
                        {v.verified ? (
                          <BadgeCheck className="size-3.5 shrink-0 text-gold-400" />
                        ) : null}
                      </p>
                      <p className="truncate text-xs text-white/50">{v.location}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="tabular flex items-center gap-1 text-xs font-bold text-gold-300">
                        <Star className="size-3 fill-current" />
                        {v.rating}
                      </p>
                      <p className="tabular text-[0.625rem] text-white/45">
                        {v.fulfilled.toLocaleString("en-NG")} orders
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          align="center"
          eyebrow="Why sell here"
          title="Built around how Hajj commerce actually works"
          description="Short season, enormous demand, buyers who do not know the city and cannot risk a bad transaction. Everything below exists to remove the friction on both sides."
        />
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-line bg-surface p-6 transition hover:border-forest-800/25 hover:shadow-[0_20px_50px_-35px_rgba(1,68,33,0.6)]"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-forest-50 text-forest-800 dark:bg-forest-950 dark:text-gold-300">
                <b.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-[0.9375rem] font-bold text-ink">{b.title}</h3>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="border-y border-line bg-surface-muted/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            align="center"
            eyebrow="Categories in demand"
            title="What Nigerian pilgrims buy most"
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(CATEGORY_META).map(([key, meta]) => (
              <div key={key} className="rounded-2xl border border-line bg-surface p-5">
                <span
                  className={`grid size-11 place-items-center rounded-xl bg-linear-to-br ${meta.tone} text-white`}
                >
                  <Icon name={meta.icon} className="size-5" />
                </span>
                <h3 className="mt-4 text-[0.9375rem] font-bold text-ink">{meta.label}</h3>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">
                  {meta.blurb}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="Getting listed"
              title="Four steps to your first order"
              description="Applications for the 2027 season close eight weeks before the first airlift so there is time for inspection and catalogue review."
            />
            <ButtonLink href="/contact" className="mt-8">
              Start an application
              <ArrowRight className="size-4" />
            </ButtonLink>
          </div>

          <ol className="space-y-4">
            {STEPS.map((s) => (
              <li
                key={s.n}
                className="flex gap-5 rounded-2xl border border-line bg-surface p-6"
              >
                <span className="tabular grid size-11 shrink-0 place-items-center rounded-xl bg-forest-800 text-sm font-bold text-white">
                  {s.n}
                </span>
                <div>
                  <h3 className="text-base font-bold text-ink">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Terms */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-line bg-surface p-8 sm:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-gold-50 text-gold-700 dark:bg-gold-950 dark:text-gold-300">
              <ShieldCheck className="size-5" />
            </span>
            <h2 className="text-xl font-bold text-ink">Commercial terms, stated plainly</h2>
            <Badge tone="gold" className="ml-auto">
              2027 season
            </Badge>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: HandCoins, label: "Commission", value: "8% per fulfilled order" },
              { icon: Clock, label: "Settlement", value: "Within 48 hours of delivery" },
              { icon: Package, label: "Listing fee", value: "None" },
              { icon: Truck, label: "Delivery", value: "SAR 15, waived above SAR 200" },
            ].map((t) => (
              <div key={t.label} className="rounded-2xl bg-surface-muted p-5">
                <t.icon className="size-5 text-forest-700 dark:text-gold-400" />
                <p className="mt-3 text-[0.6875rem] font-semibold tracking-wider text-muted uppercase">
                  {t.label}
                </p>
                <p className="mt-1 text-sm font-bold text-ink">{t.value}</p>
              </div>
            ))}
          </div>

          <ul className="mt-7 grid gap-2.5 border-t border-line pt-6 sm:grid-cols-2">
            {[
              "Cancel an order before dispatch at no penalty",
              "Disputes reviewed by HajjPath within one business day",
              "Buyer refunds come from the escrow float, never from your balance",
              "Ratings below 4.0 trigger a support review, not an instant delisting",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2.5 text-sm text-ink/80">
                <CircleCheck className="mt-0.5 size-4 shrink-0 text-forest-700 dark:text-gold-400" />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
