"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, FingerprintPattern, Info, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, TextInput } from "@/components/ui/field";
import { Divider } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";
import { useApp } from "@/lib/store";
import { DEMO_USER } from "@/lib/data/account";

interface Errors {
  identifier?: string;
  password?: string;
}

export function LoginForm() {
  const router = useRouter();
  const { login } = useApp();
  const { toast } = useToast();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  function validate(): boolean {
    const next: Errors = {};
    const trimmed = identifier.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed);
    const isPhone = /^0\d{10}$/.test(trimmed.replace(/\s/g, ""));
    if (!isEmail && !isPhone)
      next.identifier = "Enter the email address or phone number on your account.";
    if (password.length < 6) next.password = "Your password is at least 6 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setBusy(true);
    window.setTimeout(() => {
      login();
      toast({
        title: `Welcome back, ${DEMO_USER.firstName}`,
        description: "As-salamu alaykum. Your plan is on track for 2027.",
      });
      router.push("/app");
    }, 700);
  }

  function fillDemo() {
    setIdentifier(DEMO_USER.email);
    setPassword("hajjpath2027");
    setErrors({});
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">Welcome back</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Sign in to check your progress, top up your plan and pick up where your itinerary
        left off.
      </p>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-gold-500/30 bg-gold-50/70 p-4 dark:bg-gold-950/30">
        <Info className="mt-0.5 size-4 shrink-0 text-gold-700 dark:text-gold-400" />
        <div className="min-w-0 text-[0.8125rem] leading-relaxed text-ink/80">
          <p className="font-semibold text-ink">This is a live demo</p>
          <p className="mt-0.5">
            Any valid email or 11-digit phone number and a 6+ character password will sign
            you in as Ibrahim Adetunji.
          </p>
          <button
            type="button"
            onClick={fillDemo}
            className="mt-2 font-semibold text-forest-800 underline underline-offset-2 dark:text-gold-300"
          >
            Fill the demo credentials
          </button>
        </div>
      </div>

      <form onSubmit={submit} noValidate className="mt-7 space-y-5">
        <Field
          label="Email or phone number"
          required
          error={errors.identifier}
          htmlFor="login-identifier"
        >
          <TextInput
            id="login-identifier"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              setErrors((x) => ({ ...x, identifier: undefined }));
            }}
            placeholder="you@example.com or 08034512907"
            autoComplete="username"
            invalid={Boolean(errors.identifier)}
          />
        </Field>

        <Field label="Password" required error={errors.password} htmlFor="login-password">
          <div className="relative">
            <TextInput
              id="login-password"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((x) => ({ ...x, password: undefined }));
              }}
              placeholder="••••••••"
              autoComplete="current-password"
              className="pr-11"
              invalid={Boolean(errors.password)}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-2 text-muted transition hover:bg-surface-muted hover:text-ink"
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </Field>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Checkbox
            label="Keep me signed in"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="border-0 bg-transparent p-0 hover:border-0 has-checked:bg-transparent dark:has-checked:bg-transparent"
          />
          <Link
            href="/auth/forgot-password"
            className="text-sm font-medium text-forest-800 hover:underline dark:text-gold-300"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" block disabled={busy}>
          {busy ? "Signing you in…" : "Sign in"}
          {!busy ? <LogIn className="size-4" /> : null}
        </Button>

        <Divider label="or" />

        <Button
          type="button"
          variant="outline"
          size="lg"
          block
          onClick={() => {
            login();
            toast({
              title: "Signed in with biometrics",
              description: "Face ID verified on this device.",
            });
            router.push("/app");
          }}
        >
          <FingerprintPattern className="size-4" />
          Use biometric unlock
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/register"
          className="font-semibold text-forest-800 hover:underline dark:text-gold-300"
        >
          Start your plan
        </Link>
      </p>
    </div>
  );
}
