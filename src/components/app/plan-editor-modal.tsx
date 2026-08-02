"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Field, RadioCard, Select, Switch, TextInput } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { useApp } from "@/lib/store";
import { HAJJ_PACKAGES } from "@/lib/data/packages";
import { BANKS } from "@/lib/data/account";
import {
  DEPARTURE_DATES,
  FREQUENCY_LABEL,
  FREQUENCY_SUFFIX,
  cyclesRemaining,
  requiredPerCycle,
} from "@/lib/savings";
import { formatDate, naira } from "@/lib/format";
import type { PlanFrequency, SavingsPlan, TravelYear } from "@/lib/types";

const RELATIONSHIPS: SavingsPlan["relationship"][] = [
  "Self",
  "Spouse",
  "Parent",
  "Child",
  "Sibling",
  "Other",
];

export function PlanEditorModal({
  open,
  onClose,
  plan,
}: {
  open: boolean;
  onClose: () => void;
  /** Omit to create a new plan. */
  plan?: SavingsPlan;
}) {
  /* Mounted only while open, and keyed on the plan, so the form always starts
     from the right values without an effect to reset it. */
  if (!open) return null;
  return <PlanEditorForm key={plan?.id ?? "new"} onClose={onClose} plan={plan} />;
}

function PlanEditorForm({
  onClose,
  plan,
}: {
  onClose: () => void;
  plan?: SavingsPlan;
}) {
  const { addPlan, updatePlan } = useApp();
  const { toast } = useToast();

  const [beneficiaryName, setBeneficiaryName] = useState(plan?.beneficiaryName ?? "");
  const [relationship, setRelationship] = useState<SavingsPlan["relationship"]>(
    plan?.relationship ?? "Parent",
  );
  const [packageId, setPackageId] = useState(plan?.packageId ?? HAJJ_PACKAGES[0].id);
  const [travelYear, setTravelYear] = useState<TravelYear>(plan?.travelYear ?? 2027);
  const [frequency, setFrequency] = useState<PlanFrequency>(plan?.frequency ?? "monthly");
  const [amount, setAmount] = useState<number | null>(plan?.amountPerCycle ?? null);
  const [bankName, setBankName] = useState(plan?.bankName ?? BANKS[0]);
  const [autoDebit, setAutoDebit] = useState(plan?.autoDebit ?? true);
  const [openingDeposit, setOpeningDeposit] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ beneficiaryName?: string; amount?: string }>({});

  const pkg = HAJJ_PACKAGES.find((p) => p.id === packageId) ?? HAJJ_PACKAGES[0];
  const departure = DEPARTURE_DATES[travelYear];
  const balance = plan?.balance ?? openingDeposit ?? 0;
  const suggested = requiredPerCycle(pkg.priceNGN, balance, frequency, departure);
  const cycles = cyclesRemaining(frequency, departure);

  function save() {
    const next: typeof errors = {};
    if (beneficiaryName.trim().length < 3)
      next.beneficiaryName = "Enter the full name of the beneficiary.";
    const value = amount ?? suggested;
    if (value < 5000) next.amount = "The minimum contribution is ₦5,000.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (plan) {
      updatePlan(plan.id, {
        beneficiaryName: beneficiaryName.trim(),
        relationship,
        packageId,
        travelYear,
        frequency,
        amountPerCycle: value,
        bankName,
        autoDebit,
      });
      toast({
        title: "Plan updated",
        description: `${beneficiaryName.trim()} · ${naira(value)}${FREQUENCY_SUFFIX[frequency]} towards ${travelYear}.`,
      });
    } else {
      addPlan({
        beneficiaryName: beneficiaryName.trim(),
        relationship,
        packageId,
        travelYear,
        frequency,
        amountPerCycle: value,
        bankName,
        autoDebit,
        openingDeposit: openingDeposit ?? 0,
      });
      toast({
        title: "Plan created",
        description: `${beneficiaryName.trim()} is now saving towards ${pkg.name}.`,
      });
    }
    onClose();
  }

  return (
    <Modal
      open={true}
      onClose={onClose}
      size="lg"
      title={plan ? "Edit savings plan" : "Create a new plan"}
      description={
        plan
          ? "Changes take effect from your next contribution cycle."
          : "Save for a parent, spouse, child or sibling under the same verified account."
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>{plan ? "Save changes" : "Create plan"}</Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Beneficiary full name"
            required
            error={errors.beneficiaryName}
            htmlFor="pe-name"
          >
            <TextInput
              id="pe-name"
              value={beneficiaryName}
              onChange={(e) => {
                setBeneficiaryName(e.target.value);
                setErrors((x) => ({ ...x, beneficiaryName: undefined }));
              }}
              placeholder="Sekinat Adetunji"
              invalid={Boolean(errors.beneficiaryName)}
            />
          </Field>
          <Field label="Relationship" htmlFor="pe-rel">
            <Select
              id="pe-rel"
              value={relationship}
              onChange={(e) =>
                setRelationship(e.target.value as SavingsPlan["relationship"])
              }
            >
              {RELATIONSHIPS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="space-y-2.5">
          <p className="text-[0.8125rem] font-medium text-ink">Package</p>
          {HAJJ_PACKAGES.map((p) => (
            <RadioCard
              key={p.id}
              checked={p.id === packageId}
              onSelect={() => {
                setPackageId(p.id);
                setAmount(null);
              }}
              title={p.name}
              description={p.hotelDistance}
              meta={
                <span className="tabular text-sm font-bold text-ink">
                  {naira(p.priceNGN)}
                </span>
              }
            />
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Travel year" htmlFor="pe-year">
            <Select
              id="pe-year"
              value={travelYear}
              onChange={(e) => {
                setTravelYear(Number(e.target.value) as TravelYear);
                setAmount(null);
              }}
            >
              {([2026, 2027, 2028] as TravelYear[]).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Frequency" htmlFor="pe-freq">
            <Select
              id="pe-freq"
              value={frequency}
              onChange={(e) => {
                setFrequency(e.target.value as PlanFrequency);
                setAmount(null);
              }}
            >
              {(["weekly", "monthly", "quarterly"] as PlanFrequency[]).map((f) => (
                <option key={f} value={f}>
                  {FREQUENCY_LABEL[f]}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        {!plan ? (
          <Field
            label="Opening deposit"
            hint="Optional. Anything you already have set aside for this beneficiary."
            htmlFor="pe-open"
          >
            <TextInput
              id="pe-open"
              prefix="₦"
              inputMode="numeric"
              value={openingDeposit === null ? "" : String(openingDeposit)}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "");
                setOpeningDeposit(digits ? Number(digits) : null);
                setAmount(null);
              }}
              placeholder="0"
            />
          </Field>
        ) : null}

        <div className="rounded-2xl border border-forest-700/30 bg-forest-50 p-4 dark:bg-forest-950/50">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-[0.8125rem] font-semibold text-ink">
              Suggested contribution
            </p>
            <p suppressHydrationWarning className="tabular text-lg font-extrabold text-ink">
              {naira(suggested)}
              <span className="text-sm font-medium text-muted">
                {FREQUENCY_SUFFIX[frequency]}
              </span>
            </p>
          </div>
          <p suppressHydrationWarning className="mt-1 text-xs leading-relaxed text-muted">
            {cycles} contributions before the {formatDate(departure)} airlift, closing the
            remaining {naira(Math.max(0, pkg.priceNGN - balance))}.
          </p>
        </div>

        <Field label="Your contribution" error={errors.amount} htmlFor="pe-amount">
          <TextInput
            id="pe-amount"
            prefix="₦"
            inputMode="numeric"
            value={amount === null ? "" : String(amount)}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "");
              setAmount(digits ? Number(digits) : null);
              setErrors((x) => ({ ...x, amount: undefined }));
            }}
            placeholder={String(suggested)}
            invalid={Boolean(errors.amount)}
          />
        </Field>

        <Field label="Funding bank" htmlFor="pe-bank">
          <Select
            id="pe-bank"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          >
            {BANKS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </Select>
        </Field>

        <div className="rounded-2xl border border-line bg-surface p-4">
          <Switch
            checked={autoDebit}
            onChange={setAutoDebit}
            label="Standing order"
            description="Collect automatically on the 28th of each month from the funding bank."
          />
        </div>
      </div>
    </Modal>
  );
}
