"use client";

import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  BatteryLow,
  Compass,
  Copy,
  Megaphone,
  Phone,
  QrCode,
  Radio,
  ScanLine,
  Search,
  ShieldCheck,
  Siren,
  Users,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, Pill } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Avatar, EmptyState, PageHeader, Stat } from "@/components/ui/misc";
import { TextInput } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { SegmentedControl } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { MapCanvas } from "@/components/app/map-canvas";
import { useApp } from "@/lib/store";
import { GROUP_MEMBERS, PILGRIM_GROUP, POIS } from "@/lib/data/map";
import type { MemberStatus } from "@/lib/types";
import { cn } from "@/lib/cn";

const STATUS_META: Record<
  MemberStatus,
  { label: string; tone: "positive" | "info" | "warning" | "danger" }
> = {
  safe: { label: "Safe", tone: "positive" },
  moving: { label: "Moving", tone: "info" },
  resting: { label: "Resting", tone: "warning" },
  assistance: { label: "Needs help", tone: "danger" },
};

type Filter = "all" | MemberStatus;

export default function FindMePage() {
  const { user } = useApp();
  const { toast } = useToast();

  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [tagOpen, setTagOpen] = useState(false);
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [sharing, setSharing] = useState(true);

  const members = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GROUP_MEMBERS.filter(
      (m) =>
        (filter === "all" || m.status === filter) &&
        (!q ||
          m.name.toLowerCase().includes(q) ||
          m.tagCode.toLowerCase().includes(q) ||
          m.zone.toLowerCase().includes(q)),
    );
  }, [filter, query]);

  const needHelp = GROUP_MEMBERS.filter((m) => m.status === "assistance");
  const lowBattery = GROUP_MEMBERS.filter((m) => m.batteryPct < 20);
  const anchorPois = POIS.filter((p) =>
    ["poi-mina-camp", "poi-jamarat", "poi-mina-meeting", "poi-haram"].includes(p.id),
  );

  const tagUrl = `https://hajjpath.ng/found/${user.tagCode ?? "HP-27-0416"}`;

  return (
    <>
      <PageHeader
        title="Find Me"
        description="Everyone in your group, on one map — and a tag that lets any stranger reunite you in seconds."
        action={
          <>
            <Button variant="outline" onClick={() => setTagOpen(true)}>
              <QrCode className="size-4" />
              My tag
            </Button>
            <Button onClick={() => setBroadcastOpen(true)}>
              <Megaphone className="size-4" />
              Alert the group
            </Button>
          </>
        }
      />

      {needHelp.length > 0 ? (
        <Card className="mb-5 border-rose-500/40 bg-rose-50/60 dark:bg-rose-950/25">
          <CardBody className="flex flex-wrap items-center gap-4">
            <span className="grid size-11 shrink-0 animate-[pulse-ring_2s_infinite] place-items-center rounded-xl bg-rose-600 text-white">
              <Siren className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink">
                {needHelp.map((m) => m.name).join(", ")}{" "}
                {needHelp.length === 1 ? "needs" : "need"} assistance
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted">
                Last position near {needHelp[0].zone} · {needHelp[0].lastSeen} · battery{" "}
                {needHelp[0].batteryPct}%. Dr. Amina Lawal has been dispatched.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() =>
                toast({
                  title: `Calling ${needHelp[0].name}`,
                  description: needHelp[0].phone,
                  tone: "info",
                })
              }
            >
              <Phone className="size-3.5" />
              Call now
            </Button>
          </CardBody>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Group members"
          value={PILGRIM_GROUP.memberCount}
          detail={PILGRIM_GROUP.name}
          icon={<Users className="size-4" />}
        />
        <Stat
          label="Sharing location"
          value={GROUP_MEMBERS.length}
          detail="Live positions inside your group code"
          icon={<Radio className="size-4" />}
          tone="positive"
        />
        <Stat
          label="Need assistance"
          value={needHelp.length}
          detail={needHelp.length === 0 ? "Everyone is accounted for" : "Responder dispatched"}
          icon={<Siren className="size-4" />}
          tone={needHelp.length > 0 ? "danger" : "positive"}
        />
        <Stat
          label="Low battery"
          value={lowBattery.length}
          detail="Tags below 20% — remind them to charge"
          icon={<BatteryLow className="size-4" />}
          tone="gold"
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        {/* Map */}
        <Card>
          <CardHeader
            title="Live group positions"
            description={PILGRIM_GROUP.campZone}
            icon={<Compass className="size-4" />}
            action={
              <Badge tone={sharing ? "positive" : "neutral"}>
                {sharing ? "Sharing on" : "Sharing off"}
              </Badge>
            }
          />
          <CardBody className="space-y-4">
            <MapCanvas
              pois={anchorPois}
              members={members}
              showMembers
              onSelect={(p) =>
                toast({ title: p.name, description: p.description, tone: "info" })
              }
            />

            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface-muted/60 p-3.5">
              <ShieldCheck className="size-4 shrink-0 text-forest-700 dark:text-gold-400" />
              <p className="min-w-0 flex-1 text-xs leading-relaxed text-muted">
                Positions are end-to-end encrypted and visible only inside group code{" "}
                <strong className="text-ink">{PILGRIM_GROUP.code}</strong>. History is
                deleted thirty days after you return.
              </p>
              <Button
                variant={sharing ? "outline" : "primary"}
                size="sm"
                onClick={() => {
                  setSharing((s) => !s);
                  toast({
                    title: sharing ? "Location sharing paused" : "Location sharing resumed",
                    description: sharing
                      ? "Your group can no longer see your position."
                      : "Your group can see your position again.",
                    tone: sharing ? "warning" : "success",
                  });
                }}
              >
                {sharing ? "Pause sharing" : "Resume sharing"}
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Member list */}
        <Card>
          <CardHeader
            title="Group members"
            description={`${members.length} shown · led by ${PILGRIM_GROUP.adminName}`}
            icon={<Users className="size-4" />}
          />
          <CardBody className="space-y-3">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
              <TextInput
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, tag or zone"
                className="pl-9"
                aria-label="Search group members"
              />
            </div>
            <SegmentedControl
              size="sm"
              items={[
                { id: "all", label: "All", count: GROUP_MEMBERS.length },
                { id: "safe", label: "Safe" },
                { id: "moving", label: "Moving" },
                { id: "assistance", label: "Help" },
              ]}
              value={filter}
              onChange={(f) => setFilter(f as Filter)}
            />
          </CardBody>

          {members.length === 0 ? (
            <CardBody>
              <EmptyState
                title="No members match"
                description="Try clearing the filter or searching a different name."
              />
            </CardBody>
          ) : (
            <ul className="max-h-96 divide-y divide-line overflow-y-auto">
              {members.map((m) => {
                const meta = STATUS_META[m.status];
                return (
                  <li key={m.id} className="flex items-center gap-3 px-5 py-3.5">
                    <Avatar initials={m.initials} tone={m.avatarTone} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[0.8125rem] font-semibold text-ink">
                        {m.name}
                      </p>
                      <p className="truncate text-[0.6875rem] text-muted">
                        {m.role} · {m.zone} · {m.lastSeen}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className={cn(
                          "tabular text-[0.625rem] font-semibold",
                          m.batteryPct < 20 ? "text-rose-600" : "text-muted",
                        )}
                      >
                        {m.batteryPct}%
                      </span>
                      <Pill tone={meta.tone}>{meta.label}</Pill>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      {/* How it works */}
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {[
          {
            icon: QrCode,
            title: "A tag anyone can scan",
            body: "Your lanyard carries a printed QR code. Whoever finds you scans it with any phone camera — no app required — and reaches your group admin instantly.",
          },
          {
            icon: Radio,
            title: "Bluetooth beacon backup",
            body: "When the network drops, the tag still broadcasts. Any HajjPath user who walks past relays your last position to the group anonymously.",
          },
          {
            icon: ScanLine,
            title: "Scan someone else's tag",
            body: "Found a lost pilgrim? Scan their tag and HajjPath connects you to their admin, shows their language and lists any medical note they chose to share.",
          },
        ].map((f) => (
          <Card key={f.title}>
            <CardBody>
              <span className="grid size-10 place-items-center rounded-xl bg-forest-50 text-forest-800 dark:bg-forest-950 dark:text-gold-300">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-[0.9375rem] font-bold text-ink">{f.title}</h3>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">{f.body}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card className="mt-5">
        <CardBody className="flex flex-wrap items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink">Not carrying a tag yet?</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted">
              Waterproof QR and Bluetooth tags are available from verified vendors and
              delivered to your hotel or tent within five hours.
            </p>
          </div>
          <ButtonLink href="/app/marketplace/prd-061" variant="outline" size="sm">
            Order a Find Me tag
          </ButtonLink>
        </CardBody>
      </Card>

      {/* My tag modal */}
      <Modal
        open={tagOpen}
        onClose={() => setTagOpen(false)}
        title="Your pilgrim tag"
        description="Print it, wear it, and keep it visible at all times in the Mashaer."
        size="sm"
        footer={
          <Button
            onClick={() => {
              navigator.clipboard?.writeText(tagUrl);
              toast({ title: "Tag link copied", tone: "info" });
            }}
          >
            <Copy className="size-4" />
            Copy tag link
          </Button>
        }
      >
        <div className="space-y-5 text-center">
          <div className="mx-auto w-fit rounded-2xl border border-line bg-white p-5">
            <QRCodeSVG value={tagUrl} size={176} level="M" marginSize={0} />
          </div>
          <div>
            <p className="tabular text-xl font-extrabold tracking-[0.12em] text-ink">
              {user.tagCode}
            </p>
            <p className="mt-1 text-sm text-muted">
              {user.firstName} {user.lastName} · {PILGRIM_GROUP.code}
            </p>
          </div>
          <div className="space-y-2 rounded-2xl bg-surface-muted p-4 text-left">
            {[
              ["Group", PILGRIM_GROUP.name],
              ["Camp", PILGRIM_GROUP.campZone],
              ["Admin", PILGRIM_GROUP.adminName],
              ["Emergency line", PILGRIM_GROUP.emergencyLine],
            ].map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between gap-4">
                <span className="text-xs text-muted">{label}</span>
                <span className="text-right text-xs font-semibold text-ink">{value}</span>
              </div>
            ))}
          </div>
          <p className="text-xs leading-relaxed text-muted">
            Scanning this code opens a page with your group admin&apos;s contact details
            and your preferred language. It never reveals your BVN, savings or home
            address.
          </p>
        </div>
      </Modal>

      {/* Broadcast modal */}
      <Modal
        open={broadcastOpen}
        onClose={() => setBroadcastOpen(false)}
        title="Alert your group"
        description="Send your live position to all 48 members and the group admin."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setBroadcastOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setBroadcastOpen(false);
                toast({
                  title: "Alert sent to your group",
                  description:
                    "48 members and Alhaji Kabiru Sule have received your position.",
                });
              }}
            >
              Send alert
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-muted">
            Use this when you are separated from the group but not in danger. Everyone
            receives your position and can come to you.
          </p>
          <div className="rounded-2xl border border-line bg-surface-muted p-4">
            <p className="text-[0.6875rem] font-semibold tracking-wider text-muted uppercase">
              Your current position
            </p>
            <p className="mt-1 text-sm font-semibold text-ink">
              {PILGRIM_GROUP.campZone}
            </p>
            <p className="mt-0.5 text-xs text-muted">
              Accurate to about 12 metres · updated just now
            </p>
          </div>
          <p className="flex items-start gap-2 text-xs leading-relaxed text-muted">
            <Siren className="mt-0.5 size-3.5 shrink-0 text-rose-600" />
            If this is a medical or safety emergency, use the SOS button instead — it
            reaches responders, not just your group.
          </p>
          <ButtonLink href="/app/sos" variant="danger" size="sm" block>
            Open Emergency SOS
          </ButtonLink>
        </div>
      </Modal>
    </>
  );
}
