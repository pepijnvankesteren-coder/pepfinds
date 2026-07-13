import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { requireAdmin } from "@/lib/auth";
import { Container } from "@/components/ui/container";
import { YupooImportForm } from "@/components/admin/yupoo-import-form";

export const dynamic = "force-dynamic";

export default async function YupooImportPage() {
  await requireAdmin();

  return (
    <Container className="max-w-4xl">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Back to products
      </Link>

      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        Import from Yupoo
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        Paste any Yupoo page — a category, the seller&apos;s full album list, or
        a single item. Only the items on that page are listed. Pick what you
        want and import them as drafts, each with buy buttons generated from the
        marketplace link in the album.
      </p>

      <div className="mt-8">
        <YupooImportForm />
      </div>
    </Container>
  );
}
