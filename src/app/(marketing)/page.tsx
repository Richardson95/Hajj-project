import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  BookOpen,
  Building2,
  CalendarDays,
  Camera,
  ChevronRight,
  Coins,
  Compass,
  CreditCard,
  Globe,
  HandCoins,
  Headset,
  Landmark,
  Languages,
  LayoutDashboard,
  Lock,
  MapPin,
  Megaphone,
  MonitorSmartphone,
  NotebookPen,
  Repeat,
  ScanQrCode,
  ShieldCheck,
  Siren,
  Sparkles,
  Store,
  Target,
  Trophy,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/misc";
import { Kaaba, Mosque } from "@/components/brand-icons";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { SavingsCalculator } from "@/components/marketing/savings-calculator";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { Testimonials } from "@/components/marketing/testimonials";
import {
  COMPLIANCE_POINTS,
  IMPACT_STATS,
  PARTNER_LOGOS,
} from "@/lib/data/marketing";

export const metadata: Metadata = {
  title: "HajjPath — From Intention to Completion",
  description:
    "Save towards Hajj on a plan that fits your income, then let HajjPath guide you through every rite in Makkah, Mina, Arafat and Madinah. A complete pilgrimage ecosystem for Nigerian Muslims.",
};

/* ------------------------------------------------------------------ */

type IconType = React.ComponentType<{ className?: string }>;

const SAVINGS_FEATURES: { icon: IconType; title: string; body: string }[] = [
  {
    icon: UserPlus,
    title: "Verified onboarding",
    body: "BVN, NIN, passport data page and photograph checked once through a licensed KYC provider. The person saving is the person on the manifest.",
  },
  {
    icon: Repeat,
    title: "Plans that fit your income",
    body: "Weekly, monthly or quarterly contributions against a 2026, 2027 or 2028 departure. Change frequency or travel year whenever life changes.",
  },
  {
    icon: Target,
    title: "A goal tracker that does the maths",
    body: "See exactly how much is left, how many cycles remain, and whether you are on track — recalculated every time you deposit or miss one.",
  },
  {
    icon: Landmark,
    title: "Your own virtual account",
    body: "A dedicated account number in your name. Transfer from any Nigerian bank, or authorise a standing order and forget about it.",
  },
  {
    icon: BellRing,
    title: "Reminders that actually help",
    body: "Contribution nudges by push and email, tuned to your payday — plus an alert the moment a standing order fails so nothing slips.",
  },
  {
    icon: Users,
    title: "Family and diaspora plans",
    body: "Run several plans from one account: yourself, your spouse, your parents. Sponsors abroad fund; beneficiaries at home watch the tracker fill.",
  },
];

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
  {
    icon: Megaphone,
    title: "Group broadcasts",
    body: "NAHCON, your operator and your group admin reach every registered pilgrim at once — pinned, prioritised and readable offline.",
    href: "/app/announcements",
  },
  {
    icon: Camera,
    title: "Gallery",
    body: "Keep photographs and video from each stage of the journey, tagged by location and rite, in one place you will still have in twenty years.",
    href: "/app/gallery",
  },
];

const POST_HAJJ: { icon: IconType; title: string; body: string }[] = [
  {
    icon: Trophy,
    title: "Al-Hajji / Al-Hajja badge",
    body: "Awarded once your group manifest is confirmed landed — a verified honorific on your HajjPath profile, not a self-declared one.",
  },
  {
    icon: NotebookPen,
    title: "Testimonial journal",
    body: "Write reflections at each stage while the memory is fresh, keep them private, or share them to the community wall.",
  },
  {
    icon: HandCoins,
    title: "Referral rewards",
    body: "₦15,000 in wallet credit each time someone you invited activates a plan — applied straight to your own Hajj balance.",
  },
  {
    icon: Sparkles,
    title: "Digital souvenir wall",
    body: "Photographs, du'ā requests and favourite memories, shared with the pilgrims who walked the same days with you.",
  },
];

