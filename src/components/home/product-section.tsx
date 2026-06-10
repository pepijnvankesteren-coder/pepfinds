import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ProductView } from "@/lib/types";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/product-grid";

interface ProductSectionProps {
  id: string;
  title: string;
  subtitle: string;
  products: ProductView[];
  /** Optional "view all" destination shown next to the heading. */
  viewAllHref?: string;
  /** Alternate background for visual rhythm between stacked sections. */
  tone?: "canvas" | "surface";
}

/** Reusable headed product grid for the homepage (Featured, New arrivals). */
export function ProductSection({
  id,
  title,
  subtitle,
  products,
  viewAllHref,
  tone = "canvas",
}: ProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 py-24 sm:py-32",
        tone === "surface" && "bg-surface",
      )}
    >
      <Container>
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-lg text-muted text-balance">{subtitle}</p>
          </div>
          {viewAllHref && (
            <Button asChild variant="secondary" size="md" className="self-start">
              <Link href={viewAllHref}>
                Browse all
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          )}
        </Reveal>

        <div className="mt-14">
          <ProductGrid products={products} />
        </div>
      </Container>
    </section>
  );
}
