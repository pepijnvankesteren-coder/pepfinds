/** Centralized site metadata, reused by layout SEO, sitemap, and footer. */
export const SITE = {
  name: "PepFinds",
  title: "PepFinds — Curated Finds Direct From China",
  description:
    "A hand-picked catalog of products from Weidian, Taobao, and 1688 — each with direct links to trusted buying agents.",
  url: "https://pepfinds.com",
  locale: "en_US",
} as const;

/** Primary navigation links shared by the navbar. */
export const NAV_LINKS = [
  { label: "Catalog", href: "/search" },
  { label: "Marketplaces", href: "/#marketplaces" },
  { label: "Features", href: "/#features" },
] as const;

/** Footer link groups. */
export const FOOTER_LINKS = [
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms", href: "#" },
] as const;
