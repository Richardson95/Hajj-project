"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  Banknote,
  Copy,
  Download,
  Funnel,
  Info,
  Landmark,
  Plus,
  Search,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, Pill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader, Stat } from "@/components/ui/misc";
import { SegmentedControl } from "@/components/ui/tabs";
import { TextInput } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { DepositModal } from "@/components/app/deposit-modal";
import { PlanCard } from "@/components/app/plan-card";
import { PlanEditorModal } from "@/components/app/plan-editor-modal";
import { SavingsChart } from "@/components/app/savings-chart";
import { useApp } from "@/lib/store";
import { VIRTUAL_ACCOUNT } from "@/lib/data/account";
import { packageById } from "@/lib/data/packages";
import { buildSavingsCurve, progressPct } from "@/lib/savings";
import { formatDateTime, naira } from "@/lib/format";
import type { SavingsPlan, TransactionType } from "@/lib/types";
import { cn } from "@/lib/cn";

type Filter = "all" | "deposits" | "credits" | "debits" | "failed";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "deposits", label: "Deposits" },
  { id: "credits", label: "Bonuses" },
  { id: "debits", label: "Debits" },
  { id: "failed", label: "Failed" },
];

const TYPE_LABEL: Record<TransactionType, string> = {
  deposit: "Deposit",
  "auto-debit": "Standing order",
  "referral-bonus": "Referral bonus",
  "profit-share": "Profit share",
  withdrawal: "Withdrawal",
  fee: "Fee",
};

