import { cn } from "@/lib/cn";

export function Avatar({
  initials,
  tone = "from-forest-700 to-forest-900",
  size = "md",
  className,
  ring,
}: {
  initials: string;
  tone?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  ring?: boolean;
}) {
  const sizes = {
    xs: "size-7 text-[0.625rem]",
    sm: "size-9 text-xs",
    md: "size-11 text-sm",
    lg: "size-14 text-base",
    xl: "size-20 text-2xl",
  }[size];

  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-linear-to-br font-semibold tracking-wide text-white",
        tone,
        sizes,
        ring && "ring-2 ring-surface",
        className,
      )}
    >
      {initials}
    </span>
  );
}

export function Stat({
  label,
  value,
  detail,
  icon,
  tone = "brand",
  className,
}: {
  label: string;
  value: React.ReactNode;
  detail?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: "brand" | "gold" | "info" | "positive" | "danger";
  className?: string;
}) {
  const tones = {
    brand: "bg-forest-50 text-forest-800 dark:bg-forest-950 dark:text-forest-200",
    gold: "bg-gold-50 text-gold-700 dark:bg-gold-950 dark:text-gold-200",
    info: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-200",
    positive: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
    danger: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-200",
  }[tone];

  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-surface p-4 transition hover:border-forest-800/20",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[0.6875rem] font-semibold tracking-wider text-muted uppercase">
          {label}
        </p>
        {icon ? (
          <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg", tones)}>
            {icon}
          </span>
        ) : null}
      </div>
      <p className="tabular mt-2 text-2xl font-bold tracking-tight text-ink">{value}</p>
      {detail ? (
        <p className="mt-1 text-xs leading-relaxed text-muted">{detail}</p>
      ) : null}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-3 text-xs font-bold tracking-[0.18em] text-gold-600 uppercase dark:text-gold-400">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl leading-[1.15] font-bold text-ink sm:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-muted">{description}</p>
      ) : null}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
  breadcrumb,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-6", className)}>
      {breadcrumb ? <div className="mb-2">{breadcrumb}</div> : null}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-[1.75rem]">
            {title}
          </h1>
          {description ? (
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="flex shrink-0 gap-2">{action}</div> : null}
      </div>
    </header>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid place-items-center rounded-2xl border border-dashed border-line-strong bg-surface-muted/40 px-6 py-14 text-center",
        className,
      )}
    >
      {icon ? (
        <span className="mb-4 grid size-14 place-items-center rounded-2xl bg-surface text-muted shadow-sm">
          {icon}
        </span>
      ) : null}
      <p className="text-base font-semibold text-ink">{title}</p>
      {description ? (
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("shimmer rounded-lg bg-surface-muted", className)} aria-hidden />
  );
}

export function Divider({
  label,
  className,
}: {
  label?: string;
  className?: string;
}) {
  if (!label) return <hr className={cn("border-line", className)} />;
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="h-px flex-1 bg-line" />
      <span className="text-xs font-medium tracking-wide text-muted uppercase">
        {label}
      </span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

/** Definition row used across detail panels. */
export function DataRow({
  label,
  value,
  className,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4 border-b border-line py-2.5 last:border-0",
        className,
      )}
    >
      <dt className="text-[0.8125rem] text-muted">{label}</dt>
      <dd className="text-right text-[0.8125rem] font-semibold text-ink">{value}</dd>
    </div>
  );
}
