import type { Metadata } from "next";
import {
  ArrowRight,
  Building2,
  Globe,
  Heart,
  Landmark,
  Lock,
  Megaphone,
  ScrollText,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/misc";
import { Testimonials } from "@/components/marketing/testimonials";
import { COMPLIANCE_POINTS, IMPACT_STATS } from "@/lib/data/marketing";
import { Kaaba } from "@/components/brand-icons";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why HajjPath exists, how pilgrim funds are safeguarded, and who the platform serves — pilgrims, family sponsors, vendors, group admins and State Pilgrims Boards.",
};

type IconType = React.ComponentType<{ className?: string }>;

const VALUES: { icon: IconType; title: string; body: string }[] = [
  {
    icon: ScrollText,
    title: "Shariah first, not Shariah-labelled",
    body: "Non-interest custody and Mudarabah profit-sharing reviewed annually by an independent advisory board. If a structure cannot pass that review, we do not ship it.",
  },
  {
    icon: Lock,
    title: "Custody before convenience",
    body: "Pilgrim balances sit in a ring-fenced trust account with a licensed Nigerian bank, separate from company money, reconciled daily against the ledger you can see.",
  },
  {
    icon: Heart,
    title: "Designed for the elderly pilgrim",
    body: "The person who most needs this app is seventy, tired, and does not read English comfortably. Every screen is measured against whether that person can use it.",
  },
  {
    icon: Globe,
    title: "One family, several countries",
    body: "Nigerian Muslims are in Manchester, Houston, Jeddah and Kano. Sponsors abroad fund; beneficiaries at home track. The money and the intention move in the same direction.",
  },
];

