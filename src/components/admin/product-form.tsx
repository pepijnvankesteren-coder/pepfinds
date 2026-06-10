"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { ImageIcon, Plus, X } from "lucide-react";

import type { ProductFormState } from "@/lib/actions/product-actions";
import { AGENT_LIST } from "@/lib/agents";
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

  const errors = state.errors ?? {};

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
        title="Agent links"
        hint="Paste the listing URL for each agent that carries this product. Empty fields are simply left off the page."
      >
        <div className="space-y-4">
          {AGENT_LIST.map((agent) => (
            <div key={agent.id}>
              <Label htmlFor={`agent-${agent.id}`} hint={agent.domain}>
                {agent.name}
              </Label>
              <Input
                id={`agent-${agent.id}`}
                name={`agent-${agent.id}`}
                type="url"
                defaultValue={initialAgentUrl(agent.id)}
                placeholder={`https://www.${agent.domain}/…`}
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
