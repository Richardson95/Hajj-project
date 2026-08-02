import { cn } from "@/lib/cn";

export type BadgeTone =
  | "brand"
  | "gold"
  | "positive"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

const TONES: Record<BadgeTone, string> = {
  brand:
    "bg-forest-50 text-forest-800 ring-forest-800/15 dark:bg-forest-950 dark:text-forest-200 dark:ring-forest-300/20",
  gold: "bg-gold-50 text-gold-800 ring-gold-600/20 dark:bg-gold-950 dark:text-gold-200 dark:ring-gold-400/20",
  positive:
    "bg-emerald-50 text-emerald-800 ring-emerald-600/20 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-400/20",
  warning:
    "bg-amber-50 text-amber-800 ring-amber-600/20 dark:bg-amber-950 dark:text-amber-200 dark:ring-amber-400/20",
  danger:
    "bg-rose-50 text-rose-800 ring-rose-600/20 dark:bg-rose-950 dark:text-rose-200 dark:ring-rose-400/20",
  info: "bg-sky-50 text-sky-800 ring-sky-600/20 dark:bg-sky-950 dark:text-sky-200 dark:ring-sky-400/20",
  neutral: "bg-surface-muted text-muted ring-line",
};

export function Badge({
  tone = "neutral",
  className,
  children,
  icon,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wide uppercase ring-1 ring-inset",
        TONES[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

/** Softer, sentence-case pill used inside dense tables and lists. */
export function Pill({
  tone = "neutral",
  className,
  children,
  icon,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium ring-1 ring-inset",
        TONES[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
