import Link from "next/link";
import { cn } from "@/lib/cn";
import { HajjPathMark } from "./brand-icons";

export function Logo({
  className,
  size = 34,
  invert = false,
  showTagline = false,
  href = "/",
}: {
  className?: string;
  size?: number;
  invert?: boolean;
  showTagline?: boolean;
  href?: string | null;
}) {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <HajjPathMark size={size} className="shrink-0 rounded-[0.7rem]" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[1.0625rem] font-extrabold tracking-tight",
            invert ? "text-white" : "text-ink",
          )}
        >
          Hajj
          <span className={invert ? "text-gold-400" : "text-forest-700 dark:text-gold-400"}>
            Path
          </span>
        </span>
        {showTagline ? (
          <span
            className={cn(
              "mt-1 text-[0.625rem] font-medium tracking-[0.14em] uppercase",
              invert ? "text-white/60" : "text-muted",
            )}
          >
            Intention to completion
          </span>
        ) : null}
      </span>
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} aria-label="HajjPath home" className="rounded-xl">
      {content}
    </Link>
  );
}
