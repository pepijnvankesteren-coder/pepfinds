"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { Check, ImageIcon, Plus, Sparkles, X } from "lucide-react";

import type { ProductFormState } from "@/lib/actions/product-actions";
import { categorize } from "@/lib/categorize";
import { DIRECT_AGENT_LIST, SOURCE_FLOW_AGENT_LIST } from "@/lib/agents";
import { buildAgentUrl } from "@/lib/agent-links";
import { parseSourceUrl, type ParsedSource } from "@/lib/source-link";
import { MARKETPLACE_IDS } from "@/lib/types";
import { MARKETPLACES } from "@/lib/marketplaces";
import type { ProductView } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label, FieldError } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ProductFormProps {
  /** createProduct, or updateProduct with the id already bound. */
  action: (
    prev: ProductFormState,
    formData: FormData,
  ) => Promise<ProductFormState>;
  /** Existing product when editing; omit when creating. */
  initial?: ProductView;
  submitLabel: string;
}

/** Card wrapper for one section of the form. */
function FormSection({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-line bg-canvas p-6 shadow-soft sm:p-8">
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

/**
 * Create/edit form for a product. All validation happens server-side in the
 * product actions; field errors come back through useActionState.
 */
export function ProductForm({ action, initial, submitLabel }: ProductFormProps) {
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(
    action,
    {},
  );

  // Image URL rows are the only stateful part of the form. Always keep at
  // least one row visible so there's an obvious place to paste a URL.
  const [images, setImages] = React.useState<string[]>(() =>
    initial?.images.length ? initial.images : [""],
  );

  const updateImage = (index: number, value: string) =>
    setImages((rows) => rows.map((row, i) => (i === index ? value : row)));
  const addImage = () => setImages((rows) => [...rows, ""]);
  const removeImage = (index: number) =>
    setImages((rows) =>
      rows.length > 1 ? rows.filter((_, i) => i !== index) : [""],
    );

  const initialAgentUrl = (agentId: string) =>
    initial?.agentLinks.find((link) => link.agent === agentId)?.url ?? "";

  // The source link drives every direct agent's buy button, so the form
  // previews what it generates live as you paste it.
  const [sourceUrl, setSourceUrl] = React.useState(initial?.sourceUrl ?? "");
  const trimmedSource = sourceUrl.trim();
  const parsedSource = trimmedSource ? parseSourceUrl(trimmedSource) : null;

  const errors = state.errors ?? {};

  // Fill the category + tags fields from the current title (keyword-based, no
  // network). Non-destructive: only overwrites when something is detected.
  const detectFromTitle = () => {
    const byId = <T extends HTMLInputElement | HTMLTextAreaElement>(id: string) =>
      document.getElementById(id) as T | null;
    const title = byId<HTMLInputElement>("product-title")?.value ?? "";
    const description = byId<HTMLTextAreaElement>("product-description")?.value ?? "";
    const { category, tags } = categorize(title, description);
    const categoryEl = byId<HTMLInputElement>("product-category");
    const tagsEl = byId<HTMLInputElement>("product-tags");
    if (categoryEl && category) categoryEl.value = category;
    if (tagsEl && tags.length) tagsEl.value = tags.join(", ");
  };

  return (
    <form action={formAction} className="space-y-6">
      {state.message && (
        <p className="rounded-2xl border border-[#b42318]/20 bg-[#b42318]/5 px-5 py-4 text-sm text-[#b42318]">
          {state.message}
        </p>
      )}

      <FormSection title="Details">
        <div>
          <Label htmlFor="product-title">Title</Label>
          <Input
            id="product-title"
            name="title"
            defaultValue={initial?.title}
            placeholder="e.g. Nike Tech Fleece Hoodie — Grey"
            maxLength={160}
            required
            className="mt-2"
          />
          <FieldError message={errors.title} />
        </div>

        <div>
          <Label htmlFor="product-description">Description</Label>
          <Textarea
            id="product-description"
            name="description"
            defaultValue={initial?.description}
            placeholder="What makes this find worth sharing? Fit, quality, sizing notes…"
            rows={6}
            required
            className="mt-2"
          />
          <FieldError message={errors.description} />
        </div>
      </FormSection>

      <FormSection
        title="Images"
        hint="Paste direct image URLs. The first image is the cover."
      >
        <div className="space-y-3">
          {images.map((url, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-surface-soft">
                {url.trim() ? (
                  // Plain <img> on purpose: admin previews arbitrary URLs and
                  // must degrade gracefully when one is broken.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={url.trim()}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <ImageIcon className="size-4 text-muted-soft" />
                )}
              </div>
              <Input
                name="images"
                value={url}
                onChange={(e) => updateImage(index, e.target.value)}
                placeholder="https://…"
                aria-label={`Image URL ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                aria-label={`Remove image ${index + 1}`}
                className="grid size-9 shrink-0 place-items-center rounded-full text-muted transition-colors duration-300 hover:bg-surface-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/70 focus-visible:ring-offset-2"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addImage}>
          <Plus />
          Add image
        </Button>
        <FieldError message={errors.images} />
      </FormSection>

      <FormSection title="Organization">
        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={detectFromTitle}
          >
            <Sparkles />
            Detect from title
          </Button>
          <p className="mt-1.5 text-xs text-muted-soft">
            Fills category and tags from the product title.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="product-category">Category</Label>
            <Input
              id="product-category"
              name="category"
              defaultValue={initial?.category ?? ""}
              placeholder="e.g. Apparel"
              maxLength={60}
              className="mt-2"
            />
            <FieldError message={errors.category} />
          </div>

          <div>
            <Label htmlFor="product-marketplace">Source marketplace</Label>
            <Select
              id="product-marketplace"
              name="marketplace"
              defaultValue={initial?.marketplace ?? "WEIDIAN"}
              className="mt-2"
            >
              {MARKETPLACE_IDS.map((id) => (
                <option key={id} value={id}>
                  {MARKETPLACES[id].name}
                </option>
              ))}
            </Select>
            <FieldError message={errors.marketplace} />
          </div>
        </div>

        <div>
          <Label htmlFor="product-tags" hint="Comma-separated, e.g. hoodie, nike, streetwear">
            Tags
          </Label>
          <Input
            id="product-tags"
            name="tags"
            defaultValue={initial?.tags.join(", ")}
            placeholder="hoodie, nike, streetwear"
            className="mt-2"
          />
          <FieldError message={errors.tags} />
        </div>
      </FormSection>

      <FormSection
        title="Source link"
        hint="Paste the original Weidian / Taobao / 1688 listing URL once. Every agent's buy button is generated from it automatically — you don't paste a link per agent."
      >
        <div>
          <Label htmlFor="product-source-url" hint="Weidian / Taobao / 1688 / etc.">
            Original product URL
          </Label>
          <Input
            id="product-source-url"
            name="sourceUrl"
            type="url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder="https://weidian.com/item.html?itemID=…"
            className="mt-2"
          />
          <FieldError message={errors.sourceUrl} />
        </div>

        <GeneratedLinksPreview source={parsedSource} hasInput={Boolean(trimmedSource)} />
      </FormSection>

      <FormSection
        title="Manual agent links (optional)"
        hint="Optional override. Paste a specific listing URL to replace the auto-generated link for that agent — leave empty to use the link generated from the source above."
      >
        <div className="space-y-4">
          {DIRECT_AGENT_LIST.map((agent) => (
            <div key={agent.id}>
              <Label htmlFor={`agent-${agent.id}`} hint={agent.domain}>
                {agent.name}
              </Label>
              <Input
                id={`agent-${agent.id}`}
                name={`agent-${agent.id}`}
                type="url"
                defaultValue={initialAgentUrl(agent.id)}
                placeholder={
                  parsedSource
                    ? "Auto-generated from source link"
                    : `https://www.${agent.domain}/…`
                }
                className="mt-2"
              />
            </div>
          ))}
        </div>
        <FieldError message={errors.agentLinks} />
      </FormSection>

      <FormSection title="Visibility">
        <Switch
          name="published"
          label="Published"
          description="Visible in the public catalog. Drafts stay admin-only."
          defaultChecked={initial?.published ?? false}
        />
        <Switch
          name="featured"
          label="Featured"
          description="Pinned to the Featured section on the homepage."
          defaultChecked={initial?.featured ?? false}
        />
      </FormSection>

      <div className="flex items-center justify-end gap-3">
        <Button asChild variant="ghost" size="md">
          <Link href="/admin">Cancel</Link>
        </Button>
        <Button type="submit" size="md" disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}

/**
 * Live preview of the buy buttons the source link will produce. Generation is
 * the exact logic the public page runs (lib/agent-links.ts), so the admin sees
 * what shoppers will get the moment they paste a link — instead of saving and
 * checking the live page.
 */
function GeneratedLinksPreview({
  source,
  hasInput,
}: {
  source: ParsedSource | null;
  hasInput: boolean;
}) {
  if (!hasInput) {
    return (
      <p className="rounded-2xl border border-line bg-surface-soft px-4 py-3 text-xs text-muted">
        Paste a source link above to preview the buy buttons it will generate.
      </p>
    );
  }

  const generated = DIRECT_AGENT_LIST.map((agent) => ({
    agent,
    url: source ? buildAgentUrl(agent.id, source) : null,
  }));
  const generatedCount = generated.filter((row) => row.url).length;
  const sourceFlowNames = SOURCE_FLOW_AGENT_LIST.map((a) => a.name).join(" & ");

  return (
    <div className="rounded-2xl border border-line bg-surface-soft p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-soft">
        Generated buy buttons ({generatedCount})
      </p>

      {generatedCount === 0 ? (
        <p className="mt-2 text-xs text-[#b42318]">
          Couldn&apos;t read an item from this link. Use a direct Weidian /
          Taobao / 1688 listing URL (the one with the item id).
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {generated.map(({ agent, url }) =>
            url ? (
              <li key={agent.id} className="flex items-start gap-2 text-xs">
                <Check className="mt-px size-3.5 shrink-0 text-ink" />
                <span className="shrink-0 font-medium text-ink">{agent.name}</span>
                <span className="min-w-0 flex-1 truncate text-muted">{url}</span>
              </li>
            ) : null,
          )}
        </ul>
      )}

      {sourceFlowNames && (
        <p className="mt-3 border-t border-line pt-3 text-xs text-muted">
          {sourceFlowNames} show a copy-paste popup using this link.
        </p>
      )}
    </div>
  );
}
