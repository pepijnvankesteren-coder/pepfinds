import { db } from "@/lib/db";

const COMBINING_MARKS = /[̀-ͯ]/g;

/** Convert a product title into a URL-safe slug. */
export function slugify(input: string): string {
  const slug = input
    .toLowerCase()
    .normalize("NFKD")
    // Strip diacritics left over from normalization.
    .replace(COMBINING_MARKS, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");
  return slug || "product";
}

/**
 * Generate a slug that is unique across all products, appending -2, -3, …
 * when the base slug is already taken.
 */
export async function generateUniqueSlug(title: string): Promise<string> {
  const base = slugify(title);
  const existing = await db.product.findMany({
    where: { slug: { startsWith: base } },
    select: { slug: true },
  });
  const taken = new Set(existing.map((row) => row.slug));

  if (!taken.has(base)) return base;
  for (let suffix = 2; suffix < 100; suffix++) {
    const candidate = `${base}-${suffix}`;
    if (!taken.has(candidate)) return candidate;
  }
  // Practically unreachable, but guarantees termination.
  return `${base}-${Date.now().toString(36)}`;
}
