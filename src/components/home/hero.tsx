"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Full-bleed hero: oversized headline, centered search, primary CTA, and a
 * large product mockup that drifts with a subtle scroll-driven parallax.
 */
export function Hero() {
  const reduceMotion = useReducedMotion();
  const mockupRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: mockupRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [60, -60],
  );

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
    <section className="relative overflow-hidden pt-32 sm:pt-40">
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
              Product discovery, refined
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl md:text-7xl"
          >
            Find Products
            <br />
            Direct From China
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted text-balance"
          >
            Search millions of products from Weidian, Taobao, and 1688 in one
            place.
          </motion.p>

          <motion.div
            variants={item}
            className="mx-auto mt-10 max-w-xl"
          >
            <SearchBar />
          </motion.div>

          <motion.div
            variants={item}
            className="mt-6 flex items-center justify-center"
          >
            <Button asChild size="lg">
              <Link href="/search">Start Searching</Link>
            </Button>
          </motion.div>
        </motion.div>
      </Container>

      <div ref={mockupRef} className="relative mt-20 sm:mt-24">
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 60, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: EASE, delay: 0.4 }}
          style={{ y: parallaxY }}
          className="mx-auto w-full max-w-5xl px-6"
        >
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-surface-soft shadow-float sm:rounded-[2rem]">
            <Image
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1600&q=80"
              alt="Preview of the PepFinds product discovery experience"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
