import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

import { db } from "@/lib/db";
import { getMarketplace } from "@/lib/marketplaces";
import { generateUniqueSlug } from "@/lib/slug";
import { findMarketplaceUrl, parseSourceUrl, sourceKey } from "@/lib/source-link";
import { SITE } from "@/lib/site";

/**
 * One-click import endpoint for the bookmarklet (see /admin/tools).
 *
 * The bookmarklet runs on any product page (e.g. doppel.fit or a marketplace
 * listing), collects the page's links/images/title, and POSTs them here. We
 * pull out the Taobao/Weidian/1688 source link — which the affiliate engine
 * turns into buy buttons — and create a draft product.
 *
 * It's called cross-origin from another site, so it can't use the admin session
 * cookie; instead it's guarded by a shared secret (IMPORT_TOKEN) and only ever
 * creates drafts, never publishes.
 */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(body: unknown, status: number) {
  return Response.json(body, { status, headers: CORS });
}

function tokenValid(provided: string): boolean {
  const expected = process.env.IMPORT_TOKEN ?? "";
  if (!expected || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function POST(request: NextRequest) {
  if (!process.env.IMPORT_TOKEN) {
    return json({ ok: false, error: "Import is not configured (IMPORT_TOKEN unset)." }, 503);
  }

  const body = (await request.json().catch(() => null)) as {
    token?: string;
    pageUrl?: string;
    links?: unknown;
    images?: unknown;
    title?: string;
    sourceUrl?: string;
  } | null;

  if (!body) return json({ ok: false, error: "Bad request." }, 400);
  if (!tokenValid(String(body.token ?? ""))) {
    return json({ ok: false, error: "Unauthorized." }, 401);
  }

  // Find the marketplace source link: an explicit one, else scan the page.
  const links = Array.isArray(body.links) ? body.links.map(String) : [];
  const candidates = [String(body.pageUrl ?? ""), String(body.sourceUrl ?? ""), ...links];
  const sourceUrl = findMarketplaceUrl(candidates);
  if (!sourceUrl) {
    return json(
      { ok: false, error: "No Taobao / Weidian / 1688 link found on this page." },
      422,
    );
  }
  const parsed = parseSourceUrl(sourceUrl);
  if (!parsed || parsed.platform === "OTHER" || !parsed.itemId) {
    return json({ ok: false, error: "Couldn't read the marketplace item." }, 422);
  }

  // Skip if this item is already in the catalog.
  const key = sourceKey(parsed);
  const existing = await db.product.findMany({
    where: { sourceUrl: { not: null } },
    select: { id: true, slug: true, sourceUrl: true },
  });
  const dupe = existing.find((row) => {
    const p = row.sourceUrl ? parseSourceUrl(row.sourceUrl) : null;
    return p && sourceKey(p) === key;
  });
  if (dupe) {
    return json(
      {
        ok: false,
        error: "Already in your catalog.",
        editUrl: `${SITE.url}/admin/products/${dupe.id}/edit`,
      },
      409,
    );
  }

  const images = (Array.isArray(body.images) ? body.images.map(String) : [])
    .filter((u) => /^https?:\/\/\S+$/i.test(u))
    .slice(0, 10);
  const title =
    String(body.title ?? "").split("|")[0].trim() ||
    `${getMarketplace(parsed.platform).name} ${parsed.itemId}`;
  const slug = await generateUniqueSlug(title);

  const draft = await db.product.create({
    data: {
      slug,
      title,
      description: "",
      images,
      tags: [],
      marketplace: parsed.platform,
      sourceUrl: parsed.canonicalUrl ?? sourceUrl,
      published: false,
    },
    select: { id: true, title: true },
  });

  return json(
    {
      ok: true,
      id: draft.id,
      title: draft.title,
      editUrl: `${SITE.url}/admin/products/${draft.id}/edit`,
    },
    200,
  );
}
