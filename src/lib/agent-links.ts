import type { AgentId, MarketplaceId } from "@/lib/types";
import type { ParsedSource } from "@/lib/source-link";

/**
 * Generates each agent's affiliate product link from a parsed source link, so
 * the admin only ever pastes the original marketplace URL and never copies a
 * link per agent. Affiliate codes and per-agent platform identifiers live here
 * as the single source of truth — all reverse-engineered from real affiliate
 * links. Update a code here and every product reflects it instantly.
 *
 * BaseTao and ACBuy are intentionally absent: they use the source-link popup
 * flow (see lib/agents.ts + product/agent-buttons.tsx), not a generated link.
 */

// Affiliate identifiers (your account codes).
const OOPBUY_INVITE = "XND229FU9";
const KAKOBUY_AFFCODE = "xf8bm";
const ORIENTDIG_REF = "100246326";
const MULEBUY_T = "t1000017";
const MULEBUY_REF = "201340733";
const SUPERBUY_PARTNER = "8wVOmF";

// Auto-convertible platforms (everything except the OTHER catch-all).
type Platform = Exclude<MarketplaceId, "OTHER">;

// How each agent spells each platform in its product URL.
const OOPBUY_PLATFORM: Record<Platform, string> = {
  WEIDIAN: "2",
  TAOBAO: "1",
  ALI_1688: "0",
};
const ORIENTDIG_PLATFORM: Record<Platform, string> = {
  WEIDIAN: "WEIDIAN",
  TAOBAO: "TAOBAO",
  ALI_1688: "ALI_1688",
};
const MULEBUY_PLATFORM: Record<Platform, string> = {
  WEIDIAN: "WEIDIAN",
  TAOBAO: "TAOBAO",
  ALI_1688: "ALI_1688",
};
const SUPERBUY_PLATFORM: Record<Platform, string> = {
  WEIDIAN: "WD",
  TAOBAO: "TB",
  ALI_1688: "ALIBABA",
};

/**
 * Build an agent's affiliate URL for a product, or null when it can't be
 * generated (e.g. an OTHER-marketplace source, or an agent with no template).
 */
export function buildAgentUrl(
  agent: AgentId,
  source: ParsedSource,
): string | null {
  const { platform, itemId, canonicalUrl, rawUrl } = source;
  const known = platform !== "OTHER" && Boolean(itemId);

  switch (agent) {
    case "KAKOBUY": {
      // Takes the full marketplace URL, so it works on every platform.
      const target = canonicalUrl ?? rawUrl;
      return target
        ? `https://www.kakobuy.com/item/details?url=${encodeURIComponent(target)}&affcode=${KAKOBUY_AFFCODE}`
        : null;
    }
    case "OOPBUY":
      return known
        ? `https://oopbuy.com/product/${OOPBUY_PLATFORM[platform as Platform]}/${itemId}?inviteCode=${OOPBUY_INVITE}`
        : null;
    case "ORIENTDIG":
      return known
        ? `https://orientdig.com/product?platform=${ORIENTDIG_PLATFORM[platform as Platform]}&id=${itemId}&ref=${ORIENTDIG_REF}`
        : null;
    case "MULEBUY":
      return known
        ? `https://t.mulebuy.com?t=${MULEBUY_T}&id=${itemId}&shop_type=${MULEBUY_PLATFORM[platform as Platform]}&ref=${MULEBUY_REF}`
        : null;
    case "SUPERBUY":
      return known
        ? `https://www.superbuy.com/en/page/buy/?platform=${SUPERBUY_PLATFORM[platform as Platform]}&id=${itemId}&partnercode=${SUPERBUY_PARTNER}`
        : null;
    default:
      // BASETAO / ACBUY — handled by the source-link popup flow.
      return null;
  }
}