export default function SavingsPage() {
  const { plans, transactions } = useApp();
  const { toast } = useToast();

  const [depositOpen, setDepositOpen] = useState(false);
  const [depositPlan, setDepositPlan] = useState<string | undefined>();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<SavingsPlan | undefined>();
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const portfolio = plans.reduce((s, p) => s + p.balance, 0);
  const portfolioTarget = plans.reduce(
    (s, p) => s + packageById(p.packageId).priceNGN,
    0,
  );
  const monthlyCommitment = plans
    .filter((p) => p.status === "active")
    .reduce((s, p) => {
      const perMonth = { weekly: 4.33, monthly: 1, quarterly: 1 / 3 }[p.frequency];
      return s + p.amountPerCycle * perMonth;
    }, 0);

  const totalEarned = transactions
    .filter((t) => t.status === "successful" && ["profit-share", "referral-bonus"].includes(t.type))
    .reduce((s, t) => s + t.amount, 0);

  const primary = plans.find((p) => p.isPrimary) ?? plans[0];
  const curve = useMemo(() => (primary ? buildSavingsCurve(primary, 12) : []), [primary]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return transactions.filter((t) => {
      if (filter === "deposits" && !["deposit", "auto-debit"].includes(t.type)) return false;
      if (filter === "credits" && !["referral-bonus", "profit-share"].includes(t.type))
        return false;
      if (filter === "debits" && !["withdrawal", "fee"].includes(t.type)) return false;
      if (filter === "failed" && t.status !== "failed") return false;
      if (!q) return true;
      return (
        t.narration.toLowerCase().includes(q) ||
        t.reference.toLowerCase().includes(q) ||
        t.channel.toLowerCase().includes(q)
      );
    });
  }, [transactions, filter, query]);

  function copyAccount() {
    navigator.clipboard?.writeText(VIRTUAL_ACCOUNT.accountNumber);
    toast({ title: "Account number copied", tone: "info" });
  }

  function exportCsv() {
    const header = "Date,Reference,Narration,Type,Channel,Status,Amount (NGN)\n";
    const rows = filtered
      .map((t) =>
        [
          new Date(t.date).toISOString(),
          t.reference,
          `"${t.narration.replace(/"/g, '""')}"`,
          TYPE_LABEL[t.type],
          t.channel,
          t.status,
          t.amount,
        ].join(","),
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hajjpath-statement-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Statement downloaded", description: `${filtered.length} transactions exported.` });
  }

  return (
    <>
      <PageHeader
        title="Savings & plans"
        description="Every plan, every naira, and the account that funds them."
        action={
          <>
            <Button
              onClick={() => {
                setDepositPlan(undefined);
                setDepositOpen(true);
              }}
            >
              <Plus className="size-4" />
              Add money
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEditing(undefined);
                setEditorOpen(true);
              }}
            >
              New plan
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Total saved"
          value={naira(portfolio)}
          detail={`${progressPct(portfolio, portfolioTarget).toFixed(1)}% of ${naira(portfolioTarget)} across ${plans.length} plans`}
          icon={<Wallet className="size-4" />}
        />
        <Stat
          label="Monthly commitment"
          value={naira(Math.round(monthlyCommitment))}
          detail={`${plans.filter((p) => p.status === "active").length} active plans`}
          icon={<Landmark className="size-4" />}
          tone="info"
        />
        <Stat
          label="Earned in profit & bonuses"
          value={naira(totalEarned)}
          detail="Mudarabah profit share and referral rewards"
          icon={<ShieldCheck className="size-4" />}
          tone="positive"
        />
        <Stat
          label="Still to save"
          value={naira(Math.max(0, portfolioTarget - portfolio))}
          detail="Across every beneficiary on your account"
          icon={<ArrowDownToLine className="size-4" />}
          tone="gold"
        />
      </div>

      {/* Virtual account */}
      <Card className="mt-5 overflow-hidden">
        <div className="grid lg:grid-cols-[1.2fr_1fr]">
          <div className="relative bg-forest-900 p-6 text-white sm:p-7">
            <div className="pattern-islamic pointer-events-none absolute inset-0 opacity-40" />
            <div className="relative">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold tracking-[0.16em] text-gold-400 uppercase">
                  Your dedicated account
                </p>
                <Badge tone="gold">{VIRTUAL_ACCOUNT.provider}</Badge>
              </div>

              <p className="tabular mt-5 text-3xl font-extrabold tracking-[0.08em] sm:text-4xl">
                {VIRTUAL_ACCOUNT.accountNumber}
              </p>
              <p className="mt-2 text-sm text-white/65">{VIRTUAL_ACCOUNT.accountName}</p>
              <p className="text-sm text-white/50">{VIRTUAL_ACCOUNT.bankName}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                <Button variant="gold" size="sm" onClick={copyAccount}>
                  <Copy className="size-3.5" />
                  Copy number
                </Button>
                <Button
                  size="sm"
                  className="border border-white/20 bg-white/10 text-white hover:bg-white/20"
                  onClick={() => {
                    setDepositPlan(undefined);
                    setDepositOpen(true);
                  }}
                >
                  <Banknote className="size-3.5" />
                  Fund now
                </Button>
              </div>
            </div>
          </div>

          <CardBody className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl bg-surface-muted p-3.5">
              <Info className="mt-0.5 size-4 shrink-0 text-forest-700 dark:text-gold-400" />
              <p className="text-xs leading-relaxed text-muted">
                Transfers to this number are matched to your plans automatically within ten
                minutes. It accepts payments from any Nigerian bank, and from abroad
                through your sponsor&apos;s remittance provider.
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-xl bg-surface-muted p-3.5">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-forest-700 dark:text-gold-400" />
              <p className="text-xs leading-relaxed text-muted">
                Funds sit in a ring-fenced trust account, separate from HajjPath&apos;s own
                money and reconciled daily against the ledger below.
              </p>
            </div>
            <Button variant="outline" size="sm" block onClick={() => setWithdrawOpen(true)}>
              <ArrowDownToLine className="size-3.5" />
              Request a withdrawal
            </Button>
          </CardBody>
        </div>
      </Card>

      {/* Chart */}
      {curve.length > 0 && primary ? (
        <Card className="mt-5">
          <CardHeader
            title={`Trajectory — ${primary.beneficiaryName}`}
            description="Contributions to date, and the projection at the current plan."
          />
          <CardBody>
            <SavingsChart points={curve} goal={packageById(primary.packageId).priceNGN} />
          </CardBody>
        </Card>
      ) : null}

      {/* Plans */}
      <section className="mt-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-ink">Your plans</h2>
            <p className="mt-0.5 text-sm text-muted">
              One account, as many beneficiaries as you need.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditing(undefined);
              setEditorOpen(true);
            }}
          >
            <Plus className="size-3.5" />
            Add a plan
          </Button>
        </div>

        {plans.length === 0 ? (
          <EmptyState
            icon={<Wallet className="size-6" />}
            title="No savings plans yet"
            description="Create your first plan to start building towards the journey."
            action={
              <Button
                onClick={() => {
                  setEditing(undefined);
                  setEditorOpen(true);
                }}
              >
                Create a plan
              </Button>
            }
          />
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onEdit={(p) => {
                  setEditing(p);
                  setEditorOpen(true);
                }}
                onDeposit={(p) => {
                  setDepositPlan(p.id);
                  setDepositOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Ledger */}
      <Card className="mt-8">
        <CardHeader
          title="Transaction ledger"
          description={`${filtered.length} of ${transactions.length} transactions`}
          icon={<Funnel className="size-4" />}
          action={
            <Button variant="outline" size="sm" onClick={exportCsv}>
              <Download className="size-3.5" />
              Export CSV
            </Button>
          }
        />
        <CardBody className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SegmentedControl
              items={FILTERS}
              value={filter}
              onChange={setFilter}
              size="sm"
              className="sm:w-auto"
            />
            <div className="relative sm:ml-auto sm:w-64">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
              <TextInput
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search reference or narration"
                className="pl-9"
                aria-label="Search transactions"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              title="No matching transactions"
              description="Try a different filter or clear your search."
            />
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-line">
                      {["Date", "Narration", "Type", "Channel", "Status", "Amount"].map(
                        (h) => (
                          <th
                            key={h}
                            className={cn(
                              "px-3 py-2.5 text-left text-[0.6875rem] font-bold tracking-wider text-muted uppercase",
                              h === "Amount" && "text-right",
                            )}
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((t) => (
                      <tr
                        key={t.id}
                        className="border-b border-line last:border-0 hover:bg-surface-muted/50"
                      >
                        <td className="px-3 py-3 text-xs whitespace-nowrap text-muted">
                          {formatDateTime(t.date)}
                        </td>
                        <td className="px-3 py-3">
                          <p className="text-[0.8125rem] font-medium text-ink">
                            {t.narration}
                          </p>
                          <p className="tabular text-[0.6875rem] text-muted">
                            {t.reference}
                          </p>
                        </td>
                        <td className="px-3 py-3 text-[0.8125rem] whitespace-nowrap text-muted">
                          {TYPE_LABEL[t.type]}
                        </td>
                        <td className="px-3 py-3 text-[0.8125rem] whitespace-nowrap text-muted">
                          {t.channel}
                        </td>
                        <td className="px-3 py-3">
                          <Pill
                            tone={
                              t.status === "successful"
                                ? "positive"
                                : t.status === "pending"
                                  ? "warning"
                                  : "danger"
                            }
                          >
                            {t.status}
                          </Pill>
                        </td>
                        <td
                          className={cn(
                            "tabular px-3 py-3 text-right text-[0.8125rem] font-bold whitespace-nowrap",
                            t.status === "failed"
                              ? "text-muted line-through"
                              : ["withdrawal", "fee"].includes(t.type)
                                ? "text-rose-700 dark:text-rose-400"
                                : "text-emerald-700 dark:text-emerald-400",
                          )}
                        >
                          {["withdrawal", "fee"].includes(t.type) ? "−" : "+"}
                          {naira(t.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile list */}
              <ul className="divide-y divide-line md:hidden">
                {filtered.map((t) => (
                  <li key={t.id} className="flex items-start gap-3 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.8125rem] font-semibold text-ink">
                        {t.narration}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">
                        {formatDateTime(t.date)} · {t.channel}
                      </p>
                      <div className="mt-1.5">
                        <Pill
                          tone={
                            t.status === "successful"
                              ? "positive"
                              : t.status === "pending"
                                ? "warning"
                                : "danger"
                          }
                        >
                          {t.status}
                        </Pill>
                      </div>
                    </div>
                    <p
                      className={cn(
                        "tabular shrink-0 text-[0.8125rem] font-bold",
                        t.status === "failed"
                          ? "text-muted line-through"
                          : ["withdrawal", "fee"].includes(t.type)
                            ? "text-rose-700 dark:text-rose-400"
                            : "text-emerald-700 dark:text-emerald-400",
                      )}
                    >
                      {["withdrawal", "fee"].includes(t.type) ? "−" : "+"}
                      {naira(t.amount)}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </CardBody>
      </Card>

      <DepositModal
        open={depositOpen}
        onClose={() => setDepositOpen(false)}
        planId={depositPlan}
      />
      <PlanEditorModal
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        plan={editing}
      />

      <Modal
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        title="Request a withdrawal"
        description="Your savings belong to you and can be released at any time."
        footer={
          <>
            <Button variant="ghost" onClick={() => setWithdrawOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setWithdrawOpen(false);
                toast({
                  title: "Withdrawal request received",
                  description:
                    "An OTP has been sent to the phone number registered against your BVN.",
                  tone: "info",
                });
              }}
            >
              Continue to OTP
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-sm leading-relaxed text-muted">
          <p>
            Withdrawals are paid only to the bank account tied to your BVN, normally within
            two business days. For your protection, every request is confirmed with a
            one-time code sent to your registered phone number.
          </p>
          <ul className="space-y-2">
            {[
              "Fees already earned on completed quarters are retained",
              "Partial withdrawals are allowed — your plan simply recalculates",
              "Withdrawing does not close your plan or lose your travel year",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2.5">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-forest-700 dark:text-gold-400" />
                <span className="text-[0.8125rem]">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </>
  );
}
