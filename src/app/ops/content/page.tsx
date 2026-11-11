"use client";

import { useState } from "react";
import { Info, Megaphone, Pencil, Pin, Plus, Trash2 } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, Pill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader } from "@/components/ui/misc";
import { Field, Select, Switch, TextArea, TextInput } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { Tabs } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { useOps } from "@/lib/ops/store";
import { ChecklistEditor, GroupEditor, ItineraryEditor } from "@/components/ops/content-editors";
import type { OpsFaq } from "@/lib/ops/types";
import type { Faq } from "@/lib/data/marketing";
import type { AnnouncementPriority, HajjPackage } from "@/lib/types";
import { naira, relativeTime } from "@/lib/format";

type Tab = "packages" | "itinerary" | "checklist" | "group" | "faqs" | "announcements";
const FAQ_GROUPS: Faq["group"][] = ["Savings", "Compliance", "In Makkah", "Account"];

export default function OpsContentPage() {
  const { faqs, announcements, checklist } = useOps();
  const [tab, setTab] = useState<Tab>("packages");

  return (
    <>
      <PageHeader
        title="Content & settings"
        description="Everything pilgrims read in the app: fares, the itinerary, the packing checklist, group details, the FAQ and announcements."
      />
      <Tabs
        items={[
          { id: "packages", label: "Packages" },
          { id: "itinerary", label: "Itinerary" },
          { id: "checklist", label: "Checklist", count: checklist.length },
          { id: "group", label: "Group" },
          { id: "faqs", label: "FAQs", count: faqs.length },
          { id: "announcements", label: "Announcements", count: announcements.length },
        ]}
        value={tab}
        onChange={setTab}
        className="mb-5"
      />
      {tab === "packages" ? <Packages /> : null}
      {tab === "itinerary" ? <ItineraryEditor /> : null}
      {tab === "checklist" ? <ChecklistEditor /> : null}
      {tab === "group" ? <GroupEditor /> : null}
      {tab === "faqs" ? <Faqs /> : null}
      {tab === "announcements" ? <Announcements /> : null}
    </>
  );
}

/* ------------------------------- Packages ------------------------------- */

function Packages() {
  const { packages } = useOps();
  const [editing, setEditing] = useState<HajjPackage | null>(null);

  return (
    <>
      <div className="mb-4 flex items-start gap-3 rounded-xl border border-gold-500/30 bg-gold-50/60 p-3.5 dark:bg-gold-950/25">
        <Info className="mt-0.5 size-4 shrink-0 text-gold-700 dark:text-gold-400" />
        <p className="text-xs leading-relaxed text-ink/80">
          Update fares here once NAHCON gazettes the season&apos;s figures. New fares apply
          straight away to savings plan targets, registration, the plan editor and the
          savings calculator. The public Packages page updates once the backend is
          connected.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {packages.map((p) => (
          <Card key={p.id}>
            <CardBody>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-bold tracking-wider text-gold-700 uppercase dark:text-gold-400">
                    {p.tier}
                  </p>
                  <p className="mt-1 text-base font-bold text-ink">{p.name}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setEditing(p)} aria-label={`Edit ${p.name}`}>
                  <Pencil className="size-4" />
                </Button>
              </div>
              <p className="tabular mt-3 text-2xl font-extrabold text-ink">{naira(p.priceNGN)}</p>
              <p className="mt-1 text-xs text-muted">{p.operator}</p>
              {p.highlight ? <Badge tone="gold" className="mt-3">{p.highlight}</Badge> : null}
            </CardBody>
          </Card>
        ))}
      </div>
      {editing ? <PackageModal pkg={editing} onClose={() => setEditing(null)} /> : null}
    </>
  );
}

