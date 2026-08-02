import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  CalendarCheck,
  CircleCheck,
  CreditCard,
  FileText,
  IdCard,
  Landmark,
  PlaneTakeoff,
  ShieldCheck,
  Target,
  Trophy,
  UserPlus,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/misc";
import { SavingsCalculator } from "@/components/marketing/savings-calculator";
import { FaqAccordion } from "@/components/marketing/faq-accordion";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "From verified sign-up to the farewell Tawaf — the complete HajjPath journey, stage by stage, with what happens at each step and what is expected of you.",
};

type IconType = React.ComponentType<{ className?: string }>;

const STAGES: {
  phase: string;
  icon: IconType;
  title: string;
  duration: string;
  body: string;
  detail: { label: string; value: string }[];
}[] = [
  {
    phase: "Step 01",
    icon: UserPlus,
    title: "Open your account",
    duration: "About 8 minutes",
    body: "Register with your name, phone number and email. You will be asked for your BVN, NIN, passport data page and a passport photograph — the same documents your State Pilgrims Board will eventually request.",
    detail: [
      { label: "You provide", value: "Name · Phone · Email · BVN · NIN · Passport" },
      { label: "We check", value: "Identity via a licensed KYC provider" },
      { label: "Outcome", value: "A verified HajjPath account" },
    ],
  },
  {
    phase: "Step 02",
    icon: IdCard,
    title: "Pass verification",
    duration: "Usually within 1 working day",
    body: "Your BVN and NIN are validated and matched against your passport details. If anything does not line up, we tell you exactly which field to correct rather than rejecting you outright.",
    detail: [
      { label: "Provider", value: "VerifyMe / SmileID" },
      { label: "Data handling", value: "Encrypted at rest, never shared with vendors" },
      { label: "Outcome", value: "KYC status: Verified" },
    ],
  },
  {
    phase: "Step 03",
    icon: Target,
    title: "Set your goal",
    duration: "About 3 minutes",
    body: "Choose a package, a travel year and a contribution rhythm. HajjPath divides the remaining balance by the cycles left before the airlift and shows you a figure you can actually commit to.",
    detail: [
      { label: "Travel years", value: "2026 · 2027 · 2028" },
      { label: "Frequency", value: "Weekly · Monthly · Quarterly" },
      { label: "Outcome", value: "An active plan with a live tracker" },
    ],
  },
  {
    phase: "Step 04",
    icon: Landmark,
    title: "Fund your virtual account",
    duration: "Reconciled in under 10 minutes",
    body: "You receive a dedicated account number in your own name. Transfer from any Nigerian bank, pay by card or USSD, or set a standing order and let it run in the background.",
    detail: [
      { label: "Channels", value: "Transfer · Card · USSD · Standing order" },
      { label: "Custody", value: "Ring-fenced trust account, reconciled daily" },
      { label: "Outcome", value: "Balance visible instantly in your ledger" },
    ],
  },
  {
    phase: "Step 05",
    icon: BellRing,
    title: "Stay consistent",
    duration: "Ongoing until departure",
    body: "Reminders arrive before each cycle and immediately if a standing order fails. Miss one and the tracker simply recalculates — no penalties, no shame, just a new number.",
    detail: [
      { label: "Nudges", value: "Push and email, timed to your payday" },
      { label: "Flexibility", value: "Pause up to 3 months · change travel year free" },
      { label: "Outcome", value: "A plan that survives real life" },
    ],
  },
  {
    phase: "Step 06",
    icon: CalendarCheck,
    title: "Reach your goal",
    duration: "The moment the target is met",
    body: "Your status changes to Eligible for Hajj Application and HajjPath assembles a compliance pack — verified identity, passport details, savings history — ready for NAHCON and your State Board.",
    detail: [
      { label: "Unlocked", value: "Compliance pack · Group assignment" },
      { label: "Next", value: "Seat allocation through NAHCON / State Board" },
      { label: "Outcome", value: "Status: Eligible for Hajj Application" },
    ],
  },
  {
    phase: "Step 07",
    icon: PlaneTakeoff,
    title: "Travel with your companion",
    duration: "The full 30–35 day airlift",
    body: "Itinerary, offline maps, ritual guides in four languages, group locator, marketplace delivery and one-press SOS. Everything you need between Ihram and the farewell Tawaf.",
    detail: [
      { label: "Works offline", value: "Itinerary · Guides · Du'ās · Maps · Checklist" },
      { label: "Needs data", value: "Find Me · Marketplace · Broadcasts" },
      { label: "Outcome", value: "A pilgrimage performed correctly and safely" },
    ],
  },
  {
    phase: "Step 08",
    icon: Trophy,
    title: "Return as a Hajji",
    duration: "On confirmed arrival home",
    body: "Once your group manifest is confirmed landed in Nigeria, the Al-Hajji or Al-Hajja badge is added to your profile — verified by the system, not self-declared.",
    detail: [
      { label: "Awarded", value: "Al-Hajji / Al-Hajja honorific badge" },
      { label: "Preserved", value: "Journal · Gallery · Souvenir wall" },
      { label: "Onward", value: "₦15,000 referral credit per activated invite" },
    ],
  },
];

