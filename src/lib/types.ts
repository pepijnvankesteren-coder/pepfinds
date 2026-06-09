/**
 * Core domain types for the product discovery platform.
 *
 * These intentionally model only what the MVP needs today, while leaving
 * room for future features (image search, AI matching, affiliate tracking).
 * Keep them framework-agnostic so they can be shared with any future API layer.
 */

/** Stable identifiers for every supported marketplace. */
export type MarketplaceId = "weidian" | "taobao" | "1688";

export interface Marketplace {
  id: MarketplaceId;
  /** Display name, e.g. "Weidian". */
  name: string;
  /** Short tagline shown on marketplace cards. */
  description: string;
  /** Origin domain, used for outbound source links. */
  domain: string;
  /** Two-letter accent initials rendered in the logo card. */
  initials: string;
  /** Tailwind classes describing the brand accent (text + bg). */
  accent: {
    text: string;
    bg: string;
  };
}

export interface Product {
  id: string;
  title: string;
  /** Marketplace this listing originates from. */
  marketplace: MarketplaceId;
  /** Estimated price in USD. */
  price: number;
  currency: string;
  /** Primary image URL (remote placeholder for the MVP). */
  image: string;
  /** Outbound link to the original listing. */
  sourceUrl: string;
  /** Optional discovery metadata — reserved for future ranking/filters. */
  category?: ProductCategory;
  rating?: number;
  soldCount?: number;
}

export type ProductCategory =
  | "Apparel"
  | "Footwear"
  | "Accessories"
  | "Tech"
  | "Home";

/**
 * Shape returned by the (currently mocked) search layer. Mirrors what a real
 * paginated API response will look like so swapping the data source is trivial.
 */
export interface SearchResponse {
  query: string;
  results: Product[];
  total: number;
}
