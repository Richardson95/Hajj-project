"use client";

import { useMemo, useState } from "react";
import { CircleCheck, MapPin, Siren, UserRoundCheck } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { Pill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader, Stat } from "@/components/ui/misc";
import { Field, TextInput } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { SegmentedControl } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { Icon } from "@/components/icon";
import { SosPill } from "@/components/ops/ops-ui";
import {
  usePlatformActions,
  usePlatformSos,
  type SosRow,
} from "@/components/ops/use-platform";
import { SOS_CATEGORY_META } from "@/lib/data/comms";
import { formatDateTime, relativeTime } from "@/lib/format";
import type { SosStatus } from "@/lib/ops/types";
import { cn } from "@/lib/cn";

type Filter = "active" | "resolved" | "all";

export default function OpsSosPage() {
  const alerts = usePlatformSos();
  const [filter, setFilter] = useState<Filter>("active");
  const [acting, setActing] = useState<{ alert: SosRow; status: SosStatus } | null>(null);

  const visible = useMemo(
    () =>
      alerts.filter((a) =>
        filter === "all" ? true : filter === "active" ? a.status !== "resolved" : a.status === "resolved",
      ),
    [alerts, filter],
  );

  const fresh = alerts.filter((a) => a.status === "dispatched").length;
  const inProgress = alerts.filter((a) => a.status === "acknowledged").length;
  const resolved = alerts.filter((a) => a.status === "resolved").length;

  return (
    <>
      <PageHeader
        title="SOS monitor"
        description="Live emergency alerts from every group. Assign a responder, then close the alert once the pilgrim is safe."
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <Stat label="New alerts" value={fresh} detail="No responder yet" icon={<Siren className="size-4" />} tone="danger" />
        <Stat label="In progress" value={inProgress} detail="Responder on the way" icon={<UserRoundCheck className="size-4" />} tone="gold" />
        <Stat label="Resolved" value={resolved} detail="Pilgrim confirmed safe" icon={<CircleCheck className="size-4" />} tone="positive" />
      </div>

      <SegmentedControl
        items={[
          { id: "active", label: "Active", count: fresh + inProgress },
          { id: "resolved", label: "Resolved", count: resolved },
          { id: "all", label: "All", count: alerts.length },
        ]}
        value={filter}
        onChange={setFilter}
        size="sm"
        className="mb-4 w-fit"
      />

      {visible.length === 0 ? (
        <EmptyState icon={<Siren className="size-6" />} title="No alerts" description="Every pilgrim is accounted for." />
      ) : (
        <div className="space-y-3">
          {visible.map((a) => {
            const meta = SOS_CATEGORY_META.find((m) => m.id === a.category);
            return (
              <Card
                key={a.id}
                className={cn(a.status === "dispatched" && "border-rose-500/50 bg-rose-50/40 dark:bg-rose-950/20")}
              >
                <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <span
                    className={cn(
                      "grid size-11 shrink-0 place-items-center rounded-xl",
                      a.status === "resolved"
                        ? "bg-surface-muted text-muted"
                        : "bg-rose-600 text-white",
                    )}
                  >
                    {meta ? <Icon name={meta.icon} className="size-5" /> : <Siren className="size-5" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-ink">{a.pilgrim}</p>
                      <SosPill status={a.status} />
                      <Pill tone="neutral">{meta?.label ?? a.category}</Pill>
                      {a.live ? <Pill tone="brand">Demo pilgrim account</Pill> : null}
                    </div>
                    <p className="mt-1 text-xs text-muted">{a.group}</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink/85">{a.note}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-3.5" />
                        {a.location}
                      </span>
                      <span suppressHydrationWarning>
                        {formatDateTime(a.raisedAt)} · {relativeTime(a.raisedAt)}
                      </span>
                    </div>
                    <p className="mt-2 text-xs font-medium text-ink/75">Responder: {a.respondent}</p>
                  </div>
                  {a.status !== "resolved" ? (
                    <div className="flex shrink-0 gap-2 sm:flex-col">
                      {a.status === "dispatched" ? (
                        <Button size="sm" variant="danger" onClick={() => setActing({ alert: a, status: "acknowledged" })}>
                          <UserRoundCheck className="size-4" />
                          Assign responder
                        </Button>
                      ) : null}
                      <Button size="sm" variant="outline" onClick={() => setActing({ alert: a, status: "resolved" })}>
                        <CircleCheck className="size-4" />
                        Mark safe
                      </Button>
                    </div>
                  ) : null}
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      {acting ? (
        <RespondModal alert={acting.alert} status={acting.status} onClose={() => setActing(null)} />
      ) : null}
    </>
  );
}

function RespondModal({
  alert,
  status,
  onClose,
}: {
  alert: SosRow;
  status: SosStatus;
  onClose: () => void;
}) {
  const { respondSos } = usePlatformActions();
  const { toast } = useToast();
  const resolving = status === "resolved";
  const [respondent, setRespondent] = useState("");
  const [error, setError] = useState<string | null>(null);

  function confirm() {
    if (respondent.trim().length < 4) {
      setError(resolving ? "Record how it was resolved." : "Name the responder or team.");
      return;
    }
    respondSos(alert, status, respondent);
    toast({
      title: resolving ? `${alert.pilgrim} marked safe` : "Responder assigned",
      description: resolving ? undefined : `${alert.pilgrim} has been told help is on the way.`,
    });
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={resolving ? "Mark pilgrim safe" : "Assign a responder"}
      description={`${alert.pilgrim} · ${alert.location}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant={resolving ? "primary" : "danger"} onClick={confirm}>
            Confirm
          </Button>
        </>
      }
    >
      <Field
        label={resolving ? "Outcome" : "Responder"}
        required
        error={error ?? undefined}
        htmlFor="sos-respondent"
        hint={resolving ? "e.g. Red Crescent team 9 · treated on site" : "e.g. Group admin Kabiru Sule en route"}
      >
        <TextInput
          id="sos-respondent"
          value={respondent}
          onChange={(e) => {
            setRespondent(e.target.value);
            setError(null);
          }}
        />
      </Field>
    </Modal>
  );
}
