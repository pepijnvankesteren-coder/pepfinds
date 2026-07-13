"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { AlertTriangle, Check, CheckCircle2, ImageIcon } from "lucide-react";

import {
  importYupooAlbums,
  loadYupooAlbums,
  type YupooImportState,
  type YupooLoadState,
} from "@/lib/actions/yupoo-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Mirror of MAX_IMPORT in yupoo-actions, for the client-side guard. */
const MAX_IMPORT = 24;

/**
 * Yupoo importer. Step 1: paste a seller (or single album) URL to load its
 * albums. Step 2: tick the albums to import — each becomes a draft product with
 * the marketplace link's affiliate buy buttons and the album's photos.
 */
export function YupooImportForm() {
  const [loadState, loadAction, loading] = useActionState<YupooLoadState, FormData>(
    loadYupooAlbums,
    {},
  );
  const [importState, importAction, importing] = useActionState<
    YupooImportState,
    FormData
  >(importYupooAlbums, {});

  const albums = loadState.albums ?? [];
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  // Reset the selection whenever a new album set is loaded.
  React.useEffect(() => {
    setSelected(new Set());
  }, [loadState]);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const tooMany = selected.size > MAX_IMPORT;

  return (
    <div className="space-y-6">
      {/* Step 1 — load albums */}
      <form action={loadAction}>
        <section className="rounded-3xl border border-line bg-canvas p-6 shadow-soft sm:p-8">
          <Label
            htmlFor="yupoo-url"
            hint="A category, the seller's albums, or a single album — only items on that page are imported."
          >
            Yupoo URL
          </Label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <Input
              id="yupoo-url"
              name="yupooUrl"
              type="url"
              required
              placeholder="https://3madman.x.yupoo.com/albums"
              className="flex-1"
            />
            <Button type="submit" size="md" disabled={loading}>
              {loading ? "Loading…" : "Load albums"}
            </Button>
          </div>
          {loadState.message && (
            <p className="mt-3 text-sm text-[#b42318]">{loadState.message}</p>
          )}
        </section>
      </form>

      {/* Step 2 — pick + import */}
      {albums.length > 0 && (
        <form action={importAction}>
          <input type="hidden" name="host" value={loadState.host ?? ""} />
          {[...selected].map((id) => (
            <input key={id} type="hidden" name="albumId" value={id} />
          ))}

          <section className="rounded-3xl border border-line bg-canvas p-6 shadow-soft sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-ink">
                  {albums.length} album{albums.length === 1 ? "" : "s"} found
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Pick the products to import. Albums without a marketplace link
                  are skipped automatically.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSelected(new Set(albums.slice(0, MAX_IMPORT).map((a) => a.id)))
                  }
                >
                  Select {Math.min(albums.length, MAX_IMPORT)}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelected(new Set())}
                >
                  Clear
                </Button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {albums.map((album) => {
                const isOn = selected.has(album.id);
                return (
                  <button
                    key={album.id}
                    type="button"
                    onClick={() => toggle(album.id)}
                    aria-pressed={isOn}
                    className={`group relative overflow-hidden rounded-2xl border bg-surface-soft text-left transition-all duration-300 ${
                      isOn
                        ? "border-ink ring-2 ring-ink"
                        : "border-line hover:border-ink/30"
                    }`}
                  >
                    <div className="relative aspect-square overflow-hidden bg-surface-soft">
                      {album.cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={album.cover}
                          alt={album.title ?? `Album ${album.id}`}
                          loading="lazy"
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="grid size-full place-items-center text-muted-soft">
                          <ImageIcon className="size-6" />
                        </div>
                      )}
                      {isOn && (
                        <div className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-ink text-canvas">
                          <Check className="size-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="p-2.5">
                      <p className="truncate text-xs font-medium text-ink">
                        {album.title ?? `Album ${album.id}`}
                      </p>
                      {album.photoCount != null && (
                        <p className="mt-0.5 text-[0.7rem] text-muted">
                          {album.photoCount} photo{album.photoCount === 1 ? "" : "s"}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              {tooMany && (
                <p className="text-sm text-[#b42318]">
                  Up to {MAX_IMPORT} at a time.
                </p>
              )}
              <span className="text-sm text-muted">{selected.size} selected</span>
              <Button
                type="submit"
                size="md"
                disabled={importing || selected.size === 0 || tooMany}
              >
                {importing ? "Importing…" : "Import as drafts"}
              </Button>
            </div>
          </section>
        </form>
      )}

      {importState.message && (
        <p className="rounded-2xl border border-[#b42318]/20 bg-[#b42318]/5 px-5 py-4 text-sm text-[#b42318]">
          {importState.message}
        </p>
      )}

      {importState.ok && <ImportSummary state={importState} />}
    </div>
  );
}

function ImportSummary({ state }: { state: YupooImportState }) {
  const created = state.created ?? [];
  const noSource = state.noSource ?? [];
  const failed = state.failed ?? [];
  const duplicates = state.duplicates ?? 0;

  return (
    <section className="rounded-3xl border border-line bg-canvas p-6 shadow-soft sm:p-8">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="size-5 text-ink" />
        <h2 className="text-base font-semibold text-ink">
          {created.length} draft{created.length === 1 ? "" : "s"} created
          {duplicates > 0 &&
            ` · ${duplicates} already in catalog`}
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
                Review
              </Link>
            </li>
          ))}
        </ul>
      )}

      {(noSource.length > 0 || failed.length > 0) && (
        <div className="mt-6 rounded-2xl border border-[#b42318]/20 bg-[#b42318]/5 p-4 text-xs">
          <div className="flex items-center gap-2 font-medium text-[#b42318]">
            <AlertTriangle className="size-4" />
            {noSource.length + failed.length} skipped
          </div>
          {noSource.length > 0 && (
            <p className="mt-2 text-[#b42318]/80">
              No marketplace link found: {noSource.join(", ")}
            </p>
          )}
          {failed.length > 0 && (
            <p className="mt-1 text-[#b42318]/80">
              Failed to load: {failed.join(", ")}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
