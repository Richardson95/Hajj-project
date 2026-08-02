"use client";

import { useState } from "react";
import {
  CircleCheck,
  Clock,
  Headset,
  MapPin,
  Phone,
  Plus,
  ShieldCheck,
  Siren,
  Trash2,
  TriangleAlert,
  UserPlus,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, Pill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader } from "@/components/ui/misc";
import { Field, TextArea, TextInput } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { Icon } from "@/components/icon";
import { useToast } from "@/components/ui/toast";
import { useApp } from "@/lib/store";
import { SOS_CATEGORY_META } from "@/lib/data/comms";
import { PILGRIM_GROUP } from "@/lib/data/map";
import { formatDateTime, relativeTime } from "@/lib/format";
import type { SosCategory } from "@/lib/types";
import { cn } from "@/lib/cn";

const EMERGENCY_NUMBERS = [
  { label: "Saudi Red Crescent", number: "997", detail: "Ambulance and medical rescue" },
  { label: "Saudi security", number: "911", detail: "Police, crowd and safety incidents" },
  { label: "Hajj Ministry hotline", number: "1966", detail: "Pilgrim services in the Kingdom" },
  { label: "HajjPath desk", number: "+966 55 218 0043", detail: "24/7 during the season" },
];

export default function SosPage() {
  const {
    sosEvents,
    raiseSos,
    resolveSos,
    emergencyContacts,
    addEmergencyContact,
    removeEmergencyContact,
  } = useApp();
  const { toast } = useToast();

  const [category, setCategory] = useState<SosCategory | null>(null);
  const [note, setNote] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", relationship: "", phone: "" });
  const [contactError, setContactError] = useState<string | undefined>();

  const active = sosEvents.filter((e) => e.status !== "resolved");
  const selected = SOS_CATEGORY_META.find((c) => c.id === category);

  function trigger() {
    if (!category) return;
    const event = raiseSos(category, note.trim() || selected?.label || "", PILGRIM_GROUP.campZone);
    setConfirmOpen(false);
    setCategory(null);
    setNote("");
    toast({
      title: "SOS dispatched",
      description: `${emergencyContacts.length} contacts, your group admin and the HajjPath desk have your position. Reference ${event.id}.`,
      tone: "warning",
    });
  }

  function saveContact() {
    if (newContact.name.trim().length < 2) {
      setContactError("Enter the contact's name.");
      return;
    }
    if (newContact.phone.replace(/\D/g, "").length < 7) {
      setContactError("Enter a reachable phone number.");
      return;
    }
    addEmergencyContact({
      name: newContact.name.trim(),
      relationship: newContact.relationship.trim() || "Emergency contact",
      phone: newContact.phone.trim(),
      isPrimary: emergencyContacts.length === 0,
    });
    setNewContact({ name: "", relationship: "", phone: "" });
    setContactError(undefined);
    setContactOpen(false);
    toast({ title: "Emergency contact added" });
  }

  return (
    <>
      <PageHeader
        title="Emergency SOS"
        description="One press reaches your contacts, your group admin, the nearest medic and the HajjPath desk — with your exact position attached."
      />

      {active.length > 0 ? (
        <Card className="mb-5 border-rose-500/50 bg-rose-50/70 dark:bg-rose-950/30">
          <CardBody className="flex flex-wrap items-center gap-4">
            <span className="grid size-11 shrink-0 animate-[pulse-ring_2s_infinite] place-items-center rounded-xl bg-rose-600 text-white">
              <Siren className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink">
                An SOS is currently active
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted">
                {active[0].respondent} · raised{" "}
                <span suppressHydrationWarning>{relativeTime(active[0].raisedAt)}</span> at{" "}
                {active[0].location}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => resolveSos(active[0].id)}>
              <CircleCheck className="size-3.5" />
              I am safe now
            </Button>
          </CardBody>
        </Card>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          {/* Trigger */}
          <Card className="overflow-hidden">
            <div className="relative bg-rose-700 p-6 text-white sm:p-7">
              <div className="pattern-islamic pointer-events-none absolute inset-0 opacity-30" />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-2xl bg-white/15">
                    <Siren className="size-6" />
                  </span>
                  <div>
                    <h2 className="text-xl font-bold">Raise an emergency</h2>
                    <p className="text-sm text-white/70">
                      Choose what is happening so we send the right responder.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <CardBody className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {SOS_CATEGORY_META.map((c) => {
                  const on = category === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategory(c.id)}
                      aria-pressed={on}
                      className={cn(
                        "flex items-start gap-3 rounded-2xl border p-4 text-left transition",
                        on
                          ? "border-rose-500 bg-rose-50 ring-2 ring-rose-500/20 dark:bg-rose-950/40"
                          : "border-line bg-surface hover:border-rose-500/40",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-10 shrink-0 place-items-center rounded-xl",
                          on
                            ? "bg-rose-600 text-white"
                            : "bg-surface-muted text-rose-600 dark:text-rose-400",
                        )}
                      >
                        <Icon name={c.icon} className="size-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-ink">
                          {c.label}
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                          {c.detail}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {selected ? (
                <div className="rounded-2xl border border-line bg-surface-muted p-4">
                  <p className="text-[0.6875rem] font-semibold tracking-wider text-muted uppercase">
                    This alert will reach
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink">{selected.dispatch}</p>
                </div>
              ) : null}

              <Field
                label="Add a note (optional)"
                hint="A few words help the responder find you faster."
                htmlFor="sos-note"
              >
                <TextArea
                  id="sos-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Feeling faint near the Jamarat level 3 south ramp, wearing a green Al-Amanah band."
                  rows={3}
                />
              </Field>

              <Button
                variant="danger"
                size="lg"
                block
                disabled={!category}
                onClick={() => setConfirmOpen(true)}
                className={cn(category && "animate-[pulse-ring_2s_infinite]")}
              >
                <Siren className="size-5" />
                {category ? `Send ${selected?.label} SOS` : "Choose an emergency type"}
              </Button>
            </CardBody>
          </Card>

          {/* History */}
          <Card>
            <CardHeader
              title="Alert history"
              description="Every SOS you have raised, and how it was resolved."
              icon={<Clock className="size-4" />}
            />
            {sosEvents.length === 0 ? (
              <CardBody>
                <EmptyState
                  icon={<ShieldCheck className="size-6" />}
                  title="No alerts raised"
                  description="We hope it stays that way. The button is here if you ever need it."
                />
              </CardBody>
            ) : (
              <ul className="divide-y divide-line">
                {sosEvents.map((e) => {
                  const meta = SOS_CATEGORY_META.find((c) => c.id === e.category);
                  return (
                    <li key={e.id} className="flex items-start gap-3.5 px-5 py-4">
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        <Icon name={meta?.icon ?? "shield"} className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[0.8125rem] font-semibold text-ink">
                            {meta?.label ?? e.category}
                          </p>
                          <Pill
                            tone={
                              e.status === "resolved"
                                ? "positive"
                                : e.status === "acknowledged"
                                  ? "info"
                                  : "danger"
                            }
                          >
                            {e.status}
                          </Pill>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-muted">{e.note}</p>
                        <p className="mt-1 text-[0.6875rem] text-muted">
                          <span suppressHydrationWarning>{formatDateTime(e.raisedAt)}</span>{" "}
                          · {e.location} · {e.respondent}
                        </p>
                      </div>
                      {e.status !== "resolved" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => resolveSos(e.id)}
                          className="shrink-0"
                        >
                          Resolve
                        </Button>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <Card>
            <CardHeader
              title="Emergency contacts"
              description="Alerted the moment you press SOS."
              icon={<UserPlus className="size-4" />}
              action={
                <Button variant="ghost" size="sm" onClick={() => setContactOpen(true)}>
                  <Plus className="size-3.5" />
                  Add
                </Button>
              }
            />
            {emergencyContacts.length === 0 ? (
              <CardBody>
                <EmptyState
                  title="No contacts yet"
                  description="Add at least one person who should be told immediately."
                  action={
                    <Button size="sm" onClick={() => setContactOpen(true)}>
                      Add a contact
                    </Button>
                  }
                />
              </CardBody>
            ) : (
              <ul className="divide-y divide-line">
                {emergencyContacts.map((c) => (
                  <li key={c.id} className="flex items-center gap-3 px-5 py-3.5">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-[0.8125rem] font-semibold text-ink">
                          {c.name}
                        </p>
                        {c.isPrimary ? <Badge tone="brand">Primary</Badge> : null}
                      </div>
                      <p className="truncate text-xs text-muted">{c.relationship}</p>
                      <a
                        href={`tel:${c.phone.replace(/\s/g, "")}`}
                        className="tabular text-xs font-medium text-forest-800 hover:underline dark:text-gold-300"
                      >
                        {c.phone}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeEmergencyContact(c.id)}
                      aria-label={`Remove ${c.name}`}
                      className="shrink-0 rounded-lg p-2 text-muted transition hover:bg-surface-muted hover:text-rose-600"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <CardHeader
              title="Direct emergency numbers"
              description="Always call these as well in a genuine emergency."
              icon={<Phone className="size-4" />}
            />
            <ul className="divide-y divide-line">
              {EMERGENCY_NUMBERS.map((n) => (
                <li key={n.number}>
                  <a
                    href={`tel:${n.number.replace(/\s/g, "")}`}
                    className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-surface-muted/60"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                      <Phone className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.8125rem] font-semibold text-ink">
                        {n.label}
                      </span>
                      <span className="block text-xs text-muted">{n.detail}</span>
                    </span>
                    <span className="tabular shrink-0 text-sm font-bold text-ink">
                      {n.number}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="border-gold-500/30 bg-gold-50/50 dark:bg-gold-950/25">
            <CardBody className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-gold-500 text-forest-950">
                  <Headset className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">HajjPath support desk</p>
                  <p className="text-xs text-muted">Lagos and Makkah, 24/7 in season</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-muted">
                Agents speak English, Hausa and Yoruba, and can reach your group admin,
                your operator and Saudi emergency services on your behalf.
              </p>
              <p className="flex items-center gap-2 text-xs text-muted">
                <MapPin className="size-3.5" />
                Your position: {PILGRIM_GROUP.campZone}
              </p>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Confirm */}
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirm this SOS"
        description="Only send a real alert. Responders will be dispatched."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={trigger}>
              <Siren className="size-4" />
              Send SOS now
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-50/70 p-4 dark:bg-rose-950/30">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-rose-600" />
            <div className="min-w-0 text-[0.8125rem] leading-relaxed text-ink/80">
              <p className="font-semibold text-ink">{selected?.label}</p>
              <p className="mt-1">{selected?.dispatch}</p>
            </div>
          </div>
          <dl className="space-y-2 rounded-2xl bg-surface-muted p-4 text-sm">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-xs text-muted">Position</dt>
              <dd className="text-right text-xs font-semibold text-ink">
                {PILGRIM_GROUP.campZone}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-xs text-muted">Contacts alerted</dt>
              <dd className="text-right text-xs font-semibold text-ink">
                {emergencyContacts.length} people
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-xs text-muted">Group admin</dt>
              <dd className="text-right text-xs font-semibold text-ink">
                {PILGRIM_GROUP.adminName}
              </dd>
            </div>
          </dl>
          {note ? (
            <p className="rounded-2xl border border-line p-4 text-xs leading-relaxed text-muted">
              “{note}”
            </p>
          ) : null}
        </div>
      </Modal>

      {/* Add contact */}
      <Modal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        title="Add an emergency contact"
        description="They will be called and messaged the moment you raise an SOS."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setContactOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveContact}>Add contact</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Full name" required error={contactError} htmlFor="ec-name">
            <TextInput
              id="ec-name"
              value={newContact.name}
              onChange={(e) => {
                setNewContact((c) => ({ ...c, name: e.target.value }));
                setContactError(undefined);
              }}
              placeholder="Halimah Adetunji"
            />
          </Field>
          <Field label="Relationship" htmlFor="ec-rel">
            <TextInput
              id="ec-rel"
              value={newContact.relationship}
              onChange={(e) =>
                setNewContact((c) => ({ ...c, relationship: e.target.value }))
              }
              placeholder="Spouse (travelling together)"
            />
          </Field>
          <Field label="Phone number" required htmlFor="ec-phone">
            <TextInput
              id="ec-phone"
              type="tel"
              value={newContact.phone}
              onChange={(e) => {
                setNewContact((c) => ({ ...c, phone: e.target.value }));
                setContactError(undefined);
              }}
              placeholder="08029914476"
            />
          </Field>
        </div>
      </Modal>
    </>
  );
}
