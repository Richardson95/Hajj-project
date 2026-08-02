/**
 * HajjPath — domain model
 * ------------------------------------------------------------------
 * Every entity the product spec describes, typed once and shared by
 * the mock data layer, the client store and the UI.
 */

import type { IconName } from "@/components/icon";

/* ---------------------------------- People --------------------------------- */

export type UserRole =
  | "pilgrim"
  | "sponsor"
  | "vendor"
  | "group-admin"
  | "support";

export type KycStatus = "not-started" | "in-review" | "verified" | "rejected";

export type TravelYear = 2026 | 2027 | 2028;

export interface KycRecord {
  bvn: string;
  nin: string;
  passportNumber: string;
  passportPhotoUploaded: boolean;
  passportDataPageUploaded: boolean;
  status: KycStatus;
  submittedAt?: string;
  verifiedAt?: string;
  provider: "VerifyMe" | "SmileID";
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: "male" | "female";
  dateOfBirth: string;
  state: string;
  city: string;
  role: UserRole;
  initials: string;
  avatarTone: string;
  kyc: KycRecord;
  referralCode: string;
  createdAt: string;
  hajjCompleted: boolean;
  honorific?: "Al-Hajji" | "Al-Hajja";
  languages: LanguageCode[];
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  groupId?: string;
  tagCode?: string;
}

export type LanguageCode = "en" | "ha" | "yo" | "ig" | "ar";

/* --------------------------------- Savings --------------------------------- */

export type PlanFrequency = "weekly" | "monthly" | "quarterly";
export type PlanStatus = "active" | "paused" | "completed" | "draft";

export interface HajjPackage {
  id: string;
  name: string;
  tier: "Standard" | "Premium" | "Executive";
  priceNGN: number;
  operator: string;
  nights: { makkah: number; madinah: number };
  hotelDistance: string;
  inclusions: string[];
  highlight?: string;
}

export interface SavingsPlan {
  id: string;
  ownerId: string;
  beneficiaryName: string;
  relationship: "Self" | "Spouse" | "Parent" | "Child" | "Sibling" | "Other";
  packageId: string;
  travelYear: TravelYear;
  frequency: PlanFrequency;
  amountPerCycle: number;
  balance: number;
  startDate: string;
  autoDebit: boolean;
  status: PlanStatus;
  bankName: string;
  isPrimary: boolean;
}

export type TransactionType =
  | "deposit"
  | "auto-debit"
  | "referral-bonus"
  | "profit-share"
  | "withdrawal"
  | "fee";

export type TransactionStatus = "successful" | "pending" | "failed";

export interface Transaction {
  id: string;
  planId: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  reference: string;
  channel: "Virtual Account" | "Card" | "Transfer" | "USSD" | "Wallet";
  date: string;
  narration: string;
}

export interface VirtualAccount {
  bankName: string;
  accountNumber: string;
  accountName: string;
  provider: "Paystack" | "Flutterwave" | "Moniepoint";
}

/* -------------------------------- Pilgrimage ------------------------------- */

export type RitualStage =
  | "Preparation"
  | "Makkah"
  | "Mina"
  | "Arafat"
  | "Muzdalifah"
  | "Jamarat"
  | "Madinah";

export type ActivityCategory =
  | "ritual"
  | "travel"
  | "rest"
  | "meal"
  | "briefing"
  | "free";

export interface ItineraryActivity {
  id: string;
  time: string;
  title: string;
  description: string;
  category: ActivityCategory;
  location: string;
  durationMins: number;
  obligation?: "Fard" | "Wajib" | "Sunnah";
}

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  gregorian: string;
  hijri: string;
  stage: RitualStage;
  title: string;
  subtitle: string;
  activities: ItineraryActivity[];
}

export interface GuideStep {
  id: string;
  order: number;
  title: string;
  body: string;
  obligation: "Fard" | "Wajib" | "Sunnah";
  tip?: string;
}

export interface Dua {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  occasion: string;
}

export interface GuideChapter {
  id: string;
  slug: string;
  title: string;
  arabicTitle: string;
  stage: RitualStage;
  summary: string;
  readMinutes: number;
  audioLanguages: LanguageCode[];
  steps: GuideStep[];
  duas: Dua[];
}

export interface ChecklistItem {
  id: string;
  label: string;
  group: "Documents" | "Ihram & Clothing" | "Health" | "Money" | "Essentials";
  note?: string;
}

