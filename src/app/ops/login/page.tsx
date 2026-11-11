import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/ops/admin-login-form";

export const metadata: Metadata = {
  title: "Admin sign in",
};

export default function AdminLoginPage() {
  return (
    <div className="relative grid min-h-full place-items-center overflow-hidden bg-forest-950 px-4 py-12">
      <div className="pattern-islamic pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -top-40 left-1/2 size-144 -translate-x-1/2 rounded-full bg-gold-600/10 blur-[120px]" />
      <div className="relative w-full max-w-md">
        <Suspense fallback={null}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
