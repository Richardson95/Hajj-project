"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Headset, Pause, Play, Search, Wallet } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { Pill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataRow, EmptyState, PageHeader, Stat } from "@/components/ui/misc";
import { Field, Select, TextInput } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress";
import { SegmentedControl } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { OpsTable, TD } from "@/components/ops/ops-ui";
import {
  usePlatformActions,
  usePlatformPlans,
  type PlanRow,
} from "@/components/ops/use-platform";
import { usePackages } from "@/lib/catalog";
import { FREQUENCY_SUFFIX, progressPct } from "@/lib/savings";
import { compactNaira, naira } from "@/lib/format";
import type { PlanStatus, TravelYear } from "@/lib/types";

type Filter = "all" | "active" | "paused";
const YEARS: TravelYear[] = [2026, 2027, 2028];

export default function OpsPlansPage() {
  const { packageById } = usePackages();
  const plans = usePlatformPlans();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [managingId, setManagingId] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return plans.filter(
      (p) =>
        (filter === "all" || p.status === filter) &&
        (!q ||
          p.ownerName.toLowerCase().includes(q) ||
          p.beneficiaryName.toLowerCase().includes(q)),
    );
  }, [plans, filter, query]);

  const total = plans.reduce((s, p) => s + p.balance, 0);
  const paused = plans.filter((p) => p.status === "paused").length;
  const managing = plans.find((p) => p.id === managingId) ?? null;

  return (
    <>
      <PageHeader
        title="Savings plans"
        description="Every plan on the platform. Pause, resume or move a plan's travel year when a pilgrim asks."
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <Stat label="Plans" value={plans.length} detail={`${plans.length - paused} active`} icon={<Wallet className="size-4" />} />
        <Stat label="Total saved" value={compactNaira(total)} detail="Across every plan" icon={<Wallet className="size-4" />} tone="gold" />
        <Stat label="Paused" value={paused} detail="Contributions on hold" icon={<Pause className="size-4" />} tone="info" />
      </div>

      <Card>
        <CardBody className="flex flex-col gap-3 border-b border-line md:flex-row md:items-center md:justify-between">
          <SegmentedControl
            items={[
              { id: "all", label: "All", count: plans.length },
              { id: "active", label: "Active", count: plans.filter((p) => p.status === "active").length },
              { id: "paused", label: "Paused", count: paused },
            ]}
            value={filter}
            onChange={setFilter}
            size="sm"
          />
          <div className="relative md:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
            <TextInput
              aria-label="Search plans"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Owner or beneficiary"
              className="pl-10"
            />
          </div>
        </CardBody>

        {visible.length === 0 ? (
          <div className="p-5">
            <EmptyState icon={<Wallet className="size-6" />} title="No plans match" />
          </div>
        ) : (
          <OpsTable head={["Beneficiary", "Package", "Year", "Contribution", "Saved", "Status", ""]}>
            {visible.map((p) => {
              const pkg = packageById(p.packageId);
              const pct = progressPct(p.balance, pkg.priceNGN);
              return (
                <tr key={p.id} className="hover:bg-surface-muted/50">
                  <td className={TD}>
                    <p className="font-semibold text-ink">{p.beneficiaryName}</p>
                    <p className="text-xs text-muted">
                      Owner: {p.ownerName}
                      {p.live ? " · demo account" : ""}
                    </p>
                  </td>
                  <td className={`${TD} text-muted`}>{pkg.name}</td>
                  <td className={`${TD} tabular`}>{p.travelYear}</td>
                  <td className={`${TD} tabular whitespace-nowrap`}>
                    {naira(p.amountPerCycle)}
                    <span className="text-xs text-muted">{FREQUENCY_SUFFIX[p.frequency]}</span>
                  </td>
                  <td className={`${TD} min-w-40`}>
                    <p className="tabular text-xs font-semibold text-ink">{naira(p.balance)}</p>
                    <ProgressBar value={pct} className="mt-1.5" />
                  </td>
                  <td className={TD}>
                    <Pill tone={p.status === "active" ? "positive" : p.status === "paused" ? "warning" : "neutral"}>
                      {p.status}
                    </Pill>
                  </td>
                  <td className={`${TD} text-right`}>
                    <Button size="sm" variant="outline" onClick={() => setManagingId(p.id)}>
                      Manage
                    </Button>
                  </td>
                </tr>
              );
            })}
          </OpsTable>
        )}
      </Card>

      <ManageModal plan={managing} onClose={() => setManagingId(null)} />
    </>
  );
}

function ManageModal({ plan, onClose }: { plan: PlanRow | null; onClose: () => void }) {
  if (!plan) return null;
  return <ManageForm plan={plan} onClose={onClose} />;
}

function ManageForm({ plan, onClose }: { plan: PlanRow; onClose: () => void }) {
  const { packageById } = usePackages();
  const { changePlan } = usePlatformActions();
  const { toast } = useToast();
  const [status, setStatus] = useState<PlanStatus>(plan.status);
  const [year, setYear] = useState<TravelYear>(plan.travelYear);
  const pkg = packageById(plan.packageId);
  const canToggle = plan.status === "active" || plan.status === "paused";
  const dirty = status !== plan.status || year !== plan.travelYear;

  function save() {
    changePlan(plan, { status, travelYear: year });
    toast({ title: "Plan updated", description: `${plan.beneficiaryName}'s plan has been saved.` });
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={`Plan for ${plan.beneficiaryName}`}
      description={`Owner: ${plan.ownerName}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save} disabled={!dirty}>
            Save changes
          </Button>
        </>
      }
    >
      <dl>
        <DataRow label="Package" value={pkg.name} />
        <DataRow label="Target" value={naira(pkg.priceNGN)} />
        <DataRow label="Saved" value={`${naira(plan.balance)} (${progressPct(plan.balance, pkg.priceNGN).toFixed(0)}%)`} />
        <DataRow label="Contribution" value={`${naira(plan.amountPerCycle)}${FREQUENCY_SUFFIX[plan.frequency]}`} />
      </dl>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Contributions">
          {canToggle ? (
            <Button
              variant="outline"
              block
              onClick={() => setStatus((s) => (s === "paused" ? "active" : "paused"))}
            >
              {status === "paused" ? <Play className="size-4" /> : <Pause className="size-4" />}
              {status === "paused" ? "Paused (click to resume)" : "Active (click to pause)"}
            </Button>
          ) : (
            <p className="text-sm text-muted capitalize">{plan.status}</p>
          )}
        </Field>
        <Field label="Travel year" htmlFor="plan-year">
          <Select
            id="plan-year"
            value={year}
            onChange={(e) => setYear(Number(e.target.value) as TravelYear)}
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-xl bg-surface-muted p-3.5">
        <Headset className="mt-0.5 size-4 shrink-0 text-forest-700 dark:text-gold-400" />
        <p className="text-xs leading-relaxed text-muted">
          If the pilgrim can no longer travel at all, handle it through their conversation
          in the{" "}
          <Link href="/ops/support" className="font-semibold text-forest-800 underline dark:text-gold-300">
            support inbox
          </Link>
          .
        </p>
      </div>
    </Modal>
  );
}
