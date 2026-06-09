"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Optional anchor id (used by in-page navigation). */
  id?: string;
  /** Delay (seconds) before the entrance animation starts. */
  delay?: number;
  /** Vertical travel distance (px) for the fade-up. */
  y?: number;
  /** Render a different element while keeping the motion behavior. */
  as?: "div" | "section" | "li" | "article" | "header";
}

/**
 * Fade-and-rise-into-view wrapper. The cornerstone of the site's Apple-style
 * scroll choreography — subtle, springy, and respectful of reduced-motion.
 */
export function Reveal({
  children,
  className,
  id,
  delay = 0,
  y = 24,
  as = "div",
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  const variants: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : y },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <MotionTag
      id={id}
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}
