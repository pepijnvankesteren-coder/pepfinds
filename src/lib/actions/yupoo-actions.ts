"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateUniqueSlug } from "@/lib/slug";
import { parseSourceUrl, sourceKey } from "@/lib/source-link";
import {
  fetchYupooAlbum,
  listYupooAlbums,
  parseYupooInput,
  type YupooAlbumSummary,
} from "@/lib/yupoo";

/** Most albums imported in one batch, to stay within the function time budget. */
const MAX_IMPORT = 24;

export interface YupooLoadState {
  /** Seller host, carried into the import step. */
  host?: string;
  albums?: YupooAlbumSummary[];
  message?: string;
}

export interface YupooImportState {
  ok?: boolean;
  created?: { id: string; title: string }[];
  /** Albums skipped because no marketplace link was found. */
  noSource?: string[];
  /** Albums whose source listing is already in the catalog. */
  duplicates?: number;
  /** Albums that failed to fetch/parse. */
  failed?: string[];
  message?: string;
}

/** Step 1: load a seller's albums (or a single album) for selection. */
export async function loadYupooAlbums(
  _prev: YupooLoadState,
  formData: FormData,
): Promise<YupooLoadState> {
  await requireAdmin();

  const target = parseYupooInput(String(formData.get("yupooUrl") ?? ""));
  if (!target) {
    return { message: "Enter a Yupoo album or seller URL (…x.yupoo.com)." };
  }

  try {
    if (target.albumId) {
      const album = await fetchYupooAlbum(target.host, target.albumId);
      return {
        host: target.host,
        albums: [
          {
            id: album.id,
            title: album.title,
            albumUrl: album.albumUrl,
            cover: album.images[0] ?? null,
            photoCount: album.images.length,
          },
        ],
      };
    }
    const albums = await listYupooAlbums(target.host);
    if (albums.length === 0) {
      return { message: "No albums found on that page." };
    }
    return { host: target.host, albums };
  } catch {
    return { message: "Couldn't reach Yupoo. Check the URL and try again." };
  }
}

/** Run a mapper over items with a small concurrency cap. */
async function mapPool<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += limit) {
    const chunk = items.slice(i, i + limit);
    results.push(...(await Promise.all(chunk.map(fn))));
  }
  return results;
}

/** Step 2: import the selected albums as draft products. */
export async function importYupooAlbums(
  _prev: YupooImportState,
  formData: FormData,
): Promise<YupooImportState> {
  await requireAdmin();

  const host = String(formData.get("host") ?? "");
  const albumIds = formData
    .getAll("albumId")
    .map((v) => String(v))
    .filter(Boolean);

  if (!host || albumIds.length === 0) {
    return { message: "Select at least one album to import." };
  }
  if (albumIds.length > MAX_IMPORT) {
    return { message: `Up to ${MAX_IMPORT} albums per import.` };
  }

  // Fetch and parse album pages (network-bound) with limited concurrency.
  const fetched = await mapPool(albumIds, 6, async (id) => {
    try {
      return { id, album: await fetchYupooAlbum(host, id) };
    } catch {
      return { id, album: null };
    }
  });

  // Source keys already in the catalog, so re-importing an item is a no-op.
  const existing = await db.product.findMany({
    where: { sourceUrl: { not: null } },
    select: { sourceUrl: true },
  });
  const seen = new Set<string>();
  for (const row of existing) {
    const parsed = row.sourceUrl ? parseSourceUrl(row.sourceUrl) : null;
    if (parsed) seen.add(sourceKey(parsed));
  }

  const created: { id: string; title: string }[] = [];
  const noSource: string[] = [];
  const failed: string[] = [];
  let duplicates = 0;

  // Insert sequentially so slug generation sees prior inserts.
  for (const { id, album } of fetched) {
    if (!album) {
      failed.push(id);
      continue;
    }
    const parsed = album.sourceUrl ? parseSourceUrl(album.sourceUrl) : null;
    if (!parsed || parsed.platform === "OTHER" || !parsed.itemId) {
      noSource.push(album.title);
      continue;
    }
    const key = sourceKey(parsed);
    if (seen.has(key)) {
      duplicates++;
      continue;
    }
    seen.add(key);

    const slug = await generateUniqueSlug(album.title);
    const draft = await db.product.create({
      data: {
        slug,
        title: album.title,
        description: "",
        images: album.images,
        category: null,
        tags: [],
        marketplace: parsed.platform,
        sourceUrl: parsed.canonicalUrl ?? album.sourceUrl,
        featured: false,
        published: false,
      },
      select: { id: true, title: true },
    });
    created.push(draft);
  }

  if (created.length > 0) {
    revalidatePath("/admin");
  }

  return { ok: true, created, noSource, duplicates, failed };
}
