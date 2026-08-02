import Link from "next/link";
import { ArrowLeft, BadgeCheck, Lock, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/logo";
import { Kaaba } from "@/components/brand-icons";

const ASSURANCES = [
  {
    icon: ShieldCheck,
    title: "Verified once, trusted throughout",
    body: "BVN and NIN checked through a licensed provider so the person saving is the person on the manifest.",
  },
  {
    icon: Lock,
    title: "Funds held in trust",
    body: "Balances sit in a ring-fenced account with a licensed Nigerian bank, reconciled daily.",
  },
  {
    icon: BadgeCheck,
    title: "Shariah board reviewed",
    body: "Non-interest custody and Mudarabah profit-sharing, reviewed annually by an independent board.",
  },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-full lg:grid-cols-[1fr_1.05fr]">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-forest-950 text-white lg:flex lg:flex-col">
        <div className="pattern-islamic pointer-events-none absolute inset-0 opacity-45" />
        <div className="pointer-events-none absolute -top-32 -left-20 size-120 rounded-full bg-forest-700/30 blur-[110px]" />
        <div className="pointer-events-none absolute -right-20 -bottom-32 size-104 rounded-full bg-gold-600/15 blur-[100px]" />

        <div className="relative flex flex-1 flex-col p-10 xl:p-14">
          <Logo invert size={40} href="/" />

          <div className="my-auto max-w-md py-14">
            <span className="grid size-14 place-items-center rounded-2xl bg-gold-400/15 text-gold-300">
              <Kaaba className="size-7" />
            </span>
            <h2 className="mt-7 text-3xl leading-[1.15] font-extrabold xl:text-[2.5rem]">
              From intention to completion, HajjPath guides you all the way.
            </h2>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-white/65">
              Join 38,400 Nigerian Muslims building towards the journey of a lifetime —
              with a plan that fits their income and a companion for every rite.
            </p>

            <ul className="mt-10 space-y-5 border-t border-white/12 pt-8">
              {ASSURANCES.map((a) => (
                <li key={a.title} className="flex gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/8 text-gold-300">
                    <a.icon className="size-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{a.title}</span>
                    <span className="mt-1 block text-[0.8125rem] leading-relaxed text-white/55">
                      {a.body}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} HajjPath Technologies Limited · RC 7418205
          </p>
        </div>
      </aside>

      {/* Form panel */}
      <div className="flex flex-col bg-background">
        <header className="flex items-center justify-between gap-4 px-4 py-5 sm:px-8">
          <div className="lg:hidden">
            <Logo />
          </div>
          <Link
            href="/"
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-ink"
          >
            <ArrowLeft className="size-4" />
            Back to site
          </Link>
        </header>

        <main id="main" className="flex flex-1 items-start justify-center px-4 pb-16 sm:px-8">
          <div className="w-full max-w-xl py-4">{children}</div>
        </main>
      </div>
    </div>
  );
}
