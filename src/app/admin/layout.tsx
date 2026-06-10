import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { isAdmin } from "@/lib/auth";
import { SITE } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { LogoutButton } from "@/components/admin/logout-button";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/**
 * Minimal chrome for the admin area — quiet header, soft surface background,
 * no public navbar/footer. Logout only renders for live sessions, so the
 * login page stays clean.
 */
export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const authenticated = await isAdmin();

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="border-b border-line bg-canvas">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-base font-semibold tracking-tight text-ink"
            >
              <span className="grid size-7 place-items-center rounded-lg bg-ink text-sm font-bold text-canvas">
                P
              </span>
              {SITE.name}
              <span className="rounded-full border border-line bg-surface-soft px-2.5 py-0.5 text-xs font-medium text-muted">
                Admin
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm text-muted transition-colors duration-300 hover:bg-surface-soft hover:text-ink"
              >
                View site
                <ExternalLink className="size-3.5" />
              </Link>
              {authenticated && <LogoutButton />}
            </div>
          </div>
        </Container>
      </header>

      <main className="flex-1 py-10 sm:py-14">{children}</main>
    </div>
  );
}
