import { parseSourceUrl } from "@/lib/source-link";

/**
 * Scraper for Yupoo supplier catalogs (e.g. https://3madman.x.yupoo.com).
 *
 * Resellers post each product as an "album" of photos whose description links
 * to the original marketplace listing (Taobao / Weidian / 1688). We pull that
 * marketplace link — which our affiliate engine (lib/agent-links.ts) turns into
 * buy buttons — plus the album's title and photos. Yupoo photos are hotlink
 * protected, so every image URL is rewritten to go through /api/img.
 */

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

/** Max photos kept per imported product. */
const MAX_IMAGES = 10;

export interface YupooTarget {
  /** Seller host, e.g. "3madman.x.yupoo.com". */
  host: string;
  /** Album id when the input pointed at a single album, else null. */
  albumId: string | null;
}

export interface YupooAlbumSummary {
  id: string;
  title: string | null;
  albumUrl: string;
  /** Proxied cover image, or null when none was found. */
  cover: string | null;
  /** Number of photos in the album, when shown on the card. */
  photoCount: number | null;
}

export interface YupooAlbumDetail {
  id: string;
  title: string;
  albumUrl: string;
  /** Proxied full-size photo URLs. */
  images: string[];
  /** Raw marketplace listing URL, or null when none was detected. */
  sourceUrl: string | null;
}

/** Rewrite a Yupoo photo URL to load through our hotlink-safe proxy. */
function proxied(url: string): string {
  const absolute = url.startsWith("//") ? `https:${url}` : url;
  return `/api/img?u=${encodeURIComponent(absolute)}`;
}

/** Minimal HTML entity decode for the bits that show up in URLs/titles. */
function decodeEntities(input: string): string {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/** Parse a pasted Yupoo URL into a seller host + optional album id. */
export function parseYupooInput(raw: string): YupooTarget | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (!/(^|\.)yupoo\.com$/i.test(url.hostname)) return null;

  const album = url.pathname.match(/\/albums\/(\d+)/);
  return { host: url.hostname, albumId: album ? album[1] : null };
}

async function fetchHtml(url: string, host: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Referer: `https://${host}/`,
      "Accept-Language": "en-US,en;q=0.9",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Yupoo responded ${res.status}`);
  }
  return res.text();
}

/** Title from <meta og:title>, trimmed of Yupoo's " | 相册 | seller …" suffix. */
function extractTitle(html: string): string | null {
  const og = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/i);
  const raw = og?.[1] ?? html.match(/<title>([^<]*)<\/title>/i)?.[1];
  if (!raw) return null;
  const title = decodeEntities(raw).split("|")[0].trim();
  return title || null;
}

/**
 * All of the album's full-size photos, normalized to the "big" size, deduped by
 * photo id and capped. The album's own photos appear first in the markup, so
 * the cap also keeps out any trailing "related album" thumbnails.
 */
function extractImages(html: string): string[] {
  const re =
    /(?:data-src|src)="((?:https?:)?\/\/photo\.yupoo\.com\/([^"/]+)\/([0-9a-f]+)\/(?:small|medium|big|square)\.(jpe?g|png|webp))"/gi;
  const seen = new Set<string>();
  const images: string[] = [];
  for (const m of html.matchAll(re)) {
    const [, , seller, photoId, ext] = m;
    const key = `${seller}/${photoId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    images.push(proxied(`https://photo.yupoo.com/${seller}/${photoId}/big.${ext}`));
    if (images.length >= MAX_IMAGES) break;
  }
  return images;
}

/** First Taobao / Weidian / 1688 listing URL in the page that we can parse. */
function extractSourceUrl(html: string): string | null {
  const scan = (text: string): string | null => {
    const re = /https?:\/\/[^\s"'<>\\)]+/gi;
    for (const m of text.matchAll(re)) {
      const candidate = decodeEntities(m[0]).replace(/[.,]+$/, "");
      if (!/(weidian|taobao|tmall|1688)\.com/i.test(candidate)) continue;
      const parsed = parseSourceUrl(candidate);
      if (parsed && parsed.platform !== "OTHER" && parsed.itemId) {
        return parsed.canonicalUrl ?? candidate;
      }
    }
    return null;
  };

  // Raw scan first; fall back to a decoded pass for agent-wrapped (URL-encoded)
  // marketplace links.
  const direct = scan(html);
  if (direct) return direct;
  try {
    return scan(decodeURIComponent(html));
  } catch {
    return null;
  }
}

/** Fetch and parse a single album. */
export async function fetchYupooAlbum(
  host: string,
  albumId: string,
): Promise<YupooAlbumDetail> {
  // Bare /albums/{id} returns 404 — Yupoo needs the uid query param.
  const albumUrl = `https://${host}/albums/${albumId}?uid=1`;
  const html = await fetchHtml(albumUrl, host);
  return {
    id: albumId,
    title: extractTitle(html) ?? `Yupoo album ${albumId}`,
    albumUrl,
    images: extractImages(html),
    sourceUrl: extractSourceUrl(html),
  };
}

/**
 * List a seller's albums (first page) for the selection grid. Covers come from
 * the first photo in each album's card; titles are best-effort here and are
 * always refreshed from the album page on import.
 */
export async function listYupooAlbums(
  host: string,
): Promise<YupooAlbumSummary[]> {
  const html = await fetchHtml(`https://${host}/albums`, host);

  // First index of each distinct album link, in document order.
  const anchors = new Map<string, number>();
  for (const m of html.matchAll(/href="\/albums\/(\d+)/g)) {
    if (!anchors.has(m[1])) anchors.set(m[1], m.index ?? 0);
  }

  const ordered = [...anchors.entries()].sort((a, b) => a[1] - b[1]);
  const photoRe =
    /(?:data-src|src)="((?:https?:)?\/\/photo\.yupoo\.com\/[^"]+\.(?:jpe?g|png|webp))"/i;
  const altRe = /alt="([^"]+)"/i;

  return ordered.map(([id, index], i) => {
    const end = ordered[i + 1]?.[1] ?? html.length;
    const card = html.slice(index, end);
    const cover = card.match(photoRe)?.[1] ?? null;
    const altRaw = card.match(altRe)?.[1];
    const alt = altRaw ? decodeEntities(altRaw).trim() : "";
    const title = alt && !/\.(jpe?g|png|webp)$/i.test(alt) ? alt : null;
    const count = card.match(/album__photonumber"[^>]*>\s*(\d+)/)?.[1];
    return {
      id,
      title,
      albumUrl: `https://${host}/albums/${id}?uid=1`,
      cover: cover ? proxied(cover) : null,
      photoCount: count ? Number(count) : null,
    };
  });
}
