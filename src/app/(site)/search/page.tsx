import type { Metadata } from "next";
import { PackageOpen, SearchX } from "lucide-react";

import { searchPublishedProducts } from "@/lib/products";
import { Container } from "@/components/ui/container";
import { SearchBar } from "@/components/ui/search-bar";
import { ProductGrid } from "@/components/product/product-grid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catalog",
  description:
    "Browse and search the curated PepFinds catalog — hand-picked products from Weidian, Taobao, and 1688.",
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string | string[] }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = rawQuery?.trim() ?? "";

  const { results, total } = await searchPublishedProducts(query);

  return (
    <section className="min-h-screen pb-24 pt-28 sm:pt-32">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {query ? "Search results" : "Browse the catalog"}
          </h1>
          <p className="mt-3 text-muted">
            {query ? (
              <>
                {total} result{total === 1 ? "" : "s"} for{" "}
                <span className="font-medium text-ink">
                  &ldquo;{query}&rdquo;
                </span>
              </>
            ) : (
              "Search by name, tag, or category — or explore everything below."
            )}
          </p>

          <div className="mt-8">
            <SearchBar defaultValue={query} autoFocus={!query} />
          </div>
        </div>

        <div className="mt-16">
          {total > 0 ? (
            <ProductGrid products={results} />
          ) : query ? (
            <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-line bg-surface px-8 py-16 text-center">
              <div className="grid size-14 place-items-center rounded-2xl bg-surface-soft text-muted">
                <SearchX className="size-6" />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-ink">
                No products found
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Nothing in the catalog matches &ldquo;{query}&rdquo;. Try a
                broader keyword or browse everything from the homepage.
              </p>
            </div>
          ) : (
            <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-line bg-surface px-8 py-16 text-center">
              <div className="grid size-14 place-items-center rounded-2xl bg-surface-soft text-muted">
                <PackageOpen className="size-6" />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-ink">
                The catalog is being curated
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Hand-picked products are on their way. Check back soon.
              </p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
