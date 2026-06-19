"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
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
