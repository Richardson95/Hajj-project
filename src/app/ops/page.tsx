"use client";

import Link from "next/link";
import {
  ChevronRight,
  Coins,
  Gavel,
  Headset,
  History,
  IdCard,
  Siren,
  Store,
  TriangleAlert,
  UsersRound,
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Pill, type BadgeTone } from "@/components/ui/badge";
import { EmptyState, PageHeader, Stat } from "@/components/ui/misc";
import { useOps } from "@/lib/ops/store";
import { CANNOT_TRAVEL_TOPIC } from "@/components/ops/ops-ui";
import {
  usePlatformPlans,
  usePlatformSos,
  usePlatformUsers,
} from "@/components/ops/use-platform";
import { compactNaira, relativeTime } from "@/lib/format";

interface Task {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  meta: string;
  href: string;
  tag: string;
  tone: BadgeTone;
  at: string;
  rank: number;
}

export default function OpsOverviewPage() {
  const ops = useOps();
  const users = usePlatformUsers();
  const plans = usePlatformPlans();
  const sos = usePlatformSos();

  const pendingKyc = users.filter((u) => u.kyc === "in-review");
  const openTickets = ops.tickets.filter((t) => t.status === "open");
  const openDisputes = ops.disputes.filter((d) => d.status === "open");
  const pendingVendors = ops.vendors.filter((v) => v.status === "pending");
  const activeSos = sos.filter((s) => s.status !== "resolved");
  const totalSaved = plans.reduce((sum, p) => sum + p.balance, 0);

  const tasks: Task[] = [
    ...activeSos.map((s) => ({
      id: s.id,
      icon: Siren,
      title: `SOS: ${s.pilgrim}`,
      meta: `${s.location} · ${s.note}`,
      href: "/ops/sos",
      tag: s.status === "dispatched" ? "New SOS" : "SOS in progress",
      tone: "danger" as const,
      at: s.raisedAt,
      rank: 0,
    })),
    ...openTickets.map((t) => ({
      id: t.id,
      icon: Headset,
      title: `${t.name}: ${t.topic}`,
      meta: t.messages[t.messages.length - 1]?.body ?? "",
      href: `/ops/support?ticket=${t.id}`,
      tag: t.topic === CANNOT_TRAVEL_TOPIC ? "Cannot travel" : "Support",
      tone: (t.topic === CANNOT_TRAVEL_TOPIC ? "warning" : "info") as BadgeTone,
      at: t.createdAt,
      rank: t.topic === CANNOT_TRAVEL_TOPIC ? 1 : 3,
    })),
    ...pendingKyc.map((u) => ({
      id: u.id,
      icon: IdCard,
      title: `Review KYC for ${u.name}`,
      meta: `${u.state} · NIN and passport submitted`,
      href: "/ops/users",
      tag: "KYC",
      tone: "warning" as const,
      at: u.submittedAt ?? u.joinedAt,
      rank: 2,
    })),
    ...openDisputes.map((d) => ({
      id: d.id,
      icon: Gavel,
      title: `Dispute on ${d.orderId}`,
      meta: `${d.buyer} vs ${d.vendorName} · ${d.reason}`,
      href: "/ops/vendors?tab=disputes",
      tag: "Dispute",
      tone: "warning" as const,
      at: d.openedAt,
      rank: 2,
    })),
    ...pendingVendors.map((v) => ({
      id: v.id,
      icon: Store,
      title: `Vendor application: ${v.name}`,
      meta: `${v.location} · ${v.categories.join(", ")}`,
      href: "/ops/vendors",
      tag: "Vendor",
      tone: "neutral" as const,
      at: v.appliedAt,
      rank: 4,
    })),
  ].sort((a, b) => a.rank - b.rank || new Date(b.at).getTime() - new Date(a.at).getTime());

  const firstName = ops.currentAdmin?.name.split(" ")[0] ?? "";

  const stats = [
    { label: "Registered pilgrims", value: users.length, detail: `${plans.length} savings plans`, icon: UsersRound, href: "/ops/users", tone: "brand" as const },
    { label: "Total saved", value: compactNaira(totalSaved), detail: "Held in trust across all plans", icon: Coins, href: "/ops/plans", tone: "gold" as const },
    { label: "KYC awaiting review", value: pendingKyc.length, detail: "Usually cleared within one working day", icon: IdCard, href: "/ops/users", tone: "info" as const },
    { label: "Open support tickets", value: openTickets.length, detail: `${openTickets.filter((t) => t.topic === CANNOT_TRAVEL_TOPIC).length} from pilgrims who cannot travel`, icon: Headset, href: "/ops/support", tone: "info" as const },
    { label: "Open disputes", value: openDisputes.length, detail: `${pendingVendors.length} vendor applications pending`, icon: Gavel, href: "/ops/vendors?tab=disputes", tone: "gold" as const },
    { label: "Active SOS alerts", value: activeSos.length, detail: "Across every group in the field", icon: Siren, href: "/ops/sos", tone: "danger" as const },
  ];

  return (
    <>
      <PageHeader
        title={`As-salamu alaykum, ${firstName}`}
        description="Everything across HajjPath that needs a person, in the order it needs one."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-2xl">
            <Stat
              label={s.label}
              value={<span suppressHydrationWarning>{s.value}</span>}
              detail={s.detail}
              icon={<s.icon className="size-4" />}
              tone={s.tone}
              className="h-full"
            />
          </Link>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader
            title="Needs attention"
            description="SOS first, then pilgrims who cannot travel, then everything else."
            icon={<TriangleAlert className="size-4" />}
          />
          {tasks.length === 0 ? (
            <div className="p-5">
              <EmptyState title="Nothing waiting" description="Every queue is clear. Alhamdulillah." />
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {tasks.slice(0, 10).map((t) => (
                <li key={t.id}>
                  <Link
                    href={t.href}
                    className="flex items-start gap-3 px-5 py-3.5 transition hover:bg-surface-muted/60"
                  >
                    <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-surface-muted text-ink/70">
                      <t.icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-ink">{t.title}</p>
                        <Pill tone={t.tone}>{t.tag}</Pill>
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted">{t.meta}</p>
                    </div>
                    <span suppressHydrationWarning className="shrink-0 pt-1 text-[0.6875rem] text-muted">
                      {relativeTime(t.at)}
                    </span>
                    <ChevronRight className="mt-1 size-4 shrink-0 text-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Recent admin activity"
            description="Every change made in this console is recorded."
            icon={<History className="size-4" />}
          />
          <ul className="divide-y divide-line">
            {ops.audit.slice(0, 10).map((a) => (
              <li key={a.id} className="px-5 py-3">
                <p className="text-[0.8125rem] text-ink">{a.action}</p>
                <p suppressHydrationWarning className="mt-0.5 text-[0.6875rem] text-muted">
                  {a.admin} · {relativeTime(a.at)}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
