"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Clock,
  Compass,
  Footprints,
  Info,
  MapPin,
  Navigation,
  Search,
  WifiOff,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, Pill } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState, PageHeader } from "@/components/ui/misc";
import { TextInput } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { Icon } from "@/components/icon";
import { MapCanvas } from "@/components/app/map-canvas";
import { POI_CATEGORY_META, POIS } from "@/lib/data/map";
import type { Poi, PoiCategory } from "@/lib/types";
import { cn } from "@/lib/cn";

const CATEGORIES = Object.keys(POI_CATEGORY_META) as PoiCategory[];

function MapPageInner() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [active, setActive] = useState<PoiCategory[]>(CATEGORIES);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    searchParams.get("poi"),
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return POIS.filter(
      (p) =>
        active.includes(p.category) &&
        (!q ||
          p.name.toLowerCase().includes(q) ||
          p.zone.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)),
    );
  }, [active, query]);

  const selected = POIS.find((p) => p.id === selectedId) ?? null;

  function toggleCategory(c: PoiCategory) {
    setActive((a) => (a.includes(c) ? a.filter((x) => x !== c) : [...a, c]));
  }

  function directions(poi: Poi) {
    toast({
      title: `Navigating to ${poi.name}`,
      description: `${poi.walkMinutes === 0 ? "You are here" : `${poi.walkMinutes} minutes on foot from your camp`} · ${poi.zone}`,
      tone: "info",
    });
  }

  return (
    <>
      <PageHeader
        title="Live map"
        description="Camps, holy sites, hospitals, water points and coach bays across Makkah and the Mashaer."
        action={
          <ButtonLink href="/app/find-me" variant="outline">
            <Compass className="size-4" />
            Find my group
          </ButtonLink>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <Card>
            <CardBody className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-0 flex-1 sm:max-w-xs">
                  <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
                  <TextInput
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search a place or zone…"
                    className="pl-9"
                    aria-label="Search the map"
                  />
                </div>
                <Badge tone="positive" icon={<WifiOff className="size-3" />}>
                  Cached offline
                </Badge>
                <span className="tabular text-xs text-muted">
                  {visible.length} of {POIS.length} shown
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => {
                  const meta = POI_CATEGORY_META[c];
                  const on = active.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCategory(c)}
                      aria-pressed={on}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition",
                        on
                          ? "border-transparent text-white"
                          : "border-line bg-surface text-muted hover:border-forest-800/30",
                      )}
                      style={on ? { backgroundColor: meta.colour } : undefined}
                    >
                      <Icon name={meta.icon} className="size-3.5" />
                      {meta.label}
                    </button>
                  );
                })}
              </div>

              <MapCanvas
                pois={visible}
                selectedId={selectedId}
                onSelect={(p) => setSelectedId(p.id)}
              />

              <p className="flex items-start gap-2 text-xs leading-relaxed text-muted">
                <Info className="mt-0.5 size-3.5 shrink-0 text-forest-700 dark:text-gold-400" />
                A schematic of the Mashaer, not a survey map. Positions show relative
                geography between Makkah, Mina, Muzdalifah and Arafat so you can orient
                yourself quickly; walking times are measured from your assigned camp.
              </p>
            </CardBody>
          </Card>

          {/* Selected detail */}
          {selected ? (
            <Card>
              <CardHeader
                title={selected.name}
                description={selected.arabicName}
                icon={<Icon name={POI_CATEGORY_META[selected.category].icon} className="size-4" />}
                action={
                  <Button size="sm" onClick={() => directions(selected)}>
                    <Navigation className="size-3.5" />
                    Directions
                  </Button>
                }
              />
              <CardBody className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Pill tone="brand">{selected.zone}</Pill>
                  <Pill tone="neutral">{POI_CATEGORY_META[selected.category].label}</Pill>
                  <Pill tone={selected.open24h ? "positive" : "warning"}>
                    {selected.open24h ? "Open 24 hours" : "Limited hours"}
                  </Pill>
                  <Pill tone="info" icon={<Footprints className="size-3" />}>
                    {selected.walkMinutes === 0
                      ? "You are here"
                      : `${selected.walkMinutes} min walk`}
                  </Pill>
                </div>
                <p className="text-sm leading-relaxed text-muted">
                  {selected.description}
                </p>
              </CardBody>
            </Card>
          ) : null}
        </div>

        {/* Place list */}
        <Card className="lg:sticky lg:top-22 lg:self-start">
          <CardHeader
            title="Places"
            description="Tap any place to locate it on the map."
            icon={<MapPin className="size-4" />}
          />
          {visible.length === 0 ? (
            <CardBody>
              <EmptyState
                title="Nothing matches"
                description="Try clearing a filter or searching for a different place."
              />
            </CardBody>
          ) : (
            <ul className="max-h-[32rem] divide-y divide-line overflow-y-auto">
              {visible.map((poi) => {
                const meta = POI_CATEGORY_META[poi.category];
                const isSelected = poi.id === selectedId;
                return (
                  <li key={poi.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(poi.id)}
                      className={cn(
                        "flex w-full items-start gap-3 px-5 py-3.5 text-left transition hover:bg-surface-muted/60",
                        isSelected && "bg-forest-50/60 dark:bg-forest-950/40",
                      )}
                    >
                      <span
                        className="grid size-8 shrink-0 place-items-center rounded-lg text-white"
                        style={{ backgroundColor: meta.colour }}
                      >
                        <Icon name={meta.icon} className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.8125rem] font-semibold text-ink">
                          {poi.name}
                        </span>
                        <span className="mt-0.5 flex items-center gap-2 text-[0.6875rem] text-muted">
                          <span>{poi.zone}</span>
                          {poi.walkMinutes > 0 ? (
                            <>
                              <span aria-hidden>·</span>
                              <span className="inline-flex items-center gap-1">
                                <Clock className="size-3" />
                                {poi.walkMinutes} min
                              </span>
                            </>
                          ) : null}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}

export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div className="grid h-64 place-items-center text-sm text-muted">
          Loading map…
        </div>
      }
    >
      <MapPageInner />
    </Suspense>
  );
}
