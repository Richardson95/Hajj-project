"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button, ButtonLink, IconButton } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useApp } from "@/lib/store";
import { useScrolledPast } from "@/lib/client-hooks";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/packages", label: "Plans & packages" },
  { href: "/companion", label: "In Makkah" },
  { href: "/vendors", label: "For vendors" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const scrolled = useScrolledPast(8);
  const { resolved, toggle } = useTheme();
  const { authenticated, hydrated } = useApp();

  /* Close the mobile menu on navigation without a setState-in-effect. */
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-line bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-17 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition",
                  active
                    ? "text-forest-800 dark:text-gold-300"
                    : "text-muted hover:bg-surface-muted hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <IconButton
            label={resolved === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            onClick={toggle}
            className="hidden sm:inline-flex"
          >
            {resolved === "dark" ? (
              <Sun className="size-[1.15rem]" />
            ) : (
              <Moon className="size-[1.15rem]" />
            )}
          </IconButton>

          {hydrated && authenticated ? (
            <ButtonLink href="/app" size="sm" className="hidden sm:inline-flex">
              Open dashboard
            </ButtonLink>
          ) : (
            <>
              <ButtonLink
                href="/auth/login"
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
              >
                Sign in
              </ButtonLink>
              <ButtonLink href="/auth/register" size="sm" className="hidden sm:inline-flex">
                Start saving
              </ButtonLink>
            </>
          )}

          <IconButton
            label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden"
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </IconButton>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 top-17 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-forest-950/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="safe-bottom relative max-h-[calc(100vh-4.25rem)] overflow-y-auto border-b border-line bg-surface px-4 pt-3 pb-6 shadow-xl">
            <nav className="flex flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-xl px-3.5 py-3 text-[0.9375rem] font-medium transition",
                    pathname === item.href
                      ? "bg-forest-50 text-forest-800 dark:bg-forest-950 dark:text-gold-300"
                      : "text-ink hover:bg-surface-muted",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4">
              {hydrated && authenticated ? (
                <ButtonLink href="/app" block>
                  Open dashboard
                </ButtonLink>
              ) : (
                <>
                  <ButtonLink href="/auth/register" block>
                    Start saving
                  </ButtonLink>
                  <ButtonLink href="/auth/login" variant="outline" block>
                    Sign in
                  </ButtonLink>
                </>
              )}
              <Button variant="ghost" block onClick={toggle} className="mt-1">
                {resolved === "dark" ? (
                  <>
                    <Sun className="size-4" /> Light theme
                  </>
                ) : (
                  <>
                    <Moon className="size-4" /> Dark theme
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
