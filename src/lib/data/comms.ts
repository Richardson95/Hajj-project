import type { IconName } from "@/components/icon";
import type {
  AdminPilgrimRow,
  Announcement,
  AppNotification,
  SosEvent,
} from "../types";

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-01",
    title: "Mina camp allocation confirmed — Street 56, Tent 214",
    body: "Your Muassasah allocation is now final. Save the tent number offline in HajjPath before you leave Aziziyah, and photograph the street sign at the junction — GPS is unreliable inside the camp corridors.",
    author: "Alhaji Kabiru Sule",
    authorRole: "Group Admin · Al-Amanah",
    priority: "important",
    date: "2026-08-01T15:20:00.000Z",
    audience: "Al-Amanah Hajj Group 2027",
    pinned: true,
  },
  {
    id: "ann-02",
    title: "Meningitis ACWY vaccination deadline — 14 August",
    body: "All 2027 pilgrims must present a valid meningococcal ACWY certificate issued no less than ten days and no more than three years before arrival. State Pilgrims Boards are running free clinics until 14 August.",
    author: "NAHCON Medical Directorate",
    authorRole: "National Hajj Commission",
    priority: "critical",
    date: "2026-07-29T08:00:00.000Z",
    audience: "All 2027 pilgrims",
    pinned: true,
  },
  {
    id: "ann-03",
    title: "Second instalment window opens 5 August",
    body: "Pilgrims on the Baytullah Standard package can pay the second instalment from 5 to 30 August. Deposits made through your HajjPath virtual account are reconciled automatically within ten minutes.",
    author: "HajjPath Operations",
    authorRole: "HajjPath",
    priority: "info",
    date: "2026-07-27T10:30:00.000Z",
    audience: "Baytullah Standard subscribers",
    pinned: false,
  },
  {
    id: "ann-04",
    title: "Nusuk Rawdah permits — book as a group",
    body: "Rawdah slots for our Madinah window open 60 days ahead. Send your Nusuk account email to the admin desk by Friday so we can book the group together and avoid split timings.",
    author: "Alhaji Kabiru Sule",
    authorRole: "Group Admin · Al-Amanah",
    priority: "important",
    date: "2026-07-24T17:45:00.000Z",
    audience: "Al-Amanah Hajj Group 2027",
    pinned: false,
  },
  {
    id: "ann-05",
    title: "Heat advisory: expect 44–48°C in the Mashaer",
    body: "The Saudi meteorological authority projects daytime peaks of 48°C during Tashriq. Carry an umbrella, drink 250ml every thirty minutes, and never perform Jamarat between 11:00 and 15:00 if you have a heart condition.",
    author: "HajjPath Support Desk",
    authorRole: "24/7 Operations",
    priority: "critical",
    date: "2026-07-21T06:15:00.000Z",
    audience: "All pilgrims in the Kingdom",
    pinned: false,
  },
  {
    id: "ann-06",
    title: "Marketplace vendors verified for the 2027 season",
    body: "Forty-one Makkah and Madinah vendors have completed re-verification. Every order is escrow-protected — funds are released to the vendor only after you confirm delivery in the app.",
    author: "HajjPath Marketplace",
    authorRole: "HajjPath",
    priority: "info",
    date: "2026-07-15T12:00:00.000Z",
    audience: "All users",
    pinned: false,
  },
];

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: "ntf-01",
    title: "Contribution received — ₦385,000",
    body: "Your July standing order cleared. You are now 61.9% of the way to your Hajj goal.",
    kind: "savings",
    date: "2026-07-28T07:04:00.000Z",
    read: false,
    href: "/app/savings",
  },
  {
    id: "ntf-02",
    title: "Order out for delivery",
    body: "Bilal Nigerian Kitchen is 18 minutes from Aziziyah Block C with your jollof rice order.",
    kind: "order",
    date: "2026-08-01T11:22:00.000Z",
    read: false,
    href: "/app/marketplace/orders",
  },
  {
    id: "ntf-03",
    title: "Musa Bello requested assistance",
    body: "A group member raised a Find Me alert near the Jamarat Bridge. Dr. Amina Lawal is en route.",
    kind: "group",
    date: "2026-08-02T05:41:00.000Z",
    read: false,
    href: "/app/find-me",
  },
  {
    id: "ntf-04",
    title: "Meningitis certificate due in 12 days",
    body: "Upload your ACWY certificate before 14 August to keep your 2027 seat confirmed.",
    kind: "kyc",
    date: "2026-07-29T08:05:00.000Z",
    read: true,
    href: "/app/profile",
  },
  {
    id: "ntf-05",
    title: "Q2 profit share credited — ₦41,360",
    body: "Your Mudarabah pool return for April to June has been added to your balance.",
    kind: "savings",
    date: "2026-07-01T09:02:00.000Z",
    read: true,
    href: "/app/savings",
  },
  {
    id: "ntf-06",
    title: "New chapter added to your guide",
    body: "Stoning the Jamarat now includes crowd-flow maps for the 2027 Jamarat Bridge levels.",
    kind: "ritual",
    date: "2026-06-30T14:00:00.000Z",
    read: true,
    href: "/app/guide/jamarat",
  },
];

