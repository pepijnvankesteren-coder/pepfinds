/** Centralized site metadata, reused by layout SEO, sitemap, and footer. */
export const SITE = {
  name: "PepFinds",
  title: "PepFinds — Curated Finds Direct From China",
  description:
    "A hand-picked catalog of products from Weidian, Taobao, and 1688 — each with direct links to trusted buying agents.",
  url: "https://pepfinds.com",
  locale: "en_US",
} as const;

/** Single contact address, used across the legal pages and the footer. */
export const CONTACT_EMAIL = "pepvanspam@gmail.com";

/** Primary navigation links shared by the navbar. */
export const NAV_LINKS = [
  { label: "Catalog", href: "/search" },
  { label: "Marketplaces", href: "/#marketplaces" },
  { label: "Features", href: "/#features" },
] as const;

/** Footer links. mailto:/https: hrefs render as plain anchors in the footer. */
export const FOOTER_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms-and-conditions" },
  { label: "Cookies", href: "/cookies" },
  { label: "Intellectual Property", href: "/ip" },
  { label: "DSA", href: "/dsa" },
  { label: "Contact", href: `mailto:${CONTACT_EMAIL}` },
] as const;
