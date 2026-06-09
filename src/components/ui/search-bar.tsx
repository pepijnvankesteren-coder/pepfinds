"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface SearchBarProps {
  /** Visual scale: the hero uses "lg", the navbar uses "sm". */
  size?: "lg" | "sm";
  /** Pre-fill the input (e.g. from the current search query). */
  defaultValue?: string;
  /** Placeholder copy. */
  placeholder?: string;
  /** Show the inline submit button (hidden in the compact navbar variant). */
  showButton?: boolean;
  className?: string;
  autoFocus?: boolean;
}

/**
 * The platform's primary entry point. Submitting routes to /search?q=…
 * with an Apple-style focus ring that softly expands on focus.
 */
export function SearchBar({
  size = "lg",
  defaultValue = "",
  placeholder = "Search for products, brands, or styles…",
  showButton = true,
  className,
  autoFocus = false,
}: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = React.useState(defaultValue);
  const [focused, setFocused] = React.useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const query = value.trim();
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  };

  const isLarge = size === "lg";

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className={cn("relative w-full", className)}
    >
      <motion.div
        animate={{
          boxShadow: focused
            ? "0 4px 12px rgba(0,0,0,0.06), 0 24px 48px rgba(0,0,0,0.10)"
            : "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
          scale: focused && isLarge ? 1.01 : 1,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "flex items-center gap-3 rounded-full border border-line bg-canvas/80 backdrop-blur",
          isLarge ? "h-15 pl-6 pr-2" : "h-11 pl-4 pr-1.5",
        )}
      >
        <Search
          className={cn(
            "shrink-0 text-muted transition-colors",
            focused && "text-ink",
            isLarge ? "size-5" : "size-4",
          )}
          aria-hidden="true"
        />
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          aria-label="Search products"
          autoFocus={autoFocus}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-ink placeholder:text-muted-soft focus:outline-none",
            isLarge ? "text-base" : "text-sm",
          )}
        />
        {showButton && (
          <button
            type="submit"
            aria-label="Start searching"
            className={cn(
              "group inline-flex shrink-0 items-center justify-center rounded-full bg-ink text-canvas transition-all duration-300 ease-[var(--ease-out-expo)] hover:bg-ink-soft active:scale-95",
              isLarge ? "size-11" : "size-8",
            )}
          >
            <ArrowRight
              className={cn(
                "transition-transform duration-300 group-hover:translate-x-0.5",
                isLarge ? "size-5" : "size-4",
              )}
            />
          </button>
        )}
      </motion.div>
    </form>
  );
}
