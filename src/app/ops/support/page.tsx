"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Headset, Mail, Phone, RotateCcw, Send, CircleCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader } from "@/components/ui/misc";
import { Field, Select, TextArea } from "@/components/ui/field";
import { SegmentedControl } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { CANNOT_TRAVEL_TOPIC, TicketPill } from "@/components/ops/ops-ui";
import { useOps } from "@/lib/ops/store";
import type { SupportTicket, TicketStatus } from "@/lib/ops/types";
import { formatDateTime, formatPhone, relativeTime } from "@/lib/format";
import { cn } from "@/lib/cn";

type Filter = TicketStatus | "all";

export default function OpsSupportPage() {
  return (
    <Suspense fallback={null}>
      <SupportInbox />
    </Suspense>
  );
}

function SupportInbox() {
  const { tickets } = useOps();
  const params = useSearchParams();
  const [filter, setFilter] = useState<Filter>("open");
  const [selectedId, setSelectedId] = useState<string | null>(params.get("ticket"));

  const visible = useMemo(
    () =>
      tickets
        .filter((t) => filter === "all" || t.status === filter)
        .sort((a, b) => {
          const aUrgent = a.topic === CANNOT_TRAVEL_TOPIC && a.status !== "closed";
          const bUrgent = b.topic === CANNOT_TRAVEL_TOPIC && b.status !== "closed";
          if (aUrgent !== bUrgent) return aUrgent ? -1 : 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }),
    [tickets, filter],
  );

  const selected = tickets.find((t) => t.id === selectedId) ?? visible[0] ?? null;
  const count = (f: Filter) => (f === "all" ? tickets.length : tickets.filter((t) => t.status === f).length);

  return (
    <>
      <PageHeader
        title="Support inbox"
        description="Messages from the contact form. Pilgrims who can no longer travel are always shown first."
      />

      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <Card className="self-start overflow-hidden">
          <div className="border-b border-line p-3">
            <SegmentedControl
              items={[
                { id: "open", label: "Open", count: count("open") },
                { id: "pending", label: "Awaiting", count: count("pending") },
                { id: "closed", label: "Closed", count: count("closed") },
                { id: "all", label: "All" },
              ]}
              value={filter}
              onChange={setFilter}
              size="sm"
            />
          </div>
          {visible.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted">No tickets here.</p>
          ) : (
            <ul className="max-h-[70vh] divide-y divide-line overflow-y-auto">
              {visible.map((t) => {
                const last = t.messages[t.messages.length - 1];
                const active = selected?.id === t.id;
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(t.id)}
                      aria-pressed={active}
                      className={cn(
                        "block w-full px-4 py-3.5 text-left transition",
                        active ? "bg-forest-50 dark:bg-forest-950/60" : "hover:bg-surface-muted/60",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-ink">{t.name}</p>
                        <span suppressHydrationWarning className="shrink-0 text-[0.6875rem] text-muted">
                          {relativeTime(last?.at ?? t.createdAt)}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        {t.topic === CANNOT_TRAVEL_TOPIC ? (
                          <Pill tone="warning">Cannot travel</Pill>
                        ) : (
                          <span className="truncate text-xs text-muted">{t.topic}</span>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
                        {last?.from === "admin" ? `${last.author}: ` : ""}
                        {last?.body}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        {selected ? (
          <TicketDetail key={selected.id} ticket={selected} />
        ) : (
          <EmptyState icon={<Headset className="size-6" />} title="No ticket selected" />
        )}
      </div>
    </>
  );
}

function TicketDetail({ ticket }: { ticket: SupportTicket }) {
  const { admins, replyTicket, setTicketStatus, assignTicket } = useOps();
  const { toast } = useToast();
  const [reply, setReply] = useState("");
  const [error, setError] = useState<string | null>(null);

  function send() {
    if (reply.trim().length < 5) {
      setError("Write a reply first.");
      return;
    }
    replyTicket(ticket.id, reply);
    setReply("");
    toast({ title: "Reply sent", description: `Emailed to ${ticket.email}.` });
  }

  return (
    <Card className="flex flex-col">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line p-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-ink">{ticket.name}</h2>
            <TicketPill status={ticket.status} />
          </div>
          <p className="mt-1 text-sm text-muted">{ticket.topic}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
            <a href={`mailto:${ticket.email}`} className="inline-flex items-center gap-1.5 hover:text-ink">
              <Mail className="size-3.5" />
              {ticket.email}
            </a>
            {ticket.phone ? (
              <span className="inline-flex items-center gap-1.5">
                <Phone className="size-3.5" />
                {formatPhone(ticket.phone)}
              </span>
            ) : null}
            <span>Ticket {ticket.id}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <div className="w-44">
            <Select
              aria-label="Assign ticket"
              value={ticket.assigneeId ?? ""}
              onChange={(e) => assignTicket(ticket.id, e.target.value || undefined)}
            >
              <option value="">Unassigned</option>
              {admins.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </Select>
          </div>
          {ticket.status === "closed" ? (
            <Button variant="outline" onClick={() => setTicketStatus(ticket.id, "open")}>
              <RotateCcw className="size-4" />
              Reopen
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setTicketStatus(ticket.id, "closed")}>
              <CircleCheck className="size-4" />
              Close
            </Button>
          )}
        </div>
      </div>

      {ticket.topic === CANNOT_TRAVEL_TOPIC && ticket.status !== "closed" ? (
        <div className="border-b border-line bg-amber-50/60 px-5 py-3 text-xs leading-relaxed text-amber-900 dark:bg-amber-950/25 dark:text-amber-200">
          This pilgrim can no longer travel. Check their plan in Savings plans, then explain
          the options your licence allows. Do not promise an outcome you cannot deliver.
        </div>
      ) : null}

      <ol className="flex-1 space-y-4 p-5">
        {ticket.messages.map((m) => (
          <li
            key={m.id}
            className={cn("flex", m.from === "admin" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3",
                m.from === "admin"
                  ? "bg-forest-800 text-white"
                  : "border border-line bg-surface-muted/60 text-ink",
              )}
            >
              <p className="text-sm leading-relaxed whitespace-pre-line">{m.body}</p>
              <p
                suppressHydrationWarning
                className={cn("mt-1.5 text-[0.6875rem]", m.from === "admin" ? "text-white/60" : "text-muted")}
              >
                {m.author} · {formatDateTime(m.at)}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="border-t border-line p-5">
        <Field label="Reply" htmlFor="ticket-reply" error={error ?? undefined}>
          <TextArea
            id="ticket-reply"
            value={reply}
            onChange={(e) => {
              setReply(e.target.value);
              setError(null);
            }}
            placeholder={`Write to ${ticket.name.split(" ")[0]}…`}
          />
        </Field>
        <div className="mt-3 flex justify-end">
          <Button onClick={send}>
            <Send className="size-4" />
            Send reply
          </Button>
        </div>
      </div>
    </Card>
  );
}
