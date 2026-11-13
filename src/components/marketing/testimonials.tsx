import { TESTIMONIALS } from "@/lib/data/marketing";
import { Avatar } from "@/components/ui/misc";

export function Testimonials() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {TESTIMONIALS.map((t) => (
        <figure key={t.name} className="flex flex-col rounded-xl border border-line bg-surface p-6">
          <blockquote className="flex-1 text-[0.9375rem] leading-relaxed text-ink">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-3">
            <Avatar initials={t.initials} tone={t.tone} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">{t.name}</p>
              <p className="truncate text-xs text-muted">{t.role}</p>
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
