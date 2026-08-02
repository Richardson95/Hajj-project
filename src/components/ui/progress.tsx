import { cn } from "@/lib/cn";

export function ProgressBar({
  value,
  className,
  tone = "brand",
  label,
  showValue,
}: {
  value: number;
  className?: string;
  tone?: "brand" | "gold" | "positive" | "warning" | "danger";
  label?: string;
  showValue?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, value));
  const fill = {
    brand: "bg-linear-to-r from-forest-700 to-forest-500",
    gold: "bg-linear-to-r from-gold-600 to-gold-400",
    positive: "bg-linear-to-r from-emerald-700 to-emerald-500",
    warning: "bg-linear-to-r from-amber-600 to-amber-400",
    danger: "bg-linear-to-r from-rose-700 to-rose-500",
  }[tone];

  return (
    <div className={className}>
      {label || showValue ? (
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          {label ? (
            <span className="text-xs font-medium text-muted">{label}</span>
          ) : null}
          {showValue ? (
            <span className="tabular text-xs font-semibold text-ink">
              {pct.toFixed(pct % 1 === 0 ? 0 : 1)}%
            </span>
          ) : null}
        </div>
      ) : null}
      <div
        className="h-2 overflow-hidden rounded-full bg-surface-muted"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-700", fill)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function ProgressRing({
  value,
  size = 176,
  stroke = 14,
  children,
  className,
  trackClassName,
}: {
  value: number;
  size?: number;
  stroke?: number;
  children?: React.ReactNode;
  className?: string;
  trackClassName?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div
      className={cn("relative grid place-items-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        role="img"
        aria-label={`${pct.toFixed(1)}% complete`}
      >
        <defs>
          <linearGradient id="hp-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0a5c31" />
            <stop offset="55%" stopColor="#014421" />
            <stop offset="100%" stopColor="#c9a227" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className={cn("stroke-forest-100 dark:stroke-forest-950", trackClassName)}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#hp-ring)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        {children}
      </div>
    </div>
  );
}

/** Slim step indicator used by the onboarding wizard. */
export function StepDots({
  total,
  current,
  className,
}: {
  total: number;
  current: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1.5", className)} aria-hidden>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            i < current
              ? "w-6 bg-forest-800 dark:bg-forest-400"
              : i === current
                ? "w-8 bg-gold-500"
                : "w-3 bg-line-strong",
          )}
        />
      ))}
    </div>
  );
}
