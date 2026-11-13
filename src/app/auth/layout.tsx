import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.05fr]">
      {/* Brand panel */}
      <aside className="relative isolate hidden overflow-hidden bg-neutral-950 text-white lg:flex lg:flex-col">
        <Image
          src="/images/madinah-courtyard.jpg"
          alt="The courtyard of the Prophet's Mosque in Madinah"
          fill
          priority
          sizes="50vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/80 via-black/30 to-black/40" />

        <div className="flex flex-1 flex-col p-10 xl:p-14">
          <Logo invert size={40} href="/" />
          <div className="mt-auto max-w-md">
            <p className="text-3xl leading-tight font-semibold tracking-tight">
              Save for Hajj. We&apos;ll guide you there.
            </p>
            <p className="mt-6 text-xs text-white/60">
              © {new Date().getFullYear()} HajjPath Technologies Limited
            </p>
          </div>
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
