import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/ops/admin-login-form";

export const metadata: Metadata = {
  title: "Admin sign in",
};

export default function AdminLoginPage() {
  return (
    <div className="relative grid min-h-full place-items-center overflow-hidden bg-forest-950 px-4 py-12">
      <div className="relative w-full max-w-md">
        <Suspense fallback={null}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
