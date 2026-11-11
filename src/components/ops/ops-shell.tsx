"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeftRight,
  FileText,
  Headset,
  IdCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  ShieldCheck,
  Siren,
  Store,
  Sun,
  UsersRound,
  Wallet,
  X,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Avatar } from "@/components/ui/misc";
import { IconButton } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useApp } from "@/lib/store";
import { useOps } from "@/lib/ops/store";
import { initialsOf } from "@/lib/format";
import { cn } from "@/lib/cn";

type BadgeKey = "kyc" | "support" | "vendors" | "sos";

interface OpsNavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  badge?: BadgeKey;
}

export const OPS_NAV: OpsNavItem[] = [
  { href: "/ops", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/ops/users", label: "Users & KYC", icon: IdCard, badge: "kyc" },
  { href: "/ops/plans", label: "Savings plans", icon: Wallet },
  { href: "/ops/support", label: "Support inbox", icon: Headset, badge: "support" },
  { href: "/ops/vendors", label: "Marketplace", icon: Store, badge: "vendors" },
  { href: "/ops/content", label: "Content & settings", icon: FileText },
  { href: "/ops/sos", label: "SOS monitor", icon: Siren, badge: "sos" },
  { href: "/ops/team", label: "Admin team", icon: UsersRound },
];

function isActive(pathname: string, item: OpsNavItem): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function OpsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname.startsWith("/ops/login");
  if (isLogin) return <>{children}</>;
  return <GuardedShell pathname={pathname}>{children}</GuardedShell>;
}

function GuardedShell({
  pathname,
  children,
}: {
  pathname: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const ops = useOps();
  const app = useApp();
  const { resolved, toggle } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { hydrated, currentAdmin, adminLogout } = ops;

  useEffect(() => {
    if (hydrated && !currentAdmin) router.replace("/ops/login");
  }, [hydrated, currentAdmin, router]);

  /* Close the drawer on navigation without a setState-in-effect. */
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (drawerOpen) setDrawerOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const counts: Record<BadgeKey, number> = useMemo(() => {
    const liveKyc = app.user.kyc.status === "in-review" ? 1 : 0;
    const liveSos = app.sosEvents.filter((e) => e.status !== "resolved").length;
    return {
      kyc: ops.users.filter((u) => u.kyc === "in-review").length + liveKyc,
      support: ops.tickets.filter((t) => t.status === "open").length,
      vendors:
        ops.vendors.filter((v) => v.status === "pending").length +
        ops.disputes.filter((d) => d.status === "open").length,
      sos: ops.sos.filter((s) => s.status !== "resolved").length + liveSos,
    };
  }, [ops.users, ops.tickets, ops.vendors, ops.disputes, ops.sos, app.user.kyc.status, app.sosEvents]);

  const pageTitle =
    [...OPS_NAV]
      .filter((i) => isActive(pathname, i))
      .sort((a, b) => b.href.length - a.href.length)[0]?.label ?? "Operations";

  if (!hydrated || !currentAdmin) {
    return (
      <div className="grid min-h-full place-items-center px-6">
        <div className="text-center">
          <div className="mx-auto size-10 animate-spin rounded-full border-2 border-line border-t-forest-800 dark:border-t-gold-400" />
          <p className="mt-4 text-sm text-muted">
            {hydrated ? "Redirecting to admin sign in…" : "Loading the operations console…"}
          </p>
        </div>
      </div>
    );
  }

  const [first = "", ...rest] = currentAdmin.name.split(" ");
  const initials = initialsOf(first, rest.join(" ") || first);

  const sidebar = (
    <>
      <div className="px-5 pt-1 pb-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-400/15 px-2.5 py-1 text-[0.625rem] font-bold tracking-[0.14em] text-gold-300 uppercase">
          <ShieldCheck className="size-3" />
          Operations console
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 pb-5">
        <ul className="space-y-0.5">
          {OPS_NAV.map((item) => {
            const active = isActive(pathname, item);
            const count = item.badge ? counts[item.badge] : 0;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                    active
                      ? "bg-white/12 text-white"
                      : "text-white/65 hover:bg-white/6 hover:text-white",
                  )}
                >
                  <item.icon className="size-[1.15rem] shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {count > 0 ? (
                    <span
                      className={cn(
                        "tabular ml-auto rounded-md px-1.5 py-0.5 text-[0.625rem] font-bold",
                        item.badge === "sos"
                          ? "bg-rose-500 text-white"
                          : "bg-gold-400 text-forest-950",
                      )}
                    >
                      {count}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <Avatar initials={initials} tone="from-gold-500 to-gold-700" size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{currentAdmin.name}</p>
            <p className="truncate text-xs text-white/50">
              {currentAdmin.role === "super-admin" ? "Super admin" : "Staff"}
            </p>
          </div>
        </div>
        <div className="mt-1 flex gap-1">
          <Link
            href="/app"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium text-white/60 transition hover:bg-white/6 hover:text-white"
          >
            <ArrowLeftRight className="size-3.5" />
            Pilgrim app
          </Link>
          <button
            type="button"
            onClick={() => {
              adminLogout();
              router.push("/ops/login");
            }}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium text-white/60 transition hover:bg-white/6 hover:text-white"
          >
            <LogOut className="size-3.5" />
            Sign out
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-full">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-forest-950 lg:flex">
        <div className="flex h-16 items-center px-5">
          <Logo href="/ops" invert />
        </div>
        {sidebar}
      </aside>

      {drawerOpen ? (
        <div className="fixed inset-0 z-90 lg:hidden">
          <div
            className="absolute inset-0 bg-forest-950/50 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-hidden
          />
          <div className="relative flex h-full w-72 max-w-[85vw] animate-[fade-in_0.2s_ease-out] flex-col bg-forest-950">
            <div className="flex h-16 items-center justify-between px-4">
              <Logo href="/ops" invert />
              <IconButton
                label="Close menu"
                onClick={() => setDrawerOpen(false)}
                className="text-white hover:bg-white/10 hover:text-white"
              >
                <X className="size-5" />
              </IconButton>
            </div>
            {sidebar}
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-line bg-background/85 px-4 backdrop-blur-xl sm:px-6">
          <IconButton label="Open menu" className="lg:hidden" onClick={() => setDrawerOpen(true)}>
            <Menu className="size-5" />
          </IconButton>
          <p className="truncate text-sm font-bold text-ink">{pageTitle}</p>
          <div className="ml-auto flex items-center gap-1.5">
            <IconButton
              label={resolved === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              onClick={toggle}
            >
              {resolved === "dark" ? (
                <Sun className="size-[1.15rem]" />
              ) : (
                <Moon className="size-[1.15rem]" />
              )}
            </IconButton>
            <Avatar initials={initials} tone="from-gold-500 to-gold-700" size="sm" />
          </div>
        </header>

        <main id="main" className="flex-1 px-4 pt-6 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
