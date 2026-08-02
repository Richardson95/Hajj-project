import Link from "next/link";
import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primary"
  | "gold"
  | "outline"
  | "ghost"
  | "subtle"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 select-none disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 active:translate-y-px";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-forest-800 text-white shadow-[0_10px_24px_-12px_rgba(1,68,33,0.7)] hover:bg-forest-700 dark:bg-forest-600 dark:hover:bg-forest-500",
  gold: "bg-gold-500 text-forest-950 shadow-[0_10px_24px_-12px_rgba(201,162,39,0.8)] hover:bg-gold-400",
  outline:
    "border border-forest-800/25 bg-transparent text-forest-900 hover:border-forest-800/50 hover:bg-forest-50 dark:border-forest-300/25 dark:text-forest-100 dark:hover:bg-forest-950/60",
  ghost:
    "bg-transparent text-ink/75 hover:bg-surface-muted hover:text-ink",
  subtle:
    "bg-surface-muted text-ink hover:bg-line",
  danger:
    "bg-rose-600 text-white shadow-[0_10px_24px_-12px_rgba(225,29,72,0.7)] hover:bg-rose-500",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-[0.8125rem]",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  className?: string;
  children?: React.ReactNode;
}

type ButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export function Button({
  variant = "primary",
  size = "md",
  block,
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(BASE, VARIANTS[variant], SIZES[size], block && "w-full", className)}
      {...rest}
    />
  );
}

type ButtonLinkProps = CommonProps &
  Omit<React.ComponentProps<typeof Link>, "className" | "children">;

export function ButtonLink({
  variant = "primary",
  size = "md",
  block,
  className,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(BASE, VARIANTS[variant], SIZES[size], block && "w-full", className)}
      {...rest}
    />
  );
}

/** Compact square button used for icon-only affordances. */
export function IconButton({
  label,
  className,
  variant = "ghost",
  ...rest
}: { label: string } & Omit<ButtonProps, "size" | "block">) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        BASE,
        VARIANTS[variant],
        "h-10 w-10 shrink-0 rounded-xl p-0",
        className,
      )}
      {...rest}
    />
  );
}
