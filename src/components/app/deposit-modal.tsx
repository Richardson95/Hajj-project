"use client";

import { useMemo, useState } from "react";
import { Banknote, Copy, CreditCard, Landmark, Smartphone } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Field, RadioCard, Select, TextInput } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { useApp } from "@/lib/store";
import { VIRTUAL_ACCOUNT } from "@/lib/data/account";
import { packageById } from "@/lib/data/packages";
import { naira } from "@/lib/format";
import type { Transaction } from "@/lib/types";

const CHANNELS: {
  id: Transaction["channel"];
  label: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: "Virtual Account",
    label: "Bank transfer",
    detail: "Send to your dedicated HajjPath account number.",
    icon: Landmark,
  },
  {
    id: "Card",
    label: "Debit card",
    detail: "Pay instantly with a Nigerian debit card.",
    icon: CreditCard,
  },
  {
    id: "USSD",
    label: "USSD",
    detail: "Dial a short code from any phone, no data needed.",
    icon: Smartphone,
  },
];

const QUICK = [25_000, 50_000, 100_000, 250_000, 500_000];

export function DepositModal({
  open,
  onClose,
  planId,
}: {
  open: boolean;
  onClose: () => void;
  planId?: string;
}) {
  /* Mounted only while open, so the form resets itself with no effect. */
  if (!open) return null;
  return <DepositForm onClose={onClose} planId={planId} />;
}

function DepositForm({
  onClose,
  planId,
}: {
  onClose: () => void;
  planId?: string;
}) {
  const { plans, deposit } = useApp();
  const { toast } = useToast();

  const activePlans = useMemo(
    () => plans.filter((p) => p.status !== "completed"),
    [plans],
  );
  const fallbackId = activePlans[0]?.id ?? plans[0]?.id ?? "";

  const [selectedPlan, setSelectedPlan] = useState(planId ?? fallbackId);
  const [amount, setAmount] = useState<number | null>(null);
  const [channel, setChannel] = useState<Transaction["channel"]>("Virtual Account");
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  const plan = plans.find((p) => p.id === selectedPlan);
  const target = plan ? packageById(plan.packageId).priceNGN : 0;
  const remaining = plan ? Math.max(0, target - plan.balance) : 0;

  function confirm() {
    if (!plan) return;
    if (!amount || amount < 1000) {
      setError("The minimum deposit is ₦1,000.");
      return;
    }
    setBusy(true);
    window.setTimeout(() => {
      deposit(plan.id, amount, channel);
      setBusy(false);
      toast({
        title: `${naira(amount)} added to your plan`,
        description: `${plan.beneficiaryName} · ${channel}. Your tracker has been updated.`,
      });
      onClose();
    }, 700);
  }

  return (
    <Modal
      open={true}
      onClose={onClose}
      title="Add to your Hajj savings"
      description="Deposits reconcile to your plan within ten minutes."
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={confirm} disabled={busy || !plan}>
            {busy ? "Processing…" : `Deposit ${amount ? naira(amount) : ""}`}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {plans.length > 1 ? (
          <Field label="Which plan?" htmlFor="dep-plan">
            <Select
              id="dep-plan"
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.beneficiaryName} · {p.travelYear} · {naira(p.balance)} saved
                </option>
              ))}
            </Select>
          </Field>
        ) : null}

        <Field
          label="Amount"
          required
          error={error}
          hint={
            plan
              ? `${naira(remaining)} left to reach the ${packageById(plan.packageId).name} goal.`
              : undefined
          }
          htmlFor="dep-amount"
        >
          <TextInput
            id="dep-amount"
            prefix="₦"
            inputMode="numeric"
            value={amount === null ? "" : String(amount)}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "");
              setAmount(digits ? Number(digits) : null);
              setError(undefined);
            }}
            placeholder="0"
            invalid={Boolean(error)}
          />
        </Field>

        <div className="flex flex-wrap gap-2">
          {QUICK.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => {
                setAmount(q);
                setError(undefined);
              }}
              className="tabular rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-forest-800/40 hover:bg-forest-50 dark:hover:bg-forest-950/60"
            >
              {naira(q)}
            </button>
          ))}
          {plan && remaining > 0 ? (
            <button
              type="button"
              onClick={() => {
                setAmount(remaining);
                setError(undefined);
              }}
              className="rounded-lg border border-gold-500/50 bg-gold-50 px-3 py-1.5 text-xs font-semibold text-gold-800 transition hover:bg-gold-100 dark:bg-gold-950/50 dark:text-gold-200"
            >
              Complete the goal
            </button>
          ) : null}
        </div>

        <div className="space-y-2.5">
          <p className="text-[0.8125rem] font-medium text-ink">How would you like to pay?</p>
          {CHANNELS.map((c) => (
            <RadioCard
              key={c.id}
              checked={channel === c.id}
              onSelect={() => setChannel(c.id)}
              title={
                <span className="flex items-center gap-2">
                  <c.icon className="size-4 text-forest-700 dark:text-gold-400" />
                  {c.label}
                </span>
              }
              description={c.detail}
            />
          ))}
        </div>

        {channel === "Virtual Account" ? (
          <div className="rounded-2xl border border-line bg-surface-muted p-4">
            <p className="text-[0.6875rem] font-semibold tracking-wider text-muted uppercase">
              Your dedicated account
            </p>
            <div className="mt-2 flex items-center gap-3">
              <Banknote className="size-5 shrink-0 text-forest-700 dark:text-gold-400" />
              <div className="min-w-0 flex-1">
                <p className="tabular text-lg font-extrabold tracking-wide text-ink">
                  {VIRTUAL_ACCOUNT.accountNumber}
                </p>
                <p className="truncate text-xs text-muted">
                  {VIRTUAL_ACCOUNT.bankName} · {VIRTUAL_ACCOUNT.accountName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(VIRTUAL_ACCOUNT.accountNumber);
                  toast({ title: "Account number copied", tone: "info" });
                }}
                className="rounded-lg border border-line bg-surface p-2 text-muted transition hover:text-ink"
                aria-label="Copy account number"
              >
                <Copy className="size-4" />
              </button>
            </div>
          </div>
        ) : null}

        {channel === "USSD" ? (
          <div className="rounded-2xl border border-line bg-surface-muted p-4 text-center">
            <p className="text-[0.6875rem] font-semibold tracking-wider text-muted uppercase">
              Dial from your registered number
            </p>
            <p className="tabular mt-2 text-2xl font-extrabold text-ink">
              *737*50*{amount ? Math.round(amount / 1000) : "0"}*
              {VIRTUAL_ACCOUNT.accountNumber.slice(-4)}#
            </p>
            <p className="mt-2 text-xs text-muted">
              Works on any phone, with or without data.
            </p>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
