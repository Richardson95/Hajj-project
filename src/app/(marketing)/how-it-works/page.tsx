import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/misc";
import { PageHero } from "@/components/marketing/page-hero";
import { SavingsCalculator } from "@/components/marketing/savings-calculator";
import { FaqAccordion } from "@/components/marketing/faq-accordion";

export const metadata: Metadata = {
  title: "How it works",
  description: "From sign-up to the farewell Tawaf, step by step.",
};

const STEPS = [
  { title: "Open an account", body: "Name, phone, email, NIN and passport.", time: "8 min" },
  { title: "Get verified", body: "We check your NIN against your passport.", time: "1 day" },
  { title: "Set a goal", body: "Choose a package, travel year and how often you pay.", time: "3 min" },
  { title: "Pay with Paystack", body: "Card, transfer or USSD. Automatic if you like.", time: "Instant" },
  { title: "Keep going", body: "Reminders before each payment. Miss one and we recalculate.", time: "Ongoing" },
  { title: "Reach your goal", body: "You get a compliance pack for NAHCON and your State Board.", time: "—" },
  { title: "Travel", body: "Itinerary, maps, guides, Find Me and SOS in the app.", time: "30–35 days" },
  { title: "Come home", body: "Your Al-Hajji or Al-Hajja badge is added once your group lands.", time: "—" },
];

const REQUIREMENTS = [
  "NIN",
  "Passport, valid for 6+ months",
  "A Nigerian bank account in your name",
  "Phone number and email",
  "Meningitis and yellow fever certificates (before travel)",
];

const GUARANTEES = [
  "No opening deposit",
  "Pause for up to 3 months",
  "Change travel year for free",
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        image="/images/kaaba-kiswah.jpg"
        imageAlt="The Kaaba with the Abraj Al-Bait clock tower behind it"
        imagePosition="center 65%"
        title="How it works"
        description="Eight steps from sign-up to coming home."
      >
        <ButtonLink href="/auth/register" variant="gold" size="lg">
          Get started
          <ArrowRight className="size-4" />
        </ButtonLink>
      </PageHero>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <ol className="divide-y divide-line border-y border-line">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-5 py-5">
              <span className="tabular w-6 shrink-0 pt-0.5 text-sm text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-ink">{s.title}</h2>
                <p className="mt-1 text-sm text-muted">{s.body}</p>
              </div>
              <span className="shrink-0 pt-0.5 text-sm text-muted">{s.time}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-line bg-surface-muted/40">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-lg font-semibold text-ink">What you&apos;ll need</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {REQUIREMENTS.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-ink">No penalties</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {GUARANTEES.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <SectionHeading title="Estimate your contribution" />
          <div className="mt-10">
            <SavingsCalculator />
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <SectionHeading title="Questions" />
          <div className="mt-8">
            <FaqAccordion />
          </div>
        </div>
      </section>
    </>
  );
}
