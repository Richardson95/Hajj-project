"use client";

import { useId } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

const CONTROL =
  "w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink shadow-[inset_0_1px_2px_rgba(1,68,33,0.04)] outline-none transition placeholder:text-muted/70 focus:border-forest-700 focus:ring-4 focus:ring-forest-800/10 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:border-forest-400 dark:focus:ring-forest-300/10";

export function Field({
  label,
  hint,
  error,
  required,
  children,
  className,
  htmlFor,
}: {
  label: string;
  hint?: React.ReactNode;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-1 text-[0.8125rem] font-medium text-ink"
      >
        {label}
        {required ? <span className="text-rose-600">*</span> : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{error}</p>
      ) : hint ? (
        <p className="text-xs leading-relaxed text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextInput({
  className,
  prefix,
  invalid,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {
  prefix?: string;
  invalid?: boolean;
}) {
  if (prefix) {
    return (
      <div
        className={cn(
          "flex items-stretch overflow-hidden rounded-xl border border-line bg-surface shadow-[inset_0_1px_2px_rgba(1,68,33,0.04)] transition focus-within:border-forest-700 focus-within:ring-4 focus-within:ring-forest-800/10 dark:focus-within:border-forest-400",
          invalid && "border-rose-500",
          className,
        )}
      >
        <span className="grid place-items-center border-r border-line bg-surface-muted px-3 text-sm font-semibold text-muted">
          {prefix}
        </span>
        <input
          className="w-full bg-transparent px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-muted/70 disabled:cursor-not-allowed"
          {...rest}
        />
      </div>
    );
  }
  return (
    <input className={cn(CONTROL, invalid && "border-rose-500", className)} {...rest} />
  );
}

export function TextArea({
  className,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(CONTROL, "min-h-28 resize-y", className)} {...rest} />;
}

export function Select({
  className,
  children,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={cn(CONTROL, "appearance-none pr-10", className)} {...rest}>
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted"
      />
    </div>
  );
}

export function Checkbox({
  label,
  description,
  className,
  ...rest
}: { label: React.ReactNode; description?: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <label
      htmlFor={rest.id ?? id}
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-surface p-3.5 transition hover:border-forest-800/30 has-checked:border-forest-700 has-checked:bg-forest-50 dark:has-checked:bg-forest-950/50",
        className,
      )}
    >
      <span className="relative mt-0.5 grid size-5 shrink-0 place-items-center">
        <input
          id={rest.id ?? id}
          type="checkbox"
          className="peer size-5 appearance-none rounded-md border border-line-strong bg-surface transition checked:border-forest-800 checked:bg-forest-800 focus-visible:outline-2 focus-visible:outline-offset-2"
          {...rest}
        />
        <Check
          aria-hidden
          className="pointer-events-none absolute size-3.5 text-white opacity-0 transition peer-checked:opacity-100"
          strokeWidth={3}
        />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-ink">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-xs leading-relaxed text-muted">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}

export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink">{label}</p>
        {description ? (
          <p className="mt-0.5 text-xs leading-relaxed text-muted">{description}</p>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50",
          checked ? "bg-forest-800 dark:bg-forest-500" : "bg-line-strong",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform",
            checked && "translate-x-5",
          )}
        />
      </button>
    </div>
  );
}

export function RadioCard({
  checked,
  onSelect,
  title,
  description,
  meta,
  className,
}: {
  checked: boolean;
  onSelect: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={checked}
      className={cn(
        "flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition",
        checked
          ? "border-forest-700 bg-forest-50 ring-2 ring-forest-800/15 dark:bg-forest-950/60"
          : "border-line bg-surface hover:border-forest-800/30 hover:bg-surface-muted",
        className,
      )}
    >
      <span
        className={cn(
          "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2 transition",
          checked ? "border-forest-800 dark:border-forest-400" : "border-line-strong",
        )}
      >
        <span
          className={cn(
            "size-2.5 rounded-full bg-forest-800 transition dark:bg-forest-400",
            checked ? "scale-100" : "scale-0",
          )}
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-ink">{title}</span>
        {description ? (
          <span className="mt-1 block text-xs leading-relaxed text-muted">
            {description}
          </span>
        ) : null}
      </span>
      {meta ? <span className="shrink-0 text-right">{meta}</span> : null}
    </button>
  );
}
