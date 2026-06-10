import type { Metadata } from "next";

import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

/** Admin sign-in. The middleware redirects valid sessions straight to /admin. */
export default function AdminLoginPage() {
  return (
    <div className="grid min-h-[60vh] place-items-center px-6">
      <div className="w-full max-w-sm rounded-3xl border border-line bg-canvas p-8 shadow-soft">
        <div className="grid size-12 place-items-center rounded-2xl bg-ink text-lg font-bold text-canvas">
          P
        </div>
        <h1 className="mt-5 text-xl font-semibold tracking-tight text-ink">
          Admin sign in
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Enter the admin password to manage the catalog.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