const PERSONAS: {
  icon: IconType;
  role: string;
  headline: string;
  points: string[];
  href: string;
  cta: string;
}[] = [
  {
    icon: Kaaba,
    role: "Pilgrim",
    headline: "Save, prepare, and never walk alone in Makkah",
    points: [
      "A plan matched to your income and travel year",
      "Every rite explained in your own language",
      "Live map, group locator and one-press SOS",
    ],
    href: "/auth/register",
    cta: "Start a plan",
  },
  {
    icon: Users,
    role: "Family sponsor",
    headline: "Fund a parent's pilgrimage from anywhere in the world",
    points: [
      "Several beneficiaries under one verified account",
      "Beneficiaries track their own progress",
      "Transparent ledger, withdrawable at any time",
    ],
    href: "/auth/register",
    cta: "Sponsor someone",
  },
  {
    icon: Store,
    role: "Makkah vendor",
    headline: "Reach paying pilgrims before they reach the souq",
    points: [
      "Verified storefront with delivery logistics",
      "Escrow settlement — you always get paid",
      "Order dashboard, ratings and demand insight",
    ],
    href: "/vendors",
    cta: "Sell on HajjPath",
  },
  {
    icon: Megaphone,
    role: "Group admin & operator",
    headline: "See all your pilgrims on one screen",
    points: [
      "Live group positions and welfare status",
      "Broadcast to the whole manifest instantly",
      "Compliance and savings status per pilgrim",
    ],
    href: "/app/admin",
    cta: "See the admin view",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Create your account",
    body: "Name, phone, email, BVN, NIN, passport photograph and data page. Verification usually completes within one working day.",
  },
  {
    n: "02",
    title: "Choose year and plan",
    body: "Pick a package and a departure year, then set weekly, monthly or quarterly contributions. HajjPath calculates the figure for you.",
  },
  {
    n: "03",
    title: "Fund your virtual account",
    body: "Transfer from any bank, pay by card or USSD, or authorise a standing order. Every deposit reconciles within ten minutes.",
  },
  {
    n: "04",
    title: "Watch the tracker fill",
    body: "Reminders keep you consistent. When the goal is met, your status changes to Eligible for Hajj Application with a compliance pack ready.",
  },
  {
    n: "05",
    title: "Travel with your companion",
    body: "Itinerary, offline maps, ritual guides, group locator, marketplace and SOS — from the moment you enter Ihram to the farewell Tawaf.",
  },
  {
    n: "06",
    title: "Come home a Hajji",
    body: "Your badge unlocks, your journal and gallery are preserved, and your referrals keep earning towards the next pilgrimage in your family.",
  },
];

/* ------------------------------------------------------------------ */

