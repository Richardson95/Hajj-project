import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, BadgeCheck, HandCoins, Star, Truck, Users } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/misc";
import { PageHero } from "@/components/marketing/page-hero";
import { CATEGORY_META, VENDORS } from "@/lib/data/marketplace";
import { Icon } from "@/components/icon";

export const metadata: Metadata = {
  title: "For vendors",
  description:
    "Sell to Nigerian pilgrims in Makkah and Madinah, with escrow payments and delivery to hotels and Mina tents.",
};

const BENEFITS = [
  { icon: Users, title: "Buyers already in the app", body: "Pilgrims shop where they plan their day." },
  { icon: HandCoins, title: "Paid through escrow", body: "Released to you on confirmed delivery." },
  { icon: Truck, title: "Delivery handled", body: "Haram district, Aziziyah, Mina and Madinah." },
  { icon: BadgeCheck, title: "A badge that counts", body: "Inspected in person, re-checked each season." },
];

const STEPS = [
  "Apply with your Saudi commercial registration",
  "Pass an in-person inspection",
  "List your products in Riyal",
  "Fulfil orders and get paid within 48 hours",
];

const TERMS = [
  { label: "Commission", value: "8% per order" },
  { label: "Settlement", value: "48 hours" },
  { label: "Listing fee", value: "None" },
  { label: "Delivery", value: "SAR 15, free over SAR 200" },
];

export default function VendorsPage() {
  return (
    <>
      <PageHero
        image="/images/madinah-courtyard.jpg"
        imageAlt="The courtyard of the Prophet's Mosque in Madinah"
        title="Sell to pilgrims in Makkah and Madinah"
        description="Your catalogue in the app Nigerian pilgrims use every day, with payment guaranteed."
      >
        <ButtonLink href="/contact" variant="gold" size="lg">
          Apply to sell
          <ArrowRight className="size-4" />
        </ButtonLink>
        <ButtonLink
          href="/app/vendor"
          size="lg"
          className="border border-white/30 bg-white/10 text-white hover:bg-white/20"
        >
          Vendor dashboard
        </ButtonLink>
      </PageHero>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <div key={b.title}>
              <b.icon className="size-5 text-forest-700 dark:text-gold-400" />
              <h3 className="mt-3 font-semibold text-ink">{b.title}</h3>
              <p className="mt-1 text-sm text-muted">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-surface-muted/40">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
          <div>
            <SectionHeading title="What pilgrims buy" />
            <ul className="mt-8 grid gap-2 sm:grid-cols-2">
              {Object.entries(CATEGORY_META).map(([key, meta]) => (
                <li key={key} className="flex items-center gap-3 rounded-lg bg-surface px-3 py-2.5">
                  <span
                    className={`grid size-8 shrink-0 place-items-center rounded-md bg-linear-to-br ${meta.tone} text-white`}
                  >
                    <Icon name={meta.icon} className="size-4" />
                  </span>
                  <span className="text-sm text-ink">{meta.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading title="On HajjPath now" />
            <ul className="mt-8 divide-y divide-line rounded-xl border border-line bg-surface">
              {VENDORS.slice(0, 4).map((v) => (
                <li key={v.id} className="flex items-center gap-3 px-4 py-3">
                  <span
                    className={`grid size-9 shrink-0 place-items-center rounded-lg bg-linear-to-br ${v.tone} text-xs font-semibold text-white`}
                  >
                    {v.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 truncate text-sm font-medium text-ink">
                      {v.name}
                      {v.verified ? (
                        <BadgeCheck className="size-3.5 shrink-0 text-forest-700 dark:text-gold-400" />
                      ) : null}
                    </p>
                    <p className="truncate text-xs text-muted">{v.location}</p>
                  </div>
                  <span className="tabular flex items-center gap-1 text-sm text-ink">
                    <Star className="size-3.5 fill-gold-500 text-gold-500" />
                    {v.rating}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:gap-16 lg:px-8 lg:py-24">
          <div className="relative min-h-72 overflow-hidden rounded-2xl bg-surface-muted">
            <Image
              src="/images/madinah-arches.jpg"
              alt="Inside the Prophet's Mosque in Madinah"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeading title="Getting listed" />
            <ol className="mt-8 space-y-4">
              {STEPS.map((s, i) => (
                <li key={s} className="flex items-baseline gap-4 text-ink">
                  <span className="tabular w-5 shrink-0 text-sm text-muted">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
            <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-8">
              {TERMS.map((t) => (
                <div key={t.label}>
                  <dt className="text-sm text-muted">{t.label}</dt>
                  <dd className="mt-1 font-medium text-ink">{t.value}</dd>
                </div>
              ))}
            </dl>
            <ButtonLink href="/contact" className="mt-10">
              Start an application
              <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
