"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MailCheck, Send } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui/field";

export function ForgotPasswordForm() {
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = identifier.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed);
    const isPhone = /^0\d{10}$/.test(trimmed.replace(/\s/g, ""));
    if (!isEmail && !isPhone) {
      setError("Enter the email address or phone number on your account.");
      return;
    }
    setError(undefined);
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      setSent(true);
    }, 700);
  }

  if (sent) {
    return (
      <div className="text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-forest-50 text-forest-800 dark:bg-forest-950 dark:text-gold-300">
          <MailCheck className="size-6" />
        </span>
        <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-ink">
          Check your inbox
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
          If an account exists for <strong className="text-ink">{identifier}</strong>, a
          reset link is on its way. It expires in thirty minutes.
        </p>
        <p className="mx-auto mt-4 max-w-sm text-xs leading-relaxed text-muted">
          For your security, resetting a password does not change the bank account tied to
          your BVN. Withdrawals still require an OTP to that number.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/auth/login">Back to sign in</ButtonLink>
          <Button variant="outline" onClick={() => setSent(false)}>
            Try a different address
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/auth/login"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Back to sign in
      </Link>

      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-ink">
        Reset your password
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Tell us the email address or phone number on your account and we will send a reset
        link.
      </p>

      <form onSubmit={submit} noValidate className="mt-7 space-y-5">
        <Field
          label="Email or phone number"
          required
          error={error}
          htmlFor="reset-identifier"
        >
          <TextInput
            id="reset-identifier"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              setError(undefined);
            }}
            placeholder="you@example.com or 08034512907"
            autoComplete="username"
            invalid={Boolean(error)}
          />
        </Field>

        <Button type="submit" size="lg" block disabled={busy}>
          {busy ? "Sending…" : "Send reset link"}
          {!busy ? <Send className="size-4" /> : null}
        </Button>
      </form>
    </div>
  );
}