function PackageModal({ pkg, onClose }: { pkg: HajjPackage; onClose: () => void }) {
  const { updatePackage } = useOps();
  const { toast } = useToast();
  const [price, setPrice] = useState(String(pkg.priceNGN));
  const [highlight, setHighlight] = useState(pkg.highlight ?? "");
  const [error, setError] = useState<string | null>(null);

  function save() {
    const value = Number(price.replace(/[^\d]/g, ""));
    if (!value || value < 1_000_000) {
      setError("Enter the full fare in naira (at least ₦1,000,000).");
      return;
    }
    updatePackage(pkg.id, { priceNGN: value, highlight: highlight.trim() || undefined });
    toast({ title: `${pkg.name} updated`, description: `New fare ${naira(value)}.` });
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={`Edit ${pkg.name}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>Save fare</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Fare" required error={error ?? undefined} htmlFor="pkg-price">
          <TextInput
            id="pkg-price"
            prefix="₦"
            inputMode="numeric"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              setError(null);
            }}
          />
        </Field>
        <Field label="Highlight label" hint="Optional, e.g. Most popular" htmlFor="pkg-highlight">
          <TextInput id="pkg-highlight" value={highlight} onChange={(e) => setHighlight(e.target.value)} />
        </Field>
      </div>
    </Modal>
  );
}

/* --------------------------------- FAQs --------------------------------- */

function Faqs() {
  const { faqs, removeFaq } = useOps();
  const { toast } = useToast();
  const [editing, setEditing] = useState<OpsFaq | "new" | null>(null);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">Changes appear on the homepage and the FAQ page straight away.</p>
        <Button size="sm" onClick={() => setEditing("new")}>
          <Plus className="size-4" />
          Add question
        </Button>
      </div>
      <Card>
        <ul className="divide-y divide-line">
          {faqs.map((f) => (
            <li key={f.id} className="flex items-start gap-3 px-5 py-4">
              <div className="min-w-0 flex-1">
                <Pill tone="neutral">{f.group}</Pill>
                <p className="mt-1.5 text-sm font-semibold text-ink">{f.question}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{f.answer}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button size="sm" variant="ghost" onClick={() => setEditing(f)} aria-label="Edit question">
                  <Pencil className="size-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  aria-label="Delete question"
                  onClick={() => {
                    removeFaq(f.id);
                    toast({ title: "Question removed", tone: "info" });
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
      {editing ? (
        <FaqModal faq={editing === "new" ? null : editing} onClose={() => setEditing(null)} />
      ) : null}
    </>
  );
}

function FaqModal({ faq, onClose }: { faq: OpsFaq | null; onClose: () => void }) {
  const { saveFaq } = useOps();
  const { toast } = useToast();
  const [group, setGroup] = useState<Faq["group"]>(faq?.group ?? "Savings");
  const [question, setQuestion] = useState(faq?.question ?? "");
  const [answer, setAnswer] = useState(faq?.answer ?? "");
  const [errors, setErrors] = useState<{ question?: string; answer?: string }>({});

  function save() {
    const next: typeof errors = {};
    if (question.trim().length < 8) next.question = "Write the question in full.";
    if (answer.trim().length < 20) next.answer = "Write a complete answer (20+ characters).";
    setErrors(next);
    if (Object.keys(next).length) return;
    saveFaq({ id: faq?.id, group, question: question.trim(), answer: answer.trim() });
    toast({ title: faq ? "Question updated" : "Question added" });
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={faq ? "Edit question" : "Add question"}
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
        <Field label="Section" htmlFor="faq-group">
          <Select id="faq-group" value={group} onChange={(e) => setGroup(e.target.value as Faq["group"])}>
            {FAQ_GROUPS.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </Select>
        </Field>
        <Field label="Question" required error={errors.question} htmlFor="faq-q">
          <TextInput id="faq-q" value={question} onChange={(e) => setQuestion(e.target.value)} />
        </Field>
        <Field label="Answer" required error={errors.answer} htmlFor="faq-a">
          <TextArea id="faq-a" value={answer} onChange={(e) => setAnswer(e.target.value)} />
        </Field>
      </div>
    </Modal>
  );
}

/* ----------------------------- Announcements ---------------------------- */

function Announcements() {
  const { announcements, publishAnnouncement, removeAnnouncement } = useOps();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [priority, setPriority] = useState<AnnouncementPriority>("important");
  const [pinned, setPinned] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({});

  function publish() {
    const next: typeof errors = {};
    if (title.trim().length < 5) next.title = "Give it a clear title.";
    if (body.trim().length < 20) next.body = "Write the full message (20+ characters).";
    setErrors(next);
    if (Object.keys(next).length) return;
    publishAnnouncement({ title: title.trim(), body: body.trim(), priority, pinned });
    setTitle("");
    setBody("");
    setPinned(false);
    toast({ title: "Announcement published", description: "Every pilgrim now sees it in Announcements." });
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
      <Card className="self-start">
        <CardHeader title="New announcement" description="Sent to every pilgrim on HajjPath." icon={<Megaphone className="size-4" />} />
        <CardBody className="space-y-4">
          <Field label="Title" required error={errors.title} htmlFor="ann-title">
            <TextInput id="ann-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="Message" required error={errors.body} htmlFor="ann-body">
            <TextArea id="ann-body" value={body} onChange={(e) => setBody(e.target.value)} />
          </Field>
          <Field label="Priority" htmlFor="ann-priority">
            <Select id="ann-priority" value={priority} onChange={(e) => setPriority(e.target.value as AnnouncementPriority)}>
              <option value="critical">Critical</option>
              <option value="important">Important</option>
              <option value="info">Information</option>
            </Select>
          </Field>
          <Switch checked={pinned} onChange={setPinned} label="Pin to the top" description="Pinned notices also show on every pilgrim's dashboard." />
          <Button block onClick={publish}>
            <Megaphone className="size-4" />
            Publish to all pilgrims
          </Button>
        </CardBody>
      </Card>

      <div>
        <h2 className="mb-3 text-sm font-bold text-ink">Published from the console</h2>
        {announcements.length === 0 ? (
          <EmptyState icon={<Megaphone className="size-6" />} title="Nothing published yet" description="Announcements you send appear here." />
        ) : (
          <div className="space-y-3">
            {announcements.map((a) => (
              <Card key={a.id}>
                <CardBody>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Pill tone={a.priority === "critical" ? "danger" : a.priority === "important" ? "warning" : "info"}>
                          {a.priority}
                        </Pill>
                        {a.pinned ? (
                          <Pill tone="brand" icon={<Pin className="size-3" />}>
                            Pinned
                          </Pill>
                        ) : null}
                      </div>
                      <p className="mt-2 text-sm font-semibold text-ink">{a.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted">{a.body}</p>
                      <p suppressHydrationWarning className="mt-2 text-[0.6875rem] text-muted">
                        {a.author} · {relativeTime(a.date)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label="Remove announcement"
                      onClick={() => {
                        removeAnnouncement(a.id);
                        toast({ title: "Announcement removed", tone: "info" });
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
