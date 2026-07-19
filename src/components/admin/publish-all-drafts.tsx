"use client";

import { useActionState } from "react";
import { Rocket } from "lucide-react";

import {
  publishAllDrafts,
  type PublishAllState,
} from "@/lib/actions/product-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Dashboard bar to publish every ready draft at once, with one optional shared
 * description applied to drafts that don't have their own — ideal right after
 * importing a Yupoo album/category.
 */
export function PublishAllDrafts({ draftCount }: { draftCount: number }) {
  const [state, formAction, pending] = useActionState<PublishAllState, FormData>(
    publishAllDrafts,
    {},
  );

  return (
    <div className="mt-6 rounded-3xl border border-line bg-canvas p-5 shadow-soft sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-ink">
            {draftCount} draft{draftCount === 1 ? "" : "s"} waiting
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            Add one description for all of them (optional), then publish in one
            click.
          </p>
        </div>
      </div>

      <form
        action={formAction}
        onSubmit={(e) => {
          if (
            !window.confirm(
              `Publish all ${draftCount} draft${draftCount === 1 ? "" : "s"}? They'll appear in the public catalog.`,
            )
          ) {
            e.preventDefault();
          }
        }}
        className="mt-4 flex flex-col gap-3 sm:flex-row"
      >
        <Input
          name="description"
          placeholder='Description for all drafts — e.g. "Inspired by Supreme" (optional)'
          maxLength={8000}
          className="flex-1"
        />
        <Button type="submit" disabled={pending} className="shrink-0">
          <Rocket />
          {pending ? "Publishing…" : "Publish all drafts"}
        </Button>
      </form>

      {state.published != null && (
        <p className="mt-3 text-sm text-ink">
          Published {state.published} product{state.published === 1 ? "" : "s"}
          {state.skipped
            ? ` · skipped ${state.skipped} (each needs an image and a source/agent link)`
            : ""}
          .
        </p>
      )}
      {state.message && (
        <p className="mt-3 text-sm text-[#b42318]">{state.message}</p>
      )}
    </div>
  );
}
