import { Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/data/marketing";
import { Avatar } from "@/components/ui/misc";

export function Testimonials() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {TESTIMONIALS.map((t) => (
        <figure
          key={t.name}
          className="flex flex-col rounded-2xl border border-line bg-surface p-6 transition duration-300 hover:-translate-y-1 hover:border-forest-800/25 hover:shadow-[0_20px_50px_-30px_rgba(1,68,33,0.5)]"
        >
          <Quote
            aria-hidden
            className="size-7 shrink-0 text-gold-400/70 dark:text-gold-500/60"
          />
          <blockquote className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-ink/85">
            {t.quote}
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
            <Avatar initials={t.initials} tone={t.tone} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{t.name}</p>
              <p className="truncate text-xs text-muted">{t.role}</p>
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
