"use client";

import { useMemo, useState } from "react";
import { CreditCard, Landmark, Lock, Smartphone } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Field, Select, TextInput } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { useApp } from "@/lib/store";
import { usePackages } from "@/lib/catalog";
import { naira } from "@/lib/format";

const QUICK = [25_000, 50_000, 100_000, 250_000, 500_000];

/** What Paystack's checkout offers once it opens. Shown for reassurance only. */
const PAYSTACK_METHODS = [
  { label: "Card", icon: CreditCard },
  { label: "Bank transfer", icon: Landmark },
  { label: "USSD", icon: Smartphone },
];

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
  const { packageById } = usePackages();
  const { plans, deposit } = useApp();
  const { toast } = useToast();

  const activePlans = useMemo(
    () => plans.filter((p) => p.status !== "completed"),
    [plans],
  );
  const fallbackId = activePlans[0]?.id ?? plans[0]?.id ?? "";

  const [selectedPlan, setSelectedPlan] = useState(planId ?? fallbackId);
  const [amount, setAmount] = useState<number | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  const plan = plans.find((p) => p.id === selectedPlan);
  const target = plan ? packageById(plan.packageId).priceNGN : 0;
  const remaining = plan ? Math.max(0, target - plan.balance) : 0;

  function pay() {
    if (!plan) return;
    if (!amount || amount < 1000) {
      setError("The minimum deposit is ₦1,000.");
      return;
    }
    setBusy(true);
    /* Production: open Paystack checkout here and credit the plan only when
       Paystack's webhook confirms the charge on the server. */
    window.setTimeout(() => {
      deposit(plan.id, amount, "Paystack");
      setBusy(false);
      toast({
        title: `${naira(amount)} added to your plan`,
        description: `${plan.beneficiaryName} · paid with Paystack. Your tracker has been updated.`,
      });
      onClose();
    }, 900);
  }

  return (
    <Modal
      open={true}
      onClose={onClose}
      title="Add to your Hajj savings"
      description="All payments go through Paystack's secure checkout."
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={pay} disabled={busy || !plan}>
            <Lock className="size-4" />
            {busy
              ? "Opening Paystack…"
              : `Pay ${amount ? `${naira(amount)} ` : ""}with Paystack`}
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

        <div className="rounded-2xl border border-line bg-surface-muted p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Lock className="size-4 text-forest-700 dark:text-gold-400" />
            Paid securely with Paystack
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">
            Choose how to pay on the next screen:
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {PAYSTACK_METHODS.map((m) => (
              <span
                key={m.label}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs font-medium text-ink"
              >
                <m.icon className="size-3.5 text-forest-700 dark:text-gold-400" />
                {m.label}
              </span>
            ))}
          </div>
          <p className="mt-3 text-[0.6875rem] leading-relaxed text-muted">
            We never see your card details. Demo only: no real payment is taken.
          </p>
        </div>
      </div>
    </Modal>
  );
}
