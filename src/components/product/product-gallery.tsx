"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  title: string;
  className?: string;
}

/**
 * Product image gallery: large framed cover with a soft cross-fade between
 * images, plus a thumbnail rail when there's more than one.
 */
export function ProductGallery({ images, title, className }: ProductGalleryProps) {
  const [active, setActive] = React.useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-line bg-surface-soft shadow-soft">
        {current ? (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={current}
                alt={title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="grid size-full place-items-center text-muted-soft">
            <ImageIcon className="size-10" />
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show image ${index + 1} of ${images.length}`}
              aria-current={index === active}
              className={cn(
                "relative size-20 overflow-hidden rounded-xl border bg-surface-soft",
                "transition-all duration-300 ease-[var(--ease-out-expo)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/70 focus-visible:ring-offset-2",
                index === active
                  ? "border-ink shadow-soft"
                  : "border-line opacity-70 hover:opacity-100",
              )}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
