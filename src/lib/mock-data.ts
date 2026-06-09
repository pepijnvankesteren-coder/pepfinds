import type { Product, SearchResponse } from "@/lib/types";

/**
 * Deterministic placeholder imagery via picsum.photos (seeded so the same
 * product always renders the same image across server/client). Replace with
 * real marketplace CDN URLs when live APIs are connected.
 */
const img = (seed: string) =>
  `https://picsum.photos/seed/${seed}/800/800`;

/**
 * Mock product catalog. This stands in for a real search index / API.
 * Kept in one place so the entire app reads from a single fixture.
 */
export const PRODUCTS: Product[] = [
  {
    id: "wd-001",
    title: "Heavyweight Boxy Cotton Tee — Washed Black",
    marketplace: "weidian",
    price: 18,
    currency: "USD",
    image: img("pepfinds-tee"),
    sourceUrl: "https://weidian.com/item.html?itemID=000001",
    category: "Apparel",
    rating: 4.8,
    soldCount: 3120,
  },
  {
    id: "tb-002",
    title: "Retro Suede Runner Sneakers — Sand",
    marketplace: "taobao",
    price: 42,
    currency: "USD",
    image: img("pepfinds-runner"),
    sourceUrl: "https://taobao.com/item.htm?id=000002",
    category: "Footwear",
    rating: 4.7,
    soldCount: 8740,
  },
  {
    id: "16-003",
    title: "Brushed Fleece Hoodie — Heather Grey (Bulk)",
    marketplace: "1688",
    price: 14,
    currency: "USD",
    image: img("pepfinds-hoodie"),
    sourceUrl: "https://1688.com/offer/000003.html",
    category: "Apparel",
    rating: 4.6,
    soldCount: 15200,
  },
  {
    id: "wd-004",
    title: "Minimalist Nylon Crossbody Bag — Matte Black",
    marketplace: "weidian",
    price: 29,
    currency: "USD",
    image: img("pepfinds-bag"),
    sourceUrl: "https://weidian.com/item.html?itemID=000004",
    category: "Accessories",
    rating: 4.9,
    soldCount: 2050,
  },
  {
    id: "tb-005",
    title: "Wide-Leg Pleated Trousers — Charcoal",
    marketplace: "taobao",
    price: 33,
    currency: "USD",
    image: img("pepfinds-trousers"),
    sourceUrl: "https://taobao.com/item.htm?id=000005",
    category: "Apparel",
    rating: 4.5,
    soldCount: 6410,
  },
  {
    id: "16-006",
    title: "Chunky Knit Beanie — Cream (12-pack)",
    marketplace: "1688",
    price: 6,
    currency: "USD",
    image: img("pepfinds-beanie"),
    sourceUrl: "https://1688.com/offer/000006.html",
    category: "Accessories",
    rating: 4.4,
    soldCount: 22100,
  },
  {
    id: "wd-007",
    title: "Titanium Frame Sunglasses — Smoke Lens",
    marketplace: "weidian",
    price: 38,
    currency: "USD",
    image: img("pepfinds-sunglasses"),
    sourceUrl: "https://weidian.com/item.html?itemID=000007",
    category: "Accessories",
    rating: 4.8,
    soldCount: 1890,
  },
  {
    id: "tb-008",
    title: "Leather Low-Top Court Sneakers — White",
    marketplace: "taobao",
    price: 49,
    currency: "USD",
    image: img("pepfinds-court"),
    sourceUrl: "https://taobao.com/item.htm?id=000008",
    category: "Footwear",
    rating: 4.7,
    soldCount: 9930,
  },
  {
    id: "16-009",
    title: "Aluminum Desk Organizer Tray — Space Grey",
    marketplace: "1688",
    price: 11,
    currency: "USD",
    image: img("pepfinds-tray"),
    sourceUrl: "https://1688.com/offer/000009.html",
    category: "Home",
    rating: 4.6,
    soldCount: 4300,
  },
  {
    id: "wd-010",
    title: "Magnetic Wireless Charger Stand — Midnight",
    marketplace: "weidian",
    price: 24,
    currency: "USD",
    image: img("pepfinds-charger"),
    sourceUrl: "https://weidian.com/item.html?itemID=000010",
    category: "Tech",
    rating: 4.5,
    soldCount: 5620,
  },
  {
    id: "tb-011",
    title: "Quilted Liner Bomber Jacket — Olive",
    marketplace: "taobao",
    price: 56,
    currency: "USD",
    image: img("pepfinds-bomber"),
    sourceUrl: "https://taobao.com/item.htm?id=000011",
    category: "Apparel",
    rating: 4.8,
    soldCount: 3380,
  },
  {
    id: "16-012",
    title: "Ceramic Pour-Over Coffee Set — Matte White",
    marketplace: "1688",
    price: 19,
    currency: "USD",
    image: img("pepfinds-coffee"),
    sourceUrl: "https://1688.com/offer/000012.html",
    category: "Home",
    rating: 4.7,
    soldCount: 7150,
  },
];

/** A curated subset used for the landing-page showcase grid. */
export const FEATURED_PRODUCTS: Product[] = PRODUCTS.slice(0, 8);

/**
 * Mock search. Filters the fixture by a simple case-insensitive token match
 * across title / category / marketplace. Shaped like a real async API so the
 * call site won't change when a live backend replaces it.
 */
export async function searchProducts(query: string): Promise<SearchResponse> {
  const normalized = query.trim().toLowerCase();

  const results = !normalized
    ? PRODUCTS
    : PRODUCTS.filter((p) => {
        const haystack = [p.title, p.category ?? "", p.marketplace]
          .join(" ")
          .toLowerCase();
        return normalized
          .split(/\s+/)
          .some((token) => haystack.includes(token));
      });

  return {
    query,
    results,
    total: results.length,
  };
}
