import type { MarketplaceId } from "@/lib/types";

/**
 * Parses an original marketplace listing URL (Weidian / Taobao / 1688) into the
 * pieces every purchasing agent needs: which platform it is and the item id.
 * Agent affiliate links are then generated from this — see lib/agent-links.ts —
 * so the admin only ever pastes one source link per product.
 */
export interface ParsedSource {
  platform: MarketplaceId;
  /** Numeric listing id, when it could be extracted. */
  itemId: string | null;
  /** Normalized canonical listing URL, for agents that take the full URL. */
  canonicalUrl: string | null;
  /** The original URL exactly as entered. */
  rawUrl: string;
}

export function parseSourceUrl(raw: string): ParsedSource | null {
  const url = raw.trim();
  if (!url) return null;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const host = parsed.hostname.toLowerCase();

  // Weidian — id lives in the itemID query param. Covers both the canonical
  // weidian.com host and seller subdomains like shopXXXX.v.weidian.com.
  if (host === "weidian.com" || host.endsWith(".weidian.com")) {
    const itemId =
      parsed.searchParams.get("itemID") ?? parsed.searchParams.get("itemId");
    return {
      platform: "WEIDIAN",
      itemId,
      canonicalUrl: itemId
        ? `https://weidian.com/item.html?itemID=${itemId}`
        : null,
      rawUrl: url,
    };
  }

  // Taobao / Tmall — id lives in the id query param.
  if (
    host === "taobao.com" ||
    host.endsWith(".taobao.com") ||
    host.endsWith(".tmall.com")
  ) {
    const itemId = parsed.searchParams.get("id");
    return {
      platform: "TAOBAO",
      itemId,
      canonicalUrl: itemId
        ? `https://item.taobao.com/item.htm?id=${itemId}`
        : null,
      rawUrl: url,
    };
  }

  // 1688 — id is in the /offer/{id}.html path, sometimes an id query param.
  if (host === "1688.com" || host.endsWith(".1688.com")) {
    const match = parsed.pathname.match(/offer\/(\d+)\.html/);
    const itemId = match ? match[1] : parsed.searchParams.get("id");
    return {
      platform: "ALI_1688",
      itemId,
      canonicalUrl: itemId
        ? `https://detail.1688.com/offer/${itemId}.html`
        : null,
      rawUrl: url,
    };
  }

  // Anything else: still a valid source link, just not auto-convertible.
  return { platform: "OTHER", itemId: null, canonicalUrl: null, rawUrl: url };
}

/**
 * Stable identity for a source listing, so the same item — pasted twice or
 * already in the catalog — is only imported once. Falls back to the raw URL for
 * unrecognized marketplaces where no item id can be extracted.
 */
export function sourceKey(source: ParsedSource): string {
  return source.platform !== "OTHER" && source.itemId
    ? `${source.platform}:${source.itemId}`
    : source.rawUrl.trim().toLowerCase();
}
