"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { NAV_LINKS, SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

/**
 * Floating, glassmorphic navigation bar. Gains a hairline border + stronger
 * blur once the page is scrolled, mirroring Apple's sticky top chrome.
 */
export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "glass border-b border-line/70"
          : "border-b border-transparent",
      )}
    >
      <Container>
        <nav className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight text-ink"
            aria-label={`${SITE.name} home`}
          >
            <span className="grid size-7 place-items-center rounded-lg bg-ink text-canvas text-sm font-bold">
              P
            </span>
            {SITE.name}
          </Link>

          <ul className="hidden items-center gap-9 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <Button asChild size="sm">
              <Link href="/search">Start Searching</Link>
            </Button>
          </div>

          <button
            type="button"
            className="grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-surface-soft md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>
      </Container>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="glass overflow-hidden border-b border-line/70 md:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-3 py-3 text-base text-ink transition-colors hover:bg-surface-soft"
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild size="md" className="mt-2 w-full">
                <Link href="/search" onClick={() => setMenuOpen(false)}>
                  Start Searching
                </Link>
              </Button>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
