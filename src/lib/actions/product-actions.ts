"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { getMarketplace } from "@/lib/marketplaces";
import { parseSourceUrl, type ParsedSource } from "@/lib/source-link";
import { generateUniqueSlug } from "@/lib/slug";
import {
  fieldErrorsFrom,
  productInputFromForm,
  productInputSchema,
  type ProductInput,
} from "@/lib/validation";

export interface ProductFormState {
  /** One message per field, keyed by field name. */
  errors?: Record<string, string>;
  /** Form-level error (e.g. product no longer exists). */
  message?: string;
}

/** Refresh every public surface that renders catalog data. */
function revalidateCatalog(slug?: string) {
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/product/${slug}`);
}

function scalarFields(data: ProductInput) {
  return {
    title: data.title,
    description: data.description,
    images: data.images,
    category: data.category ?? null,
    tags: data.tags,
    marketplace: data.marketplace,
    sourceUrl: data.sourceUrl ?? null,
    featured: data.featured,
    published: data.published,
  };
}

export async function createProduct(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();

  const parsed = productInputSchema.safeParse(productInputFromForm(formData));
  if (!parsed.success) {
    return { errors: fieldErrorsFrom(parsed.error) };
  }

  const slug = await generateUniqueSlug(parsed.data.title);
  await db.product.create({
    data: {
      slug,
      ...scalarFields(parsed.data),
      agentLinks: { create: parsed.data.agentLinks },
    },
  });

  revalidateCatalog(slug);
  redirect("/admin");
}

export async function updateProduct(
  id: string,
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();

  const parsed = productInputSchema.safeParse(productInputFromForm(formData));
  if (!parsed.success) {
    return { errors: fieldErrorsFrom(parsed.error) };
  }

  const existing = await db.product.findUnique({
    where: { id },
    select: { slug: true },
  });
  if (!existing) {
    return { message: "This product no longer exists." };
  }

  await db.product.update({
    where: { id },
    data: {
      ...scalarFields(parsed.data),
      // Replace the link set wholesale — simplest correct sync.
      agentLinks: { deleteMany: {}, create: parsed.data.agentLinks },
    },
  });

  revalidateCatalog(existing.slug);
  redirect("/admin");
}

/**
 * A product imported in bulk that was actually created, returned so the form
 * can link straight to each new draft's edit page.
 */
interface ImportedDraft {
  id: string;
  title: string;
}

export interface BulkImportState {
  /** Set once the action has run, so the UI can switch to the result view. */
  ok?: boolean;
  /** Drafts created this run, in paste order. */
  created?: ImportedDraft[];
  /** Lines skipped because that source link is already in the catalog. */
  duplicates?: number;
  /** Lines that weren't a usable http(s) link, echoed back for fixing. */
  invalid?: string[];
  /** Form-level error (e.g. nothing pasted). */
  message?: string;
}

/**
 * Stable identity for a source listing, so the same item pasted twice — or
 * already in the catalog — is only imported once. Falls back to the raw URL
 * for unrecognized marketplaces where no item id can be extracted.
 */
function sourceKey(source: ParsedSource): string {
  return source.platform !== "OTHER" && source.itemId
    ? `${source.platform}:${source.itemId}`
    : source.rawUrl.trim().toLowerCase();
}

/** Placeholder title for a freshly imported draft, e.g. "Weidian 7263846". */
function draftTitleFor(source: ParsedSource): string {
  const name = getMarketplace(source.platform).name;
  return source.itemId ? `${name} ${source.itemId}` : `${name} listing`;
}

/**
 * Create one draft product per pasted source link. Each draft only carries the
 * source URL — buy buttons generate from it automatically (see lib/products.ts)
 * — so the admin can dump a batch of listings and fill in titles/images later.
 */
export async function bulkImportProducts(
  _prev: BulkImportState,
  formData: FormData,
): Promise<BulkImportState> {
  await requireAdmin();

  const lines = String(formData.get("urls") ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return { message: "Paste at least one source link." };
  }
  if (lines.length > 200) {
    return { message: "Up to 200 links at a time — split larger batches." };
  }

  // Source keys already in the catalog, so re-pasting an existing item is a
  // no-op rather than a duplicate product.
  const existing = await db.product.findMany({
    where: { sourceUrl: { not: null } },
    select: { sourceUrl: true },
  });
  const seen = new Set<string>();
  for (const row of existing) {
    const parsed = row.sourceUrl ? parseSourceUrl(row.sourceUrl) : null;
    if (parsed) seen.add(sourceKey(parsed));
  }

  const created: ImportedDraft[] = [];
  const invalid: string[] = [];
  let duplicates = 0;

  for (const line of lines) {
    let protocol = "";
    try {
      protocol = new URL(line).protocol;
    } catch {
      // Not a URL at all.
    }
    const source =
      protocol === "http:" || protocol === "https:" ? parseSourceUrl(line) : null;
    if (!source) {
      invalid.push(line);
      continue;
    }

    const key = sourceKey(source);
    if (seen.has(key)) {
      duplicates++;
      continue;
    }
    seen.add(key);

    const title = draftTitleFor(source);
    const slug = await generateUniqueSlug(title);
    const draft = await db.product.create({
      data: {
        slug,
        title,
        description: "",
        images: [],
        category: null,
        tags: [],
        marketplace: source.platform,
        // Store the normalized canonical URL when we have one.
        sourceUrl: source.canonicalUrl ?? source.rawUrl,
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

  return { ok: true, created, duplicates, invalid };
}

export async function deleteProduct(id: string): Promise<void> {
  await requireAdmin();

  const deleted = await db.product
    .delete({ where: { id }, select: { slug: true } })
    .catch(() => null); // Already gone — treat as success.

  if (deleted) {
    revalidateCatalog(deleted.slug);
  }
  revalidatePath("/admin");
}
