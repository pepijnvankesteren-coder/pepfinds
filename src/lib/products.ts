import type { Prisma } from "@prisma/client";

import { db } from "@/lib/db";
import {
  AGENT_IDS,
  type AgentId,
  type MarketplaceId,
  type ProductView,
} from "@/lib/types";

/**
 * Server-only data access layer for products. Every function returns plain,
 * serializable ProductView objects so pages can hand results straight to
 * client components.
 */

const productInclude = { agentLinks: true } satisfies Prisma.ProductInclude;

type ProductWithLinks = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;

/** Map a database row (with links) into the UI view shape. */
export function toProductView(product: ProductWithLinks): ProductView {
  const agentOrder = new Map(AGENT_IDS.map((id, index) => [id, index]));
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    description: product.description,
    images: product.images,
    category: product.category,
    tags: product.tags,
    marketplace: product.marketplace as MarketplaceId,
    featured: product.featured,
    published: product.published,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    agentLinks: [...product.agentLinks]
      .sort(
        (a, b) =>
          (agentOrder.get(a.agent as AgentId) ?? 99) -
          (agentOrder.get(b.agent as AgentId) ?? 99),
      )
      .map((link) => ({ agent: link.agent as AgentId, url: link.url })),
  };
}

/** Published products flagged as featured, newest first. */
export async function getFeaturedProducts(limit = 8): Promise<ProductView[]> {
  const rows = await db.product.findMany({
    where: { published: true, featured: true },
    include: productInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(toProductView);
}

/** Most recently added published products. */
export async function getRecentProducts(limit = 8): Promise<ProductView[]> {
  const rows = await db.product.findMany({
    where: { published: true },
    include: productInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(toProductView);
}

/** A single published product for the public detail page. */
export async function getPublishedProductBySlug(
  slug: string,
): Promise<ProductView | null> {
  const row = await db.product.findFirst({
    where: { slug, published: true },
    include: productInclude,
  });
  return row ? toProductView(row) : null;
}

/**
 * Search published products across title, description, category, and tags.
 * Every whitespace-separated token must match at least one field, so longer
 * queries narrow the results. An empty query browses the whole catalog.
 */
export async function searchPublishedProducts(
  query: string,
  limit = 60,
): Promise<{ results: ProductView[]; total: number }> {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  const where: Prisma.ProductWhereInput = {
    published: true,
    AND: tokens.map((token) => ({
      OR: [
        { title: { contains: token, mode: "insensitive" as const } },
        { description: { contains: token, mode: "insensitive" as const } },
        { category: { contains: token, mode: "insensitive" as const } },
        // Tags are stored lowercase, so an exact lowercase match works.
        { tags: { has: token } },
      ],
    })),
  };

  const [rows, total] = await Promise.all([
    db.product.findMany({
      where,
      include: productInclude,
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
    db.product.count({ where }),
  ]);

  return { results: rows.map(toProductView), total };
}

/** Every product — drafts included — for the admin dashboard. */
export async function getAllProductsForAdmin(): Promise<ProductView[]> {
  const rows = await db.product.findMany({
    include: productInclude,
    orderBy: { updatedAt: "desc" },
  });
  return rows.map(toProductView);
}

/** A single product by id — drafts included — for the admin edit form. */
export async function getProductForAdmin(
  id: string,
): Promise<ProductView | null> {
  const row = await db.product.findUnique({
    where: { id },
    include: productInclude,
  });
  return row ? toProductView(row) : null;
}
