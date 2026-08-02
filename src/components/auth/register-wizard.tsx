"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CircleCheck,
  Eye,
  EyeOff,
  FingerprintPattern,
  IdCard,
  Info,
  Landmark,
  Lock,
  RefreshCcw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Checkbox,
  Field,
  RadioCard,
  Select,
  Switch,
  TextInput,
} from "@/components/ui/field";
import { StepDots } from "@/components/ui/progress";
import { DataRow } from "@/components/ui/misc";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { OtpInput } from "./otp-input";
import { UploadField, type UploadedFile } from "./upload-field";
import { useApp } from "@/lib/store";
import { HAJJ_PACKAGES } from "@/lib/data/packages";
import { BANKS, NIGERIAN_STATES } from "@/lib/data/account";
import {
  DEPARTURE_DATES,
  FREQUENCY_LABEL,
  FREQUENCY_SUFFIX,
  cyclesRemaining,
  requiredPerCycle,
} from "@/lib/savings";
import { formatDate, initialsOf, maskId, naira } from "@/lib/format";
import type { PlanFrequency, TravelYear } from "@/lib/types";
import { cn } from "@/lib/cn";

const DEMO_OTP = "482016";

const STEPS = [
  { id: "details", label: "Your details", icon: UserPlus },
  { id: "verify", label: "Verify phone", icon: Smartphone },
  { id: "identity", label: "Identity", icon: IdCard },
  { id: "documents", label: "Documents", icon: BadgeCheck },
  { id: "plan", label: "Your plan", icon: Target },
  { id: "review", label: "Review", icon: ShieldCheck },
] as const;

type StepId = (typeof STEPS)[number]["id"];

interface FormState {
  firstName: string;
  lastName: string;
  gender: "male" | "female" | "";
  dateOfBirth: string;
  email: string;
  phone: string;
  password: string;
  state: string;
  city: string;
  otp: string;
  bvn: string;
  nin: string;
  passportNumber: string;
  passportPhoto: UploadedFile | null;
  passportDataPage: UploadedFile | null;
  beneficiary: "self" | "other";
  beneficiaryName: string;
  relationship: "Spouse" | "Parent" | "Child" | "Sibling" | "Other";
  packageId: string;
  travelYear: TravelYear;
  frequency: PlanFrequency;
  amountPerCycle: number | null;
  bankName: string;
  autoDebit: boolean;
  referralCode: string;
  twoFactor: boolean;
  biometric: boolean;
  acceptTerms: boolean;
  acceptShariah: boolean;
}

const INITIAL: FormState = {
  firstName: "",
  lastName: "",
  gender: "",
  dateOfBirth: "",
  email: "",
  phone: "",
  password: "",
  state: "",
  city: "",
  otp: "",
  bvn: "",
  nin: "",
  passportNumber: "",
  passportPhoto: null,
  passportDataPage: null,
  beneficiary: "self",
  beneficiaryName: "",
  relationship: "Parent",
  packageId: HAJJ_PACKAGES[0].id,
  travelYear: 2027,
  frequency: "monthly",
  amountPerCycle: null,
  bankName: BANKS[0],
  autoDebit: true,
  referralCode: "",
  twoFactor: true,
  biometric: true,
  acceptTerms: false,
  acceptShariah: false,
};

type Errors = Partial<Record<keyof FormState, string>>;

function passwordScore(pw: string): { score: number; label: string; tone: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong", "Excellent"];
  const tones = [
    "bg-rose-500",
    "bg-rose-500",
    "bg-amber-500",
    "bg-amber-400",
    "bg-emerald-500",
    "bg-emerald-600",
  ];
  return { score, label: labels[score], tone: tones[score] };
}

