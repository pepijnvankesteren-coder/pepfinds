import type { Marketplace, MarketplaceId } from "@/lib/types";

/**
 * The supported marketplaces. Treated as the single source of truth — UI
 * badges, marketplace cards, and source links all derive from this map.
 */
export const MARKETPLACES: Record<MarketplaceId, Marketplace> = {
  weidian: {
    id: "weidian",
    name: "Weidian",
    description: "Boutique sellers and emerging brands.",
    domain: "weidian.com",
    initials: "WD",
    accent: {
      text: "text-[#e02020]",
      bg: "bg-[#e02020]/8",
    },
  },
  taobao: {
    id: "taobao",
    name: "Taobao",
    description: "The largest consumer marketplace in China.",
    domain: "taobao.com",
    initials: "TB",
    accent: {
      text: "text-[#ff5000]",
      bg: "bg-[#ff5000]/8",
    },
  },
  "1688": {
    id: "1688",
    name: "1688",
    description: "Wholesale sourcing direct from factories.",
    domain: "1688.com",
    initials: "16",
    accent: {
      text: "text-[#ff6a00]",
      bg: "bg-[#ff6a00]/8",
    },
  },
};

/** Ordered list for rendering. */
export const MARKETPLACE_LIST: Marketplace[] = Object.values(MARKETPLACES);

export function getMarketplace(id: MarketplaceId): Marketplace {
  return MARKETPLACES[id];
}