export const SOS_HISTORY: SosEvent[] = [
  {
    id: "sos-01",
    category: "heat",
    note: "Dizziness after Dhuhr at the Mataf — requested cooling assistance.",
    raisedAt: "2026-07-19T13:12:00.000Z",
    location: "Masjid al-Haram, Gate 79",
    status: "resolved",
    respondent: "Red Crescent team 14 · arrived in 4 minutes",
  },
  {
    id: "sos-02",
    category: "lost",
    note: "Separated from group after Isha, unable to locate Street 56.",
    raisedAt: "2026-07-08T21:48:00.000Z",
    location: "Mina, near Sector 54",
    status: "resolved",
    respondent: "Group Admin Kabiru Sule · reunited in 11 minutes",
  },
];

export const SOS_CATEGORY_META: {
  id: SosEvent["category"];
  label: string;
  icon: IconName;
  detail: string;
  dispatch: string;
}[] = [
  {
    id: "medical",
    label: "Medical emergency",
    icon: "ambulance",
    detail: "Chest pain, collapse, severe injury or breathing difficulty.",
    dispatch: "Saudi Red Crescent (997) + group medic",
  },
  {
    id: "heat",
    label: "Heat exhaustion",
    icon: "thermometer",
    detail: "Dizziness, cramping, confusion or stopping sweating in the heat.",
    dispatch: "Nearest cooling unit + group medic",
  },
  {
    id: "lost",
    label: "I am lost",
    icon: "compass",
    detail: "Separated from your group and unsure of your location.",
    dispatch: "Group admin + Find Me broadcast to all members",
  },
  {
    id: "family",
    label: "Missing companion",
    icon: "users",
    detail: "Someone travelling with you cannot be found.",
    dispatch: "Group-wide Find Me alert + HajjPath support desk",
  },
  {
    id: "security",
    label: "Safety concern",
    icon: "shield",
    detail: "Theft, harassment or a dangerous crowd surge.",
    dispatch: "Saudi security (911) + HajjPath support desk",
  },
  {
    id: "other",
    label: "Something else",
    icon: "headset",
    detail: "Speak to a HajjPath agent who will route your case.",
    dispatch: "HajjPath 24/7 support agent",
  },
];

export const ADMIN_PILGRIMS: AdminPilgrimRow[] = [
  { id: "ap-01", name: "Ibrahim Adetunji", passport: "B10428765", kyc: "verified", savedPct: 62, status: "safe", room: "Anjum 1418", phone: "08034512907" },
  { id: "ap-02", name: "Halimah Adetunji", passport: "B10428766", kyc: "verified", savedPct: 56, status: "safe", room: "Anjum 1420", phone: "08029914476" },
  { id: "ap-03", name: "Sekinat Adetunji", passport: "A98120044", kyc: "verified", savedPct: 19, status: "resting", room: "Anjum 1420", phone: "08055120038" },
  { id: "ap-04", name: "Musa Bello", passport: "B22014993", kyc: "verified", savedPct: 88, status: "assistance", room: "Aziziyah F2", phone: "08067714402" },
  { id: "ap-05", name: "Yakubu Danladi", passport: "B14077210", kyc: "in-review", savedPct: 41, status: "safe", room: "Aziziyah C7", phone: "08122009471" },
  { id: "ap-06", name: "Fatimah Oyelaran", passport: "B09884120", kyc: "verified", savedPct: 74, status: "moving", room: "Dar Al Tawhid 809", phone: "08099471200" },
  { id: "ap-07", name: "Suleiman Idris", passport: "B31200487", kyc: "verified", savedPct: 100, status: "safe", room: "Anjum 1502", phone: "08036612284" },
  { id: "ap-08", name: "Zainab Abubakar", passport: "B27718840", kyc: "in-review", savedPct: 33, status: "safe", room: "Aziziyah C9", phone: "08144902017" },
  { id: "ap-09", name: "Abdulganiyu Salami", passport: "B18830092", kyc: "verified", savedPct: 67, status: "moving", room: "Anjum 1511", phone: "08023390014" },
  { id: "ap-10", name: "Hauwa Mohammed", passport: "B20014477", kyc: "rejected", savedPct: 12, status: "safe", room: "Pending", phone: "08167712230" },
];
