"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import type { MarketplaceInfo } from "@/lib/types";

interface MarketplaceCardProps {
  marketplace: MarketplaceInfo;
  className?: string;
}

/**
 * Clean logo card for a supported marketplace. Uses typographic initials in
 * the brand accent rather than third-party logos, keeping the look cohesive.
 */
export function MarketplaceCard({
  marketplace,
  className,
}: MarketplaceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex flex-col items-center gap-4 rounded-3xl border border-line bg-canvas p-8 text-center shadow-soft transition-shadow duration-500 hover:shadow-float",
        className,
      )}
    >
      <div
        className={cn(
          "grid size-16 place-items-center rounded-2xl text-xl font-bold",
          marketplace.accent.bg,
          marketplace.accent.text,
        )}
      >
        {marketplace.initials}
      </div>
      <div>
        <h3 className="text-base font-semibold text-ink">
          {marketplace.name}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          {marketplace.description}
        </p>
      </div>
    </motion.div>
  );
}
