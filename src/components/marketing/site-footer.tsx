import Link from "next/link";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/logo";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/how-it-works", label: "How it works" },
      { href: "/packages", label: "Plans & packages" },
      { href: "/companion", label: "In Makkah" },
      { href: "/app/guide", label: "Hajj guide library" },
      { href: "/app/marketplace", label: "Makkah marketplace" },
    ],
  },
  {
    title: "Who it's for",
    links: [
      { href: "/auth/register", label: "Pilgrims" },
      { href: "/about#sponsors", label: "Family sponsors" },
      { href: "/vendors", label: "Makkah vendors" },
      { href: "/about#operators", label: "Hajj operators" },
      { href: "/about#boards", label: "State Pilgrims Boards" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About HajjPath" },
      { href: "/faq", label: "Frequently asked" },
      { href: "/contact", label: "Contact us" },
      { href: "/legal/terms", label: "Terms of service" },
      { href: "/legal/privacy", label: "Privacy policy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-line bg-forest-950 text-white/80">
      <div className="pattern-islamic pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-forest-700/25 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2.2fr]">
          <div>
            <Logo invert size={40} showTagline />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
              HajjPath is a complete pilgrimage ecosystem — Shariah-compliant savings,
              verified identity, live guidance in the holy sites, and a marketplace that
              reaches your hotel or your tent.
            </p>

            <div className="mt-6 space-y-2.5 text-sm">
              <p className="flex items-start gap-2.5 text-white/70">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold-400" />
                14 Kofo Abayomi Street, Victoria Island, Lagos · Nigeria
              </p>
              <p className="flex items-center gap-2.5 text-white/70">
                <Phone className="size-4 shrink-0 text-gold-400" />
                <a href="tel:+2348000425584" className="hover:text-white">
                  0800 HAJJPATH (0800 425 5728)
                </a>
              </p>
              <p className="flex items-center gap-2.5 text-white/70">
                <Mail className="size-4 shrink-0 text-gold-400" />
                <a href="mailto:salam@hajjpath.ng" className="hover:text-white">
                  salam@hajjpath.ng
                </a>
              </p>
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5">
              <ShieldCheck className="size-4 text-gold-400" />
              <span className="text-xs font-medium text-white/75">
                Shariah advisory board reviewed · Funds held in trust
              </span>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="text-xs font-bold tracking-[0.16em] text-gold-400 uppercase">
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/65 transition hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} HajjPath Technologies Limited. RC 7418205. All
            rights reserved.
          </p>
          <p className="max-w-2xl text-xs leading-relaxed text-white/40">
            HajjPath facilitates savings and pilgrimage logistics. Seat allocation remains
            the responsibility of NAHCON and the State Pilgrims Welfare Boards. Figures
            shown are illustrative and reviewed each Hajj season.
          </p>
        </div>
      </div>
    </footer>
  );
}
