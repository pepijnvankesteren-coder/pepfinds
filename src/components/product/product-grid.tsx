"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/product-card";

interface ProductGridProps {
  products: Product[];
  className?: string;
  /** Number of initial cards to mark as priority for LCP. */
  priorityCount?: number;
}

/**
 * Responsive product grid with a staggered entrance. Children rise into view
 * one after another for a calm, choreographed reveal.
 */
export function ProductGrid({
  products,
  className,
  priorityCount = 4,
}: ProductGridProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: reduceMotion ? 0 : 0.06 },
        },
      }}
      className={cn(
        "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          variants={{
            hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
            },
          }}
        >
          <ProductCard product={product} priority={index < priorityCount} />
        </motion.div>
      ))}
    </motion.div>
  );
}
