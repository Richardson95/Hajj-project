import {
  ArrowUpRight,
  Bell,
  CalendarDays,
  Compass,
  LayoutDashboard,
  Store,
  Wallet,
} from "lucide-react";
import { ProgressRing } from "@/components/ui/progress";
import { Kaaba } from "@/components/brand-icons";

/**
 * A faithful, static rendering of the real dashboard, framed in browser chrome.
 * Purely decorative — hidden from assistive technology.
 */
export function DashboardPreview() {
  return (
    <div aria-hidden className="w-full">
      <div className="overflow-hidden rounded-2xl border border-white/15 bg-forest-950/70 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.65)] backdrop-blur-sm">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-3.5 py-2.5">
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-rose-400/70" />
            <span className="size-2.5 rounded-full bg-amber-400/70" />
            <span className="size-2.5 rounded-full bg-emerald-400/70" />
          </span>
          <span className="ml-2 flex-1 truncate rounded-md bg-black/25 px-3 py-1 text-[0.6875rem] text-white/45">
            hajjpath.ng/app
          </span>
        </div>

        {/* App body */}
        <div className="flex bg-sand-50 dark:bg-[#0e1c15]">
          {/* Rail */}
          <div className="hidden w-13 shrink-0 flex-col items-center gap-3 border-r border-line py-4 sm:flex">
            {[LayoutDashboard, Wallet, CalendarDays, Compass, Store].map((RailIcon, i) => (
              <span
                key={i}
                className={
                  i === 0
                    ? "grid size-8 place-items-center rounded-lg bg-forest-800 text-white"
                    : "grid size-8 place-items-center rounded-lg text-muted"
                }
              >
                <RailIcon className="size-4" />
              </span>
            ))}
          </div>

          <div className="min-w-0 flex-1 p-4">
            {/* Top bar */}
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[0.6875rem] text-muted">As-salamu alaykum</p>
                <p className="text-sm font-bold text-ink">Ibrahim Adetunji</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative grid size-7 place-items-center rounded-lg border border-line bg-surface">
                  <Bell className="size-3.5 text-muted" />
                  <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-rose-500" />
                </span>
                <span className="grid size-7 place-items-center rounded-full bg-linear-to-br from-forest-700 to-forest-900 text-[0.625rem] font-bold text-white">
                  IA
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
              {/* Goal ring card */}
              <div className="flex items-center gap-4 rounded-xl border border-line bg-surface p-4">
                <ProgressRing value={61.9} size={104} stroke={9}>
                  <div className="text-center">
                    <p className="tabular text-lg font-extrabold text-ink">62%</p>
                    <p className="text-[0.5625rem] tracking-wide text-muted uppercase">
                      funded
                    </p>
                  </div>
                </ProgressRing>
                <div className="min-w-0">
                  <p className="text-[0.625rem] font-semibold tracking-wider text-muted uppercase">
                    Saved so far
                  </p>
                  <p className="tabular text-xl font-extrabold text-ink">₦5,412,500</p>
                  <p className="text-[0.6875rem] text-muted">of ₦8,750,000 goal</p>
                  <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[0.625rem] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    <ArrowUpRight className="size-3" /> On track for 2027
                  </span>
                </div>
              </div>

              {/* Stat stack */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Departure in", value: "261 days", detail: "20 Apr 2027" },
                  { label: "Monthly plan", value: "₦385,000", detail: "Auto-debit on" },
                  { label: "This month", value: "₦426,360", detail: "2 deposits" },
                  { label: "Group", value: "Al-Amanah", detail: "48 pilgrims" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-line bg-surface p-2.5"
                  >
                    <p className="text-[0.5625rem] font-semibold tracking-wider text-muted uppercase">
                      {s.label}
                    </p>
                    <p className="tabular mt-0.5 text-sm font-bold text-ink">{s.value}</p>
                    <p className="text-[0.625rem] text-muted">{s.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Itinerary strip */}
            <div className="mt-3 rounded-xl border border-line bg-surface p-3">
              <div className="mb-2.5 flex items-center justify-between">
                <p className="text-[0.6875rem] font-bold text-ink">Next in your plan</p>
                <span className="text-[0.625rem] text-muted">Itinerary</span>
              </div>
              <div className="space-y-2">
                {[
                  { t: "05:30", title: "Enter Ihram for Hajj", sub: "8 Dhul-Hijjah · Aziziyah" },
                  { t: "07:30", title: "Transfer to Mina", sub: "Street 56 · Tent 214" },
                ].map((row) => (
                  <div key={row.t} className="flex items-center gap-2.5">
                    <span className="tabular w-9 shrink-0 text-[0.625rem] font-semibold text-forest-700 dark:text-gold-400">
                      {row.t}
                    </span>
                    <span className="grid size-6 shrink-0 place-items-center rounded-md bg-forest-50 text-forest-800 dark:bg-forest-950 dark:text-forest-200">
                      <Kaaba className="size-3.5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[0.6875rem] font-semibold text-ink">
                        {row.title}
                      </span>
                      <span className="block truncate text-[0.625rem] text-muted">
                        {row.sub}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
