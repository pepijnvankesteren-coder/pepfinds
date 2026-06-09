import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/product-grid";
import { FEATURED_PRODUCTS } from "@/lib/mock-data";

/** Curated showcase grid on the landing page. */
export function ProductShowcase() {
  return (
    <section id="showcase" className="scroll-mt-24 bg-surface py-24 sm:py-32">
      <Container>
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Trending right now
            </h2>
            <p className="mt-4 text-lg text-muted text-balance">
              A glimpse of what you can discover — handpicked across every
              connected marketplace.
            </p>
          </div>
          <Button asChild variant="secondary" size="md" className="self-start">
            <Link href="/search">
              Browse all
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </Reveal>

        <div className="mt-14">
          <ProductGrid products={FEATURED_PRODUCTS} />
        </div>
      </Container>
    </section>
  );
}
