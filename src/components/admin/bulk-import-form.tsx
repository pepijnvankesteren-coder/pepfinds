"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Copy } from "lucide-react";

import type { BulkImportState } from "@/lib/actions/product-actions";
import { bulkImportProducts } from "@/lib/actions/product-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const PLACEHOLDER = `https://weidian.com/item.html?itemID=7263846
https://item.taobao.com/item.htm?id=812345678901
https://detail.1688.com/offer/655443322110.html`;

/**
 * Bulk importer: paste one source link per line and create a draft product for
 * each. Buy buttons generate from the source link automatically, so the only
 * follow-up is adding a title, images, and a description per draft.
 */
export function BulkImportForm() {
  const [state, formAction, pending] = useActionState<BulkImportState, FormData>(
    bulkImportProducts,
    {},
  );

  const created = state.created ?? [];
  const invalid = state.invalid ?? [];

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-5">
        {state.message && (
          <p className="rounded-2xl border border-[#b42318]/20 bg-[#b42318]/5 px-5 py-4 text-sm text-[#b42318]">
            {state.message}
          </p>
        )}

        <section className="rounded-3xl border border-line bg-canvas p-6 shadow-soft sm:p-8">
          <Label htmlFor="bulk-urls" hint="One Weidian / Taobao / 1688 link per line. Up to 200 at a time.">
            Source links
          </Label>
          <Textarea
            id="bulk-urls"
            name="urls"
            rows={12}
            placeholder={PLACEHOLDER}
            required
            className="mt-3 font-mono text-sm"
          />
          <p className="mt-3 text-xs leading-relaxed text-muted">
            Each link becomes a <strong className="font-medium text-ink">draft</strong>{" "}
            with all buy buttons ready. Links already in your catalog are skipped.
            Add a title, images, and description before publishing.
          </p>
        </section>

        <div className="flex items-center justify-end gap-3">
          <Button asChild variant="ghost" size="md">
            <Link href="/admin">Cancel</Link>
          </Button>
          <Button type="submit" size="md" disabled={pending}>
            {pending ? "Importing…" : "Import drafts"}
          </Button>
        </div>
      </form>

      {state.ok && (
        <ImportSummary
          created={created}
          duplicates={state.duplicates ?? 0}
          invalid={invalid}
        />
      )}
    </div>
  );
}

function ImportSummary({
  created,
  duplicates,
  invalid,
}: {
  created: { id: string; title: string }[];
  duplicates: number;
  invalid: string[];
}) {
  return (
    <section className="rounded-3xl border border-line bg-canvas p-6 shadow-soft sm:p-8">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="size-5 text-ink" />
        <h2 className="text-base font-semibold text-ink">
          {created.length} draft{created.length === 1 ? "" : "s"} created
          {duplicates > 0 && ` · ${duplicates} duplicate${duplicates === 1 ? "" : "s"} skipped`}
        </h2>
      </div>

      {created.length > 0 && (
        <ul className="mt-5 divide-y divide-line-soft overflow-hidden rounded-2xl border border-line">
          {created.map((draft) => (
            <li
              key={draft.id}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <span className="truncate text-sm text-ink">{draft.title}</span>
              <Link
                href={`/admin/products/${draft.id}/edit`}
                className="shrink-0 text-sm font-medium text-ink underline-offset-4 hover:underline"
              >
                Add details
              </Link>
            </li>
          ))}
        </ul>
      )}

      {invalid.length > 0 && (
        <div className="mt-6 rounded-2xl border border-[#b42318]/20 bg-[#b42318]/5 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-[#b42318]">
            <AlertTriangle className="size-4" />
            {invalid.length} line{invalid.length === 1 ? "" : "s"} skipped — not a valid link
          </div>
          <ul className="mt-2 space-y-1">
            {invalid.map((line, index) => (
              <li
                key={index}
                className="truncate font-mono text-xs text-[#b42318]/80"
              >
                {line}
              </li>
            ))}
          </ul>
        </div>
      )}

      {created.length === 0 && invalid.length === 0 && duplicates > 0 && (
        <p className="mt-3 flex items-center gap-2 text-sm text-muted">
          <Copy className="size-4" />
          Every link was already in your catalog — nothing to add.
        </p>
      )}
    </section>
  );
}