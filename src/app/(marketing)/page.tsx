import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Building2,
  CalendarDays,
  ChevronRight,
  Compass,
  CreditCard,
  Globe,
  Headset,
  LayoutDashboard,
  Lock,
  MapPin,
  MonitorSmartphone,
  ShieldCheck,
  Siren,
  Sparkles,
  Store,
  Trophy,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/misc";
import { Kaaba } from "@/components/brand-icons";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { SavingsCalculator } from "@/components/marketing/savings-calculator";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { Testimonials } from "@/components/marketing/testimonials";
import {
  COMPLIANCE_POINTS,
  PARTNER_LOGOS,
} from "@/lib/data/marketing";

export const metadata: Metadata = {
  title: "HajjPath — From Intention to Completion",
  description:
    "Save towards Hajj on a plan that fits your income, then let HajjPath guide you through every rite in Makkah, Mina, Arafat and Madinah. A complete pilgrimage ecosystem for Nigerian Muslims.",
};

/* ------------------------------------------------------------------ */

type IconType = React.ComponentType<{ className?: string }>;

const COMPANION_FEATURES: {
  icon: IconType;
  title: string;
  body: string;
  href: string;
}[] = [
  {
    icon: Compass,
    title: "Find Me",
    body: "Every pilgrim carries a QR and Bluetooth tag. Group members see each other on a live map; anyone who finds a lost pilgrim can scan to reach the admin.",
    href: "/app/find-me",
  },
  {
    icon: CalendarDays,
    title: "Tour planner",
    body: "A day-by-day itinerary through Madinah, Makkah, Mina, Arafat, Muzdalifah and Jamarat, with the obligation level marked on every single rite.",
    href: "/app/planner",
  },
  {
    icon: MapPin,
    title: "Live map & directions",
    body: "Camps, Jamarat levels, hospitals, restrooms, cooling stations and coach bays — cached offline before you ever leave Nigeria.",
    href: "/app/map",
  },
  {
    icon: Store,
    title: "Makkah marketplace",
    body: "Verified vendors for Ihram, livestock, food, toiletries and medicine, delivered to your hotel or your tent, with payment held in escrow.",
    href: "/app/marketplace",
  },
  {
    icon: Siren,
    title: "Emergency SOS",
    body: "One press alerts your emergency contacts, your group admin and the HajjPath desk with your exact position and the nature of the emergency.",
    href: "/app/sos",
  },
  {
    icon: BookOpen,
    title: "Guide library",
    body: "Step-by-step rituals, authentic du'ās with transliteration, an interactive checklist and audio guidance in Hausa, Yoruba, Arabic and English.",
    href: "/app/guide",
  },
];

/* ------------------------------------------------------------------ */

