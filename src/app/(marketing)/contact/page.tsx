import type { Metadata } from "next";
import { Clock, Headset, Mail, MapPin, Phone, Siren } from "lucide-react";
import { ContactForm } from "@/components/marketing/contact-form";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { SectionHeading } from "@/components/ui/misc";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach the HajjPath team in Lagos or Makkah.",
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
      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Contact</h1>
        <p className="mt-3 text-lg text-muted">We reply within one business day.</p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div>
            <div>
              <ContactForm />
            </div>
          </div>

          <aside className="divide-y divide-line border-y border-line">
            {CHANNELS.map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="flex gap-4 py-5 transition-colors hover:text-forest-800"
              >
                <c.icon className="mt-0.5 size-5 shrink-0 text-forest-700 dark:text-gold-400" />
                <span className="min-w-0">
                  <span className="block text-sm text-muted">
                    {c.label}
                  </span>
                  <span className="mt-0.5 block font-medium break-all text-ink">
                    {c.value}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted">
                    {c.detail}
                  </span>
                </span>
              </a>
            ))}

            <div className="flex gap-4 py-5">
              <MapPin className="mt-0.5 size-5 shrink-0 text-forest-700 dark:text-gold-400" />
              <div>
              <p className="text-sm text-muted">Head office</p>
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
            </div>

            <div className="flex gap-4 py-5">
              <Siren className="mt-0.5 size-5 shrink-0 text-rose-600" />
              <p className="text-sm text-ink">
                <span className="font-medium">Emergency in Saudi Arabia?</span> Press SOS in
                the app or call 997.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
        <SectionHeading title="Common questions" />
        <div className="mt-8">
          <FaqAccordion />
        </div>
      </section>
    </>
  );
}
