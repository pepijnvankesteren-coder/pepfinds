/** Centralized site metadata, reused by layout SEO, sitemap, and footer. */
export const SITE = {
  name: "PepFinds",
  title: "PepFinds — Find Products Direct From China",
  description:
    "Search millions of products from Weidian, Taobao, and 1688 in one place.",
  url: "https://pepfinds.com",
  locale: "en_US",
} as const;

/** Primary navigation links shared by the navbar. */
export const NAV_LINKS = [
  { label: "Discover", href: "/#showcase" },
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
