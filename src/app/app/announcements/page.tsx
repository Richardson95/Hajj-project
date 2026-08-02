"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  Megaphone,
  Pin,
  Search,
  Share2,
  TriangleAlert,
  Users,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, Pill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, EmptyState, PageHeader, Stat } from "@/components/ui/misc";
import { TextInput } from "@/components/ui/field";
import { SegmentedControl } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { ANNOUNCEMENTS } from "@/lib/data/comms";
import { PILGRIM_GROUP } from "@/lib/data/map";
import { formatDateTime, initialsOf, relativeTime } from "@/lib/format";
import type { AnnouncementPriority } from "@/lib/types";
import { cn } from "@/lib/cn";

type Filter = "all" | AnnouncementPriority;

const PRIORITY_META: Record<
  AnnouncementPriority,
  { label: string; tone: "danger" | "warning" | "info"; ring: string }
> = {
  critical: {
    label: "Critical",
    tone: "danger",
    ring: "border-rose-500/40 bg-rose-50/50 dark:bg-rose-950/25",
  },
  important: {
    label: "Important",
    tone: "warning",
    ring: "border-amber-500/40 bg-amber-50/40 dark:bg-amber-950/20",
  },
  info: { label: "Information", tone: "info", ring: "" },
};

export default function AnnouncementsPage() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ANNOUNCEMENTS.filter(
      (a) =>
        (filter === "all" || a.priority === filter) &&
        (!q ||
          a.title.toLowerCase().includes(q) ||
          a.body.toLowerCase().includes(q) ||
          a.author.toLowerCase().includes(q)),
    ).sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [filter, query]);

  const critical = ANNOUNCEMENTS.filter((a) => a.priority === "critical").length;
  const pinned = ANNOUNCEMENTS.filter((a) => a.pinned).length;

  return (
    <>
      <PageHeader
        title="Announcements"
        description="Broadcasts from NAHCON, your operator and your group admin — pinned by priority, readable offline."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="Total notices"
          value={ANNOUNCEMENTS.length}
          detail="Across all your audiences"
          icon={<Megaphone className="size-4" />}
        />
        <Stat
          label="Critical"
          value={critical}
          detail="Read these before anything else"
          icon={<TriangleAlert className="size-4" />}
          tone="danger"
        />
        <Stat
          label="Pinned"
          value={pinned}
          detail="Stay at the top until resolved"
          icon={<Pin className="size-4" />}
          tone="gold"
        />
      </div>

      <Card className="mt-5">
        <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SegmentedControl
            size="sm"
            items={[
              { id: "all", label: "All", count: ANNOUNCEMENTS.length },
              { id: "critical", label: "Critical", count: critical },
              {
                id: "important",
                label: "Important",
                count: ANNOUNCEMENTS.filter((a) => a.priority === "important").length,
              },
              {
                id: "info",
                label: "Information",
                count: ANNOUNCEMENTS.filter((a) => a.priority === "info").length,
              },
            ]}
            value={filter}
            onChange={(f) => setFilter(f as Filter)}
            className="sm:w-auto"
          />
          <div className="relative sm:ml-auto sm:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
            <TextInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search announcements"
              className="pl-9"
              aria-label="Search announcements"
            />
          </div>
        </CardBody>
      </Card>

      {visible.length === 0 ? (
        <EmptyState
          className="mt-5"
          icon={<Bell className="size-6" />}
          title="Nothing here"
          description="No announcements match this filter. Try clearing your search."
        />
      ) : (
        <div className="mt-5 space-y-4">
          {visible.map((a) => {
            const meta = PRIORITY_META[a.priority];
            const [first, ...rest] = a.author.replace(/^Alhaji\s+/, "").split(" ");
            return (
              <Card key={a.id} className={cn(meta.ring)}>
                <CardBody>
                  <div className="flex flex-wrap items-start gap-3">
                    <Avatar
                      initials={initialsOf(first, rest.join(" ") || first)}
                      tone={
                        a.priority === "critical"
                          ? "from-rose-600 to-rose-800"
                          : a.priority === "important"
                            ? "from-gold-500 to-gold-700"
                            : "from-forest-700 to-forest-900"
                      }
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Pill tone={meta.tone}>{meta.label}</Pill>
                        {a.pinned ? (
                          <Pill tone="neutral" icon={<Pin className="size-3" />}>
                            Pinned
                          </Pill>
                        ) : null}
                        <span
                          suppressHydrationWarning
                          className="text-[0.6875rem] text-muted"
                        >
                          {relativeTime(a.date)}
                        </span>
                      </div>
                      <h2 className="mt-2 text-base font-bold text-ink">{a.title}</h2>
                      <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                        {a.body}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-4">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-ink">{a.author}</p>
                      <p className="truncate text-[0.6875rem] text-muted">
                        {a.authorRole} · <span suppressHydrationWarning>{formatDateTime(a.date)}</span>
                      </p>
                    </div>
                    <Badge tone="neutral" className="ml-auto">
                      {a.audience}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard?.writeText(`${a.title}\n\n${a.body}\n\n— ${a.author}, ${a.authorRole}`);
                        toast({ title: "Announcement copied", tone: "info" });
                      }}
                    >
                      <Share2 className="size-3.5" />
                      Share
                    </Button>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="mt-6">
        <CardHeader
          title="Who can broadcast to you"
          description="Only verified authorities appear here — there is no open posting."
          icon={<Users className="size-4" />}
        />
        <CardBody className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "NAHCON",
              body: "National directives on health requirements, fares, airlift schedules and Saudi regulation changes.",
            },
            {
              title: PILGRIM_GROUP.operator,
              body: "Your licensed operator — camp allocations, transport timings and group logistics.",
            },
            {
              title: `${PILGRIM_GROUP.adminName}, Group Admin`,
              body: "Day-to-day instructions for the 48 pilgrims in your group while you are in the Kingdom.",
            },
          ].map((s) => (
            <div key={s.title} className="rounded-2xl bg-surface-muted p-4">
              <p className="text-[0.8125rem] font-bold text-ink">{s.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
        </CardBody>
      </Card>
    </>
  );
}
