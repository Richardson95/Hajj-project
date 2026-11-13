import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/misc";
import { PageHero } from "@/components/marketing/page-hero";
import { Testimonials } from "@/components/marketing/testimonials";
import { COMPLIANCE_POINTS, IMPACT_STATS } from "@/lib/data/marketing";

export const metadata: Metadata = {
  title: "About",
  description: "Why HajjPath exists, who it serves and how pilgrim money is kept safe.",
};

const AUDIENCES = [
  { id: "pilgrims", title: "Pilgrims", body: "Save, travel and perform every rite with a guide." },
  { id: "sponsors", title: "Family sponsors", body: "Fund a parent or spouse's plan from anywhere." },
  { id: "vendors", title: "Vendors", body: "Sell to pilgrims in Makkah and Madinah." },
  { id: "operators", title: "Group admins", body: "See the welfare of your whole group at once." },
  { id: "boards", title: "Pilgrims Boards", body: "Receive pilgrims already verified and funded." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        image="/images/makkah-haram.jpg"
        imageAlt="Pilgrims around the Kaaba in Masjid al-Haram"
        title="Hajj shouldn't be lost to arithmetic"
        description="Most people who never go don't lack the intention. They lack a plan. We built one."
      />

      <section className="border-b border-line">
        <dl className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {IMPACT_STATS.map((s) => (
            <div key={s.label}>
              <dt className="tabular text-3xl font-semibold tracking-tight text-ink">{s.value}</dt>
              <dd className="mt-1 text-sm text-muted">{s.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <SectionHeading
            title="Who it's for"
            description="Saving is only the first part. Pilgrims also need to know the next rite, find their group and get help fast."
          />
          <dl className="mt-8 divide-y divide-line border-y border-line">
            {AUDIENCES.map((a) => (
              <div key={a.id} id={a.id} className="grid scroll-mt-24 gap-1 py-4 sm:grid-cols-[10rem_1fr]">
                <dt className="font-medium text-ink">{a.title}</dt>
                <dd className="text-sm text-muted sm:pt-0.5">{a.body}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative min-h-96 overflow-hidden rounded-2xl bg-surface-muted">
          <Image
            src="/images/madinah-courtyard.jpg"
            alt="The courtyard of the Prophet's Mosque in Madinah"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="border-t border-line bg-surface-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <SectionHeading title="How we protect you" />
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {COMPLIANCE_POINTS.map((p) => (
              <div key={p.title}>
                <h3 className="font-semibold text-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-sm text-muted">
            HajjPath Technologies Limited · RC 7418205 · Lagos, Nigeria
          </p>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <SectionHeading title="From our pilgrims" />
          <div className="mt-10">
            <Testimonials />
          </div>
          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/auth/register" size="lg">
              Create an account
              <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline" size="lg">
              Contact us
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
