import Link from "next/link";
import { Logo } from "@/components/logo";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/how-it-works", label: "How it works" },
      { href: "/packages", label: "Packages" },
      { href: "/companion", label: "In Makkah" },
      { href: "/app/guide", label: "Guide" },
      { href: "/app/marketplace", label: "Marketplace" },
    ],
  },
  {
    title: "Who it's for",
    links: [
      { href: "/auth/register", label: "Pilgrims" },
      { href: "/about#sponsors", label: "Family sponsors" },
      { href: "/vendors", label: "Vendors" },
      { href: "/about#operators", label: "Group admins" },
      { href: "/about#boards", label: "Pilgrims Boards" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
      { href: "/legal/terms", label: "Terms" },
      { href: "/legal/privacy", label: "Privacy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted">
              Hajj savings and a pilgrimage companion for Nigerian Muslims.
            </p>
            <p className="mt-4 text-sm text-muted">
              <a href="mailto:salam@hajjpath.ng" className="hover:text-ink">
                salam@hajjpath.ng
              </a>
              {" · "}
              <a href="tel:+2348004255728" className="hover:text-ink">
                0800 425 5728
              </a>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-medium text-ink">{column.title}</h3>
                <ul className="mt-3 space-y-2">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-muted transition-colors hover:text-ink">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} HajjPath Technologies Limited · RC 7418205</p>
          <p>Seat allocation remains with NAHCON and the State Pilgrims Boards.</p>
        </div>
      </div>
    </footer>
  );
}
