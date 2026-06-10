import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { requireAdmin } from "@/lib/auth";
import { getProductForAdmin } from "@/lib/products";
import { updateProduct } from "@/lib/actions/product-actions";
import { Container } from "@/components/ui/container";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  await requireAdmin();
  const { id } = await params;

  const product = await getProductForAdmin(id);
  if (!product) notFound();

  return (
    <Container className="max-w-3xl">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Back to products
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Edit product
        </h1>
        {product.published && (
          <Link
            href={`/product/${product.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
          >
            View live page
            <ExternalLink className="size-3.5" />
          </Link>
        )}
      </div>
      <p className="mt-1.5 truncate text-sm text-muted">{product.title}</p>

      <div className="mt-8">
        <ProductForm
          action={updateProduct.bind(null, product.id)}
          initial={product}
          submitLabel="Save changes"
        />
      </div>
    </Container>
  );
}
