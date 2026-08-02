/** Formatting helpers — deterministic so server and client render identically. */

const NGN = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const NGN_PRECISE = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const SAR = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function naira(value: number, precise = false): string {
  return precise ? NGN_PRECISE.format(value) : NGN.format(Math.round(value));
}

export function riyal(value: number): string {
  return `SAR ${SAR.format(value)}`;
}

/** ₦1,250,000 → "₦1.25m" for tight spaces such as chart axes. */
export function compactNaira(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `₦${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 2)}m`;
  if (Math.abs(value) >= 1_000) return `₦${Math.round(value / 1_000)}k`;
  return `₦${value}`;
}

export function percent(value: number, digits = 0): string {
  return `${value.toFixed(digits)}%`;
}

const DATE_MED = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const DATE_LONG = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const DATE_SHORT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  timeZone: "UTC",
});

export function formatDate(iso: string): string {
  return DATE_MED.format(new Date(iso));
}

export function formatLongDate(iso: string): string {
  return DATE_LONG.format(new Date(iso));
}

export function formatShortDate(iso: string): string {
  return DATE_SHORT.format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(d);
  return `${DATE_MED.format(d)} · ${time}`;
}

/** "3 days ago" / "in 2 months" — relative to a supplied "now" for stability. */
export function relativeTime(iso: string, now: Date = new Date()): string {
  const diffMs = new Date(iso).getTime() - now.getTime();
  const abs = Math.abs(diffMs);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31_536_000_000],
    ["month", 2_592_000_000],
    ["week", 604_800_000],
    ["day", 86_400_000],
    ["hour", 3_600_000],
    ["minute", 60_000],
  ];
  for (const [unit, ms] of units) {
    if (abs >= ms) return rtf.format(Math.round(diffMs / ms), unit);
  }
  return "just now";
}

export function initialsOf(first: string, last: string): string {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

/** 08012345678 → 0801 234 5678 */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  return raw;
}

/** 2237458190 → 223•••8190 */
export function maskId(value: string, visible = 4): string {
  if (value.length <= visible * 2) return value;
  return `${value.slice(0, 3)}${"•".repeat(value.length - 3 - visible)}${value.slice(-visible)}`;
}

export function pluralise(count: number, singular: string, plural?: string): string {
  return `${count} ${count === 1 ? singular : (plural ?? `${singular}s`)}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
