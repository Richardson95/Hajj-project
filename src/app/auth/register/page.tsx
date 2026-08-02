import type { Metadata } from "next";
import { RegisterWizard } from "@/components/auth/register-wizard";

export const metadata: Metadata = {
  title: "Create your account",
  description:
    "Open a HajjPath account: verified onboarding with BVN and NIN, passport upload, and a savings plan matched to your travel year.",
};

export default function RegisterPage() {
  return <RegisterWizard />;
}
