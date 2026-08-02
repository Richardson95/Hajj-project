"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronRight,
  LogOut,
  Menu,
  Moon,
  MoreHorizontal,
  RotateCcw,
  Search,
  ShoppingCart,
  Siren,
  Sun,
  X,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Avatar } from "@/components/ui/misc";
import { IconButton } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useApp, useCartSummary } from "@/lib/store";
import { cn } from "@/lib/cn";
import {
  ALL_NAV_ITEMS,
  MOBILE_NAV,
  NAV_GROUPS,
  PORTAL_LINKS,
  type NavItem,
} from "./nav-config";
import { AppSearch } from "./app-search";

function isActive(pathname: string, item: NavItem): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { authenticated, hydrated, user, notifications, orders, logout, resetDemo } =
    useApp();
  const { resolved, toggle } = useTheme();
  const { itemCount } = useCartSummary();

  const openOrders = orders.filter(
    (o) => !["delivered", "cancelled"].includes(o.status),
  ).length;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (hydrated && !authenticated) router.replace("/auth/login");
  }, [hydrated, authenticated, router]);

  /* Close the mobile menus on navigation, adjusting state during render rather
     than in an effect (React's documented pattern for derived resets). */
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (drawerOpen) setDrawerOpen(false);
    if (moreOpen) setMoreOpen(false);
  }

  useEffect(() => {
    const locked = drawerOpen || moreOpen;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen, moreOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pageTitle = useMemo(() => {
    const match = [...ALL_NAV_ITEMS]
      .filter((i) => isActive(pathname, i))
      .sort((a, b) => b.href.length - a.href.length)[0];
    return match?.label ?? "HajjPath";
  }, [pathname]);

  function badgeCount(item: NavItem): number {
    if (item.badge === "notifications") return unread;
    if (item.badge === "orders") return openOrders;
    return 0;
  }

  if (!hydrated || !authenticated) {
    return (
      <div className="grid min-h-full place-items-center px-6">
        <div className="text-center">
          <div className="mx-auto size-10 animate-spin rounded-full border-2 border-line border-t-forest-800 dark:border-t-gold-400" />
          <p className="mt-4 text-sm text-muted">
            {hydrated ? "Redirecting to sign in…" : "Loading your pilgrimage…"}
          </p>
        </div>
      </div>
    );
  }

  const sidebarContent = (
    <>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="mb-1.5 px-3 text-[0.625rem] font-bold tracking-[0.14em] text-muted uppercase">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(pathname, item);
                const count = badgeCount(item);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                        active
                          ? "bg-forest-800 text-white shadow-[0_8px_20px_-12px_rgba(1,68,33,0.8)]"
                          : item.href === "/app/sos"
                            ? "text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                            : "text-ink/75 hover:bg-surface-muted hover:text-ink",
                      )}
                    >
                      <item.icon className="size-[1.15rem] shrink-0" />
                      <span className="truncate">{item.label}</span>
                      {count > 0 ? (
                        <span
                          className={cn(
                            "tabular ml-auto rounded-md px-1.5 py-0.5 text-[0.625rem] font-bold",
                            active
                              ? "bg-white/20 text-white"
                              : "bg-rose-500 text-white",
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
          </div>
        ))}

        <div>
          <p className="mb-1.5 px-3 text-[0.625rem] font-bold tracking-[0.14em] text-muted uppercase">
            Switch portal
          </p>
          <ul className="space-y-0.5">
            {PORTAL_LINKS.map((item) => {
              const active = isActive(pathname, item);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                      active
                        ? "bg-gold-500 text-forest-950"
                        : "text-ink/75 hover:bg-surface-muted hover:text-ink",
                    )}
                  >
                    <item.icon className="size-[1.15rem] shrink-0" />
                    <span className="truncate">{item.label}</span>
                    <ChevronRight className="ml-auto size-4 opacity-40" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div className="border-t border-line p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <Avatar initials={user.initials} tone={user.avatarTone} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">
              {user.honorific ? `${user.honorific} ` : ""}
              {user.firstName} {user.lastName}
            </p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>
        </div>
        <div className="mt-1 flex gap-1">
          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted transition hover:bg-surface-muted hover:text-ink"
          >
            <LogOut className="size-3.5" />
            Sign out
          </button>
          <button
            type="button"
            onClick={resetDemo}
            title="Reset all demo data to its original state"
            className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted transition hover:bg-surface-muted hover:text-ink"
          >
            <RotateCcw className="size-3.5" />
            Reset demo
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-full">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-70 shrink-0 flex-col border-r border-line bg-surface lg:flex">
        <div className="flex h-16 items-center border-b border-line px-5">
          <Logo href="/app" />
        </div>
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-90 lg:hidden">
          <div
            className="absolute inset-0 bg-forest-950/50 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-hidden
          />
          <div className="relative flex h-full w-72 max-w-[85vw] animate-[fade-in_0.2s_ease-out] flex-col border-r border-line bg-surface">
            <div className="flex h-16 items-center justify-between border-b border-line px-4">
              <Logo href="/app" />
              <IconButton label="Close menu" onClick={() => setDrawerOpen(false)}>
                <X className="size-5" />
              </IconButton>
            </div>
            {sidebarContent}
          </div>
        </div>
      ) : null}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-line bg-background/85 px-4 backdrop-blur-xl sm:px-6">
          <IconButton
            label="Open menu"
            className="lg:hidden"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu className="size-5" />
          </IconButton>

          <div className="min-w-0 lg:hidden">
            <p className="truncate text-sm font-bold text-ink">{pageTitle}</p>
          </div>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="ml-auto hidden w-full max-w-sm items-center gap-2.5 rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-muted transition hover:border-forest-800/25 lg:mr-auto lg:ml-0 lg:flex"
          >
            <Search className="size-4 shrink-0" />
            <span className="flex-1 text-left">Search plans, rituals, vendors…</span>
            <kbd className="rounded-md border border-line bg-surface-muted px-1.5 py-0.5 text-[0.625rem] font-semibold">
              ⌘K
            </kbd>
          </button>

          <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
            <IconButton
              label="Search"
              className="lg:hidden"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="size-5" />
            </IconButton>

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

            <Link
              href="/app/notifications"
              aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
              className="relative grid size-10 place-items-center rounded-xl text-ink/75 transition hover:bg-surface-muted hover:text-ink"
            >
              <Bell className="size-[1.15rem]" />
              {unread > 0 ? (
                <span className="tabular absolute top-1.5 right-1.5 grid min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[0.5625rem] font-bold text-white">
                  {unread}
                </span>
              ) : null}
            </Link>

            <Link
              href="/app/marketplace/cart"
              aria-label={`Cart${itemCount ? `, ${itemCount} items` : ", empty"}`}
              className="relative grid size-10 place-items-center rounded-xl text-ink/75 transition hover:bg-surface-muted hover:text-ink"
            >
              <ShoppingCart className="size-[1.15rem]" />
              {itemCount > 0 ? (
                <span className="tabular absolute top-1.5 right-1.5 grid min-w-4 place-items-center rounded-full bg-forest-800 px-1 text-[0.5625rem] font-bold text-white dark:bg-gold-500 dark:text-forest-950">
                  {itemCount}
                </span>
              ) : null}
            </Link>

            <Link
              href="/app/sos"
              className="ml-1 hidden items-center gap-2 rounded-xl bg-rose-600 px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-500 sm:inline-flex"
            >
              <Siren className="size-4" />
              SOS
            </Link>

            <Link href="/app/profile" aria-label="Profile" className="ml-1 rounded-full">
              <Avatar initials={user.initials} tone={user.avatarTone} size="sm" />
            </Link>
          </div>
        </header>

        <main id="main" className="flex-1 px-4 pt-6 pb-28 sm:px-6 lg:px-8 lg:pb-12">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-5">
          {MOBILE_NAV.map((item) => {
            const active = isActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[0.625rem] font-medium transition",
                  active ? "text-forest-800 dark:text-gold-300" : "text-muted",
                )}
              >
                <item.icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className="flex flex-col items-center gap-1 py-2.5 text-[0.625rem] font-medium text-muted"
          >
            <MoreHorizontal className="size-5" />
            More
          </button>
        </div>
      </nav>

      {/* Mobile "more" sheet */}
      {moreOpen ? (
        <div className="fixed inset-0 z-90 lg:hidden">
          <div
            className="absolute inset-0 bg-forest-950/50 backdrop-blur-sm"
            onClick={() => setMoreOpen(false)}
            aria-hidden
          />
          <div className="safe-bottom absolute inset-x-0 bottom-0 max-h-[80vh] animate-[slide-up_0.28s_cubic-bezier(0.22,1,0.36,1)] overflow-y-auto rounded-t-3xl border-t border-line bg-surface p-5">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line-strong" />
            <div className="space-y-5">
              {NAV_GROUPS.map((group) => (
                <div key={group.title}>
                  <p className="mb-2 text-[0.625rem] font-bold tracking-[0.14em] text-muted uppercase">
                    {group.title}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex flex-col items-center gap-2 rounded-xl border border-line p-3 text-center"
                      >
                        <item.icon className="size-5 text-forest-800 dark:text-gold-300" />
                        <span className="text-[0.6875rem] leading-tight font-medium text-ink">
                          {item.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <div>
                <p className="mb-2 text-[0.625rem] font-bold tracking-[0.14em] text-muted uppercase">
                  Switch portal
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {PORTAL_LINKS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 rounded-xl border border-line p-3"
                    >
                      <item.icon className="size-4 text-gold-600 dark:text-gold-400" />
                      <span className="text-[0.8125rem] font-medium text-ink">
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <AppSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
