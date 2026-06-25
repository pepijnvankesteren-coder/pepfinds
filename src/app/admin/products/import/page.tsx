import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { requireAdmin } from "@/lib/auth";
import { Container } from "@/components/ui/container";
import { BulkImportForm } from "@/components/admin/bulk-import-form";

export const dynamic = "force-dynamic";

export default async function BulkImportPage() {
  await requireAdmin();

  return (
    <Container className="max-w-3xl">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Back to products
      </Link>

      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        Bulk import
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        Paste a batch of source links to create one draft per listing, with buy
        buttons already generated from each link.
      </p>

      <div className="mt-8">
        <BulkImportForm />
      </div>
    </Container>
  );
}