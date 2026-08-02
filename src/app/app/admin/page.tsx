"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Compass,
  Download,
  Megaphone,
  Phone,
  Search,
  Send,
  ShieldCheck,
  Siren,
  TriangleAlert,
  Users,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Pill } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Avatar, EmptyState, PageHeader, Stat } from "@/components/ui/misc";
import { ProgressBar } from "@/components/ui/progress";
import { Field, Select, TextArea, TextInput } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { SegmentedControl } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { MapCanvas } from "@/components/app/map-canvas";
import { ADMIN_PILGRIMS } from "@/lib/data/comms";
import { GROUP_MEMBERS, PILGRIM_GROUP, POIS } from "@/lib/data/map";
import { initialsOf } from "@/lib/format";
import type { AnnouncementPriority, KycStatus, MemberStatus } from "@/lib/types";
import { cn } from "@/lib/cn";

type Filter = "all" | "attention" | "kyc" | "behind";

const KYC_TONE: Record<KycStatus, "positive" | "warning" | "danger" | "neutral"> = {
  verified: "positive",
  "in-review": "warning",
  rejected: "danger",
  "not-started": "neutral",
};

const STATUS_TONE: Record<MemberStatus, "positive" | "info" | "warning" | "danger"> = {
  safe: "positive",
  moving: "info",
  resting: "warning",
  assistance: "danger",
};

const TONES = [
  "from-forest-700 to-forest-900",
  "from-gold-500 to-gold-700",
  "from-sky-600 to-sky-800",
  "from-violet-600 to-violet-800",
  "from-teal-600 to-teal-800",
  "from-rose-600 to-rose-800",
];