const REQUIREMENTS = [
  { icon: IdCard, label: "Bank Verification Number (BVN)" },
  { icon: FileText, label: "National Identity Number (NIN)" },
  { icon: FileText, label: "International passport, valid 6+ months" },
  { icon: CreditCard, label: "A Nigerian bank account in your own name" },
  { icon: ShieldCheck, label: "A phone number registered against your BVN" },
  { icon: BadgeCheck, label: "Meningitis ACWY & yellow fever certificates before travel" },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-forest-950 text-white">
        <div className="pattern-islamic pointer-events-none absolute inset-0 opacity-45" />
        <div className="pointer-events-none absolute -top-24 right-0 size-112 rounded-full bg-gold-600/15 blur-[100px]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <p className="text-xs font-bold tracking-[0.18em] text-gold-400 uppercase">
            How it works
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-5xl">
            Eight steps between the intention and the Ka&apos;bah.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70">
            No branch visits, no agents, no paperwork queues. Here is exactly what happens
            at each stage, how long it takes, and what HajjPath needs from you.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/auth/register" variant="gold" size="lg">
              Start now
              <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink
              href="/packages"
              size="lg"
              className="border border-white/20 bg-white/8 text-white hover:bg-white/15"
            >
              Compare packages
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <ol className="relative space-y-6 before:absolute before:top-8 before:bottom-8 before:left-6 before:hidden before:w-px before:bg-line sm:before:block">
          {STAGES.map((stage) => (
            <li key={stage.phase} className="relative sm:pl-20">
              <span className="absolute top-6 left-0 hidden size-12 place-items-center rounded-2xl border border-line bg-surface text-forest-800 shadow-sm sm:grid dark:text-gold-300">
                <stage.icon className="size-5" />
              </span>

              <article className="rounded-2xl border border-line bg-surface p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-forest-50 text-forest-800 sm:hidden dark:bg-forest-950 dark:text-gold-300">
                    <stage.icon className="size-5" />
                  </span>
                  <span className="text-xs font-bold tracking-[0.16em] text-gold-600 uppercase dark:text-gold-400">
                    {stage.phase}
                  </span>
                  <span className="ml-auto rounded-full bg-surface-muted px-2.5 py-1 text-[0.6875rem] font-medium text-muted">
                    {stage.duration}
                  </span>
                </div>

                <h2 className="mt-3 text-xl font-bold text-ink">{stage.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{stage.body}</p>

                <dl className="mt-5 grid gap-3 border-t border-line pt-5 sm:grid-cols-3">
                  {stage.detail.map((d) => (
                    <div key={d.label}>
                      <dt className="text-[0.6875rem] font-semibold tracking-wider text-muted uppercase">
                        {d.label}
                      </dt>
                      <dd className="mt-1 text-[0.8125rem] leading-snug font-medium text-ink">
                        {d.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            </li>
          ))}
        </ol>
      </section>

      {/* Requirements */}
      <section className="border-y border-line bg-surface-muted/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <SectionHeading
              eyebrow="Before you begin"
              title="What you will need to hand"
              description="Gather these once and the whole process takes minutes. Everything except the vaccination certificates is needed at sign-up; those are required before departure."
            />
            <ul className="grid gap-3 sm:grid-cols-2">
              {REQUIREMENTS.map((r) => (
                <li
                  key={r.label}
                  className="flex items-start gap-3 rounded-xl border border-line bg-surface p-4"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-forest-50 text-forest-800 dark:bg-forest-950 dark:text-gold-300">
                    <r.icon className="size-4" />
                  </span>
                  <span className="pt-1 text-[0.8125rem] leading-snug font-medium text-ink">
                    {r.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          align="center"
          eyebrow="Estimate first"
          title="See your number before you sign up"
        />
        <div className="mt-12">
          <SavingsCalculator />
        </div>
      </section>

      {/* Guarantees */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "No opening deposit",
              body: "Start with whatever you have this month, even if it is nothing at all.",
            },
            {
              title: "Withdraw at any time",
              body: "Your savings are yours. Requests are paid to your BVN-linked account within two business days.",
            },
            {
              title: "Change your travel year free",
              body: "Move from 2027 to 2028 without losing a naira. The tracker simply recalculates.",
            },
          ].map((g) => (
            <div key={g.title} className="rounded-2xl border border-line bg-surface p-6">
              <CircleCheck className="size-6 text-forest-700 dark:text-gold-400" />
              <h3 className="mt-4 text-base font-bold text-ink">{g.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{g.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8">
        <SectionHeading align="center" eyebrow="Questions" title="Still wondering?" />
        <div className="mt-10">
          <FaqAccordion />
        </div>
      </section>
    </>
  );
}
