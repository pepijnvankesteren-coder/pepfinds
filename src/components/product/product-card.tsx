"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { SOURCE_FLOW_AGENT_LIST } from "@/lib/agents";
import type { ProductView } from "@/lib/types";
import { MarketplaceBadge } from "@/components/marketplace/marketplace-badge";

interface ProductCardProps {
  product: ProductView;
  /** Eager-load the first row of images for better LCP. */
  priority?: boolean;
  className?: string;
}

/**
 * Premium product tile: framed cover with a slow hover zoom and marketplace
 * badge. The whole card links to the product's detail page.
 */
export function ProductCard({
  product,
  priority = false,
  className,
}: ProductCardProps) {
  const cover = product.images[0];
  // Buy options = direct agent links plus the source-flow agents (BaseTao,
  // ACBuy) that a source link unlocks.
  const agentCount =
    product.agentLinks.length +
    (product.sourceUrl ? SOURCE_FLOW_AGENT_LIST.length : 0);

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn("h-full", className)}
    >
      <Link
        href={`/product/${product.slug}`}
        className={cn(
          "group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-canvas shadow-soft",
          "transition-shadow duration-500 hover:shadow-float",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/70 focus-visible:ring-offset-2",
        )}
      >
        <div className="relative aspect-square overflow-hidden bg-surface-soft">
          {cover ? (
            <Image
              src={cover}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={priority}
              className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
            />
          ) : (
            <div className="grid size-full place-items-center text-muted-soft">
              <ImageIcon className="size-8" />
            </div>
          )}
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

          {product.category && (
            <p className="mt-1.5 text-xs text-muted">{product.category}</p>
          )}

          <div className="mt-auto flex items-center justify-between pt-5">
            <span className="text-xs text-muted">
              {agentCount} agent{agentCount === 1 ? "" : "s"} available
            </span>
            <span
              aria-hidden="true"
              className="inline-flex items-center gap-1 rounded-full bg-surface-soft px-3.5 py-2 text-sm font-medium text-ink transition-colors duration-300 group-hover:bg-ink group-hover:text-canvas"
            >
              View
              <ArrowUpRight className="size-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
