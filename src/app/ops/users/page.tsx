"use client";

import { useMemo, useState } from "react";
import { CircleCheck, CircleX, IdCard, Search } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { Pill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataRow, EmptyState, PageHeader } from "@/components/ui/misc";
import { Field, TextArea, TextInput } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { SegmentedControl } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { KycPill, OpsTable, TD } from "@/components/ops/ops-ui";
import {
  usePlatformActions,
  usePlatformUsers,
  type UserRow,
} from "@/components/ops/use-platform";
import { formatDate, formatDateTime, formatPhone, maskId } from "@/lib/format";

type Filter = "all" | "in-review" | "verified" | "rejected";

export default function OpsUsersPage() {
  const users = usePlatformUsers();
  const [filter, setFilter] = useState<Filter>("in-review");
  const [query, setQuery] = useState("");
  const [reviewId, setReviewId] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter(
      (u) =>
        (filter === "all" || u.kyc === filter) &&
        (!q ||
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.phone.includes(q) ||
          u.state.toLowerCase().includes(q)),
    );
  }, [users, filter, query]);

  const count = (f: Filter) => (f === "all" ? users.length : users.filter((u) => u.kyc === f).length);
  const reviewing = users.find((u) => u.id === reviewId) ?? null;

  return (
    <>
      <PageHeader
        title="Users & KYC"
        description="Every registered pilgrim. Approve or reject identity checks so they can start saving."
      />

      <Card>
        <CardBody className="flex flex-col gap-3 border-b border-line md:flex-row md:items-center md:justify-between">
          <SegmentedControl
            items={[
              { id: "in-review", label: "Awaiting review", count: count("in-review") },
              { id: "verified", label: "Verified", count: count("verified") },
              { id: "rejected", label: "Rejected", count: count("rejected") },
              { id: "all", label: "All", count: count("all") },
            ]}
            value={filter}
            onChange={setFilter}
            size="sm"
          />
          <div className="relative md:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
            <TextInput
              aria-label="Search users"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name, email, phone or state"
              className="pl-10"
            />
          </div>
        </CardBody>

        {visible.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={<IdCard className="size-6" />}
              title="No users here"
              description={filter === "in-review" ? "Every identity check has been reviewed." : "Try a different filter or search."}
            />
          </div>
        ) : (
          <OpsTable head={["Pilgrim", "State", "Joined", "KYC", ""]}>
            {visible.map((u) => (
              <tr key={u.id} className="hover:bg-surface-muted/50">
                <td className={TD}>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-ink">{u.name}</p>
                    {u.live ? <Pill tone="brand">Demo pilgrim account</Pill> : null}
                  </div>
                  <p className="text-xs text-muted">{u.email}</p>
                </td>
                <td className={`${TD} text-muted`}>{u.state}</td>
                <td className={`${TD} whitespace-nowrap text-muted`}>{formatDate(u.joinedAt)}</td>
                <td className={TD}>
                  <KycPill status={u.kyc} />
                </td>
                <td className={`${TD} text-right`}>
                  <Button
                    size="sm"
                    variant={u.kyc === "in-review" ? "primary" : "outline"}
                    onClick={() => setReviewId(u.id)}
                  >
                    {u.kyc === "in-review" ? "Review" : "View"}
                  </Button>
                </td>
              </tr>
            ))}
          </OpsTable>
        )}
      </Card>

      <ReviewModal user={reviewing} onClose={() => setReviewId(null)} />
    </>
  );
}

function ReviewModal({ user, onClose }: { user: UserRow | null; onClose: () => void }) {
  if (!user) return null;
  return <ReviewForm user={user} onClose={onClose} />;
}

function ReviewForm({ user, onClose }: { user: UserRow; onClose: () => void }) {
  const { setKyc } = usePlatformActions();
  const { toast } = useToast();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  function approve() {
    setKyc(user, "verified");
    toast({ title: `${user.name} is verified`, description: "They can now fund their plan in full." });
    onClose();
  }

  function reject() {
    if (reason.trim().length < 10) {
      setError("Tell the pilgrim what to fix (at least 10 characters).");
      return;
    }
    setKyc(user, "rejected", reason.trim());
    toast({ title: `KYC rejected for ${user.name}`, description: "They have been asked to correct and resubmit.", tone: "warning" });
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={user.name}
      description={user.live ? "Demo pilgrim account in this browser. Changes show in the pilgrim app straight away." : user.email}
      footer={
        rejecting ? (
          <>
            <Button variant="ghost" onClick={() => setRejecting(false)}>
              Back
            </Button>
            <Button variant="danger" onClick={reject}>
              <CircleX className="size-4" />
              Confirm rejection
            </Button>
          </>
        ) : (
          <>
            {user.kyc !== "rejected" ? (
              <Button variant="outline" onClick={() => setRejecting(true)}>
                <CircleX className="size-4" />
                Reject
              </Button>
            ) : null}
            {user.kyc !== "verified" ? (
              <Button onClick={approve}>
                <CircleCheck className="size-4" />
                Approve
              </Button>
            ) : null}
          </>
        )
      }
    >
      {rejecting ? (
        <Field label="Reason for rejection" required error={error ?? undefined} htmlFor="kyc-reason" hint="The pilgrim sees this, so say exactly what to correct.">
          <TextArea
            id="kyc-reason"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError(null);
            }}
            placeholder="e.g. The passport data page photo is blurred. Please upload a clear photo."
          />
        </Field>
      ) : (
        <>
          <div className="mb-3">
            <KycPill status={user.kyc} />
          </div>
          <dl>
            <DataRow label="Email" value={user.email} />
            <DataRow label="Phone" value={formatPhone(user.phone)} />
            <DataRow label="State" value={user.state} />
            <DataRow label="NIN" value={user.nin ? maskId(user.nin) : "—"} />
            <DataRow label="Passport number" value={user.passportNumber || "—"} />
            <DataRow label="Documents" value="Passport photo and data page uploaded" />
            <DataRow label="Submitted" value={user.submittedAt ? formatDateTime(user.submittedAt) : "—"} />
            {user.reviewedAt ? <DataRow label="Last reviewed" value={formatDateTime(user.reviewedAt)} /> : null}
          </dl>
          {user.rejectionReason ? (
            <p className="mt-4 rounded-xl bg-rose-50 p-3.5 text-[0.8125rem] leading-relaxed text-rose-800 dark:bg-rose-950/40 dark:text-rose-200">
              {user.rejectionReason}
            </p>
          ) : null}
        </>
      )}
    </Modal>
  );
}
