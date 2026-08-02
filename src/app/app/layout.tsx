import type { Metadata } from "next";
import { AppShell } from "@/components/app/app-shell";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s · HajjPath",
  },
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
