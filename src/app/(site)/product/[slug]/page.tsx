import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getPublishedProductBySlug } from "@/lib/products";
import { getMarketplace } from "@/lib/marketplaces";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { MarketplaceBadge } from "@/components/marketplace/marketplace-badge";
import { ProductGallery } from "@/components/product/product-gallery";
import { AgentButtons } from "@/components/product/agent-buttons";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);
  if (!product) {
    return { title: "Product not found" };
  }
  return {
    title: product.title,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 160),
      images: product.images[0] ? [product.images[0]] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);
  if (!product) notFound();

  const marketplace = getMarketplace(product.marketplace);

  return (
    <section className="pb-24 pt-28 sm:pt-32">
      <Container>
        <Reveal>
          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-4" />
            Back to catalog
          </Link>
        </Reveal>

        <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <ProductGallery images={product.images} title={product.title} />
          </Reveal>

          <Reveal delay={0.08} className="flex flex-col">
            <div>
              <MarketplaceBadge marketplace={product.marketplace} />
            </div>

            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
              {product.title}
            </h1>

            {product.category && (
              <p className="mt-2 text-sm text-muted">{product.category}</p>
            )}

            <p className="mt-6 whitespace-pre-line text-[0.95rem] leading-relaxed text-muted">
              {product.description}
            </p>

            {product.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="rounded-full border border-line bg-surface-soft px-3 py-1 text-xs font-medium text-muted transition-colors duration-300 hover:border-ink/20 hover:text-ink"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-10 border-t border-line pt-8">
              <h2 className="text-sm font-semibold text-ink">
                Buy through an agent
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Pick your preferred purchasing agent — each button opens this
                listing on the agent&apos;s site, ready to order.
              </p>
              <AgentButtons
                links={product.buyLinks}
                sourceUrl={product.sourceUrl}
                className="mt-5"
              />
              <p className="mt-5 text-xs leading-relaxed text-muted-soft">
                Sourced from {marketplace.name}. PepFinds doesn&apos;t sell or
                ship anything — your order is placed entirely on the agent&apos;s
                own site, under their terms. Listed items are sold by third
                parties and may be unofficial or replica products, and some links
                may earn us a commission at no extra cost to you. PepFinds is
                independent and not affiliated with any brand, marketplace, or
                agent. See our{" "}
                <Link
                  href="/terms-and-conditions"
                  className="underline underline-offset-2 hover:text-ink"
                >
                  Terms
                </Link>
                .
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
