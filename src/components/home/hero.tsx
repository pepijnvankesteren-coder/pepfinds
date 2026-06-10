"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Hero: oversized headline, centered search, and the primary CTA into the
 * catalog. Kept deliberately spare — the curated products are the show.
 */
export function Hero() {
  const reduceMotion = useReducedMotion();

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: EASE },
    },
  };

  return (
    <section className="relative overflow-hidden pb-20 pt-32 sm:pb-24 sm:pt-40">
      <div className="hero-glow pointer-events-none absolute inset-0 -z-10" />

      <Container>
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div variants={item} className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-soft px-3.5 py-1.5 text-xs font-medium text-muted">
              <span className="size-1.5 rounded-full bg-ink" />
              Hand-picked, agent-ready finds
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl md:text-7xl"
          >
            Curated Finds,
            <br />
            Direct From China
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted text-balance"
          >
            A hand-picked catalog of products from Weidian, Taobao, and 1688 —
            each with direct links to trusted buying agents.
          </motion.p>

          <motion.div variants={item} className="mx-auto mt-10 max-w-xl">
            <SearchBar />
          </motion.div>

          <motion.div
            variants={item}
            className="mt-6 flex items-center justify-center"
          >
            <Button asChild size="lg">
              <Link href="/search">Browse the Catalog</Link>
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
