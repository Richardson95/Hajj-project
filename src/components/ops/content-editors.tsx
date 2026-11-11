"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, Users } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Pill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Select, TextArea, TextInput } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { useOps } from "@/lib/ops/store";
import { CHECKLIST_GROUPS } from "@/lib/data/guide";
import type {
  ActivityCategory,
  ChecklistItem,
  ItineraryActivity,
  ItineraryDay,
  PilgrimGroup,
} from "@/lib/types";

/* ------------------------------- Checklist ------------------------------- */

export function ChecklistEditor() {
  const { checklist, removeChecklistItem } = useOps();
  const { toast } = useToast();
  const [editing, setEditing] = useState<ChecklistItem | "new" | null>(null);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">The packing checklist every pilgrim sees. Changes apply straight away.</p>
        <Button size="sm" onClick={() => setEditing("new")}>
          <Plus className="size-4" />
          Add item
        </Button>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {CHECKLIST_GROUPS.map((group) => {
          const items = checklist.filter((c) => c.group === group);
          return (
            <Card key={group}>
              <CardHeader title={group} description={`${items.length} items`} />
              <ul className="divide-y divide-line">
                {items.map((c) => (
                  <li key={c.id} className="flex items-start gap-3 px-5 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-ink">{c.label}</p>
                      {c.note ? <p className="mt-0.5 text-xs text-muted">{c.note}</p> : null}
                    </div>
                    <Button size="sm" variant="ghost" aria-label="Edit item" onClick={() => setEditing(c)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label="Remove item"
                      onClick={() => {
                        removeChecklistItem(c.id);
                        toast({ title: "Item removed", tone: "info" });
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
      {editing ? <ChecklistModal item={editing === "new" ? null : editing} onClose={() => setEditing(null)} /> : null}
    </>
  );
}

function ChecklistModal({ item, onClose }: { item: ChecklistItem | null; onClose: () => void }) {
  const { saveChecklistItem } = useOps();
  const { toast } = useToast();
  const [label, setLabel] = useState(item?.label ?? "");
  const [group, setGroup] = useState<ChecklistItem["group"]>(item?.group ?? "Essentials");
  const [note, setNote] = useState(item?.note ?? "");
  const [error, setError] = useState<string | null>(null);

  function save() {
    if (label.trim().length < 3) {
      setError("Describe the item.");
      return;
    }
    saveChecklistItem({ id: item?.id, label: label.trim(), group, note: note.trim() || undefined });
    toast({ title: item ? "Item updated" : "Item added" });
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={item ? "Edit checklist item" : "Add checklist item"}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>Save</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Item" required error={error ?? undefined} htmlFor="cl-label">
          <TextInput id="cl-label" value={label} onChange={(e) => { setLabel(e.target.value); setError(null); }} />
        </Field>
        <Field label="Section" htmlFor="cl-group">
          <Select id="cl-group" value={group} onChange={(e) => setGroup(e.target.value as ChecklistItem["group"])}>
            {CHECKLIST_GROUPS.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </Select>
        </Field>
        <Field label="Tip" htmlFor="cl-note" hint="Optional short note shown under the item.">
          <TextInput id="cl-note" value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
      </div>
    </Modal>
  );
}

/* ------------------------------- Itinerary ------------------------------- */

const ACTIVITY_CATEGORIES: ActivityCategory[] = ["ritual", "travel", "rest", "meal", "briefing", "free"];

export function ItineraryEditor() {
  const { itinerary, removeActivity } = useOps();
  const { toast } = useToast();
  const [dayId, setDayId] = useState(itinerary[0]?.id ?? "");
  const [editingDay, setEditingDay] = useState(false);
  const [editing, setEditing] = useState<ItineraryActivity | "new" | null>(null);
  const day = itinerary.find((d) => d.id === dayId) ?? itinerary[0];

  if (!day) return null;

  return (
    <>
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="w-full sm:w-96">
          <Field label="Day" htmlFor="it-day">
            <Select id="it-day" value={day.id} onChange={(e) => setDayId(e.target.value)}>
              {itinerary.map((d) => (
                <option key={d.id} value={d.id}>
                  Day {d.dayNumber} · {d.stage} · {d.title}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <Button variant="outline" onClick={() => setEditingDay(true)}>
          <Pencil className="size-4" />
          Edit day
        </Button>
        <Button onClick={() => setEditing("new")}>
          <Plus className="size-4" />
          Add activity
        </Button>
      </div>

      <Card>
        <CardHeader title={`Day ${day.dayNumber}: ${day.title}`} description={`${day.hijri} · ${day.gregorian} · ${day.subtitle}`} />
        <ul className="divide-y divide-line">
          {day.activities.map((a) => (
            <li key={a.id} className="flex items-start gap-4 px-5 py-3.5">
              <span className="tabular w-12 shrink-0 pt-0.5 text-xs font-bold text-forest-800 dark:text-gold-400">{a.time}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-ink">{a.title}</p>
                  {a.obligation ? <Pill tone={a.obligation === "Fard" ? "danger" : a.obligation === "Wajib" ? "warning" : "neutral"}>{a.obligation}</Pill> : null}
                  <Pill tone="neutral">{a.category}</Pill>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">{a.description}</p>
                <p className="mt-0.5 text-[0.6875rem] text-muted">{a.location} · {a.durationMins} min</p>
              </div>
              <Button size="sm" variant="ghost" aria-label="Edit activity" onClick={() => setEditing(a)}>
                <Pencil className="size-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                aria-label="Remove activity"
                onClick={() => {
                  removeActivity(day.id, a.id);
                  toast({ title: "Activity removed", tone: "info" });
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      </Card>

      {editingDay ? <DayModal day={day} onClose={() => setEditingDay(false)} /> : null}
      {editing ? (
        <ActivityModal dayId={day.id} activity={editing === "new" ? null : editing} onClose={() => setEditing(null)} />
      ) : null}
    </>
  );
}

function DayModal({ day, onClose }: { day: ItineraryDay; onClose: () => void }) {
  const { updateDay } = useOps();
  const { toast } = useToast();
  const [title, setTitle] = useState(day.title);
  const [subtitle, setSubtitle] = useState(day.subtitle);
  const [gregorian, setGregorian] = useState(day.gregorian);
  const [hijri, setHijri] = useState(day.hijri);

  return (
    <Modal
      open
      onClose={onClose}
      title={`Edit day ${day.dayNumber}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              updateDay(day.id, {
                title: title.trim() || day.title,
                subtitle: subtitle.trim(),
                gregorian: gregorian.trim() || day.gregorian,
                hijri: hijri.trim() || day.hijri,
              });
              toast({ title: "Day updated" });
              onClose();
            }}
          >
            Save
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" htmlFor="dy-title" className="sm:col-span-2">
          <TextInput id="dy-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Subtitle" htmlFor="dy-sub" className="sm:col-span-2">
          <TextInput id="dy-sub" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        </Field>
        <Field label="Gregorian date" htmlFor="dy-greg" hint="As shown to pilgrims, e.g. 2027-05-14">
          <TextInput id="dy-greg" value={gregorian} onChange={(e) => setGregorian(e.target.value)} />
        </Field>
        <Field label="Hijri date" htmlFor="dy-hijri">
          <TextInput id="dy-hijri" value={hijri} onChange={(e) => setHijri(e.target.value)} />
        </Field>
      </div>
    </Modal>
  );
}

function ActivityModal({
  dayId,
  activity,
  onClose,
}: {
  dayId: string;
  activity: ItineraryActivity | null;
  onClose: () => void;
}) {
  const { saveActivity } = useOps();
  const { toast } = useToast();
  const [time, setTime] = useState(activity?.time ?? "08:00");
  const [title, setTitle] = useState(activity?.title ?? "");
  const [description, setDescription] = useState(activity?.description ?? "");
  const [location, setLocation] = useState(activity?.location ?? "");
  const [category, setCategory] = useState<ActivityCategory>(activity?.category ?? "ritual");
  const [duration, setDuration] = useState(String(activity?.durationMins ?? 60));
  const [obligation, setObligation] = useState<ItineraryActivity["obligation"] | "">(activity?.obligation ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function save() {
    const mins = Number(duration);
    const next: Record<string, string> = {};
    if (!/^\d{2}:\d{2}$/.test(time)) next.time = "Use 24-hour time, e.g. 07:30.";
    if (title.trim().length < 3) next.title = "Give the activity a title.";
    if (location.trim().length < 2) next.location = "Where does it happen?";
    if (!mins || mins <= 0) next.duration = "Enter minutes.";
    setErrors(next);
    if (Object.keys(next).length) return;
    saveActivity(dayId, {
      id: activity?.id,
      time,
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      category,
      durationMins: mins,
      obligation: obligation || undefined,
    });
    toast({ title: activity ? "Activity updated" : "Activity added" });
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      title={activity ? "Edit activity" : "Add activity"}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>Save</Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Time" required error={errors.time} htmlFor="ac-time">
          <TextInput id="ac-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </Field>
        <Field label="Duration (minutes)" required error={errors.duration} htmlFor="ac-dur">
          <TextInput id="ac-dur" inputMode="numeric" value={duration} onChange={(e) => setDuration(e.target.value.replace(/\D/g, ""))} />
        </Field>
        <Field label="Title" required error={errors.title} htmlFor="ac-title" className="sm:col-span-2">
          <TextInput id="ac-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Description" htmlFor="ac-desc" className="sm:col-span-2">
          <TextArea id="ac-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        <Field label="Location" required error={errors.location} htmlFor="ac-loc">
          <TextInput id="ac-loc" value={location} onChange={(e) => setLocation(e.target.value)} />
        </Field>
        <Field label="Type" htmlFor="ac-cat">
          <Select id="ac-cat" value={category} onChange={(e) => setCategory(e.target.value as ActivityCategory)}>
            {ACTIVITY_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Obligation" htmlFor="ac-ob" hint="For rites only.">
          <Select id="ac-ob" value={obligation ?? ""} onChange={(e) => setObligation(e.target.value as ItineraryActivity["obligation"] | "")}>
            <option value="">None</option>
            <option value="Fard">Fard</option>
            <option value="Wajib">Wajib</option>
            <option value="Sunnah">Sunnah</option>
          </Select>
        </Field>
      </div>
    </Modal>
  );
}

/* --------------------------------- Group --------------------------------- */

export function GroupEditor() {
  const { group, updateGroup } = useOps();
  const { toast } = useToast();
  const [draft, setDraft] = useState<PilgrimGroup>(group);
  const [error, setError] = useState<string | null>(null);

  const fields: { key: keyof PilgrimGroup; label: string; hint?: string }[] = [
    { key: "name", label: "Group name" },
    { key: "code", label: "Group code" },
    { key: "operator", label: "Licensed operator" },
    { key: "adminName", label: "Group admin" },
    { key: "campZone", label: "Camp zone", hint: "Shown on Find Me, SOS and the pilgrim tag." },
    { key: "emergencyLine", label: "Emergency line" },
  ];

  function save() {
    if (fields.some((f) => String(draft[f.key]).trim() === "") || !draft.memberCount) {
      setError("Fill in every field.");
      return;
    }
    updateGroup({ ...draft, memberCount: Number(draft.memberCount) });
    setError(null);
    toast({ title: "Group details saved", description: "Pilgrims see the new details everywhere in the app." });
  }

  return (
    <Card className="max-w-3xl">
      <CardHeader title="Group details" description="Used across Find Me, SOS, Profile, Announcements and the group admin view." icon={<Users className="size-4" />} />
      <CardBody className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <Field key={f.key} label={f.label} hint={f.hint} htmlFor={`gp-${f.key}`}>
            <TextInput
              id={`gp-${f.key}`}
              value={String(draft[f.key])}
              onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
            />
          </Field>
        ))}
        <Field label="Pilgrims in group" htmlFor="gp-count" error={error ?? undefined}>
          <TextInput
            id="gp-count"
            inputMode="numeric"
            value={String(draft.memberCount || "")}
            onChange={(e) => setDraft((d) => ({ ...d, memberCount: Number(e.target.value.replace(/\D/g, "")) }))}
          />
        </Field>
        <div className="flex items-end justify-end sm:col-span-2">
          <Button onClick={save}>Save group details</Button>
        </div>
      </CardBody>
    </Card>
  );
}
