"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

export function OtpInput({
  value,
  onChange,
  length = 6,
  invalid,
  autoFocus,
}: {
  value: string;
  onChange: (next: string) => void;
  length?: number;
  invalid?: boolean;
  autoFocus?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  function setDigit(index: number, digit: string) {
    const chars = value.padEnd(length, " ").split("");
    chars[index] = digit || " ";
    onChange(chars.join("").replace(/\s+$/, "").replace(/\s/g, ""));
  }

  function handleChange(index: number, raw: string) {
    const digits = raw.replace(/\D/g, "");
    if (!digits) {
      setDigit(index, "");
      return;
    }
    if (digits.length > 1) {
      // Paste of a full code
      onChange(digits.slice(0, length));
      refs.current[Math.min(digits.length, length - 1)]?.focus();
      return;
    }
    const chars = value.split("");
    chars[index] = digits;
    onChange(chars.join("").slice(0, length));
    if (index < length - 1) refs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      refs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      refs.current[index + 1]?.focus();
    }
  }

  return (
    <div className="flex gap-2 sm:gap-3">
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={length}
          aria-label={`Digit ${i + 1} of ${length}`}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={cn(
            "tabular h-14 w-full rounded-xl border bg-surface text-center text-xl font-bold text-ink shadow-[inset_0_1px_2px_rgba(1,68,33,0.04)] outline-none transition",
            "focus:border-forest-700 focus:ring-4 focus:ring-forest-800/10 dark:focus:border-forest-400",
            invalid ? "border-rose-500" : "border-line",
            value[i] && "border-forest-700 dark:border-forest-400",
          )}
        />
      ))}
    </div>
  );
}
