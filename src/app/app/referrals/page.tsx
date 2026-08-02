"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  Gift,
  HandCoins,
  Mail,
  Share2,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, Pill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader, Stat } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";
import { useApp } from "@/lib/store";
import { REFERRALS } from "@/lib/data/journey";
import { formatDate, naira } from "@/lib/format";

const STEPS = [
  {
    icon: Share2,
    title: "Share your code",
    body: "Send your personal code or link to family, friends and your community WhatsApp group.",
  },
  {
    icon: UserPlus,
    title: "They open an account",
    body: "Your code is applied at sign-up. They receive ₦5,000 in wallet credit on verification.",
  },
  {
    icon: HandCoins,
    title: "You earn ₦15,000",
    body: "Credited to your own Hajj balance the moment their first contribution clears.",
  },
];

export default function ReferralsPage() {
  const { user, deposit, plans } = useApp();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const link = `https://hajjpath.ng/join/${user.referralCode}`;
  const earned = REFERRALS.reduce((s, r) => s + r.rewardNGN, 0);
  const activated = REFERRALS.filter((r) => r.status === "saving").length;
  const pending = REFERRALS.filter((r) => r.status !== "saving").length;
  const primary = plans.find((p) => p.isPrimary) ?? plans[0];

  function copy(value: string, label: string) {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    toast({ title: `${label} copied`, tone: "info" });
    window.setTimeout(() => setCopied(false), 2000);
  }

  async function share() {
    const text = `I'm saving for Hajj with HajjPath. Use my code ${user.referralCode} and we both earn wallet credit.`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Join me on HajjPath", text, url: link });
        return;
      } catch {
        /* dismissed — fall through to copy */
      }
    }
    copy(`${text} ${link}`, "Invitation");
  }

  return (
    <>
      <PageHeader
        title="Referrals"
        description="Guide someone else towards the House of Allah, and earn towards your own journey."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Total earned"
          value={naira(earned)}
          detail="Credited straight to your Hajj balance"
          icon={<HandCoins className="size-4" />}
          tone="gold"
        />
        <Stat
          label="People invited"
          value={REFERRALS.length}
          detail={`${activated} actively saving`}
          icon={<Users className="size-4" />}
        />
        <Stat
          label="Awaiting activation"
          value={pending}
          detail="They earn you ₦15,000 on first contribution"
          icon={<TrendingUp className="size-4" />}
          tone="info"
        />
        <Stat
          label="Per activated referral"
          value={naira(15_000)}
          detail="No cap on how many you can invite"
          icon={<Gift className="size-4" />}
          tone="positive"
        />
      </div>

      {/* Code card */}
      <Card className="mt-5 overflow-hidden">
        <div className="relative bg-forest-900 p-6 text-white sm:p-8">
          <div className="pattern-islamic pointer-events-none absolute inset-0 opacity-40" />
          <div className="pointer-events-none absolute -right-16 -bottom-20 size-64 rounded-full bg-gold-500/15 blur-3xl" />

          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-gold-400 uppercase">
                Your referral code
              </p>
              <p className="tabular mt-4 text-3xl font-extrabold tracking-[0.12em] sm:text-4xl">
                {user.referralCode}
              </p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/65">
                Share it with anyone who has been meaning to start. They get ₦5,000 on
                verification, you get ₦15,000 when their first contribution clears.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => copy(user.referralCode, "Referral code")}
                >
                  {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  {copied ? "Copied" : "Copy code"}
                </Button>
                <Button
                  size="sm"
                  className="border border-white/20 bg-white/10 text-white hover:bg-white/20"
                  onClick={share}
                >
                  <Share2 className="size-3.5" />
                  Share invitation
                </Button>
                <Button
                  size="sm"
                  className="border border-white/20 bg-white/10 text-white hover:bg-white/20"
                  onClick={() => copy(link, "Invitation link")}
                >
                  <Mail className="size-3.5" />
                  Copy link
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/5 p-5 lg:w-64">
              <p className="text-[0.6875rem] font-semibold tracking-wider text-white/50 uppercase">
                Wallet credit available
              </p>
              <p className="tabular mt-2 text-3xl font-extrabold">{naira(earned)}</p>
              <Button
                variant="gold"
                size="sm"
                block
                className="mt-4"
                disabled={!primary || earned === 0}
                onClick={() => {
                  if (!primary) return;
                  deposit(primary.id, earned, "Wallet", "referral-bonus");
                  toast({
                    title: `${naira(earned)} moved to your plan`,
                    description: `Applied to ${primary.beneficiaryName}'s Hajj balance.`,
                  });
                }}
              >
                Apply to my plan
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* How it works */}
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {STEPS.map((s, i) => (
          <Card key={s.title}>
            <CardBody>
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-forest-50 text-forest-800 dark:bg-forest-950 dark:text-gold-300">
                  <s.icon className="size-5" />
                </span>
                <span className="tabular text-xs font-bold text-muted">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-4 text-[0.9375rem] font-bold text-ink">{s.title}</h3>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">{s.body}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Referral list */}
      <Card className="mt-5">
        <CardHeader
          title="People you have invited"
          description={`${REFERRALS.length} invitations · ${activated} activated`}
          icon={<Users className="size-4" />}
        />
        {REFERRALS.length === 0 ? (
          <CardBody>
            <EmptyState
              icon={<UserPlus className="size-6" />}
              title="No referrals yet"
              description="Share your code and your first reward will appear here."
            />
          </CardBody>
        ) : (
          <ul className="divide-y divide-line">
            {REFERRALS.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink">{r.name}</p>
                  <p className="text-xs text-muted">
                    Invited {formatDate(r.joinedAt)}
                  </p>
                </div>
                <Pill
                  tone={
                    r.status === "saving"
                      ? "positive"
                      : r.status === "registered"
                        ? "info"
                        : "neutral"
                  }
                >
                  {r.status === "saving"
                    ? "Actively saving"
                    : r.status === "registered"
                      ? "Registered"
                      : "Invitation sent"}
                </Pill>
                <p className="tabular w-24 shrink-0 text-right text-sm font-bold text-ink">
                  {r.rewardNGN > 0 ? `+${naira(r.rewardNGN)}` : "—"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="mt-5">
        <CardBody className="flex flex-wrap items-center gap-4">
          <Badge tone="neutral">Terms</Badge>
          <p className="min-w-0 flex-1 text-xs leading-relaxed text-muted">
            Rewards are credited once the referred pilgrim passes KYC and their first
            contribution clears. Self-referrals and duplicate accounts are reversed. Wallet
            credit can be applied to any plan on your account but cannot be withdrawn as
            cash.
          </p>
        </CardBody>
      </Card>
    </>
  );
}
