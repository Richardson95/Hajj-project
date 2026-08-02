import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Camera,
  ChevronRight,
  Clock,
  Compass,
  Languages,
  MapPin,
  Megaphone,
  NotebookPen,
  ScanQrCode,
  ShieldCheck,
  Siren,
  Store,
  WifiOff,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/misc";
import { Kaaba } from "@/components/brand-icons";
import { ITINERARY } from "@/lib/data/itinerary";
import { GUIDE_CHAPTERS, LANGUAGES } from "@/lib/data/guide";
import { POI_CATEGORY_META, POIS } from "@/lib/data/map";
import { Icon } from "@/components/icon";
import { formatLongDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "In Makkah",
  description:
    "Live maps, a group locator, ritual guidance in four languages, a verified Makkah marketplace and one-press SOS — everything HajjPath does once you are on the ground.",
};

type IconType = React.ComponentType<{ className?: string }>;

const MODULES: {
  icon: IconType;
  title: string;
  tagline: string;
  body: string;
  points: string[];
  href: string;
}[] = [
  {
    icon: Compass,
    title: "Find Me",
    tagline: "Nobody gets lost for long",
    body: "Every pilgrim in your group carries a lanyard tag with a printed QR code and a Bluetooth beacon. Inside your group code, members see each other on a live map. Outside it, any stranger with any phone can scan the tag and be connected to your group admin in one tap.",
    points: [
      "Live group map with welfare status per pilgrim",
      "QR tag works even if the finder has no app",
      "Battery level and last-seen time for every member",
      "Broadcast a 'find this person' alert to all 48 members",
    ],
    href: "/app/find-me",
  },
  {
    icon: MapPin,
    title: "Live map & directions",
    tagline: "The Mashaer, made legible",
    body: "A schematic map of Makkah, Mina, Muzdalifah and Arafat with everything a pilgrim actually looks for — your tent, the Jamarat entry level assigned to your camp, the nearest hospital, restroom, cooling station and coach bay.",
    points: [
      `${POIS.length} mapped points across all five zones`,
      "Filter by medical, water, restrooms, transport and food",
      "Walking time from your current camp to each point",
      "Cached before departure so it works without data",
    ],
    href: "/app/map",
  },
  {
    icon: BookOpen,
    title: "Guide library",
    tagline: "Every rite, in your own language",
    body: "Seven chapters covering Ihram, Tawaf, Sa'i, Arafat, Muzdalifah, the Jamarat and Madinah — each broken into ordered steps with the obligation level marked, the common mistakes flagged, and the authentic du'ā for the moment.",
    points: [
      `${GUIDE_CHAPTERS.length} chapters, ${GUIDE_CHAPTERS.reduce((n, c) => n + c.steps.length, 0)} ordered steps`,
      "Fard, Wajib and Sunnah labelled on every step",
      "Du'ās in Arabic with transliteration and translation",
      "Audio narration in Hausa, Yoruba, Arabic and English",
    ],
    href: "/app/guide",
  },
  {
    icon: Store,
    title: "Makkah marketplace",
    tagline: "Delivered to your hotel or your tent",
    body: "Verified Makkah and Madinah vendors selling Ihram, Adahi-certified livestock, Nigerian food, toiletries, medicine and travel tech. Payment is held in escrow and released only when you confirm delivery.",
    points: [
      "Ihram · livestock · souvenirs · food · pharmacy · tech",
      "Delivery to hotel, Aziziyah or your Mina tent",
      "Escrow protection on every single order",
      "Prices shown in both Naira and Riyal",
    ],
    href: "/app/marketplace",
  },
  {
    icon: Siren,
    title: "Emergency SOS",
    tagline: "Four minutes, median response",
    body: "Choose the nature of the emergency — medical, heat, lost, missing companion or a safety concern — and one press alerts your emergency contacts, your group admin, the nearest medic and the HajjPath desk, with your exact position attached.",
    points: [
      "Six emergency categories, each with its own dispatch route",
      "Position, camp and tent number sent automatically",
      "Works alongside Saudi Red Crescent (997)",
      "Full history of every alert you have ever raised",
    ],
    href: "/app/sos",
  },
  {
    icon: Megaphone,
    title: "Group broadcasts",
    tagline: "One message, the whole manifest",
    body: "NAHCON, your operator and your group admin publish announcements straight to every registered pilgrim — pinned by priority, timestamped, and readable offline once received.",
    points: [
      "Critical, important and informational priorities",
      "Pinned notices stay at the top until resolved",
      "Audience targeting by group, package or nationality",
      "Readable offline once delivered",
    ],
    href: "/app/announcements",
  },
];

