"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";

import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { MarketplaceBadge } from "@/components/marketplace/marketplace-badge";

interface ProductCardProps {
  product: Product;
  /** Eager-load the first row of images for better LCP. */
  priority?: boolean;
  className?: string;
}

/**
 * Premium product tile: framed image with a slow hover zoom, marketplace
 * badge, title, estimated price, and an outbound "View Product" link.
 */
export function ProductCard({
  product,
  priority = false,
  className,
}: ProductCardProps) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-canvas shadow-soft transition-shadow duration-500 hover:shadow-float",
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-surface-soft">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          priority={priority}
          className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <MarketplaceBadge
            marketplace={product.marketplace}
            className="bg-canvas/80 backdrop-blur"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-[0.95rem] font-medium leading-snug text-ink">
          {product.title}
        </h3>

        {(product.rating || product.soldCount) && (
          <div className="mt-2 flex items-center gap-3 text-xs text-muted">
            {product.rating && (
              <span className="inline-flex items-center gap-1">
                <Star className="size-3.5 fill-ink text-ink" />
                {product.rating.toFixed(1)}
              </span>
            )}
            {product.soldCount && (
              <span>{product.soldCount.toLocaleString()} sold</span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-end justify-between pt-5">
          <div>
            <p className="text-xs text-muted">Est. price</p>
            <p className="text-lg font-semibold tracking-tight text-ink">
              {formatPrice(product.price, product.currency)}
            </p>
          </div>
          <a
            href={product.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${product.title} on its source marketplace`}
            className="inline-flex items-center gap-1 rounded-full bg-surface-soft px-3.5 py-2 text-sm font-medium text-ink transition-all duration-300 hover:bg-ink hover:text-canvas"
          >
            View
            <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
