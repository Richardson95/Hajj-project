import { cn } from "@/lib/cn";

export function Card({
  className,
  as: Tag = "div",
  ...rest
}: React.HTMLAttributes<HTMLElement> & {
  as?: "div" | "section" | "article" | "li";
}) {
  return (
    <Tag
      className={cn(
        "rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgba(1,68,33,0.04),0_10px_30px_-24px_rgba(1,68,33,0.35)]",
        className,
      )}
      {...rest}
    />
  );
}

export function CardHeader({
  title,
  description,
  action,
  className,
  icon,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4",
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        {icon ? (
          <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-forest-50 text-forest-800 dark:bg-forest-950 dark:text-forest-200">
            {icon}
          </span>
        ) : null}
        <div className="min-w-0">
          <h2 className="text-[0.9375rem] font-semibold text-ink">{title}</h2>
          {description ? (
            <p className="mt-0.5 text-[0.8125rem] leading-relaxed text-muted">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function CardBody({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...rest} />;
}

export function CardFooter({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 border-t border-line px-5 py-3.5",
        className,
      )}
      {...rest}
    />
  );
}
