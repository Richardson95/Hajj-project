import type { Metadata } from "next";
import { OpsShell } from "@/components/ops/ops-shell";

export const metadata: Metadata = {
  title: {
    default: "Operations console",
    template: "%s · HajjPath Ops",
  },
  robots: { index: false, follow: false },
};

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  return <OpsShell>{children}</OpsShell>;
}