export default function HomePage() {
  return (
    <>
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden bg-forest-950 text-white">
        <div className="pattern-islamic pointer-events-none absolute inset-0 opacity-45" />
        <div className="pointer-events-none absolute -top-32 -left-24 size-[34rem] rounded-full bg-forest-700/30 blur-[110px]" />
        <div className="pointer-events-none absolute top-1/3 -right-24 size-[30rem] rounded-full bg-gold-600/15 blur-[110px]" />

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
              body: "Verified onboarding, a plan that matches your income, a dedicated virtual account and a goal tracker that never lets the target drift out of sight.",
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
              body: "A verified Al-Hajji badge, a journal of reflections written while they were still fresh, a gallery of every stage, and rewards for guiding others.",
              points: ["Verified honorific badge", "Journal & souvenir wall", "₦15,000 referral credit"],
              tone: "from-forest-700 to-forest-900",
            },
          ].map((pillar) => (
            <article
              key={pillar.tag}
              className="group relative overflow-hidden rounded-3xl border border-line bg-surface p-7 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_70px_-40px_rgba(1,68,33,0.6)]"
            >
              <div
                className={`grid size-13 place-items-center rounded-2xl bg-gradient-to-br ${pillar.tone} text-white shadow-lg`}
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

      {/* ===================== SAVINGS FEATURES ====================== */}
      <section className="relative overflow-hidden border-y border-line bg-surface-muted/50">
        <div className="pattern-islamic-ink pointer-events-none absolute inset-0 opacity-70" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading
                eyebrow="Before the journey"
                title="Saving for Hajj, made ordinary"
                description="Twenty years of intention undone by one unstructured account. HajjPath turns a distant dream into a number you can hit this month."
              />
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/packages">
                  Compare packages
                  <ArrowRight className="size-4" />
                </ButtonLink>
                <ButtonLink href="/how-it-works" variant="outline">
                  How it works
                </ButtonLink>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {SAVINGS_FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-line bg-surface p-5 transition hover:border-forest-800/25 hover:shadow-[0_16px_40px_-28px_rgba(1,68,33,0.55)]"
                >
                  <span className="grid size-10 place-items-center rounded-xl bg-forest-50 text-forest-800 dark:bg-forest-950 dark:text-gold-300">
                    <f.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-[0.9375rem] font-bold text-ink">{f.title}</h3>
                  <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">
                    {f.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
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
        <div className="pointer-events-none absolute top-0 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-gold-600/10 blur-[120px]" />

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

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

          <div className="mt-12 grid gap-4 rounded-3xl border border-white/12 bg-white/5 p-6 sm:grid-cols-3 sm:p-8">
            {[
              {
                icon: ScanQrCode,
                title: "Scan-to-reunite tags",
                body: "A waterproof lanyard tag carrying a QR code and a Bluetooth beacon. Any phone that scans it reaches your group admin, even without the app installed.",
              },
              {
                icon: Languages,
                title: "Four languages, with audio",
                body: "Every ritual chapter is narrated in Hausa, Yoruba, Arabic and English — for the elderly pilgrim who was never going to read the booklet.",
              },
              {
                icon: Headset,
                title: "A desk that never sleeps",
                body: "HajjPath support agents in Lagos and Makkah, on shift through the whole season, routing SOS alerts to whoever can get there fastest.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold-400/15 text-gold-300">
                  <item.icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold">{item.title}</h3>
                  <p className="mt-1 text-[0.8125rem] leading-relaxed text-white/60">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================= POST HAJJ ========================= */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16">
          <div className="grid gap-4 sm:grid-cols-2">
            {POST_HAJJ.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-line bg-surface p-5 transition hover:border-gold-500/40"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-gold-50 text-gold-700 dark:bg-gold-950 dark:text-gold-300">
                  <f.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-[0.9375rem] font-bold text-ink">{f.title}</h3>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">
                  {f.body}
                </p>
              </div>
            ))}
          </div>

          <div className="lg:pl-6">
            <SectionHeading
              eyebrow="After the journey"
              title="You come home changed. Your account should show it."
              description="The badge is earned, not claimed — it unlocks only when your group manifest is confirmed landed in Nigeria. Everything else is yours to keep: the reflections, the photographs, the people you met."
            />
            <div className="mt-8 rounded-2xl border border-gold-500/25 bg-gold-50/60 p-5 dark:bg-gold-950/30">
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-white shadow-lg">
                  <Mosque className="size-6" />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">Al-Hajji Ibrahim Adetunji</p>
                  <p className="text-xs text-muted">
                    Verified · 1448 AH · Al-Amanah Hajj Group
                  </p>
                </div>
                <Badge tone="gold" className="ml-auto">
                  Verified
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================== PERSONAS ========================= */}
      <section className="relative border-y border-line bg-surface-muted/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <SectionHeading
            align="center"
            eyebrow="Who it's for"
            title="Five roles, one ecosystem"
            description="Pilgrims, the families who fund them, the vendors who supply them and the operators who lead them — each gets the view they actually need."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {PERSONAS.map((p) => (
              <article
                key={p.role}
                className="flex flex-col rounded-3xl border border-line bg-surface p-7 transition hover:border-forest-800/25 hover:shadow-[0_24px_60px_-40px_rgba(1,68,33,0.6)]"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl bg-forest-800 text-white">
                    <p.icon className="size-5" />
                  </span>
                  <p className="text-xs font-bold tracking-[0.16em] text-gold-600 uppercase dark:text-gold-400">
                    {p.role}
                  </p>
                </div>
                <h3 className="mt-5 text-xl font-bold text-ink">{p.headline}</h3>
                <ul className="mt-4 flex-1 space-y-2.5">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-sm text-muted">
                      <BadgeCheck className="mt-0.5 size-4 shrink-0 text-forest-700 dark:text-gold-400" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <ButtonLink href={p.href} variant="outline" size="sm" className="mt-6 self-start">
                  {p.cta}
                  <ArrowRight className="size-3.5" />
                </ButtonLink>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ========================== JOURNEY ========================== */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeading
          align="center"
          eyebrow="The journey in six steps"
          title="From download-free sign-up to Al-Hajji"
          description="No branch visits, no agents, no paperwork queues. Everything happens in your browser and finishes at the Ka'bah."
        />

        <ol className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step) => (
            <li
              key={step.n}
              className="relative overflow-hidden rounded-2xl border border-line bg-surface p-6"
            >
              <span className="absolute -top-3 -right-1 text-6xl font-extrabold text-forest-800/6 dark:text-white/5">
                {step.n}
              </span>
              <span className="tabular inline-grid size-9 place-items-center rounded-xl bg-forest-800 text-sm font-bold text-white">
                {step.n}
              </span>
              <h3 className="mt-4 text-base font-bold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
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

      {/* ========================== IMPACT ========================== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {IMPACT_STATS.map((s, i) => {
            const StatIcon = [Users, Coins, Target, Siren][i] ?? Users;
            return (
              <div
                key={s.label}
                className="rounded-2xl border border-line bg-surface p-6 text-center"
              >
                <span className="mx-auto grid size-11 place-items-center rounded-xl bg-forest-50 text-forest-800 dark:bg-forest-950 dark:text-gold-300">
                  <StatIcon className="size-5" />
                </span>
                <dt className="tabular mt-4 text-3xl font-extrabold tracking-tight text-ink">
                  {s.value}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-ink/80">{s.label}</dd>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{s.detail}</p>
              </div>
            );
          })}
        </dl>
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
          <FaqAccordion />
        </div>
      </section>

      {/* ============================ CTA =========================== */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-forest-900 px-6 py-16 text-center text-white sm:px-12 sm:py-20">
          <div className="pattern-islamic pointer-events-none absolute inset-0 opacity-45" />
          <div className="pointer-events-none absolute -bottom-24 left-1/2 size-[28rem] -translate-x-1/2 rounded-full bg-gold-500/20 blur-[100px]" />

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
                <ShieldCheck className="size-3.5" /> Withdraw any time
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
