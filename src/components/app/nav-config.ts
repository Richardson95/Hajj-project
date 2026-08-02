import {
  Bell,
  BookOpen,
  CalendarDays,
  Camera,
  Compass,
  HandCoins,
  LayoutDashboard,
  ListChecks,
  Map,
  Megaphone,
  NotebookPen,
  Package,
  Siren,
  Store,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  badge?: "notifications" | "orders";
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { href: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
      {
        href: "/app/notifications",
        label: "Notifications",
        icon: Bell,
        badge: "notifications",
      },
    ],
  },
  {
    title: "Savings",
    items: [
      { href: "/app/savings", label: "Savings & plans", icon: Wallet },
      { href: "/app/family", label: "Family plans", icon: Users },
      { href: "/app/referrals", label: "Referrals", icon: HandCoins },
    ],
  },
  {
    title: "Pilgrimage",
    items: [
      { href: "/app/planner", label: "Tour planner", icon: CalendarDays },
      { href: "/app/guide", label: "Guide library", icon: BookOpen },
      { href: "/app/checklist", label: "Packing checklist", icon: ListChecks },
      { href: "/app/map", label: "Live map", icon: Map },
      { href: "/app/find-me", label: "Find Me", icon: Compass },
      { href: "/app/announcements", label: "Announcements", icon: Megaphone },
    ],
  },
  {
    title: "Marketplace",
    items: [
      { href: "/app/marketplace", label: "Makkah market", icon: Store },
      { href: "/app/marketplace/orders", label: "My orders", icon: Package, badge: "orders" },
    ],
  },
  {
    title: "Memories",
    items: [
      { href: "/app/gallery", label: "Gallery", icon: Camera },
      { href: "/app/journal", label: "Journal", icon: NotebookPen },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/app/sos", label: "Emergency SOS", icon: Siren },
      { href: "/app/profile", label: "Profile & security", icon: UserCog },
    ],
  },
];

export const PORTAL_LINKS: NavItem[] = [
  { href: "/app/vendor", label: "Vendor portal", icon: Store },
  { href: "/app/admin", label: "Group admin", icon: Users },
];

export const MOBILE_NAV: NavItem[] = [
  { href: "/app", label: "Home", icon: LayoutDashboard, exact: true },
  { href: "/app/savings", label: "Savings", icon: Wallet },
  { href: "/app/planner", label: "Planner", icon: CalendarDays },
  { href: "/app/marketplace", label: "Market", icon: Store },
];

/** Flat lookup used by the topbar to title the current page. */
export const ALL_NAV_ITEMS: NavItem[] = [
  ...NAV_GROUPS.flatMap((g) => g.items),
  ...PORTAL_LINKS,
];
