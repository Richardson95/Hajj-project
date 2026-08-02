import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset your password",
  description: "Recover access to your HajjPath account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
