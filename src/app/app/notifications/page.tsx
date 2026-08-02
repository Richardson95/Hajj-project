"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Bell,
  BookOpen,
  CheckCheck,
  IdCard,
  Package,
  Settings,
  Users,
  Wallet,
} from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader } from "@/components/ui/misc";
import { SegmentedControl } from "@/components/ui/tabs";
import { useApp } from "@/lib/store";
import { relativeTime } from "@/lib/format";
import type { AppNotification } from "@/lib/types";
import { cn } from "@/lib/cn";

const KIND_META: Record<
  AppNotification["kind"],
  { label: string; icon: React.ComponentType<{ className?: string }>; tone: string }
> = {
  savings: {
    label: "Savings",
    icon: Wallet,
    tone: "bg-forest-50 text-forest-800 dark:bg-forest-950 dark:text-forest-200",
  },
  kyc: {
    label: "Verification",
    icon: IdCard,
    tone: "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  },
  group: {
    label: "Group",
    icon: Users,
    tone: "bg-sky-50 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
  },
  order: {
    label: "Orders",
    icon: Package,
    tone: "bg-violet-50 text-violet-800 dark:bg-violet-950 dark:text-violet-200",
  },
  ritual: {
    label: "Guide",
    icon: BookOpen,
    tone: "bg-gold-50 text-gold-800 dark:bg-gold-950 dark:text-gold-200",
  },
  system: {
    label: "System",
    icon: Settings,
    tone: "bg-surface-muted text-muted",
  },
};

type Filter = "all" | "unread" | AppNotification["kind"];

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const [filter, setFilter] = useState<Filter>("all");

  const unread = notifications.filter((n) => !n.read).length;

  const filters = useMemo(
    () => [
      { id: "all" as Filter, label: "All", count: notifications.length },
      { id: "unread" as Filter, label: "Unread", count: unread },
      { id: "savings" as Filter, label: "Savings" },
      { id: "group" as Filter, label: "Group" },
      { id: "order" as Filter, label: "Orders" },
      { id: "kyc" as Filter, label: "Verification" },
    ],
    [notifications.length, unread],
  );

  const visible = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.kind === filter;
  });

  return (
    <>
      <PageHeader
        title="Notifications"
        description={
          unread > 0
            ? `${unread} unread ${unread === 1 ? "notice" : "notices"} across your account.`
            : "You are all caught up."
        }
        action={
          unread > 0 ? (
            <Button variant="outline" onClick={markAllNotificationsRead}>
              <CheckCheck className="size-4" />
              Mark all read
            </Button>
          ) : undefined
        }
      />

      <SegmentedControl
        items={filters}
        value={filter}
        onChange={setFilter}
        className="mb-5"
      />

      {visible.length === 0 ? (
        <EmptyState
          icon={<Bell className="size-6" />}
          title="Nothing here"
          description="Notifications about your savings, your group and your orders will appear here."
        />
      ) : (
        <div className="space-y-3">
          {visible.map((n) => {
            const meta = KIND_META[n.kind];
            const Body = (
              <>
                <span
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-xl",
                    meta.tone,
                  )}
                >
                  <meta.icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-ink">{n.title}</span>
                    {!n.read ? (
                      <span className="size-2 rounded-full bg-rose-500" aria-label="Unread" />
                    ) : null}
                  </span>
                  <span className="mt-1 block text-[0.8125rem] leading-relaxed text-muted">
                    {n.body}
                  </span>
                  <span className="mt-1.5 block text-xs text-muted">
                    {meta.label} · <span suppressHydrationWarning>{relativeTime(n.date)}</span>
                  </span>
                </span>
              </>
            );

            return (
              <Card
                key={n.id}
                className={cn(
                  "transition",
                  !n.read && "border-forest-800/25 bg-forest-50/40 dark:bg-forest-950/30",
                )}
              >
                <CardBody className="p-0">
                  {n.href ? (
                    <Link
                      href={n.href}
                      onClick={() => markNotificationRead(n.id)}
                      className="flex items-start gap-4 rounded-2xl p-4 transition hover:bg-surface-muted/60"
                    >
                      {Body}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => markNotificationRead(n.id)}
                      className="flex w-full items-start gap-4 rounded-2xl p-4 text-left transition hover:bg-surface-muted/60"
                    >
                      {Body}
                    </button>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
