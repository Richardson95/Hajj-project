"use client";

import { useMemo, useState } from "react";
import {
  Camera,
  Download,
  Image as ImageIcon,
  Play,
  Plus,
  Share2,
  Trash2,
  Video,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, Pill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader, Stat } from "@/components/ui/misc";
import { Field, Select, TextInput } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { SegmentedControl } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { Icon, type IconName } from "@/components/icon";
import { useApp } from "@/lib/store";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";

type Filter = "all" | "photo" | "video";

const LOCATIONS = [
  "Masjid al-Haram, Makkah",
  "Masjid an-Nabawi, Madinah",
  "Mina",
  "Arafat",
  "Muzdalifah",
  "Jamarat Bridge",
  "Aziziyah, Makkah",
  "Jeddah",
];

const TONES = [
  "from-forest-700 via-forest-800 to-forest-950",
  "from-gold-400 via-gold-600 to-forest-900",
  "from-sky-700 via-forest-800 to-forest-950",
  "from-amber-600 via-amber-800 to-forest-950",
  "from-teal-700 via-forest-800 to-forest-950",
  "from-indigo-800 via-forest-900 to-forest-950",
  "from-rose-700 via-forest-800 to-forest-950",
];

const ICON_CHOICES: { id: IconName; label: string }[] = [
  { id: "kaaba", label: "Ka'bah" },
  { id: "mosque", label: "Mosque" },
  { id: "tent", label: "Camp" },
  { id: "sun", label: "Arafat" },
  { id: "mountain", label: "Muzdalifah" },
  { id: "droplets", label: "Zamzam" },
  { id: "gift", label: "Souvenir" },
  { id: "camera", label: "General" },
];

