import type { Metadata } from "next";
import { ArrowRight, MessageCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { FaqAccordion } from "@/components/marketing/faq-accordion";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description:
    "Answers on Hajj savings, Shariah compliance, KYC, withdrawals, offline use in Makkah, marketplace escrow and how HajjPath works with NAHCON.",
};

export default function FaqPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-forest-950 text-white">
        <div className="pattern-islamic pointer-events-none absolute inset-0 opacity-45" />
        <div className="relative mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-bold tracking-[0.18em] text-gold-400 uppercase">
            Frequently asked
          </p>
          <h1 className="mt-4 text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-5xl">
            Everything people ask us
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/70">
            Savings mechanics, Shariah compliance, identity verification, what works
            offline in the Mashaer, and how HajjPath fits alongside NAHCON.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <FaqAccordion />

        <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl border border-line bg-surface p-9 text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-forest-50 text-forest-800 dark:bg-forest-950 dark:text-gold-300">
            <MessageCircle className="size-5" />
          </span>
          <h2 className="text-xl font-bold text-ink">Still not answered?</h2>
          <p className="max-w-md text-sm leading-relaxed text-muted">
            Write to the team and a HajjPath agent will reply within one business day, in
            English, Hausa or Yoruba.
          </p>
          <ButtonLink href="/contact" className="mt-1">
            Contact support
            <ArrowRight className="size-4" />
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
