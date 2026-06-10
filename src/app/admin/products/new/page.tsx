import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { requireAdmin } from "@/lib/auth";
import { createProduct } from "@/lib/actions/product-actions";
import { Container } from "@/components/ui/container";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
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
        New product
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        Add a find to the catalog. Save as a draft or publish right away.
      </p>

      <div className="mt-8">
        <ProductForm action={createProduct} submitLabel="Create product" />
      </div>
    </Container>
  );
}
