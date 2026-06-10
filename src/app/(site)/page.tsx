import { getFeaturedProducts, getRecentProducts } from "@/lib/products";
import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { ProductSection } from "@/components/home/product-section";
import { CatalogEmptyState } from "@/components/home/catalog-empty-state";
import { MarketplacesSection } from "@/components/home/marketplaces-section";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, recent] = await Promise.all([
    getFeaturedProducts(8),
    getRecentProducts(8),
  ]);

  // Featured items also appear in "New arrivals" if they're recent — avoid
  // showing the exact same products twice back to back.
  const featuredIds = new Set(featured.map((product) => product.id));
  const fresh = recent.filter((product) => !featuredIds.has(product.id));

  const catalogIsEmpty = recent.length === 0;

  return (
    <>
      <Hero />

      {catalogIsEmpty ? (
        <CatalogEmptyState />
      ) : (
        <>
          <ProductSection
            id="featured"
            title="Featured finds"
            subtitle="The standouts — hand-picked highlights from the catalog."
            products={featured}
            viewAllHref="/search"
            tone="surface"
          />
          <ProductSection
            id="new"
            title="New arrivals"
            subtitle="The latest additions, fresh from the source."
            products={fresh.slice(0, 8)}
            viewAllHref={featured.length === 0 ? "/search" : undefined}
            tone={featured.length === 0 ? "surface" : "canvas"}
          />
        </>
      )}

      <Features />
      <MarketplacesSection />
    </>
  );
}
