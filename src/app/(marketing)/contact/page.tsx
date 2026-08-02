import type { Metadata } from "next";
import { Clock, Headset, Mail, MapPin, Phone, Siren } from "lucide-react";
import { ContactForm } from "@/components/marketing/contact-form";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { SectionHeading } from "@/components/ui/misc";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to the HajjPath team in Lagos or Makkah — savings questions, verification support, vendor applications and group enquiries.",
};

const CHANNELS = [
  {
    icon: Phone,
    label: "Support line (Nigeria)",
    value: "0800 425 5728",
    href: "tel:+2348004255728",
    detail: "Mon–Sat, 08:00–20:00 WAT · English, Hausa, Yoruba",
  },
  {
    icon: Headset,
    label: "Makkah desk (in season)",
    value: "+966 55 218 0043",
    href: "tel:+966552180043",
    detail: "24 hours during the airlift window",
  },
  {
    icon: Mail,
    label: "General enquiries",
    value: "salam@hajjpath.ng",
    href: "mailto:salam@hajjpath.ng",
    detail: "Replies within one business day",
  },
  {
    icon: Mail,
    label: "Vendor applications",
    value: "vendors@hajjpath.ng",
    href: "mailto:vendors@hajjpath.ng",
    detail: "Include your Saudi commercial registration",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-forest-950 text-white">
        <div className="pattern-islamic pointer-events-none absolute inset-0 opacity-45" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-bold tracking-[0.18em] text-gold-400 uppercase">
            Contact
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-5xl">
            A person, not a ticket queue.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70">
            Whether you are opening your first plan, chasing a deposit, applying to sell,
            or leading a group of two hundred — there is someone here who handles exactly
            that.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div>
            <h2 className="text-2xl font-bold text-ink">Send us a message</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Fill this in and it lands with the right desk directly. The more specific
              you are, the faster the answer.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <aside className="space-y-4">
            {CHANNELS.map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="flex gap-4 rounded-2xl border border-line bg-surface p-5 transition hover:border-forest-800/30 hover:shadow-[0_16px_40px_-30px_rgba(1,68,33,0.6)]"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-forest-50 text-forest-800 dark:bg-forest-950 dark:text-gold-300">
                  <c.icon className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.6875rem] font-semibold tracking-wider text-muted uppercase">
                    {c.label}
                  </span>
                  <span className="mt-0.5 block text-sm font-bold break-all text-ink">
                    {c.value}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted">
                    {c.detail}
                  </span>
                </span>
              </a>
            ))}

            <div className="rounded-2xl border border-line bg-surface p-5">
              <span className="grid size-11 place-items-center rounded-xl bg-forest-50 text-forest-800 dark:bg-forest-950 dark:text-gold-300">
                <MapPin className="size-5" />
              </span>
              <p className="mt-4 text-[0.6875rem] font-semibold tracking-wider text-muted uppercase">
                Head office
              </p>
              <address className="mt-1 text-sm leading-relaxed font-medium text-ink not-italic">
                14 Kofo Abayomi Street
                <br />
                Victoria Island, Lagos
                <br />
                Nigeria
              </address>
              <p className="mt-3 flex items-center gap-2 text-xs text-muted">
                <Clock className="size-3.5" />
                Visitors by appointment, Mon–Fri
              </p>
            </div>

            <div className="rounded-2xl border border-rose-500/30 bg-rose-50/70 p-5 dark:bg-rose-950/30">
              <span className="grid size-11 place-items-center rounded-xl bg-rose-600 text-white">
                <Siren className="size-5" />
              </span>
              <p className="mt-4 text-sm font-bold text-ink">
                Emergency in the Kingdom?
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">
                Do not use this form. Press SOS in the app, or call Saudi Red Crescent on
                997 and Saudi security on 911. Your group admin is alerted automatically.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="Before you write"
          title="This may already be answered"
        />
        <div className="mt-10">
          <FaqAccordion />
        </div>
      </section>
    </>
  );
}
