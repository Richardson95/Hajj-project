import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Compass,
  MapPin,
  Megaphone,
  Siren,
  Store,
  X,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/misc";
import { PageHero } from "@/components/marketing/page-hero";
import { GUIDE_CHAPTERS, LANGUAGES } from "@/lib/data/guide";
import { POI_CATEGORY_META, POIS } from "@/lib/data/map";
import { Icon } from "@/components/icon";

export const metadata: Metadata = {
  title: "In Makkah",
  description:
    "Maps, a group locator, ritual guides, a marketplace and SOS for your days in Makkah, Mina, Arafat and Madinah.",
};

const MODULES = [
  {
    icon: Compass,
    title: "Find Me",
    body: "Your group on a live map. Anyone can scan your tag to reach your admin.",
    href: "/app/find-me",
  },
  {
    icon: MapPin,
    title: "Map",
    body: `${POIS.length} places across Makkah, Mina, Muzdalifah and Arafat.`,
    href: "/app/map",
  },
  {
    icon: BookOpen,
    title: "Guide",
    body: `${GUIDE_CHAPTERS.length} chapters, each rite marked Fard, Wajib or Sunnah.`,
    href: "/app/guide",
  },
  {
    icon: Store,
    title: "Marketplace",
    body: "Verified vendors. Paid in escrow, delivered to your hotel or tent.",
    href: "/app/marketplace",
  },
  {
    icon: Siren,
    title: "SOS",
    body: "Sends your position to your contacts, group admin and our desk.",
    href: "/app/sos",
  },
  {
    icon: Megaphone,
    title: "Broadcasts",
    body: "Notices from NAHCON, your operator and your group admin.",
    href: "/app/announcements",
  },
];

const OFFLINE = [
  { label: "Itinerary", offline: true },
  { label: "Guides and du'ās", offline: true },
  { label: "Maps", offline: true },
  { label: "Checklist", offline: true },
  { label: "Find Me", offline: false },
  { label: "Marketplace", offline: false },
];

export default function CompanionPage() {
  return (
    <>
      <PageHero
        image="/images/arafat.jpg"
        imageAlt="Pilgrims in ihram on Mount Arafat"
        imagePosition="center 70%"
        title="For the days in the Mashaer"
        description="Everything you need between Ihram and the farewell Tawaf, in one app."
      >
        <ButtonLink href="/app" variant="gold" size="lg">
          Try the demo
          <ArrowRight className="size-4" />
        </ButtonLink>
      </PageHero>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading title="What's in the app" />
        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m) => (
            <Link
              key={m.title}
              href={m.href}
              className="group bg-surface p-6 transition-colors hover:bg-surface-muted"
            >
              <m.icon className="size-5 text-forest-700 dark:text-gold-400" />
              <h3 className="mt-4 flex items-center gap-1 font-semibold text-ink">
                {m.title}
                <ChevronRight className="size-4 text-muted transition-transform group-hover:translate-x-0.5" />
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{m.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-surface-muted/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
          <div>
            <SectionHeading title="On the map" />
            <div className="mt-8 grid gap-2 sm:grid-cols-2">
              {Object.entries(POI_CATEGORY_META).map(([key, meta]) => {
                const count = POIS.filter((p) => p.category === key).length;
                return (
                  <div key={key} className="flex items-center gap-3 rounded-lg bg-surface px-3 py-2.5">
                    <span
                      className="grid size-8 shrink-0 place-items-center rounded-md text-white"
                      style={{ backgroundColor: meta.colour }}
                    >
                      <Icon name={meta.icon} className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm text-ink">{meta.label}</span>
                    <span className="tabular text-sm text-muted">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="relative min-h-80 overflow-hidden rounded-2xl bg-surface-muted">
            <Image
              src="/images/makkah-haram.jpg"
              alt="Pilgrims around the Kaaba in Masjid al-Haram"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
          <div>
            <SectionHeading
              title="Works without data"
              description="Networks slow down when two million people arrive at once. The essentials download before you fly."
            />
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {OFFLINE.map((f) => (
                <li key={f.label} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-ink">{f.label}</span>
                  {f.offline ? (
                    <span className="flex items-center gap-1.5 text-forest-700 dark:text-forest-300">
                      <Check className="size-4" /> Offline
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-muted">
                      <X className="size-4" /> Needs data
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading
              title="In your language"
              description="Every chapter is narrated by native speakers."
            />
            <div className="mt-8 flex flex-wrap gap-2">
              {LANGUAGES.map((l) => (
                <span
                  key={l.code}
                  className="rounded-lg border border-line px-3.5 py-2 text-sm text-ink"
                >
                  {l.native}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
