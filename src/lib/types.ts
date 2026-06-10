/**
 * Core domain types for the curated product platform.
 *
 * The id unions mirror the Prisma enums (`Marketplace`, `Agent`) as plain
 * string literals so client components never need to import the Prisma
 * runtime. The server data layer (lib/products.ts) maps database rows into
 * the serializable view types below before they cross into the UI.
 */

/** Stable identifiers for every supported source marketplace. */
export const MARKETPLACE_IDS = ["WEIDIAN", "TAOBAO", "ALI_1688", "OTHER"] as const;
export type MarketplaceId = (typeof MARKETPLACE_IDS)[number];

export interface MarketplaceInfo {
  id: MarketplaceId;
  /** Display name, e.g. "Weidian". */
  name: string;
  /** Short tagline shown on marketplace cards. */
  description: string;
  /** Origin domain — empty for the "Other" catch-all. */
  domain: string;
  /** Two-letter accent initials rendered in the logo card. */
  initials: string;
  /** Tailwind classes describing the brand accent (text + bg). */
  accent: {
    text: string;
    bg: string;
  };
}

/** Stable identifiers for every supported purchasing agent. */
export const AGENT_IDS = [
  "OOPBUY",
  "KAKOBUY",
  "ACBUY",
  "ORIENTDIG",
  "SUPERBUY",
  "BASETAO",
  "MULEBUY",
] as const;
export type AgentId = (typeof AGENT_IDS)[number];

export interface AgentInfo {
  id: AgentId;
  /** Display name, e.g. "Superbuy". */
  name: string;
  /** Primary domain, shown as a hint next to agent link inputs. */
  domain: string;
}

/** A single agent purchase link attached to a product. */
export interface AgentLinkView {
  agent: AgentId;
  url: string;
}

/**
 * Serializable product shape consumed by all UI components.
 * Dates are ISO strings so the type is safe to pass to client components.
 */
export interface ProductView {
  id: string;
  slug: string;
  title: string;
  description: string;
  images: string[];
  category: string | null;
  tags: string[];
  marketplace: MarketplaceId;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  agentLinks: AgentLinkView[];
}
