import { Pill, type BadgeTone } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import type { KycStatus } from "@/lib/types";
import type { DisputeStatus, SosStatus, TicketStatus, VendorStatus } from "@/lib/ops/types";

const KYC: Record<KycStatus, { label: string; tone: BadgeTone }> = {
  "in-review": { label: "Awaiting review", tone: "warning" },
  verified: { label: "Verified", tone: "positive" },
  rejected: { label: "Rejected", tone: "danger" },
  "not-started": { label: "Not started", tone: "neutral" },
};

export function KycPill({ status }: { status: KycStatus }) {
  return <Pill tone={KYC[status].tone}>{KYC[status].label}</Pill>;
}

const TICKET: Record<TicketStatus, { label: string; tone: BadgeTone }> = {
  open: { label: "Open", tone: "warning" },
  pending: { label: "Awaiting customer", tone: "info" },
  closed: { label: "Closed", tone: "neutral" },
};

export function TicketPill({ status }: { status: TicketStatus }) {
  return <Pill tone={TICKET[status].tone}>{TICKET[status].label}</Pill>;
}

const VENDOR: Record<VendorStatus, { label: string; tone: BadgeTone }> = {
  pending: { label: "Pending", tone: "warning" },
  approved: { label: "Active", tone: "positive" },
  suspended: { label: "Suspended", tone: "danger" },
  rejected: { label: "Rejected", tone: "neutral" },
};

export function VendorPill({ status }: { status: VendorStatus }) {
  return <Pill tone={VENDOR[status].tone}>{VENDOR[status].label}</Pill>;
}

const DISPUTE: Record<DisputeStatus, { label: string; tone: BadgeTone }> = {
  open: { label: "Open", tone: "warning" },
  refunded: { label: "Refunded to buyer", tone: "info" },
  released: { label: "Released to vendor", tone: "positive" },
};

export function DisputePill({ status }: { status: DisputeStatus }) {
  return <Pill tone={DISPUTE[status].tone}>{DISPUTE[status].label}</Pill>;
}

const SOS: Record<SosStatus, { label: string; tone: BadgeTone }> = {
  dispatched: { label: "New", tone: "danger" },
  acknowledged: { label: "Responder assigned", tone: "warning" },
  resolved: { label: "Resolved", tone: "positive" },
};

export function SosPill({ status }: { status: SosStatus }) {
  return <Pill tone={SOS[status].tone}>{SOS[status].label}</Pill>;
}

/** Topic used by the contact form for pilgrims who can no longer travel. */
export const CANNOT_TRAVEL_TOPIC = "I can no longer travel for Hajj";

/** Consistent table styling for console lists. */
export function OpsTable({
  head,
  children,
  className,
}: {
  head: React.ReactNode[];
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-line text-[0.6875rem] font-medium text-muted">
            {head.map((h, i) => (
              <th key={i} scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  );
}

export const TD = "px-4 py-3 align-middle";
