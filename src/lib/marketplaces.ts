import type { MarketplaceId, MarketplaceInfo } from "@/lib/types";

/**
 * The supported marketplaces. Treated as the single source of truth — UI
 * badges, marketplace cards, and the admin form all derive from this map.
 */
export const MARKETPLACES: Record<MarketplaceId, MarketplaceInfo> = {
  WEIDIAN: {
    id: "WEIDIAN",
    name: "Weidian",
    description: "Boutique sellers and emerging brands.",
    domain: "weidian.com",
    initials: "WD",
    accent: {
      text: "text-[#e02020]",
      bg: "bg-[#e02020]/8",
    },
  },
  TAOBAO: {
    id: "TAOBAO",
    name: "Taobao",
    description: "The largest consumer marketplace in China.",
    domain: "taobao.com",
    initials: "TB",
    accent: {
      text: "text-[#ff5000]",
      bg: "bg-[#ff5000]/8",
    },
  },
  ALI_1688: {
    id: "ALI_1688",
    name: "1688",
    description: "Wholesale sourcing direct from factories.",
    domain: "1688.com",
    initials: "16",
    accent: {
      text: "text-[#ff6a00]",
      bg: "bg-[#ff6a00]/8",
    },
  },
  OTHER: {
    id: "OTHER",
    name: "Other",
    description: "Sourced beyond the big three.",
    domain: "",
    initials: "OT",
    accent: {
      text: "text-muted",
      bg: "bg-surface-soft",
    },
  },
};

/** The primary marketplaces shown on the homepage (excludes the catch-all). */
export const MARKETPLACE_LIST: MarketplaceInfo[] = [
  MARKETPLACES.WEIDIAN,
  MARKETPLACES.TAOBAO,
  MARKETPLACES.ALI_1688,
];

export function getMarketplace(id: MarketplaceId): MarketplaceInfo {
  return MARKETPLACES[id];
}
