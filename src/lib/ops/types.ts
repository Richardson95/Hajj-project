/**
 * Operations console — domain model
 * ------------------------------------------------------------------
 * Everything HajjPath staff manage across the whole platform, as
 * opposed to the single signed-in pilgrim the main app models.
 */

import type {
  AnnouncementPriority,
  ChecklistItem,
  HajjPackage,
  ItineraryDay,
  KycStatus,
  PilgrimGroup,
  PlanFrequency,
  PlanStatus,
  Product,
  SosCategory,
  TravelYear,
  Vendor,
} from "../types";
import type { Faq } from "../data/marketing";

export type AdminRole = "super-admin" | "staff";

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  /** Demo only: a real deployment verifies credentials on the server. */
  password: string;
  role: AdminRole;
  addedAt: string;
  addedBy: string;
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  state: string;
  joinedAt: string;
  nin: string;
  passportNumber: string;
  kyc: KycStatus;
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface OpsPlan {
  id: string;
  userId: string;
  beneficiaryName: string;
  packageId: string;
  travelYear: TravelYear;
  frequency: PlanFrequency;
  amountPerCycle: number;
  balance: number;
  status: PlanStatus;
}

export type TicketStatus = "open" | "pending" | "closed";

export interface TicketMessage {
  id: string;
  from: "customer" | "admin";
  author: string;
  body: string;
  at: string;
}

export interface SupportTicket {
  id: string;
  name: string;
  email: string;
  phone?: string;
  topic: string;
  status: TicketStatus;
  assigneeId?: string;
  createdAt: string;
  messages: TicketMessage[];
}

export type VendorStatus = "pending" | "approved" | "suspended" | "rejected";

/** A supplier whose goods HajjPath lists. Vendors never post products themselves. */
export interface OpsVendor extends Vendor {
  contact: string;
  status: VendorStatus;
  appliedAt: string;
  note?: string;
}

export type DisputeStatus = "open" | "refunded" | "released";

export interface Dispute {
  id: string;
  orderId: string;
  buyer: string;
  vendorName: string;
  amountSAR: number;
  reason: string;
  openedAt: string;
  status: DisputeStatus;
  resolutionNote?: string;
}

export interface OpsFaq extends Faq {
  id: string;
}

export interface OpsAnnouncement {
  id: string;
  title: string;
  body: string;
  priority: AnnouncementPriority;
  pinned: boolean;
  date: string;
  author: string;
}

export type SosStatus = "dispatched" | "acknowledged" | "resolved";

export interface OpsSosAlert {
  id: string;
  pilgrim: string;
  group: string;
  category: SosCategory;
  note: string;
  location: string;
  raisedAt: string;
  status: SosStatus;
  respondent: string;
}

export interface AuditEntry {
  id: string;
  at: string;
  admin: string;
  action: string;
}

export interface OpsState {
  sessionAdminId: string | null;
  admins: AdminAccount[];
  users: PlatformUser[];
  plans: OpsPlan[];
  tickets: SupportTicket[];
  vendors: OpsVendor[];
  /** The marketplace catalogue. Only admins create, edit or remove products. */
  products: Product[];
  hiddenProducts: string[];
  disputes: Dispute[];
  packages: HajjPackage[];
  faqs: OpsFaq[];
  announcements: OpsAnnouncement[];
  sos: OpsSosAlert[];
  checklist: ChecklistItem[];
  group: PilgrimGroup;
  itinerary: ItineraryDay[];
  audit: AuditEntry[];
}
