import Link from "next/link";
import { ImageIcon, Package, Pencil, Plus, Star, Upload } from "lucide-react";

import { requireAdmin } from "@/lib/auth";
import { getAllProductsForAdmin } from "@/lib/products";
import { deleteProduct } from "@/lib/actions/product-actions";
import { getMarketplace } from "@/lib/marketplaces";
import { SOURCE_FLOW_AGENT_LIST } from "@/lib/agents";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export const dynamic = "force-dynamic";

function StatusChip({ published }: { published: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        published ? "bg-ink text-canvas" : "border border-line bg-surface-soft text-muted",
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {published ? "Published" : "Draft"}
    </span>
  );
}

/** Product management dashboard — every product, drafts included. */
export default async function AdminDashboardPage() {
  await requireAdmin();
  const products = await getAllProductsForAdmin();
  const publishedCount = products.filter((p) => p.published).length;

  return (
    <Container>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Products
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            {products.length === 0
              ? "Your catalog is empty."
              : `${products.length} product${products.length === 1 ? "" : "s"} · ${publishedCount} published`}
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Button asChild variant="outline" size="md">
            <Link href="/admin/products/import">
              <Upload />
              Bulk import
            </Link>
          </Button>
          <Button asChild size="md">
            <Link href="/admin/products/new">
              <Plus />
              New product
            </Link>
          </Button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-3xl border border-dashed border-line bg-canvas px-8 py-20 text-center">
          <div className="grid size-14 place-items-center rounded-2xl bg-surface-soft text-muted">
            <Package className="size-6" />
          </div>
          <h2 className="mt-5 text-lg font-semibold text-ink">
            No products yet
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
            Add your first find — once published it appears in the public
            catalog instantly.
          </p>
          <Button asChild size="md" className="mt-6">
            <Link href="/admin/products/new">
              <Plus />
              Add your first product
            </Link>
          </Button>
        </div>
      ) : (
        <ul className="mt-8 overflow-hidden rounded-3xl border border-line bg-canvas shadow-soft">
          {products.map((product) => {
            const agentCount =
              product.agentLinks.length +
              (product.sourceUrl ? SOURCE_FLOW_AGENT_LIST.length : 0);
            return (
            <li
              key={product.id}
              className="flex items-center gap-4 border-b border-line-soft p-4 last:border-b-0 sm:gap-5 sm:px-6"
            >
              <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-line-soft bg-surface-soft">
                {product.images[0] ? (
                  // Plain <img>: tolerate broken admin-pasted URLs gracefully.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.images[0]}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <ImageIcon className="size-5 text-muted-soft" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">
                  {product.title}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted">
                  {getMarketplace(product.marketplace).name}
                  {product.category ? ` · ${product.category}` : ""}
                  {" · "}
                  {agentCount} agent{agentCount === 1 ? "" : "s"}
                </p>
              </div>

              <div className="hidden items-center gap-2 sm:flex">
                {product.featured && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-line bg-surface-soft px-2.5 py-1 text-xs font-medium text-ink">
                    <Star className="size-3 fill-ink" />
                    Featured
                  </span>
                )}
                <StatusChip published={product.published} />
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  aria-label={`Edit ${product.title}`}
                  className="grid size-9 place-items-center rounded-full text-muted transition-colors duration-300 hover:bg-surface-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/70 focus-visible:ring-offset-2"
                >
                  <Pencil className="size-4" />
                </Link>
                <DeleteProductButton
                  action={deleteProduct.bind(null, product.id)}
                  title={product.title}
                />
              </div>
            </li>
            );
          })}
        </ul>
      )}
    </Container>
  );
}