export function RegisterWizard() {
  const router = useRouter();
  const { addPlan, updateUser, login } = useApp();
  const { toast } = useToast();

  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [otpResent, setOtpResent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const step = STEPS[stepIndex];
  const pkg = HAJJ_PACKAGES.find((p) => p.id === form.packageId) ?? HAJJ_PACKAGES[0];
  const departure = DEPARTURE_DATES[form.travelYear];

  const suggested = useMemo(
    () => requiredPerCycle(pkg.priceNGN, 0, form.frequency, departure),
    [pkg.priceNGN, form.frequency, departure],
  );
  const cycles = useMemo(
    () => cyclesRemaining(form.frequency, departure),
    [form.frequency, departure],
  );
  const contribution = form.amountPerCycle ?? suggested;

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validateStep(id: StepId): boolean {
    const e: Errors = {};

    if (id === "details") {
      if (form.firstName.trim().length < 2) e.firstName = "Enter your first name.";
      if (form.lastName.trim().length < 2) e.lastName = "Enter your surname.";
      if (!form.gender) e.gender = "Select an option.";
      if (!form.dateOfBirth) e.dateOfBirth = "Enter your date of birth.";
      else {
        const age =
          (Date.now() - new Date(form.dateOfBirth).getTime()) / (365.25 * 86_400_000);
        if (age < 18) e.dateOfBirth = "You must be at least 18 to open an account.";
        if (age > 110) e.dateOfBirth = "Please check this date.";
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
        e.email = "Enter a valid email address.";
      if (!/^0\d{10}$/.test(form.phone.replace(/\s/g, "")))
        e.phone = "Enter an 11-digit Nigerian number, e.g. 08034512907.";
      if (form.password.length < 8)
        e.password = "Use at least 8 characters.";
      if (!form.state) e.state = "Select your state.";
      if (form.city.trim().length < 2) e.city = "Enter your city or town.";
    }

    if (id === "verify") {
      if (form.otp.length !== 6) e.otp = "Enter the 6-digit code.";
      else if (form.otp !== DEMO_OTP) e.otp = `Incorrect code. For this demo use ${DEMO_OTP}.`;
    }

    if (id === "identity") {
      if (!/^\d{11}$/.test(form.bvn)) e.bvn = "A BVN is exactly 11 digits.";
      if (!/^\d{11}$/.test(form.nin)) e.nin = "A NIN is exactly 11 digits.";
      if (!/^[A-Za-z]\d{8}$/.test(form.passportNumber.trim()))
        e.passportNumber = "Format is one letter followed by 8 digits, e.g. B10428765.";
    }

    if (id === "documents") {
      if (!form.passportPhoto) e.passportPhoto = "Upload a recent passport photograph.";
      if (!form.passportDataPage)
        e.passportDataPage = "Upload the data page of your international passport.";
    }

    if (id === "plan") {
      if (form.beneficiary === "other" && form.beneficiaryName.trim().length < 3)
        e.beneficiaryName = "Enter the full name of the beneficiary.";
      if (contribution < 5000) e.amountPerCycle = "The minimum contribution is ₦5,000.";
      if (cycles <= 0)
        e.travelYear = "That airlift is too close. Choose a later travel year.";
    }

    if (id === "review") {
      if (!form.acceptTerms) e.acceptTerms = "You must accept the terms to continue.";
      if (!form.acceptShariah)
        e.acceptShariah = "Please confirm you understand the profit-sharing structure.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validateStep(step.id)) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (stepIndex < STEPS.length - 1) {
      setStepIndex((i) => i + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function back() {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function finish() {
    if (!validateStep("review")) return;
    setSubmitting(true);
    window.setTimeout(() => {
      const phone = form.phone.replace(/\s/g, "");
      updateUser({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone,
        gender: form.gender === "female" ? "female" : "male",
        dateOfBirth: form.dateOfBirth,
        state: form.state,
        city: form.city.trim(),
        initials: initialsOf(form.firstName, form.lastName),
        twoFactorEnabled: form.twoFactor,
        biometricEnabled: form.biometric,
        kyc: {
          bvn: form.bvn,
          nin: form.nin,
          passportNumber: form.passportNumber.trim().toUpperCase(),
          passportPhotoUploaded: true,
          passportDataPageUploaded: true,
          status: "in-review",
          submittedAt: new Date().toISOString(),
          provider: "VerifyMe",
        },
      });
      addPlan({
        beneficiaryName:
          form.beneficiary === "self"
            ? `${form.firstName.trim()} ${form.lastName.trim()}`
            : form.beneficiaryName.trim(),
        relationship: form.beneficiary === "self" ? "Self" : form.relationship,
        packageId: form.packageId,
        travelYear: form.travelYear,
        frequency: form.frequency,
        amountPerCycle: contribution,
        bankName: form.bankName,
        autoDebit: form.autoDebit,
      });
      login();
      toast({
        title: "Account created — welcome to HajjPath",
        description: "Your KYC is in review. You can start funding your plan right away.",
      });
      router.push("/app");
    }, 900);
  }

  const pwScore = passwordScore(form.password);

  return (
    <div>
      {/* Header */}
      <div className="mb-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-gold-600 uppercase dark:text-gold-400">
              Step {stepIndex + 1} of {STEPS.length}
            </p>
            <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              {step.label}
            </h1>
          </div>
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-forest-800 text-white">
            <step.icon className="size-5" />
          </span>
        </div>
        <StepDots total={STEPS.length} current={stepIndex} className="mt-5" />
      </div>

      {/* Steps */}
      <div className="space-y-5">
        {step.id === "details" ? (
          <>
            <p className="text-sm leading-relaxed text-muted">
              Use your name exactly as it appears on your international passport — it must
              match for verification to pass.
            </p>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="First name" required error={errors.firstName} htmlFor="r-first">
                <TextInput
                  id="r-first"
                  value={form.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  placeholder="Ibrahim"
                  autoComplete="given-name"
                  invalid={Boolean(errors.firstName)}
                />
              </Field>
              <Field label="Surname" required error={errors.lastName} htmlFor="r-last">
                <TextInput
                  id="r-last"
                  value={form.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                  placeholder="Adetunji"
                  autoComplete="family-name"
                  invalid={Boolean(errors.lastName)}
                />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Gender" required error={errors.gender} htmlFor="r-gender">
                <Select
                  id="r-gender"
                  value={form.gender}
                  onChange={(e) => set("gender", e.target.value as FormState["gender"])}
                >
                  <option value="">Select…</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Select>
              </Field>
              <Field
                label="Date of birth"
                required
                error={errors.dateOfBirth}
                htmlFor="r-dob"
              >
                <TextInput
                  id="r-dob"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => set("dateOfBirth", e.target.value)}
                  invalid={Boolean(errors.dateOfBirth)}
                />
              </Field>
            </div>

            <Field label="Email address" required error={errors.email} htmlFor="r-email">
              <TextInput
                id="r-email"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                invalid={Boolean(errors.email)}
              />
            </Field>

            <Field
              label="Phone number"
              required
              error={errors.phone}
              hint="Must be the number registered against your BVN — withdrawals are confirmed here."
              htmlFor="r-phone"
            >
              <TextInput
                id="r-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="08034512907"
                autoComplete="tel"
                invalid={Boolean(errors.phone)}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="State of residence" required error={errors.state} htmlFor="r-state">
                <Select
                  id="r-state"
                  value={form.state}
                  onChange={(e) => set("state", e.target.value)}
                >
                  <option value="">Select…</option>
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </Select>
              </Field>
              <Field label="City or town" required error={errors.city} htmlFor="r-city">
                <TextInput
                  id="r-city"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="Ikeja"
                  autoComplete="address-level2"
                  invalid={Boolean(errors.city)}
                />
              </Field>
            </div>

            <Field label="Create a password" required error={errors.password} htmlFor="r-pw">
              <div className="relative">
                <TextInput
                  id="r-pw"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  className="pr-11"
                  invalid={Boolean(errors.password)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-2 text-muted transition hover:bg-surface-muted hover:text-ink"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </Field>

            {form.password ? (
              <div className="-mt-2 flex items-center gap-3">
                <div className="flex h-1.5 flex-1 gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "flex-1 rounded-full transition",
                        i < pwScore.score ? pwScore.tone : "bg-line",
                      )}
                    />
                  ))}
                </div>
                <span className="w-20 shrink-0 text-right text-xs font-semibold text-muted">
                  {pwScore.label}
                </span>
              </div>
            ) : null}
          </>
        ) : null}

        {step.id === "verify" ? (
          <>
            <p className="text-sm leading-relaxed text-muted">
              We sent a 6-digit code to{" "}
              <strong className="text-ink">{form.phone || "your phone"}</strong>. Enter it
              below to confirm the number belongs to you.
            </p>

            <div className="flex items-start gap-3 rounded-2xl border border-gold-500/30 bg-gold-50/70 p-4 dark:bg-gold-950/30">
              <Info className="mt-0.5 size-4 shrink-0 text-gold-700 dark:text-gold-400" />
              <p className="text-[0.8125rem] leading-relaxed text-ink/80">
                No SMS is actually sent in this demo. Use the code{" "}
                <strong className="tabular text-ink">{DEMO_OTP}</strong>.
              </p>
            </div>

            <Field label="Verification code" required error={errors.otp}>
              <OtpInput
                value={form.otp}
                onChange={(v) => set("otp", v)}
                invalid={Boolean(errors.otp)}
                autoFocus
              />
            </Field>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setOtpResent(true);
                  toast({ title: "Code resent", description: `Use ${DEMO_OTP} to continue.` });
                }}
              >
                <RefreshCcw className="size-4" />
                {otpResent ? "Resend again" : "Resend code"}
              </Button>
              <button
                type="button"
                onClick={() => setStepIndex(0)}
                className="text-sm font-medium text-muted underline underline-offset-2 hover:text-ink"
              >
                Change phone number
              </button>
            </div>
          </>
        ) : null}

        {step.id === "identity" ? (
          <>
            <p className="text-sm leading-relaxed text-muted">
              Nigerian regulation requires verified identity before an account can hold
              funds. These details are checked once and encrypted at rest.
            </p>

            <Field
              label="Bank Verification Number (BVN)"
              required
              error={errors.bvn}
              hint="Dial *565*0# on the phone linked to your bank account to retrieve it."
              htmlFor="r-bvn"
            >
              <TextInput
                id="r-bvn"
                inputMode="numeric"
                maxLength={11}
                value={form.bvn}
                onChange={(e) => set("bvn", e.target.value.replace(/\D/g, ""))}
                placeholder="22137458190"
                invalid={Boolean(errors.bvn)}
              />
            </Field>

            <Field
              label="National Identity Number (NIN)"
              required
              error={errors.nin}
              hint="Printed on your NIN slip or national identity card."
              htmlFor="r-nin"
            >
              <TextInput
                id="r-nin"
                inputMode="numeric"
                maxLength={11}
                value={form.nin}
                onChange={(e) => set("nin", e.target.value.replace(/\D/g, ""))}
                placeholder="70154829336"
                invalid={Boolean(errors.nin)}
              />
            </Field>

            <Field
              label="International passport number"
              required
              error={errors.passportNumber}
              hint="Must be valid for at least six months beyond your travel date."
              htmlFor="r-passport"
            >
              <TextInput
                id="r-passport"
                maxLength={9}
                value={form.passportNumber}
                onChange={(e) => set("passportNumber", e.target.value.toUpperCase())}
                placeholder="B10428765"
                invalid={Boolean(errors.passportNumber)}
              />
            </Field>

            <div className="flex items-start gap-3 rounded-2xl border border-line bg-surface-muted/60 p-4">
              <Lock className="mt-0.5 size-4 shrink-0 text-forest-700 dark:text-gold-400" />
              <p className="text-xs leading-relaxed text-muted">
                Your BVN and NIN are validated through VerifyMe and stored encrypted. They
                are never shared with vendors, travel operators or other pilgrims.
              </p>
            </div>
          </>
        ) : null}

        {step.id === "documents" ? (
          <>
            <p className="text-sm leading-relaxed text-muted">
              Two documents complete your KYC. Clear photographs taken on a phone are
              perfectly acceptable, as long as every corner is visible.
            </p>

            <UploadField
              label="Passport photograph"
              description="Recent, plain background, face clearly visible. JPG or PNG, up to 5MB."
              accept="image/png,image/jpeg"
              value={form.passportPhoto}
              onChange={(f) => set("passportPhoto", f)}
              error={errors.passportPhoto}
            />

            <UploadField
              label="Passport data page"
              description="The page carrying your photograph, passport number and expiry date. JPG, PNG or PDF."
              value={form.passportDataPage}
              onChange={(f) => set("passportDataPage", f)}
              error={errors.passportDataPage}
            />

            <div className="rounded-2xl border border-line bg-surface-muted/60 p-4">
              <p className="text-[0.8125rem] font-semibold text-ink">
                What reviewers check
              </p>
              <ul className="mt-2.5 space-y-1.5">
                {[
                  "All four corners of the data page are visible",
                  "The passport number matches what you entered",
                  "Expiry date is at least six months after your travel year",
                  "The photograph matches the passport image",
                ].map((c) => (
                  <li key={c} className="flex items-start gap-2 text-xs text-muted">
                    <CircleCheck className="mt-0.5 size-3.5 shrink-0 text-forest-700 dark:text-gold-400" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : null}

        {step.id === "plan" ? (
          <>
            <p className="text-sm leading-relaxed text-muted">
              Choose who is travelling, which package, and how often you want to
              contribute. Everything here can be changed later at no cost.
            </p>

            <div className="space-y-2.5">
              <p className="text-[0.8125rem] font-medium text-ink">Who is this plan for?</p>
              <div className="grid gap-2.5 sm:grid-cols-2">
                <RadioCard
                  checked={form.beneficiary === "self"}
                  onSelect={() => set("beneficiary", "self")}
                  title="Myself"
                  description="I am saving for my own pilgrimage."
                />
                <RadioCard
                  checked={form.beneficiary === "other"}
                  onSelect={() => set("beneficiary", "other")}
                  title="Someone else"
                  description="A parent, spouse, child or sibling."
                />
              </div>
            </div>

            {form.beneficiary === "other" ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Beneficiary full name"
                  required
                  error={errors.beneficiaryName}
                  htmlFor="r-bname"
                >
                  <TextInput
                    id="r-bname"
                    value={form.beneficiaryName}
                    onChange={(e) => set("beneficiaryName", e.target.value)}
                    placeholder="Sekinat Adetunji"
                    invalid={Boolean(errors.beneficiaryName)}
                  />
                </Field>
                <Field label="Relationship" htmlFor="r-rel">
                  <Select
                    id="r-rel"
                    value={form.relationship}
                    onChange={(e) =>
                      set("relationship", e.target.value as FormState["relationship"])
                    }
                  >
                    {["Spouse", "Parent", "Child", "Sibling", "Other"].map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </Select>
                </Field>
              </div>
            ) : null}

            <div className="space-y-2.5">
              <p className="text-[0.8125rem] font-medium text-ink">Package</p>
              <div className="space-y-2.5">
                {HAJJ_PACKAGES.map((p) => (
                  <RadioCard
                    key={p.id}
                    checked={p.id === form.packageId}
                    onSelect={() => {
                      set("packageId", p.id);
                      set("amountPerCycle", null);
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
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Travel year" error={errors.travelYear} htmlFor="r-year">
                <Select
                  id="r-year"
                  value={form.travelYear}
                  onChange={(e) => {
                    set("travelYear", Number(e.target.value) as TravelYear);
                    set("amountPerCycle", null);
                  }}
                >
                  {([2026, 2027, 2028] as TravelYear[]).map((y) => (
                    <option key={y} value={y}>
                      {y} ·{" "}
                      {new Date(DEPARTURE_DATES[y]).toLocaleDateString("en-GB", {
                        month: "short",
                        year: "numeric",
                        timeZone: "UTC",
                      })}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Contribution frequency" htmlFor="r-freq">
                <Select
                  id="r-freq"
                  value={form.frequency}
                  onChange={(e) => {
                    set("frequency", e.target.value as PlanFrequency);
                    set("amountPerCycle", null);
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

            <div className="rounded-2xl border border-forest-700/30 bg-forest-50 p-4 dark:bg-forest-950/50">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-[0.8125rem] font-semibold text-ink">
                  Suggested contribution
                </p>
                <p suppressHydrationWarning className="tabular text-lg font-extrabold text-ink">
                  {naira(suggested)}
                  <span className="text-sm font-medium text-muted">
                    {FREQUENCY_SUFFIX[form.frequency]}
                  </span>
                </p>
              </div>
              <p suppressHydrationWarning className="mt-1 text-xs leading-relaxed text-muted">
                {cycles} contributions between today and the {formatDate(departure)}{" "}
                airlift, covering the full {naira(pkg.priceNGN)} fare.
              </p>
            </div>

            <Field
              label="Your contribution"
              error={errors.amountPerCycle}
              hint="Set your own figure if the suggestion is too high or you want to finish early."
              htmlFor="r-amount"
            >
              <TextInput
                id="r-amount"
                prefix="₦"
                inputMode="numeric"
                value={form.amountPerCycle === null ? "" : String(form.amountPerCycle)}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "");
                  set("amountPerCycle", digits ? Number(digits) : null);
                }}
                placeholder={String(suggested)}
                invalid={Boolean(errors.amountPerCycle)}
              />
            </Field>

            <Field label="Funding bank" htmlFor="r-bank">
              <Select
                id="r-bank"
                value={form.bankName}
                onChange={(e) => set("bankName", e.target.value)}
              >
                {BANKS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </Select>
            </Field>

            <div className="rounded-2xl border border-line bg-surface p-4">
              <Switch
                checked={form.autoDebit}
                onChange={(v) => set("autoDebit", v)}
                label="Set up a standing order"
                description="We collect automatically on the 28th. You will always be told before and after each attempt."
              />
            </div>
          </>
        ) : null}

        {step.id === "review" ? (
          <>
            <p className="text-sm leading-relaxed text-muted">
              Check everything below, set your security preferences, and activate your
              account.
            </p>

            <div className="rounded-2xl border border-line bg-surface">
              <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
                <p className="text-[0.8125rem] font-bold text-ink">Your details</p>
                <button
                  type="button"
                  onClick={() => setStepIndex(0)}
                  className="text-xs font-semibold text-forest-800 hover:underline dark:text-gold-300"
                >
                  Edit
                </button>
              </div>
              <dl className="px-5 py-2">
                <DataRow
                  label="Name"
                  value={`${form.firstName} ${form.lastName}`.trim() || "—"}
                />
                <DataRow label="Email" value={form.email || "—"} />
                <DataRow label="Phone" value={form.phone || "—"} />
                <DataRow
                  label="Location"
                  value={form.city && form.state ? `${form.city}, ${form.state}` : "—"}
                />
              </dl>
            </div>

            <div className="rounded-2xl border border-line bg-surface">
              <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
                <p className="text-[0.8125rem] font-bold text-ink">Identity</p>
                <button
                  type="button"
                  onClick={() => setStepIndex(2)}
                  className="text-xs font-semibold text-forest-800 hover:underline dark:text-gold-300"
                >
                  Edit
                </button>
              </div>
              <dl className="px-5 py-2">
                <DataRow label="BVN" value={form.bvn ? maskId(form.bvn) : "—"} />
                <DataRow label="NIN" value={form.nin ? maskId(form.nin) : "—"} />
                <DataRow label="Passport" value={form.passportNumber || "—"} />
                <DataRow
                  label="Documents"
                  value={
                    <Badge tone="positive" icon={<CircleCheck className="size-3" />}>
                      2 uploaded
                    </Badge>
                  }
                />
              </dl>
            </div>

            <div className="rounded-2xl border border-line bg-surface">
              <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
                <p className="text-[0.8125rem] font-bold text-ink">Your plan</p>
                <button
                  type="button"
                  onClick={() => setStepIndex(4)}
                  className="text-xs font-semibold text-forest-800 hover:underline dark:text-gold-300"
                >
                  Edit
                </button>
              </div>
              <dl className="px-5 py-2">
                <DataRow
                  label="Beneficiary"
                  value={
                    form.beneficiary === "self"
                      ? `${form.firstName} ${form.lastName}`.trim() || "Myself"
                      : `${form.beneficiaryName} (${form.relationship})`
                  }
                />
                <DataRow label="Package" value={pkg.name} />
                <DataRow label="Goal" value={naira(pkg.priceNGN)} />
                <DataRow
                  label="Travel year"
                  value={
                    <span suppressHydrationWarning>
                      {form.travelYear} · departs {formatDate(departure)}
                    </span>
                  }
                />
                <DataRow
                  label="Contribution"
                  value={
                    <span suppressHydrationWarning>
                      {naira(contribution)}
                      {FREQUENCY_SUFFIX[form.frequency]}
                    </span>
                  }
                />
                <DataRow label="Funding bank" value={form.bankName} />
                <DataRow
                  label="Standing order"
                  value={form.autoDebit ? "Enabled · 28th monthly" : "Manual deposits"}
                />
              </dl>
            </div>

            <div className="space-y-4 rounded-2xl border border-line bg-surface p-5">
              <p className="text-[0.8125rem] font-bold text-ink">Security</p>
              <Switch
                checked={form.twoFactor}
                onChange={(v) => set("twoFactor", v)}
                label="Two-factor authentication"
                description="An OTP is required for sign-in on a new device and for every withdrawal."
              />
              <Switch
                checked={form.biometric}
                onChange={(v) => set("biometric", v)}
                label="Biometric unlock"
                description="Use Face ID or a fingerprint to open HajjPath on this device."
              />
            </div>

            <Field
              label="Referral code"
              hint="Optional. If a friend invited you, both of you earn wallet credit."
              htmlFor="r-ref"
            >
              <TextInput
                id="r-ref"
                value={form.referralCode}
                onChange={(e) => set("referralCode", e.target.value.toUpperCase())}
                placeholder="HAJJ-IBRA27"
              />
            </Field>

            <div className="space-y-3">
              <Checkbox
                label={
                  <>
                    I accept the{" "}
                    <Link
                      href="/legal/terms"
                      className="font-semibold text-forest-800 underline underline-offset-2 dark:text-gold-300"
                    >
                      terms of service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/legal/privacy"
                      className="font-semibold text-forest-800 underline underline-offset-2 dark:text-gold-300"
                    >
                      privacy policy
                    </Link>
                  </>
                }
                description="Including that HajjPath does not allocate Hajj seats — NAHCON and the State Boards do."
                checked={form.acceptTerms}
                onChange={(e) => set("acceptTerms", e.target.checked)}
              />
              {errors.acceptTerms ? (
                <p className="text-xs font-medium text-rose-600">{errors.acceptTerms}</p>
              ) : null}

              <Checkbox
                label="I understand the Shariah-compliant structure"
                description="Deposits are held in non-interest custody and may be placed in Mudarabah pools where returns are shared as profit, not guaranteed."
                checked={form.acceptShariah}
                onChange={(e) => set("acceptShariah", e.target.checked)}
              />
              {errors.acceptShariah ? (
                <p className="text-xs font-medium text-rose-600">{errors.acceptShariah}</p>
              ) : null}
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-forest-700/30 bg-forest-50 p-4 dark:bg-forest-950/50">
              <Landmark className="mt-0.5 size-4 shrink-0 text-forest-700 dark:text-gold-400" />
              <p className="text-xs leading-relaxed text-muted">
                On activation you receive a dedicated virtual account in your own name.
                Every naira you transfer to it is reconciled to this plan within ten
                minutes.
              </p>
            </div>
          </>
        ) : null}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center gap-3 border-t border-line pt-6">
        {stepIndex > 0 ? (
          <Button variant="ghost" onClick={back} disabled={submitting}>
            <ArrowLeft className="size-4" />
            Back
          </Button>
        ) : null}

        {stepIndex < STEPS.length - 1 ? (
          <Button className="ml-auto" size="lg" onClick={next}>
            Continue
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button className="ml-auto" size="lg" onClick={finish} disabled={submitting}>
            {submitting ? "Activating…" : "Activate my account"}
            {!submitting ? <Sparkles className="size-4" /> : null}
          </Button>
        )}
      </div>

      {stepIndex === 0 ? (
        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-forest-800 hover:underline dark:text-gold-300"
          >
            Sign in
          </Link>
        </p>
      ) : null}

      {stepIndex === STEPS.length - 1 ? (
        <p className="mt-5 flex items-center justify-center gap-2 text-xs text-muted">
          <FingerprintPattern className="size-3.5" />
          Your data is encrypted in transit and at rest
        </p>
      ) : null}
    </div>
  );
}
