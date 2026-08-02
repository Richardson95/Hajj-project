"use client";

import { cn } from "@/lib/cn";

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

/** Pill-style switcher for filtering lists. */
export function SegmentedControl<T extends string>({
  items,
  value,
  onChange,
  className,
  size = "md",
}: {
  items: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "no-scrollbar flex gap-1 overflow-x-auto rounded-xl border border-line bg-surface-muted p-1",
        className,
      )}
    >
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange(item.id)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-lg font-medium whitespace-nowrap transition",
              size === "sm" ? "px-3 py-1.5 text-xs" : "px-3.5 py-2 text-[0.8125rem]",
              active
                ? "bg-surface text-ink shadow-sm"
                : "text-muted hover:text-ink",
            )}
          >
            {item.icon}
            {item.label}
            {typeof item.count === "number" ? (
              <span
                className={cn(
                  "tabular rounded-md px-1.5 py-0.5 text-[0.6875rem] font-semibold",
                  active
                    ? "bg-forest-100 text-forest-800 dark:bg-forest-900 dark:text-forest-200"
                    : "bg-line text-muted",
                )}
              >
                {item.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

/** Underlined tabs for page-level sections. */
export function Tabs<T extends string>({
  items,
  value,
  onChange,
  className,
}: {
  items: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("no-scrollbar overflow-x-auto border-b border-line", className)}>
      <div role="tablist" className="flex min-w-max gap-1">
        {items.map((item) => {
          const active = item.id === value;
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => onChange(item.id)}
              className={cn(
                "relative inline-flex items-center gap-2 px-3.5 py-3 text-sm font-medium whitespace-nowrap transition",
                active ? "text-forest-800 dark:text-forest-200" : "text-muted hover:text-ink",
              )}
            >
              {item.icon}
              {item.label}
              {typeof item.count === "number" ? (
                <span className="tabular rounded-md bg-surface-muted px-1.5 py-0.5 text-[0.6875rem] font-semibold text-muted">
                  {item.count}
                </span>
              ) : null}
              {active ? (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-forest-800 dark:bg-forest-300" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