/* ----------------------------------- Map ----------------------------------- */

export type PoiCategory =
  | "holy-site"
  | "camp"
  | "hospital"
  | "restroom"
  | "water"
  | "transport"
  | "food"
  | "hotel"
  | "meeting-point";

export interface Poi {
  id: string;
  name: string;
  arabicName?: string;
  category: PoiCategory;
  /** Normalised 0–100 coordinates on the HajjPath schematic map. */
  x: number;
  y: number;
  zone: RitualStage;
  description: string;
  walkMinutes: number;
  open24h: boolean;
}

export type MemberStatus = "safe" | "moving" | "resting" | "assistance";

export interface GroupMember {
  id: string;
  name: string;
  initials: string;
  avatarTone: string;
  role: "Pilgrim" | "Group Admin" | "Mutawwif" | "Medic";
  status: MemberStatus;
  x: number;
  y: number;
  zone: RitualStage;
  lastSeen: string;
  phone: string;
  tagCode: string;
  batteryPct: number;
}

export interface PilgrimGroup {
  id: string;
  name: string;
  code: string;
  operator: string;
  adminName: string;
  memberCount: number;
  campZone: string;
  emergencyLine: string;
}

/* -------------------------------- Marketplace ------------------------------ */

export type ProductCategory =
  | "ihram"
  | "livestock"
  | "souvenirs"
  | "food"
  | "toiletries"
  | "medicine"
  | "electronics";

export interface Vendor {
  id: string;
  name: string;
  location: string;
  rating: number;
  ratingCount: number;
  verified: boolean;
  since: number;
  categories: ProductCategory[];
  tone: string;
  responseTime: string;
  fulfilled: number;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  vendorId: string;
  priceNGN: number;
  priceSAR: number;
  compareAtSAR?: number;
  rating: number;
  reviews: number;
  stock: number;
  icon: IconName;
  tone: string;
  description: string;
  tags: string[];
  deliveryHours: number;
  deliversTo: ("Hotel" | "Mina Tent" | "Aziziyah" | "Madinah Hotel")[];
}

export interface CartLine {
  productId: string;
  qty: number;
}

export type OrderStatus =
  | "escrow-held"
  | "preparing"
  | "out-for-delivery"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  lines: CartLine[];
  totalSAR: number;
  status: OrderStatus;
  placedAt: string;
  deliverTo: string;
  courier: string;
  eta: string;
}

/* ------------------------------ Communications ----------------------------- */

export type AnnouncementPriority = "critical" | "important" | "info";

export interface Announcement {
  id: string;
  title: string;
  body: string;
  author: string;
  authorRole: string;
  priority: AnnouncementPriority;
  date: string;
  audience: string;
  pinned: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  kind: "savings" | "kyc" | "group" | "order" | "ritual" | "system";
  date: string;
  read: boolean;
  href?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

export type SosCategory =
  | "medical"
  | "lost"
  | "security"
  | "heat"
  | "family"
  | "other";

export interface SosEvent {
  id: string;
  category: SosCategory;
  note: string;
  raisedAt: string;
  location: string;
  status: "dispatched" | "acknowledged" | "resolved";
  respondent: string;
}

/* ------------------------------- Post-pilgrimage --------------------------- */

export interface GalleryItem {
  id: string;
  type: "photo" | "video";
  caption: string;
  location: string;
  date: string;
  tone: string;
  icon: IconName;
  durationSec?: number;
}

export interface JournalEntry {
  id: string;
  title: string;
  body: string;
  date: string;
  stage: RitualStage;
  mood: "grateful" | "reflective" | "joyful" | "humbled";
  shared: boolean;
}

export interface Referral {
  id: string;
  name: string;
  joinedAt: string;
  status: "invited" | "registered" | "saving";
  rewardNGN: number;
}

/* ---------------------------------- Vendor --------------------------------- */

export interface VendorOrderRow {
  id: string;
  product: string;
  buyer: string;
  qty: number;
  amountSAR: number;
  status: OrderStatus;
  placedAt: string;
  deliverTo: string;
}

/* ------------------------------- Group admin ------------------------------- */

export interface AdminPilgrimRow {
  id: string;
  name: string;
  passport: string;
  kyc: KycStatus;
  savedPct: number;
  status: MemberStatus;
  room: string;
  phone: string;
}
