import Link from "next/link";
import { ArrowLeft, Compass, LayoutDashboard, Search } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Kaaba } from "@/components/brand-icons";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-forest-950 text-white">
      <div className="pattern-islamic pointer-events-none absolute inset-0 opacity-45" />
      <div className="pointer-events-none absolute top-1/4 left-1/2 size-128 -translate-x-1/2 rounded-full bg-forest-700/25 blur-[110px]" />

      <header className="relative px-4 py-6 sm:px-8">
        <Logo invert href="/" />
      </header>

      <main className="relative flex flex-1 items-center justify-center px-4 pb-20">
        <div className="max-w-lg text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-gold-400/15 text-gold-300">
            <Kaaba className="size-8" />
          </span>

          <p className="tabular mt-8 text-6xl font-extrabold tracking-tight text-white/15 sm:text-7xl">
            404
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            This path leads nowhere
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/65">
            The page you were looking for has moved or never existed. Let us point you back
            towards the journey.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/" variant="gold" size="lg">
              <ArrowLeft className="size-4" />
              Back to the homepage
            </ButtonLink>
            <ButtonLink
              href="/app"
              size="lg"
              className="border border-white/20 bg-white/8 text-white hover:bg-white/15"
            >
              <LayoutDashboard className="size-4" />
              Open the dashboard
            </ButtonLink>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {[
              { href: "/how-it-works", label: "How it works", icon: Compass },
              { href: "/packages", label: "Plans & packages", icon: Search },
              { href: "/contact", label: "Contact support", icon: Search },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="inline-flex items-center gap-1.5 text-white/55 transition hover:text-white"
              >
                <l.icon className="size-3.5" />
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
