"use client";

import { Icon } from "@/components/icon";
import { POI_CATEGORY_META } from "@/lib/data/map";
import type { GroupMember, Poi } from "@/lib/types";
import { cn } from "@/lib/cn";

const ZONES = [
  { id: "makkah", label: "Makkah", cx: 15, cy: 52, rx: 13, ry: 16 },
  { id: "aziziyah", label: "Aziziyah", cx: 33, cy: 43, rx: 8, ry: 10 },
  { id: "mina", label: "Mina", cx: 55, cy: 34, rx: 13, ry: 11 },
  { id: "muzdalifah", label: "Muzdalifah", cx: 70, cy: 45, rx: 9, ry: 9 },
  { id: "arafat", label: "Arafat", cx: 87, cy: 56, rx: 12, ry: 13 },
];

const ROUTE = "M15,52 L33,43 L48,36 L57,35 L70,45 L87,56";

export function MapCanvas({
  pois,
  members = [],
  selectedId,
  onSelect,
  showMembers = false,
  className,
}: {
  pois: Poi[];
  members?: GroupMember[];
  selectedId?: string | null;
  onSelect?: (poi: Poi) => void;
  showMembers?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-line bg-sand-100 dark:bg-forest-950",
        className,
      )}
    >
      {/* Terrain wash */}
      <div className="map-grid absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_60%,rgba(1,68,33,0.10),transparent_45%),radial-gradient(circle_at_85%_55%,rgba(201,162,39,0.12),transparent_45%)]" />

      {/* Zones + route */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
        aria-hidden
      >
        {ZONES.map((z) => (
          <g key={z.id}>
            <ellipse
              cx={z.cx}
              cy={z.cy}
              rx={z.rx}
              ry={z.ry}
              className="fill-forest-800/8 stroke-forest-800/25 dark:fill-forest-300/8 dark:stroke-forest-300/25"
              strokeWidth={0.25}
              strokeDasharray="1.5 1"
            />
          </g>
        ))}
        <path
          d={ROUTE}
          fill="none"
          className="stroke-gold-600/70"
          strokeWidth={0.5}
          strokeDasharray="2 1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Zone labels */}
      {ZONES.map((z) => (
        <span
          key={z.id}
          className="pointer-events-none absolute -translate-x-1/2 text-[0.5rem] font-bold tracking-[0.16em] text-forest-800/45 uppercase sm:text-[0.625rem] dark:text-forest-200/40"
          style={{ left: `${z.cx}%`, top: `${z.cy - z.ry - 3}%` }}
        >
          {z.label}
        </span>
      ))}

      {/* POI markers */}
      {pois.map((poi) => {
        const meta = POI_CATEGORY_META[poi.category];
        const active = selectedId === poi.id;
        return (
          <button
            key={poi.id}
            type="button"
            onClick={() => onSelect?.(poi)}
            aria-label={`${poi.name} — ${meta.label}`}
            aria-pressed={active}
            className={cn(
              "group absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition",
              active ? "z-30 scale-125" : "z-10 hover:z-20 hover:scale-110",
            )}
            style={{ left: `${poi.x}%`, top: `${poi.y}%` }}
          >
            <span
              className={cn(
                "grid size-6 place-items-center rounded-full text-white shadow-md ring-2 transition sm:size-7",
                active ? "ring-white" : "ring-white/70",
              )}
              style={{ backgroundColor: meta.colour }}
            >
              <Icon name={meta.icon} className="size-3 sm:size-3.5" />
            </span>
            <span
              className={cn(
                "pointer-events-none absolute top-full left-1/2 mt-1 w-max max-w-36 -translate-x-1/2 rounded-md bg-forest-950/90 px-1.5 py-0.5 text-[0.5625rem] leading-tight font-medium text-white transition",
                active ? "opacity-100" : "opacity-0 group-hover:opacity-100",
              )}
            >
              {poi.name}
            </span>
          </button>
        );
      })}

      {/* Group members */}
      {showMembers
        ? members.map((m) => (
            <span
              key={m.id}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${m.x}%`, top: `${m.y}%` }}
              title={`${m.name} — ${m.status}`}
            >
              <span
                className={cn(
                  "grid size-6 place-items-center rounded-full bg-linear-to-br text-[0.5rem] font-bold text-white ring-2 ring-white sm:size-7 sm:text-[0.625rem]",
                  m.avatarTone,
                  m.status === "assistance" && "animate-[pulse-ring_2s_infinite]",
                )}
              >
                {m.initials}
              </span>
              {m.status === "assistance" ? (
                <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
              ) : null}
            </span>
          ))
        : null}

      {/* Compass */}
      <div className="pointer-events-none absolute top-3 right-3 grid size-9 place-items-center rounded-full border border-line bg-surface/80 text-[0.5625rem] font-bold text-muted backdrop-blur-sm">
        <span className="absolute top-0.5 text-forest-800 dark:text-gold-400">N</span>
        <span className="mt-2 h-4 w-px bg-line-strong" />
      </div>

      {/* Scale */}
      <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg border border-line bg-surface/80 px-2 py-1 backdrop-blur-sm">
        <span className="h-0.5 w-8 bg-ink/60" />
        <span className="text-[0.5625rem] font-medium text-muted">5 km</span>
      </div>
    </div>
  );
}
