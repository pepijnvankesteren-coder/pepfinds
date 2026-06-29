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

/**
 * Find the first usable Weidian / Taobao / 1688 listing URL among a set of
 * candidate strings (e.g. every link on a product page, plus the page URL).
 * Each candidate is also decoded a couple of times, so a marketplace URL that
 * an agent link wraps in a percent-encoded `?url=` param is still found.
 * Used by the one-click bookmarklet importer.
 */
export function findMarketplaceUrl(candidates: string[]): string | null {
  for (const raw of candidates) {
    if (!raw) continue;
    const forms = [raw];
    try {
      forms.push(decodeURIComponent(raw));
    } catch {
      // Malformed escape — skip the decoded form.
    }
    try {
      forms.push(decodeURIComponent(decodeURIComponent(raw)));
    } catch {
      // Ditto.
    }
    for (const form of forms) {
      // Split before every scheme so a marketplace URL nested in an agent
      // link's `?url=` param is treated as its own candidate, not swallowed by
      // the outer URL.
      for (const part of form.split(/(?=https?:\/\/)/i)) {
        const match = part.match(/^https?:\/\/[^\s"'<>\\]+/i);
        if (!match) continue;
        const url = match[0].replace(/[)\].,]+$/, "");
        if (!/(weidian|taobao|tmall|1688)\.com/i.test(url)) continue;
        const parsed = parseSourceUrl(url);
        if (parsed && parsed.platform !== "OTHER" && parsed.itemId) {
          return parsed.canonicalUrl ?? url;
        }
      }
    }
  }
  return null;
}