export default function CompanionPage() {
  const arafahDay = ITINERARY.find((d) => d.stage === "Arafat") ?? ITINERARY[0];

  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-forest-950 text-white">
        <div className="pattern-islamic pointer-events-none absolute inset-0 opacity-45" />
        <div className="pointer-events-none absolute top-0 -right-20 size-[32rem] rounded-full bg-gold-600/15 blur-[110px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-gold-400 uppercase">
                During the journey
              </p>
              <h1 className="mt-4 text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-5xl">
                The six days that decide whether Hajj goes well.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70">
                Between the 8th and the 13th of Dhul-Hijjah, two million people move
                through the same few kilometres in forty-eight degree heat, performing
                rites that must be done in the right order at the right time. HajjPath is
                built for exactly those days.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/app" variant="gold" size="lg">
                  Explore the live demo
                  <ArrowRight className="size-4" />
                </ButtonLink>
                <ButtonLink
                  href="/app/guide"
                  size="lg"
                  className="border border-white/20 bg-white/8 text-white hover:bg-white/15"
                >
                  Open the guide library
                </ButtonLink>
              </div>
            </div>

            {/* Itinerary card preview */}
            <div className="rounded-3xl border border-white/12 bg-white/5 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-gold-400/15 px-3 py-1 text-[0.6875rem] font-bold tracking-wide text-gold-300 uppercase">
                  <Kaaba className="size-3.5" />
                  {arafahDay.hijri}
                </span>
                <span className="text-xs text-white/50">
                  {formatLongDate(arafahDay.gregorian)}
                </span>
              </div>
              <h2 className="mt-4 text-xl font-bold">{arafahDay.title}</h2>
              <p className="mt-1 text-sm text-white/60">{arafahDay.subtitle}</p>

              <ul className="mt-5 space-y-3 border-t border-white/12 pt-5">
                {arafahDay.activities.slice(0, 4).map((a) => (
                  <li key={a.id} className="flex gap-3">
                    <span className="tabular w-11 shrink-0 pt-0.5 text-xs font-bold text-gold-300">
                      {a.time}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold">{a.title}</span>
                        {a.obligation ? (
                          <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[0.625rem] font-bold tracking-wide text-white/70 uppercase">
                            {a.obligation}
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-white/55">
                        {a.description}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          align="center"
          eyebrow="What is in your hand"
          title="Six modules, working together"
          description="Each one solves a problem pilgrims have described for decades — separation from the group, not knowing the next rite, being unable to buy what you need, and having no way to call for help."
        />

        <div className="mt-14 space-y-6">
          {MODULES.map((m, i) => (
            <article
              key={m.title}
              className="grid gap-8 rounded-3xl border border-line bg-surface p-7 sm:p-9 lg:grid-cols-[1.15fr_1fr] lg:items-center"
            >
              <div className={i % 2 === 1 ? "lg:order-2" : undefined}>
                <div className="flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-2xl bg-forest-800 text-white">
                    <m.icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold tracking-[0.16em] text-gold-600 uppercase dark:text-gold-400">
                      {m.tagline}
                    </p>
                    <h3 className="text-xl font-bold text-ink">{m.title}</h3>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-muted">{m.body}</p>
                <Link
                  href={m.href}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-forest-800 transition hover:gap-2 dark:text-gold-300"
                >
                  Open {m.title}
                  <ChevronRight className="size-4" />
                </Link>
              </div>

              <ul
                className={`space-y-2.5 rounded-2xl bg-surface-muted p-5 ${i % 2 === 1 ? "lg:order-1" : ""}`}
              >
                {m.points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm text-ink/80">
                    <ChevronRight className="mt-0.5 size-4 shrink-0 text-forest-700 dark:text-gold-400" />
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Map legend */}
      <section className="border-y border-line bg-surface-muted/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <SectionHeading
              eyebrow="Mapped for you"
              title="Everything a pilgrim actually looks for"
              description="Not a generic map of Saudi Arabia. A purpose-built layer of the places that matter during the five days of Hajj, each with walking time from your camp."
            />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(POI_CATEGORY_META).map(([key, meta]) => {
                const count = POIS.filter((p) => p.category === key).length;
                return (
                  <div
                    key={key}
                    className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4"
                  >
                    <span
                      className="grid size-9 shrink-0 place-items-center rounded-lg text-white"
                      style={{ backgroundColor: meta.colour }}
                    >
                      <Icon name={meta.icon} className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[0.8125rem] font-semibold text-ink">
                        {meta.label}
                      </p>
                      <p className="text-xs text-muted">
                        {count} {count === 1 ? "location" : "locations"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Languages & offline */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-line bg-surface p-8">
            <span className="grid size-12 place-items-center rounded-2xl bg-forest-50 text-forest-800 dark:bg-forest-950 dark:text-gold-300">
              <Languages className="size-5" />
            </span>
            <h2 className="mt-5 text-2xl font-bold text-ink">
              Guidance in the language you think in
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              A seventy-three year old pilgrim from Kano should not have to decode an
              English booklet in the middle of the Mataf. Every ritual chapter is narrated
              by native speakers, and the interface follows.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {LANGUAGES.map((l) => (
                <span
                  key={l.code}
                  className="rounded-xl border border-line bg-surface-muted px-3.5 py-2 text-sm font-medium text-ink"
                >
                  {l.native}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-line bg-surface p-8">
            <span className="grid size-12 place-items-center rounded-2xl bg-gold-50 text-gold-700 dark:bg-gold-950 dark:text-gold-300">
              <WifiOff className="size-5" />
            </span>
            <h2 className="mt-5 text-2xl font-bold text-ink">
              Built for patchy Mashaer coverage
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Networks buckle when two million people arrive at once. Everything you need
              to perform the rites correctly is cached to your device before you fly.
            </p>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {[
                { label: "Itinerary", offline: true },
                { label: "Ritual guides & du'ās", offline: true },
                { label: "Offline maps", offline: true },
                { label: "Packing checklist", offline: true },
                { label: "Find Me live map", offline: false },
                { label: "Marketplace orders", offline: false },
              ].map((f) => (
                <div
                  key={f.label}
                  className="flex items-center justify-between gap-2 rounded-xl border border-line px-3.5 py-2.5"
                >
                  <span className="text-[0.8125rem] font-medium text-ink">{f.label}</span>
                  <Badge tone={f.offline ? "positive" : "warning"}>
                    {f.offline ? "Offline" : "Online"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Post-journey strip */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: NotebookPen,
              title: "Journal as you go",
              body: "Write reflections at each stage while the memory is still sharp. Keep them private or share them.",
            },
            {
              icon: Camera,
              title: "Gallery by stage",
              body: "Photographs and video tagged by location and rite, preserved long after the phone is replaced.",
            },
            {
              icon: ShieldCheck,
              title: "Encrypted throughout",
              body: "Location sharing and group chats are end-to-end encrypted and purged thirty days after you return.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-line bg-surface p-6">
              <f.icon className="size-5 text-forest-700 dark:text-gold-400" />
              <h3 className="mt-4 text-base font-bold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl border border-line bg-surface p-8 text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-forest-800 text-white">
            <ScanQrCode className="size-5" />
          </span>
          <h2 className="text-2xl font-bold text-ink">
            Try every one of these modules right now
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-muted">
            The demo runs on a fully populated 2027 pilgrimage — a real itinerary, a real
            group of 48, a stocked marketplace and a live map.
          </p>
          <p className="flex items-center gap-2 text-xs text-muted">
            <Clock className="size-3.5" /> Takes about two minutes to look around
          </p>
          <ButtonLink href="/app" size="lg" className="mt-1">
            Open the demo
            <ArrowRight className="size-4" />
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