export default function GroupAdminPage() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [broadcast, setBroadcast] = useState({
    title: "",
    body: "",
    priority: "important" as AnnouncementPriority,
  });
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({});

  const pilgrims = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ADMIN_PILGRIMS.filter((p) => {
      if (filter === "attention" && p.status !== "assistance") return false;
      if (filter === "kyc" && p.kyc === "verified") return false;
      if (filter === "behind" && p.savedPct >= 50) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.passport.toLowerCase().includes(q) ||
        p.room.toLowerCase().includes(q)
      );
    });
  }, [filter, query]);

  const needAttention = ADMIN_PILGRIMS.filter((p) => p.status === "assistance").length;
  const kycPending = ADMIN_PILGRIMS.filter((p) => p.kyc !== "verified").length;
  const avgSaved = Math.round(
    ADMIN_PILGRIMS.reduce((s, p) => s + p.savedPct, 0) / ADMIN_PILGRIMS.length,
  );
  const fullyFunded = ADMIN_PILGRIMS.filter((p) => p.savedPct === 100).length;

  const anchorPois = POIS.filter((p) =>
    ["poi-mina-camp", "poi-jamarat", "poi-mina-meeting", "poi-haram"].includes(p.id),
  );

  function sendBroadcast() {
    const next: typeof errors = {};
    if (broadcast.title.trim().length < 5) next.title = "Give the notice a clear title.";
    if (broadcast.body.trim().length < 20)
      next.body = "Write at least a sentence so pilgrims know what to do.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setBroadcastOpen(false);
    setBroadcast({ title: "", body: "", priority: "important" });
    toast({
      title: "Broadcast sent",
      description: `All ${PILGRIM_GROUP.memberCount} pilgrims in ${PILGRIM_GROUP.name} have received it.`,
    });
  }

  function exportManifest() {
    const header = "Name,Passport,KYC,Saved %,Status,Room,Phone\n";
    const rows = ADMIN_PILGRIMS.map((p) =>
      [p.name, p.passport, p.kyc, p.savedPct, p.status, p.room, p.phone].join(","),
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "al-amanah-2027-manifest.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Manifest exported", description: `${ADMIN_PILGRIMS.length} pilgrims.` });
  }

  return (
    <>
      <PageHeader
        title="Group admin"
        description={`${PILGRIM_GROUP.name} · ${PILGRIM_GROUP.operator}`}
        action={
          <>
            <Button variant="outline" onClick={exportManifest}>
              <Download className="size-4" />
              Export manifest
            </Button>
            <Button onClick={() => setBroadcastOpen(true)}>
              <Megaphone className="size-4" />
              Broadcast
            </Button>
          </>
        }
      />

      {needAttention > 0 ? (
        <Card className="mb-5 border-rose-500/40 bg-rose-50/60 dark:bg-rose-950/25">
          <CardBody className="flex flex-wrap items-center gap-4">
            <span className="grid size-11 shrink-0 animate-[pulse-ring_2s_infinite] place-items-center rounded-xl bg-rose-600 text-white">
              <Siren className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink">
                {needAttention} pilgrim{needAttention > 1 ? "s" : ""} requesting assistance
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted">
                Open Find Me to see live positions and dispatch the nearest medic.
              </p>
            </div>
            <ButtonLink href="/app/find-me" variant="danger" size="sm">
              <Compass className="size-3.5" />
              Locate now
            </ButtonLink>
          </CardBody>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Pilgrims in group"
          value={PILGRIM_GROUP.memberCount}
          detail={PILGRIM_GROUP.campZone}
          icon={<Users className="size-4" />}
        />
        <Stat
          label="Need attention"
          value={needAttention}
          detail={needAttention === 0 ? "Everyone accounted for" : "Responders dispatched"}
          icon={<TriangleAlert className="size-4" />}
          tone={needAttention > 0 ? "danger" : "positive"}
        />
        <Stat
          label="KYC outstanding"
          value={kycPending}
          detail="Must clear before the manifest is submitted"
          icon={<BadgeCheck className="size-4" />}
          tone="gold"
        />
        <Stat
          label="Average funded"
          value={`${avgSaved}%`}
          detail={`${fullyFunded} pilgrim(s) fully funded`}
          icon={<ShieldCheck className="size-4" />}
          tone="info"
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        {/* Live map */}
        <Card>
          <CardHeader
            title="Live group positions"
            description={`${GROUP_MEMBERS.length} sharing location`}
            icon={<Compass className="size-4" />}
            action={
              <ButtonLink href="/app/find-me" variant="ghost" size="sm">
                Open Find Me
              </ButtonLink>
            }
          />
          <CardBody>
            <MapCanvas pois={anchorPois} members={GROUP_MEMBERS} showMembers />
            <div className="mt-4 space-y-2">
              {(["safe", "moving", "resting", "assistance"] as MemberStatus[]).map((s) => {
                const count = GROUP_MEMBERS.filter((m) => m.status === s).length;
                return (
                  <div key={s} className="flex items-center gap-3">
                    <Pill tone={STATUS_TONE[s]}>{s}</Pill>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-muted">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          s === "assistance"
                            ? "bg-rose-500"
                            : s === "resting"
                              ? "bg-amber-500"
                              : s === "moving"
                                ? "bg-sky-500"
                                : "bg-emerald-500",
                        )}
                        style={{
                          width: `${(count / GROUP_MEMBERS.length) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="tabular w-6 text-right text-xs font-semibold text-ink">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        {/* Manifest */}
        <Card>
          <CardHeader
            title="Pilgrim manifest"
            description={`${pilgrims.length} of ${ADMIN_PILGRIMS.length} pilgrims shown`}
            icon={<Users className="size-4" />}
          />
          <CardBody className="space-y-3 pb-0">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
              <TextInput
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, passport or room"
                className="pl-9"
                aria-label="Search pilgrims"
              />
            </div>
            <SegmentedControl
              size="sm"
              items={[
                { id: "all", label: "All", count: ADMIN_PILGRIMS.length },
                { id: "attention", label: "Attention", count: needAttention },
                { id: "kyc", label: "KYC", count: kycPending },
                {
                  id: "behind",
                  label: "Behind",
                  count: ADMIN_PILGRIMS.filter((p) => p.savedPct < 50).length,
                },
              ]}
              value={filter}
              onChange={(f) => setFilter(f as Filter)}
            />
          </CardBody>

          {pilgrims.length === 0 ? (
            <CardBody>
              <EmptyState
                title="No pilgrims match"
                description="Try clearing the filter or searching a different name."
              />
            </CardBody>
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {pilgrims.map((p, i) => {
                const [first, ...rest] = p.name.split(" ");
                return (
                  <li key={p.id} className="flex items-center gap-3 px-5 py-3.5">
                    <Avatar
                      initials={initialsOf(first, rest.join(" ") || first)}
                      tone={TONES[i % TONES.length]}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-[0.8125rem] font-semibold text-ink">
                          {p.name}
                        </p>
                        <Pill tone={KYC_TONE[p.kyc]}>{p.kyc}</Pill>
                        <Pill tone={STATUS_TONE[p.status]}>{p.status}</Pill>
                      </div>
                      <p className="tabular truncate text-[0.6875rem] text-muted">
                        {p.passport} · {p.room}
                      </p>
                      <ProgressBar
                        value={p.savedPct}
                        className="mt-1.5"
                        tone={
                          p.savedPct >= 80
                            ? "positive"
                            : p.savedPct >= 50
                              ? "brand"
                              : "warning"
                        }
                      />
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className="tabular text-xs font-bold text-ink">
                        {p.savedPct}%
                      </span>
                      <a
                        href={`tel:${p.phone}`}
                        aria-label={`Call ${p.name}`}
                        className="grid size-8 place-items-center rounded-lg border border-line text-muted transition hover:border-forest-800/30 hover:text-ink"
                      >
                        <Phone className="size-3.5" />
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      {/* Group details */}
      <Card className="mt-5">
        <CardHeader
          title="Group details"
          description="Shared with every pilgrim in the manifest."
          icon={<ShieldCheck className="size-4" />}
        />
        <CardBody className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Group code", PILGRIM_GROUP.code],
            ["Operator", PILGRIM_GROUP.operator],
            ["Camp zone", PILGRIM_GROUP.campZone],
            ["Emergency line", PILGRIM_GROUP.emergencyLine],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-surface-muted p-4">
              <p className="text-[0.6875rem] font-semibold tracking-wider text-muted uppercase">
                {label}
              </p>
              <p className="mt-1 text-[0.8125rem] font-bold text-ink">{value}</p>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Broadcast modal */}
      <Modal
        open={broadcastOpen}
        onClose={() => setBroadcastOpen(false)}
        title="Broadcast to your group"
        description={`Reaches all ${PILGRIM_GROUP.memberCount} pilgrims immediately.`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setBroadcastOpen(false)}>
              Cancel
            </Button>
            <Button onClick={sendBroadcast}>
              <Send className="size-4" />
              Send broadcast
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Priority" htmlFor="bc-priority">
            <Select
              id="bc-priority"
              value={broadcast.priority}
              onChange={(e) =>
                setBroadcast((b) => ({
                  ...b,
                  priority: e.target.value as AnnouncementPriority,
                }))
              }
            >
              <option value="critical">Critical — safety or deadline</option>
              <option value="important">Important — action needed</option>
              <option value="info">Information — no action needed</option>
            </Select>
          </Field>

          <Field label="Title" required error={errors.title} htmlFor="bc-title">
            <TextInput
              id="bc-title"
              value={broadcast.title}
              onChange={(e) => {
                setBroadcast((b) => ({ ...b, title: e.target.value }));
                setErrors((x) => ({ ...x, title: undefined }));
              }}
              placeholder="Coach departs for Mina at 07:30 sharp"
              invalid={Boolean(errors.title)}
            />
          </Field>

          <Field label="Message" required error={errors.body} htmlFor="bc-body">
            <TextArea
              id="bc-body"
              value={broadcast.body}
              onChange={(e) => {
                setBroadcast((b) => ({ ...b, body: e.target.value }));
                setErrors((x) => ({ ...x, body: undefined }));
              }}
              placeholder="Be at the Al-Amanah banner by 07:15 in Ihram. Bring your water bottle and your pebble pouch."
              rows={5}
            />
          </Field>

          <div className="flex items-start gap-3 rounded-xl border border-line bg-surface-muted p-3.5">
            <Megaphone className="mt-0.5 size-4 shrink-0 text-forest-700 dark:text-gold-400" />
            <p className="text-xs leading-relaxed text-muted">
              Critical notices are pinned to the top of every pilgrim&apos;s announcements
              page and pushed as a notification. They remain readable offline once
              delivered.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