export default function GalleryPage() {
  const { gallery, addGalleryItem, removeGalleryItem } = useApp();
  const { toast } = useToast();

  const [filter, setFilter] = useState<Filter>("all");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    caption: "",
    location: LOCATIONS[0],
    type: "photo" as "photo" | "video",
    icon: "kaaba" as IconName,
  });
  const [error, setError] = useState<string | undefined>();

  const visible = useMemo(
    () => (filter === "all" ? gallery : gallery.filter((g) => g.type === filter)),
    [gallery, filter],
  );

  const item = gallery.find((g) => g.id === selected) ?? null;

  function save() {
    if (draft.caption.trim().length < 3) {
      setError("Give this memory a caption.");
      return;
    }
    addGalleryItem({
      type: draft.type,
      caption: draft.caption.trim(),
      location: draft.location,
      date: new Date().toISOString(),
      tone: TONES[Math.floor(Math.random() * TONES.length)],
      icon: draft.icon,
      durationSec: draft.type === "video" ? 45 : undefined,
    });
    setDraft({ caption: "", location: LOCATIONS[0], type: "photo", icon: "kaaba" });
    setError(undefined);
    setUploadOpen(false);
    toast({ title: "Added to your gallery" });
  }

  return (
    <>
      <PageHeader
        title="Gallery"
        description="Photographs and video from every stage of the journey, tagged by place and date."
        action={
          <Button onClick={() => setUploadOpen(true)}>
            <Plus className="size-4" />
            Add a memory
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="Memories saved"
          value={gallery.length}
          detail="Preserved long after the phone is replaced"
          icon={<Camera className="size-4" />}
        />
        <Stat
          label="Photographs"
          value={gallery.filter((g) => g.type === "photo").length}
          detail="Tagged by location and rite"
          icon={<ImageIcon className="size-4" />}
          tone="gold"
        />
        <Stat
          label="Videos"
          value={gallery.filter((g) => g.type === "video").length}
          detail="Talbiyah, Tawaf and the walk to Jamarat"
          icon={<Video className="size-4" />}
          tone="info"
        />
      </div>

      <SegmentedControl
        className="mt-5"
        items={[
          { id: "all", label: "Everything", count: gallery.length },
          {
            id: "photo",
            label: "Photos",
            count: gallery.filter((g) => g.type === "photo").length,
          },
          {
            id: "video",
            label: "Videos",
            count: gallery.filter((g) => g.type === "video").length,
          },
        ]}
        value={filter}
        onChange={(f) => setFilter(f as Filter)}
      />

      {visible.length === 0 ? (
        <EmptyState
          className="mt-5"
          icon={<Camera className="size-6" />}
          title="Nothing here yet"
          description="Add your first memory and it will be kept with the rest of your pilgrimage record."
          action={<Button onClick={() => setUploadOpen(true)}>Add a memory</Button>}
        />
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setSelected(g.id)}
              className="group overflow-hidden rounded-2xl border border-line bg-surface text-left transition duration-300 hover:-translate-y-1 hover:border-forest-800/25 hover:shadow-[0_22px_50px_-36px_rgba(1,68,33,0.7)]"
            >
              <div
                className={cn(
                  "relative grid aspect-4/3 place-items-center bg-linear-to-br text-white",
                  g.tone,
                )}
              >
                <div className="pattern-islamic absolute inset-0 opacity-40" />
                <Icon name={g.icon} className="relative size-12 opacity-90" />
                {g.type === "video" ? (
                  <span className="absolute right-2.5 bottom-2.5 inline-flex items-center gap-1 rounded-lg bg-black/45 px-2 py-1 text-[0.625rem] font-semibold backdrop-blur-sm">
                    <Play className="size-3 fill-current" />
                    {g.durationSec}s
                  </span>
                ) : null}
              </div>
              <div className="p-3.5">
                <p className="line-clamp-2 text-[0.8125rem] leading-snug font-semibold text-ink">
                  {g.caption}
                </p>
                <p className="mt-1 truncate text-[0.6875rem] text-muted">{g.location}</p>
                <p className="text-[0.6875rem] text-muted">{formatDate(g.date)}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Modal
        open={item !== null}
        onClose={() => setSelected(null)}
        title={item?.caption ?? ""}
        description={item ? `${item.location} · ${formatDate(item.date)}` : undefined}
        size="lg"
        footer={
          item ? (
            <>
              <Button
                variant="ghost"
                onClick={() => {
                  removeGalleryItem(item.id);
                  setSelected(null);
                  toast({ title: "Removed from your gallery", tone: "info" });
                }}
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard?.writeText(
                    `${item.caption} — ${item.location}, ${formatDate(item.date)}`,
                  );
                  toast({ title: "Caption copied", tone: "info" });
                }}
              >
                <Share2 className="size-4" />
                Share
              </Button>
              <Button
                onClick={() =>
                  toast({
                    title: "Download queued",
                    description: "The original file will be saved to your device.",
                    tone: "info",
                  })
                }
              >
                <Download className="size-4" />
                Download
              </Button>
            </>
          ) : undefined
        }
      >
        {item ? (
          <div className="space-y-4">
            <div
              className={cn(
                "relative grid aspect-video place-items-center overflow-hidden rounded-2xl bg-linear-to-br text-white",
                item.tone,
              )}
            >
              <div className="pattern-islamic absolute inset-0 opacity-40" />
              <Icon name={item.icon} className="relative size-24 opacity-90" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Pill tone="brand">{item.location}</Pill>
              <Pill tone="neutral">{item.type === "video" ? "Video" : "Photograph"}</Pill>
              {item.durationSec ? (
                <Pill tone="info">{item.durationSec} seconds</Pill>
              ) : null}
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Upload */}
      <Modal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Add a memory"
        description="Give it a caption and a place — the date is recorded automatically."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setUploadOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>Add to gallery</Button>
          </>
        }
      >
        <div className="space-y-4">
          <SegmentedControl
            items={[
              { id: "photo", label: "Photograph" },
              { id: "video", label: "Video" },
            ]}
            value={draft.type}
            onChange={(t) => setDraft((d) => ({ ...d, type: t as "photo" | "video" }))}
          />

          <Field label="Caption" required error={error} htmlFor="gal-caption">
            <TextInput
              id="gal-caption"
              value={draft.caption}
              onChange={(e) => {
                setDraft((d) => ({ ...d, caption: e.target.value }));
                setError(undefined);
              }}
              placeholder="First sight of the Ka'bah after Isha"
              invalid={Boolean(error)}
            />
          </Field>

          <Field label="Where was this?" htmlFor="gal-location">
            <Select
              id="gal-location"
              value={draft.location}
              onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
            >
              {LOCATIONS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </Select>
          </Field>

          <Field label="Cover symbol" htmlFor="gal-icon">
            <Select
              id="gal-icon"
              value={draft.icon}
              onChange={(e) =>
                setDraft((d) => ({ ...d, icon: e.target.value as IconName }))
              }
            >
              {ICON_CHOICES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </Select>
          </Field>

          <div className="rounded-xl border border-line bg-surface-muted p-3.5">
            <p className="text-xs leading-relaxed text-muted">
              In the full release you attach the photograph or clip itself. In this demo,
              the cover symbol and gradient stand in for the image so nothing is uploaded
              anywhere.
            </p>
          </div>
        </div>
      </Modal>

      <Card className="mt-6">
        <CardHeader
          title="Digital souvenir wall"
          description="Share a memory to the community wall and see what other pilgrims kept."
        />
        <CardBody className="flex flex-wrap items-center gap-4">
          <Badge tone="gold">Opens after your return</Badge>
          <p className="min-w-0 flex-1 text-xs leading-relaxed text-muted">
            Once your group manifest is confirmed landed, you can post memories, du&apos;ā
            requests and reflections to the shared wall for the 1448 AH cohort.
          </p>
        </CardBody>
      </Card>
    </>
  );
}