const AUDIENCES: {
  id: string;
  icon: IconType;
  title: string;
  body: string;
  points: string[];
}[] = [
  {
    id: "pilgrims",
    icon: Kaaba,
    title: "Pilgrims",
    body: "The person saving, travelling and performing the rites. Everything else on the platform exists to serve this account.",
    points: [
      "Verified identity from day one",
      "A savings plan matched to real income",
      "Ritual guidance, maps and SOS on the ground",
    ],
  },
  {
    id: "sponsors",
    icon: Users,
    title: "Family sponsors",
    body: "Children funding parents, spouses funding one another, siblings pooling for an elder. One verified account, several beneficiaries.",
    points: [
      "Multiple plans with independent goals",
      "Beneficiaries see their own tracker",
      "Transparent ledger, withdrawable any time",
    ],
  },
  {
    id: "vendors",
    icon: Store,
    title: "Makkah & Madinah vendors",
    body: "Inspected, registered sellers supplying Ihram, livestock, food, medicine and travel essentials to pilgrims who cannot navigate the city.",
    points: [
      "Escrow-protected settlement",
      "Delivery to hotels, Aziziyah and Mina tents",
      "Reputation that carries across seasons",
    ],
  },
  {
    id: "operators",
    icon: Megaphone,
    title: "Hajj operators & group admins",
    body: "The people responsible for forty or four hundred pilgrims at once, who currently manage it with a paper manifest and a phone.",
    points: [
      "Live welfare status across the group",
      "Broadcasts to the whole manifest instantly",
      "Savings and compliance status per pilgrim",
    ],
  },
  {
    id: "boards",
    icon: Landmark,
    title: "NAHCON & State Pilgrims Boards",
    body: "HajjPath does not allocate seats. It prepares pilgrims who arrive at the Board already verified, already funded and already documented.",
    points: [
      "Compliance packs formatted for submission",
      "Verified BVN, NIN and passport on file",
      "Complete, auditable savings history",
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-forest-950 text-white">
        <div className="pattern-islamic pointer-events-none absolute inset-0 opacity-45" />
        <div className="pointer-events-none absolute top-0 left-1/2 size-136 -translate-x-1/2 rounded-full bg-forest-700/25 blur-[110px]" />

        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-gold-400/15 text-gold-300">
            <Kaaba className="size-7" />
          </span>
          <h1 className="mt-6 text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-5xl">
            Hajj should not be lost to arithmetic.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/70 sm:text-lg">
            Most Nigerian Muslims who never perform Hajj do not fail for lack of intention.
            They fail because there was never a structure — no plan, no reminder, no
            account that separated pilgrimage money from everything else. HajjPath is that
            structure, and then the companion for the journey it makes possible.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <SectionHeading
            eyebrow="Why we built it"
            title="A payment plan solves a third of the problem"
            description="The saving is only the first chapter. Pilgrims still arrive in Makkah unsure of the next rite, get separated from their group in the Mashaer, cannot find a shop that sells what they need, and have no way to call for help that knows where they are standing. HajjPath was built to close all four gaps in one place."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl border border-line bg-surface p-6">
                <span className="grid size-11 place-items-center rounded-xl bg-forest-50 text-forest-800 dark:bg-forest-950 dark:text-gold-300">
                  <v.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-[0.9375rem] font-bold text-ink">{v.title}</h3>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-line bg-surface-muted/50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {IMPACT_STATS.map((s) => (
              <div key={s.label}>
                <dt className="tabular text-3xl font-extrabold tracking-tight text-ink">
                  {s.value}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-ink/80">{s.label}</dd>
                <p className="mt-1 text-xs leading-relaxed text-muted">{s.detail}</p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Audiences */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          align="center"
          eyebrow="Who we serve"
          title="Five constituencies, one manifest"
        />
        <div className="mt-14 space-y-5">
          {AUDIENCES.map((a) => (
            <article
              key={a.id}
              id={a.id}
              className="grid gap-6 rounded-3xl border border-line bg-surface p-7 scroll-mt-24 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:items-center"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl bg-forest-800 text-white">
                    <a.icon className="size-5" />
                  </span>
                  <h3 className="text-xl font-bold text-ink">{a.title}</h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted">{a.body}</p>
              </div>
              <ul className="space-y-2.5 rounded-2xl bg-surface-muted p-5">
                {a.points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm text-ink/80">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-forest-700 dark:text-gold-400" />
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Governance */}
      <section className="relative overflow-hidden border-y border-line bg-forest-900 text-white">
        <div className="pattern-islamic pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <div>
              <p className="mb-3 text-xs font-bold tracking-[0.18em] text-gold-400 uppercase">
                Governance
              </p>
              <h2 className="text-3xl leading-[1.15] font-bold sm:text-4xl">
                Four commitments we do not trade away
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/70">
                Hajj savings represent years of sacrifice, often from people with very
                little margin. These are the constraints we design inside, not the
                features we advertise.
              </p>
              <div className="mt-8 flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-4 py-3">
                <Building2 className="size-4 shrink-0 text-gold-400" />
                <span className="text-xs text-white/70">
                  HajjPath Technologies Limited · RC 7418205 · Lagos, Nigeria
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {COMPLIANCE_POINTS.map((p, i) => (
                <div key={p.title} className="rounded-2xl border border-white/12 bg-white/5 p-5">
                  <div className="flex items-start gap-4">
                    <span className="tabular grid size-8 shrink-0 place-items-center rounded-lg bg-gold-400/15 text-xs font-bold text-gold-300">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-[0.9375rem] font-bold">{p.title}</h3>
                      <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-white/65">
                        {p.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading align="center" eyebrow="Voices" title="The people it was built for" />
        <div className="mt-12">
          <Testimonials />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-5 rounded-3xl border border-line bg-surface p-10 text-center">
          <h2 className="text-2xl font-bold text-ink sm:text-3xl">
            Wherever you are in the journey, start here.
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-muted">
            Open a plan, sponsor a parent, list your shop, or bring your whole group onto
            one manifest. The account takes minutes to create.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/auth/register" size="lg">
              Create an account
              <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline" size="lg">
              Talk to the team
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
