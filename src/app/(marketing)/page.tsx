import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Compass,
  Lock,
  MapPin,
  ShieldCheck,
  Siren,
  Store,
  UserCheck,
  Wallet,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/misc";
import { SavingsCalculator } from "@/components/marketing/savings-calculator";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { Testimonials } from "@/components/marketing/testimonials";

export const metadata: Metadata = {
  title: "HajjPath — Save for Hajj, then go with a guide",
  description:
    "A Hajj savings plan that fits your income, and a companion app for Makkah, Mina, Arafat and Madinah.",
};

const STAGES = [
  {
    image: "/images/makkah-clock-tower.jpg",
    alt: "The Kaaba and the Abraj Al-Bait clock tower in Makkah",
    title: "Save",
    position: "center 85%",
    body: "Pick a package and travel year. We work out the weekly or monthly amount.",
  },
  {
    image: "/images/arafat.jpg",
    alt: "Pilgrims in ihram on Mount Arafat",
    title: "Go",
    position: "center 70%",
    body: "Offline maps, ritual guides, a group locator and SOS for the days in the Mashaer.",
  },
  {
    image: "/images/madinah-courtyard.jpg",
    alt: "The courtyard of the Prophet's Mosque in Madinah at sunset",
    title: "Return",
    position: "center",
    body: "A verified Al-Hajji badge on your profile, and credit for every friend you refer.",
  },
];

const FEATURES = [
  { icon: Compass, title: "Find Me", body: "See your group on a live map.", href: "/app/find-me" },
  { icon: CalendarDays, title: "Day planner", body: "Every rite, in order.", href: "/app/planner" },
  { icon: MapPin, title: "Offline maps", body: "Camps, Jamarat, clinics.", href: "/app/map" },
  { icon: Store, title: "Marketplace", body: "Delivered to your tent.", href: "/app/marketplace" },
  { icon: Siren, title: "SOS", body: "One press to your group admin.", href: "/app/sos" },
  { icon: BookOpen, title: "Guide", body: "Audio in Hausa, Yoruba and English.", href: "/app/guide" },
];

const TRUST = [
  { icon: Wallet, text: "Payments through Paystack" },
  { icon: ShieldCheck, text: "Non-interest, Shariah-reviewed" },
  { icon: UserCheck, text: "NIN and passport verified" },
  { icon: Lock, text: "Location shared only with your group" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-10 pb-16 sm:px-6 lg:px-8 lg:pt-16 lg:pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h1 className="text-4xl leading-[1.08] font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Save for Hajj.
              <br />
              We&apos;ll guide you there.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
              A savings plan that fits your income, and a companion for every rite once you
              land.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/auth/register" size="lg">
                Start saving
                <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/how-it-works" variant="outline" size="lg">
                How it works
              </ButtonLink>
            </div>
            <dl className="mt-10 flex gap-10 border-t border-line pt-6">
              {[
                { v: "38,400+", l: "Pilgrims saving" },
                { v: "99.2%", l: "Goals met on time" },
              ].map((s) => (
                <div key={s.l}>
                  <dt className="tabular text-2xl font-semibold tracking-tight text-ink">{s.v}</dt>
                  <dd className="mt-0.5 text-sm text-muted">{s.l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-surface-muted lg:aspect-5/4">
            <Image
              src="/images/makkah-haram.jpg"
              alt="Pilgrims in ihram around the Kaaba in Masjid al-Haram"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Save · Go · Return */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <SectionHeading title="One app for the whole journey" />
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {STAGES.map((s) => (
              <article key={s.title}>
                <div className="relative aspect-3/2 overflow-hidden rounded-xl bg-surface-muted">
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                    style={{ objectPosition: s.position }}
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="border-t border-line bg-surface-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <SectionHeading title="What would it cost you?" description="No account needed." />
          <div className="mt-10">
            <SavingsCalculator />
          </div>
        </div>
      </section>

      {/* In Makkah */}
      <section className="border-t border-line">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
          <div className="relative order-last min-h-80 overflow-hidden rounded-2xl bg-surface-muted lg:order-first">
            <Image
              src="/images/madinah-arches.jpg"
              alt="Striped arches inside the Prophet's Mosque in Madinah"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeading
              title="On the ground"
              description="Guides and maps download before you fly, so they work without data."
            />
            <ul className="mt-8 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
              {FEATURES.map((f) => (
                <li key={f.title} className="bg-surface">
                  <Link
                    href={f.href}
                    className="flex h-full items-start gap-3 p-4 transition-colors hover:bg-surface-muted"
                  >
                    <f.icon className="mt-0.5 size-5 shrink-0 text-forest-700 dark:text-gold-400" />
                    <span>
                      <span className="block text-sm font-medium text-ink">{f.title}</span>
                      <span className="block text-sm text-muted">{f.body}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/companion"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-forest-800 hover:underline dark:text-gold-300"
            >
              All companion features
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="border-t border-line bg-surface-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST.map((t) => (
              <li key={t.text} className="flex items-center gap-3 text-sm text-ink">
                <t.icon className="size-5 shrink-0 text-forest-700 dark:text-gold-400" />
                {t.text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <SectionHeading title="From our pilgrims" />
          <div className="mt-10">
            <Testimonials />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <SectionHeading title="Questions" />
          <div className="mt-8">
            <FaqAccordion limit={5} />
          </div>
          <Link
            href="/faq"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-forest-800 hover:underline dark:text-gold-300"
          >
            All questions
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="relative isolate overflow-hidden bg-neutral-950 text-white">
        <Image
          src="/images/kaaba-kiswah.jpg"
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover object-[50%_70%]"
        />
        <div className="absolute inset-0 -z-10 bg-black/60" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
            The intention is there. Give it a plan.
          </h2>
          <div className="mt-8">
            <ButtonLink href="/auth/register" variant="gold" size="lg">
              Create an account
              <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
