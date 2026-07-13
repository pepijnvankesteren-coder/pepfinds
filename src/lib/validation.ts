import { z } from "zod";

import { AGENT_IDS, MARKETPLACE_IDS } from "@/lib/types";
import { DIRECT_AGENT_LIST } from "@/lib/agents";

/**
 * Zod schemas + FormData parsing for the admin product form. Validation runs
 * on the server inside the product actions; the form re-renders field errors
 * from the flattened error map returned here.
 */

const urlField = z
  .string()
  .trim()
  .max(2000, "URL is too long")
  .regex(/^https?:\/\/\S+$/i, "Must be a full http(s):// URL");

// Images may also be a same-origin path (e.g. /api/img?u=… for proxied Yupoo
// photos), so allow a leading-slash relative URL in addition to full URLs.
const imageUrlField = z
  .string()
  .trim()
  .max(2000, "URL is too long")
  .regex(/^(https?:\/\/|\/)\S+$/i, "Must be a full URL or a /path");

export const productInputSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, "Title must be at least 2 characters")
      .max(160, "Title must be 160 characters or fewer"),
    description: z
      .string()
      .trim()
      .max(8000, "Description must be 8000 characters or fewer"),
    images: z.array(imageUrlField).max(10, "Up to 10 images per product"),
    category: z
      .string()
      .trim()
      .max(60, "Category must be 60 characters or fewer")
      .optional(),
    tags: z
      .array(z.string().trim().min(1).max(40, "Tags must be 40 characters or fewer"))
      .max(15, "Up to 15 tags per product"),
    marketplace: z.enum(MARKETPLACE_IDS),
    // Original marketplace listing URL; powers the BaseTao/ACBuy popups.
    sourceUrl: urlField.optional(),
    agentLinks: z
      .array(z.object({ agent: z.enum(AGENT_IDS), url: urlField }))
      .max(AGENT_IDS.length),
    featured: z.boolean(),
    published: z.boolean(),
  })
  .superRefine((data, ctx) => {
    // Drafts may be incomplete, but a published product must be presentable.
    if (data.published && data.images.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["images"],
        message: "Add at least one image before publishing",
      });
    }
    // A published product needs at least one way to buy: either a direct agent
    // link, or a source link (which surfaces the BaseTao/ACBuy buy buttons).
    if (data.published && data.agentLinks.length === 0 && !data.sourceUrl) {
      ctx.addIssue({
        code: "custom",
        path: ["agentLinks"],
        message: "Add at least one agent link or a source link before publishing",
      });
    }
  });

export type ProductInput = z.infer<typeof productInputSchema>;

/**
 * Collect the raw product fields from the admin form's FormData.
 * Returns an unvalidated shape — feed it to productInputSchema.safeParse.
 */
export function productInputFromForm(formData: FormData): unknown {
  const text = (name: string) => String(formData.get(name) ?? "");

  const images = formData
    .getAll("images")
    .map((value) => String(value).trim())
    .filter(Boolean);

  // Tags arrive as one comma-separated input; normalize to lowercase so
  // tag search can match case-insensitively against the stored values.
  const tags = Array.from(
    new Set(
      text("tags")
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean),
    ),
  );

  // Source-flow agents (BaseTao, ACBuy) have no per-product input — they're
  // driven by the single source link below — so only collect direct agents.
  const agentLinks = DIRECT_AGENT_LIST.flatMap(({ id: agent }) => {
    const url = text(`agent-${agent}`).trim();
    return url ? [{ agent, url }] : [];
  });

  const category = text("category").trim();
  const sourceUrl = text("sourceUrl").trim();

  return {
    title: text("title"),
    description: text("description"),
    images,
    category: category || undefined,
    tags,
    marketplace: text("marketplace") || "OTHER",
    sourceUrl: sourceUrl || undefined,
    agentLinks,
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
  };
}

/** Map a ZodError to one message per top-level field, for inline display. */
export function fieldErrorsFrom(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "form");
    if (!(field in fieldErrors)) {
      fieldErrors[field] = issue.message;
    }
  }
  return fieldErrors;
}
