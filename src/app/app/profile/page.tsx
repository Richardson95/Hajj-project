"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Bell,
  FingerprintPattern,
  Globe,
  IdCard,
  Key,
  Languages,
  LogOut,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Sun,
  TriangleAlert,
  UserCog,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, DataRow, PageHeader } from "@/components/ui/misc";
import { Field, Select, Switch, TextInput } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { SegmentedControl } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { useTheme } from "@/components/theme-provider";
import { useApp } from "@/lib/store";
import { NIGERIAN_STATES } from "@/lib/data/account";
import { LANGUAGES } from "@/lib/data/guide";
import { PILGRIM_GROUP } from "@/lib/data/map";
import { formatDate, formatPhone, maskId } from "@/lib/format";
import type { LanguageCode } from "@/lib/types";

const KYC_META = {
  verified: { label: "Verified", tone: "positive" as const },
  "in-review": { label: "In review", tone: "warning" as const },
  "not-started": { label: "Not started", tone: "neutral" as const },
  rejected: { label: "Action required", tone: "danger" as const },
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser, logout, resetDemo, plans } = useApp();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    state: user.state,
    city: user.city,
  });
  const [notifications, setNotifications] = useState({
    contributions: true,
    reminders: true,
    group: true,
    orders: true,
    marketing: false,
  });

  const kyc = KYC_META[user.kyc.status];

  function saveProfile() {
    updateUser({
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      state: draft.state,
      city: draft.city.trim(),
      initials: `${draft.firstName.charAt(0)}${draft.lastName.charAt(0)}`.toUpperCase(),
    });
    setEditOpen(false);
    toast({ title: "Profile updated" });
  }

  function toggleLanguage(code: LanguageCode) {
    const next = user.languages.includes(code)
      ? user.languages.filter((l) => l !== code)
      : [...user.languages, code];
    updateUser({ languages: next.length > 0 ? next : ["en"] });
  }

  return (
    <>
      <PageHeader
        title="Profile & security"
        description="Your identity, your preferences and the controls that protect your savings."
      />

      {/* Identity card */}
      <Card className="overflow-hidden">
        <div className="relative bg-forest-900 p-6 text-white sm:p-7">
          <div className="pattern-islamic pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative flex flex-wrap items-center gap-5">
            <Avatar initials={user.initials} tone={user.avatarTone} size="xl" />
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-extrabold">
                {user.honorific ? `${user.honorific} ` : ""}
                {user.firstName} {user.lastName}
              </h2>
              <p className="mt-1 text-sm text-white/65">
                Pilgrim · {PILGRIM_GROUP.name}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-white/60">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="size-3.5" />
                  {user.email}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="size-3.5" />
                  {formatPhone(user.phone)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  {user.city}, {user.state}
                </span>
              </div>
            </div>
            <Button
              className="border border-white/20 bg-white/10 text-white hover:bg-white/20"
              onClick={() => setEditOpen(true)}
            >
              <UserCog className="size-4" />
              Edit profile
            </Button>
          </div>
        </div>
      </Card>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* KYC */}
        <Card>
          <CardHeader
            title="Identity verification"
            description="Required before an account can hold funds."
            icon={<IdCard className="size-4" />}
            action={<Badge tone={kyc.tone}>{kyc.label}</Badge>}
          />
          <CardBody>
            {user.kyc.status === "in-review" ? (
              <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-50/60 p-3.5 dark:bg-amber-950/25">
                <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-600" />
                <p className="text-xs leading-relaxed text-muted">
                  Your documents are with our verification partner. This usually completes
                  within one working day. You can keep funding your plan in the meantime.
                </p>
              </div>
            ) : null}

            <dl>
              <DataRow label="BVN" value={maskId(user.kyc.bvn)} />
              <DataRow label="NIN" value={maskId(user.kyc.nin)} />
              <DataRow label="Passport number" value={user.kyc.passportNumber} />
              <DataRow
                label="Passport photograph"
                value={
                  user.kyc.passportPhotoUploaded ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                      <BadgeCheck className="size-3.5" />
                      Uploaded
                    </span>
                  ) : (
                    "Missing"
                  )
                }
              />
              <DataRow
                label="Passport data page"
                value={
                  user.kyc.passportDataPageUploaded ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                      <BadgeCheck className="size-3.5" />
                      Uploaded
                    </span>
                  ) : (
                    "Missing"
                  )
                }
              />
              <DataRow label="Checked by" value={user.kyc.provider} />
              {user.kyc.verifiedAt ? (
                <DataRow
                  label="Verified on"
                  value={<span suppressHydrationWarning>{formatDate(user.kyc.verifiedAt)}</span>}
                />
              ) : user.kyc.submittedAt ? (
                <DataRow
                  label="Submitted on"
                  value={<span suppressHydrationWarning>{formatDate(user.kyc.submittedAt)}</span>}
                />
              ) : null}
            </dl>

            <p className="mt-4 text-xs leading-relaxed text-muted">
              These details are encrypted at rest and never shared with vendors, travel
              operators or other pilgrims.
            </p>
          </CardBody>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader
            title="Security"
            description="The controls that stand between your savings and everyone else."
            icon={<ShieldCheck className="size-4" />}
          />
          <CardBody className="space-y-5">
            <Switch
              checked={user.twoFactorEnabled}
              onChange={(v) => {
                updateUser({ twoFactorEnabled: v });
                toast({
                  title: v ? "Two-factor enabled" : "Two-factor disabled",
                  tone: v ? "success" : "warning",
                });
              }}
              label="Two-factor authentication"
              description="An OTP is required to sign in on a new device and for every withdrawal."
            />
            <Switch
              checked={user.biometricEnabled}
              onChange={(v) => {
                updateUser({ biometricEnabled: v });
                toast({ title: v ? "Biometric unlock enabled" : "Biometric unlock disabled", tone: "info" });
              }}
              label="Biometric unlock"
              description="Use Face ID or a fingerprint to open HajjPath on this device."
            />

            <div className="space-y-3 border-t border-line pt-5">
              <Button
                variant="outline"
                size="sm"
                block
                onClick={() =>
                  toast({
                    title: "Password reset link sent",
                    description: `Check ${user.email}. The link expires in thirty minutes.`,
                    tone: "info",
                  })
                }
              >
                <Key className="size-3.5" />
                Change password
              </Button>
              <Button
                variant="outline"
                size="sm"
                block
                onClick={() =>
                  toast({
                    title: "Signed out of other devices",
                    description: "Only this browser remains signed in.",
                  })
                }
              >
                <Smartphone className="size-3.5" />
                Sign out of other devices
              </Button>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-surface-muted p-3.5">
              <FingerprintPattern className="mt-0.5 size-4 shrink-0 text-forest-700 dark:text-gold-400" />
              <p className="text-xs leading-relaxed text-muted">
                Withdrawals are always paid to the bank account tied to your BVN and always
                require an OTP to your registered number — even if someone has your
                password.
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader
            title="Preferences"
            description="Language, appearance and how HajjPath reaches you."
            icon={<Languages className="size-4" />}
          />
          <CardBody className="space-y-5">
            <div>
              <p className="mb-2.5 text-[0.8125rem] font-medium text-ink">
                Languages you read and speak
              </p>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((l) => {
                  const on = user.languages.includes(l.code);
                  return (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => toggleLanguage(l.code)}
                      aria-pressed={on}
                      className={
                        on
                          ? "rounded-xl border border-forest-700 bg-forest-50 px-3.5 py-2 text-sm font-medium text-forest-800 dark:bg-forest-950/70 dark:text-gold-300"
                          : "rounded-xl border border-line bg-surface px-3.5 py-2 text-sm font-medium text-muted transition hover:border-forest-800/30"
                      }
                    >
                      {l.native}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                Guide audio and support calls default to your first selected language.
              </p>
            </div>

            <div>
              <p className="mb-2.5 flex items-center gap-2 text-[0.8125rem] font-medium text-ink">
                <Sun className="size-4" />
                Appearance
              </p>
              <SegmentedControl
                items={[
                  { id: "light", label: "Light" },
                  { id: "dark", label: "Dark" },
                  { id: "system", label: "System" },
                ]}
                value={theme}
                onChange={(t) => setTheme(t as typeof theme)}
                size="sm"
              />
            </div>
          </CardBody>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader
            title="Notifications"
            description="Choose what HajjPath tells you about."
            icon={<Bell className="size-4" />}
          />
          <CardBody className="space-y-5">
            {(
              [
                ["contributions", "Contribution receipts", "Every deposit, standing order and profit share."],
                ["reminders", "Contribution reminders", "A nudge before each cycle, timed to your payday."],
                ["group", "Group and safety alerts", "Broadcasts, Find Me alerts and SOS updates."],
                ["orders", "Marketplace orders", "Dispatch, delivery and escrow release."],
                ["marketing", "News and offers", "Occasional product updates. Off by default."],
              ] as const
            ).map(([key, label, description]) => (
              <Switch
                key={key}
                checked={notifications[key]}
                onChange={(v) => setNotifications((n) => ({ ...n, [key]: v }))}
                label={label}
                description={description}
              />
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Account summary */}
      <Card className="mt-5">
        <CardHeader
          title="Account"
          description="Everything tied to this HajjPath profile."
          icon={<Globe className="size-4" />}
        />
        <CardBody>
          <dl>
            <DataRow
              label="Member since"
              value={<span suppressHydrationWarning>{formatDate(user.createdAt)}</span>}
            />
            <DataRow label="Referral code" value={user.referralCode} />
            <DataRow label="Pilgrim tag" value={user.tagCode ?? "Not issued"} />
            <DataRow label="Group" value={PILGRIM_GROUP.name} />
            <DataRow label="Group code" value={PILGRIM_GROUP.code} />
            <DataRow label="Active plans" value={plans.length} />
            <DataRow
              label="Hajj status"
              value={
                user.hajjCompleted
                  ? `${user.honorific ?? "Al-Hajji"} — verified`
                  : "Not yet performed"
              }
            />
          </dl>
        </CardBody>
      </Card>

      {/* Danger zone */}
      <Card className="mt-5 border-rose-500/30">
        <CardHeader
          title="Session & demo data"
          description="This build stores everything locally in your browser."
          icon={<RotateCcw className="size-4" />}
        />
        <CardBody className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => {
              resetDemo();
              toast({
                title: "Demo data reset",
                description: "Plans, orders and journal entries are back to their originals.",
                tone: "info",
              });
            }}
          >
            <RotateCcw className="size-4" />
            Reset demo data
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              logout();
              router.push("/");
            }}
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </CardBody>
      </Card>

      {/* Edit modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit your profile"
        description="Your name must continue to match your international passport."
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveProfile}>Save changes</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" htmlFor="pf-first">
              <TextInput
                id="pf-first"
                value={draft.firstName}
                onChange={(e) => setDraft((d) => ({ ...d, firstName: e.target.value }))}
              />
            </Field>
            <Field label="Surname" htmlFor="pf-last">
              <TextInput
                id="pf-last"
                value={draft.lastName}
                onChange={(e) => setDraft((d) => ({ ...d, lastName: e.target.value }))}
              />
            </Field>
          </div>
          <Field label="Email address" htmlFor="pf-email">
            <TextInput
              id="pf-email"
              type="email"
              value={draft.email}
              onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
            />
          </Field>
          <Field
            label="Phone number"
            hint="Changing this requires re-verification against your BVN."
            htmlFor="pf-phone"
          >
            <TextInput
              id="pf-phone"
              type="tel"
              value={draft.phone}
              onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="State" htmlFor="pf-state">
              <Select
                id="pf-state"
                value={draft.state}
                onChange={(e) => setDraft((d) => ({ ...d, state: e.target.value }))}
              >
                {NIGERIAN_STATES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
            </Field>
            <Field label="City or town" htmlFor="pf-city">
              <TextInput
                id="pf-city"
                value={draft.city}
                onChange={(e) => setDraft((d) => ({ ...d, city: e.target.value }))}
              />
            </Field>
          </div>
        </div>
      </Modal>
    </>
  );
}
