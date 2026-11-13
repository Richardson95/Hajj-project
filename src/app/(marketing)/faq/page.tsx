import type { Metadata } from "next";
import Link from "next/link";
import { FaqAccordion } from "@/components/marketing/faq-accordion";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description:
    "Answers on Hajj savings, Shariah compliance, KYC, offline use in Makkah, marketplace escrow and how HajjPath works with NAHCON.",
};

export default function FaqPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-4 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">FAQ</h1>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <FaqAccordion />

        <p className="mt-10 text-sm text-muted">
          Can&apos;t find your answer?{" "}
          <Link href="/contact" className="font-medium text-forest-800 hover:underline dark:text-gold-300">
            Contact us
          </Link>
        </p>
      </section>
    </>
  );
}