export default function HomePage() {
  return (
    <>
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden bg-forest-950 text-white">
        <div className="pattern-islamic pointer-events-none absolute inset-0 opacity-45" />
        <div className="pointer-events-none absolute -top-32 -left-24 size-136 rounded-full bg-forest-700/30 blur-[110px]" />
        <div className="pointer-events-none absolute top-1/3 -right-24 size-120 rounded-full bg-gold-600/15 blur-[110px]" />

        <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24 lg:pb-28">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-gold-300">
                <Sparkles className="size-3.5" />
                Built for Nigerian Muslims, at home and abroad
              </span>

              <h1 className="mt-6 text-[2.5rem] leading-[1.06] font-extrabold tracking-tight sm:text-6xl lg:text-[4rem]">
                From intention
                <br />
                to completion,
                <br />
                <span className="text-gradient-gold">HajjPath guides you</span>
                <br />
                all the way.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
                Save towards Hajj on a plan that fits your income. Then, when the airlift
                comes, carry a companion that knows every rite, every camp and every turn
                between Madinah and the Jamarat.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/auth/register" variant="gold" size="lg">
                  Start saving today
                  <ArrowRight className="size-4" />
                </ButtonLink>
                <ButtonLink
                  href="/how-it-works"
                  size="lg"
                  className="border border-white/20 bg-white/8 text-white hover:bg-white/15"
                >
                  See how it works
                </ButtonLink>
              </div>

              <dl className="mt-11 grid max-w-lg grid-cols-3 gap-6 border-t border-white/12 pt-7">
                {[
                  { v: "38,400+", l: "Pilgrims saving" },
                  { v: "₦14.2bn", l: "Held in trust" },
                  { v: "99.2%", l: "Goals met on time" },
                ].map((s) => (
                  <div key={s.l}>
                    <dt className="tabular text-2xl font-extrabold tracking-tight sm:text-[1.75rem]">
                      {s.v}
                    </dt>
                    <dd className="mt-1 text-xs leading-snug text-white/55">{s.l}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="animate-fade-up lg:pl-4 [animation-delay:120ms]">
              <DashboardPreview />
              <p className="mt-4 flex items-center justify-center gap-2 text-xs text-white/50">
                <MonitorSmartphone className="size-4 text-gold-400" />
                Runs in any browser — nothing to install, on desktop or phone
              </p>
            </div>
          </div>
        </div>

        {/* Partner marquee */}
        <div className="relative border-t border-white/10 bg-forest-950/60 py-5">
          <p className="mb-4 text-center text-[0.6875rem] font-semibold tracking-[0.18em] text-white/40 uppercase">
            Working alongside
          </p>
          <div className="no-scrollbar flex overflow-hidden">
            <div className="animate-marquee flex shrink-0 items-center gap-12 pr-12">
              {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="text-sm font-semibold tracking-wide whitespace-nowrap text-white/35"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======================= THREE PILLARS ======================= */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeading
          align="center"
          eyebrow="One app, three chapters"
          title="HajjPath is not a payment plan. It is the whole journey."
          description="Most apps stop when the money is raised. Yours has barely started. HajjPath carries you from the first ₦5,000 to the farewell Tawaf and the story you tell afterwards."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {[
            {
              tag: "Before",
              icon: Wallet,
              title: "Save with discipline and clarity",
              body: "Verified onboarding, a plan that matches your income, secure payments through Paystack and a goal tracker that never lets the target drift out of sight.",
              points: ["KYC in one working day", "Weekly · monthly · quarterly", "Family & diaspora plans"],
              tone: "from-forest-800 to-forest-950",
            },
            {
              tag: "During",
              icon: Compass,
              title: "Never be lost in the Mashaer",
              body: "A live map of the holy sites, a group locator, ritual guidance in your language, a marketplace that delivers to your tent, and SOS one press away.",
              points: ["Offline maps & guides", "Find Me group locator", "24/7 emergency desk"],
              tone: "from-gold-600 to-gold-800",
            },
            {
              tag: "After",
              icon: Trophy,
              title: "Keep what the journey gave you",
              body: "A verified Al-Hajji badge on your profile, earned rather than claimed, and rewards for every relative and friend you guide onto the path.",
              points: ["Verified honorific badge", "Confirmed on landing", "₦15,000 referral credit"],
              tone: "from-forest-700 to-forest-900",
            },
          ].map((pillar) => (
            <article
              key={pillar.tag}
              className="group relative overflow-hidden rounded-3xl border border-line bg-surface p-7 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_70px_-40px_rgba(1,68,33,0.6)]"
            >
              <div
                className={`grid size-13 place-items-center rounded-2xl bg-linear-to-br ${pillar.tone} text-white shadow-lg`}
              >
                <pillar.icon className="size-6" />
              </div>
              <p className="mt-5 text-xs font-bold tracking-[0.16em] text-gold-600 uppercase dark:text-gold-400">
                {pillar.tag} the journey
              </p>
              <h3 className="mt-2 text-xl font-bold text-ink">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{pillar.body}</p>
              <ul className="mt-5 space-y-2 border-t border-line pt-5">
                {pillar.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm text-ink/80">
                    <BadgeCheck className="size-4 shrink-0 text-forest-700 dark:text-gold-400" />
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* ======================== CALCULATOR ========================= */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeading
          align="center"
          eyebrow="Try it now"
          title="Find your number in thirty seconds"
          description="No account needed. Move the sliders and see exactly what Hajj would cost you each week, month or quarter."
        />
        <div className="mt-12">
          <SavingsCalculator />
        </div>
      </section>

      {/* ===================== IN MAKKAH SECTION ===================== */}
      <section className="relative overflow-hidden bg-forest-950 text-white">
        <div className="pattern-islamic pointer-events-none absolute inset-0 opacity-40" />
        <div className="pointer-events-none absolute top-0 left-1/2 size-144 -translate-x-1/2 rounded-full bg-gold-600/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-bold tracking-[0.18em] text-gold-400 uppercase">
              During the journey
            </p>
            <h2 className="text-3xl leading-[1.15] font-bold sm:text-4xl">
              Two million people. Forty-eight degrees. One companion that knows exactly
              where you are.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70">
              The hardest part of Hajj is not the saving. It is the six days between the
              8th and the 13th of Dhul-Hijjah, when the crowd is dense, the heat is
              punishing and the rites must be done in the right order. That is where
              HajjPath earns its place.
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COMPANION_FEATURES.map((f) => (
              <Link
                key={f.title}
                href={f.href}
                className="group rounded-2xl border border-white/12 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:border-gold-400/40 hover:bg-white/10"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-gold-400/15 text-gold-300 transition group-hover:bg-gold-400/25">
                  <f.icon className="size-5" />
                </span>
                <h3 className="mt-4 flex items-center gap-1 text-[0.9375rem] font-bold">
                  {f.title}
                  <ChevronRight className="size-4 text-white/30 transition group-hover:translate-x-0.5 group-hover:text-gold-300" />
                </h3>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-white/60">
                  {f.body}
                </p>
              </Link>
            ))}
          </div>

          <Link
            href="/companion"
            className="mt-10 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300 hover:text-gold-200"
          >
            Everything the companion does
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* ========================= COMPLIANCE ======================== */}
      <section className="relative overflow-hidden border-y border-line bg-forest-900 text-white">
        <div className="pattern-islamic pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <div>
              <p className="mb-3 text-xs font-bold tracking-[0.18em] text-gold-400 uppercase">
                Trust & compliance
              </p>
              <h2 className="text-3xl leading-[1.15] font-bold sm:text-4xl">
                Your money, your identity and your location — held to the standard they
                deserve.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/70">
                Hajj savings are often years of sacrifice. We treat them accordingly:
                ring-fenced custody, verified identity, Shariah oversight and encryption
                on everything that could put a pilgrim at risk.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                {[
                  { icon: ShieldCheck, label: "Shariah board reviewed" },
                  { icon: Lock, label: "End-to-end encrypted" },
                  { icon: Building2, label: "Funds held in trust" },
                  { icon: Globe, label: "Diaspora friendly" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2.5 rounded-xl border border-white/12 bg-white/5 px-3.5 py-3"
                  >
                    <item.icon className="size-4 shrink-0 text-gold-400" />
                    <span className="text-xs font-medium text-white/80">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {COMPLIANCE_POINTS.map((point, i) => (
                <div
                  key={point.title}
                  className="rounded-2xl border border-white/12 bg-white/5 p-5"
                >
                  <div className="flex items-start gap-4">
                    <span className="tabular grid size-8 shrink-0 place-items-center rounded-lg bg-gold-400/15 text-xs font-bold text-gold-300">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-[0.9375rem] font-bold">{point.title}</h3>
                      <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-white/65">
                        {point.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======================== TESTIMONIALS ======================= */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          align="center"
          eyebrow="In their own words"
          title="What pilgrims, sponsors and vendors say"
        />
        <div className="mt-12">
          <Testimonials />
        </div>
      </section>

      {/* ============================ FAQ =========================== */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          align="center"
          eyebrow="Questions"
          title="Everything people ask before they start"
        />
        <div className="mt-10">
          <FaqAccordion limit={5} />
        </div>
        <p className="mt-6 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-800 hover:underline dark:text-gold-300"
          >
            See all questions
            <ArrowRight className="size-4" />
          </Link>
        </p>
      </section>

      {/* ============================ CTA =========================== */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-4xl bg-forest-900 px-6 py-16 text-center text-white sm:px-12 sm:py-20">
          <div className="pattern-islamic pointer-events-none absolute inset-0 opacity-45" />
          <div className="pointer-events-none absolute -bottom-24 left-1/2 size-112 -translate-x-1/2 rounded-full bg-gold-500/20 blur-[100px]" />

          <div className="relative mx-auto max-w-2xl">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-gold-400/15 text-gold-300">
              <Kaaba className="size-7" />
            </span>
            <h2 className="mt-6 text-3xl leading-tight font-extrabold sm:text-[2.75rem]">
              The intention is already there.
              <br />
              Give it a plan.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70">
              Open an account in a few minutes, choose your travel year, and let HajjPath
              carry the arithmetic, the reminders and the road ahead.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="/auth/register" variant="gold" size="lg">
                Create your account
                <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink
                href="/app"
                size="lg"
                className="border border-white/20 bg-white/8 text-white hover:bg-white/15"
              >
                <LayoutDashboard className="size-4" />
                Explore the live demo
              </ButtonLink>
            </div>
            <p className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/45">
              <span className="flex items-center gap-1.5">
                <CreditCard className="size-3.5" /> No opening deposit
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5" /> Funds held in trust
              </span>
              <span className="flex items-center gap-1.5">
                <Headset className="size-3.5" /> Support in four languages
              </span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
