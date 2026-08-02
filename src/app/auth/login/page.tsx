import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your HajjPath account to manage your savings plan and pilgrimage.",
};

export default function LoginPage() {
  return <LoginForm />;
}
