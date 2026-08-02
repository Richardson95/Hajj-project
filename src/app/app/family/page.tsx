"use client";

import { useState } from "react";
import { Globe, Heart, Plus, ShieldCheck, Users } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader, Stat } from "@/components/ui/misc";
import { Avatar } from "@/components/ui/misc";
import { ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DepositModal } from "@/components/app/deposit-modal";
import { PlanCard } from "@/components/app/plan-card";
import { PlanEditorModal } from "@/components/app/plan-editor-modal";
import { useApp } from "@/lib/store";
import { packageById } from "@/lib/data/packages";
import { progressPct } from "@/lib/savings";
import { initialsOf, naira } from "@/lib/format";
import type { SavingsPlan } from "@/lib/types";

const TONES = [
  "from-gold-500 to-gold-700",
  "from-violet-600 to-violet-800",
  "from-sky-600 to-sky-800",
  "from-teal-600 to-teal-800",
  "from-rose-600 to-rose-800",
];

export default function FamilyPage() {
  const { plans, user } = useApp();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<SavingsPlan | undefined>();
  const [depositOpen, setDepositOpen] = useState(false);
  const [depositPlan, setDepositPlan] = useState<string | undefined>();

  const sponsored = plans.filter((p) => p.relationship !== "Self");
  const own = plans.filter((p) => p.relationship === "Self");

  const sponsoredTotal = sponsored.reduce((s, p) => s + p.balance, 0);
  const sponsoredTarget = sponsored.reduce(
    (s, p) => s + packageById(p.packageId).priceNGN,
    0,
  );

  return (
    <>
      <PageHeader
        title="Family plans"
        description="Save for a parent, a spouse or a child under your own verified account — from anywhere in the world."
        action={
          <Button
            onClick={() => {
              setEditing(undefined);
              setEditorOpen(true);
            }}
          >
            <Plus className="size-4" />
            Sponsor someone
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="People you sponsor"
          value={sponsored.length}
          detail={
            sponsored.length > 0
              ? sponsored.map((p) => p.beneficiaryName.split(" ")[0]).join(", ")
              : "No sponsored plans yet"
          }
          icon={<Users className="size-4" />}
        />
        <Stat
          label="Saved for family"
          value={naira(sponsoredTotal)}
          detail={`${progressPct(sponsoredTotal, sponsoredTarget).toFixed(1)}% of ${naira(sponsoredTarget)}`}
          icon={<Heart className="size-4" />}
          tone="gold"
        />
        <Stat
          label="Your own plans"
          value={own.length}
          detail={`${naira(own.reduce((s, p) => s + p.balance, 0))} saved for yourself`}
          icon={<ShieldCheck className="size-4" />}
          tone="info"
        />
      </div>

      {/* Household overview */}
      <Card className="mt-5">
        <CardHeader
          title="Household overview"
          description="Every beneficiary on this account, and how close each one is."
          icon={<Users className="size-4" />}
        />
        <CardBody className="space-y-5">
          {plans.map((plan, i) => {
            const pkg = packageById(plan.packageId);
            const pct = progressPct(plan.balance, pkg.priceNGN);
            const [first, ...rest] = plan.beneficiaryName.split(" ");
            return (
              <div key={plan.id} className="flex items-center gap-4">
                <Avatar
                  initials={initialsOf(first, rest.join(" ") || first)}
                  tone={
                    plan.relationship === "Self"
                      ? user.avatarTone
                      : TONES[i % TONES.length]
                  }
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-ink">
                      {plan.beneficiaryName}
                    </p>
                    <Badge tone={plan.relationship === "Self" ? "brand" : "neutral"}>
                      {plan.relationship}
                    </Badge>
                    <span className="text-xs text-muted">{plan.travelYear}</span>
                  </div>
                  <ProgressBar value={pct} className="mt-2" />
                </div>
                <div className="shrink-0 text-right">
                  <p className="tabular text-sm font-bold text-ink">
                    {naira(plan.balance)}
                  </p>
                  <p className="tabular text-xs text-muted">{pct.toFixed(0)}%</p>
                </div>
              </div>
            );
          })}
        </CardBody>
      </Card>

      {/* Diaspora note */}
      <Card className="mt-5 border-gold-500/30 bg-gold-50/50 dark:bg-gold-950/25">
        <CardBody className="flex flex-wrap items-center gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold-500 text-forest-950">
            <Globe className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink">Sponsoring from abroad</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted">
              Fund a beneficiary&apos;s plan from any country using your usual remittance
              provider — the transfer lands in your HajjPath virtual account and reconciles
              automatically. The beneficiary can watch their own tracker fill on their own
              phone, without ever seeing your other plans.
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Sponsored plan cards */}
      <section className="mt-8">
        <h2 className="text-lg font-bold text-ink">Sponsored plans</h2>
        <p className="mt-0.5 mb-4 text-sm text-muted">
          Manage each beneficiary&apos;s package, travel year and contribution separately.
        </p>

        {sponsored.length === 0 ? (
          <EmptyState
            icon={<Users className="size-6" />}
            title="You are not sponsoring anyone yet"
            description="Add a parent, spouse, child or sibling and their plan will run alongside your own."
            action={
              <Button
                onClick={() => {
                  setEditing(undefined);
                  setEditorOpen(true);
                }}
              >
                Sponsor someone
              </Button>
            }
          />
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {sponsored.map((plan) => (
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

      <PlanEditorModal
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        plan={editing}
      />
      <DepositModal
        open={depositOpen}
        onClose={() => setDepositOpen(false)}
        planId={depositPlan}
      />
    </>
  );
}
