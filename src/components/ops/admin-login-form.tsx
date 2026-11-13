"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Info, LogIn, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { useOps } from "@/lib/ops/store";
import { DEMO_ADMIN_PASSWORD } from "@/lib/ops/seed";

export function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { adminLogin } = useOps();
  const { toast } = useToast();

  const [email, setEmail] = useState(params.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError("Enter your admin email address.");
      return;
    }
    if (!password) {
      setError("Enter your admin password.");
      return;
    }
    setBusy(true);
    window.setTimeout(() => {
      const result = adminLogin(email, password);
      setBusy(false);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      toast({ title: "Signed in to the operations console" });
      router.push("/ops");
    }, 500);
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 shadow-2xl sm:p-8">
      <Logo href="/" />
      <span className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-gold-50 px-2.5 py-1 text-[0.6875rem] font-medium text-gold-800 dark:bg-gold-950 dark:text-gold-300">
        <ShieldCheck className="size-3.5" />
        Admin access only
      </span>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
        Operations console
      </h1>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">
        Admin accounts only.
      </p>

      <form onSubmit={submit} noValidate className="mt-6 space-y-4">
        <Field label="Admin email" htmlFor="adm-email" required>
          <TextInput
            id="adm-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            placeholder="you@hajjpath.ng"
            invalid={Boolean(error)}
          />
        </Field>
        <Field label="Password" htmlFor="adm-password" required error={error ?? undefined}>
          <div className="relative">
            <TextInput
              id="adm-password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              className="pr-11"
              invalid={Boolean(error)}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted hover:text-ink"
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </Field>
        <Button type="submit" block disabled={busy}>
          <LogIn className="size-4" />
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-gold-500/30 bg-gold-50/70 p-4 dark:bg-gold-950/30">
        <Info className="mt-0.5 size-4 shrink-0 text-gold-700 dark:text-gold-400" />
        <div className="text-[0.8125rem] leading-relaxed text-ink/80">
          <p>
            Demo admin: <strong className="text-ink">admin@hajjpath.ng</strong>, password{" "}
            <strong className="tabular text-ink">{DEMO_ADMIN_PASSWORD}</strong>.
          </p>
          <button
            type="button"
            onClick={() => {
              setEmail("admin@hajjpath.ng");
              setPassword(DEMO_ADMIN_PASSWORD);
              setError(null);
            }}
            className="mt-1 font-semibold text-forest-800 underline underline-offset-2 dark:text-gold-300"
          >
            Fill demo credentials
          </button>
        </div>
      </div>

      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Back to HajjPath
      </Link>
    </div>
  );
}
