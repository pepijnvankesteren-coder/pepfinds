import Link from "next/link";
import { ArrowLeft, Bookmark } from "lucide-react";

import { requireAdmin } from "@/lib/auth";
import { SITE } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { BookmarkletLink } from "@/components/admin/bookmarklet-link";

export const dynamic = "force-dynamic";

/** Build the one-line bookmarklet, with the secret token + endpoint baked in. */
function buildBookmarklet(token: string): string {
  const endpoint = `${SITE.url}/api/import`;
  return `javascript:(function(){try{var T='${token}';var EP='${endpoint}';var L=[].slice.call(document.querySelectorAll('a[href]')).map(function(a){return a.href;});var I=[].slice.call(document.querySelectorAll('img')).map(function(i){return i.currentSrc||i.src;}).filter(Boolean);var o=document.querySelector('meta[property="og:image"]');if(o&&o.content)I.unshift(o.content);var t=(document.querySelector('meta[property="og:title"]')||{}).content||document.title;fetch(EP,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:T,pageUrl:location.href,links:L,images:I,title:t})}).then(function(r){return r.json();}).then(function(d){if(d&&d.ok){if(confirm('Imported as draft: '+d.title+' \\u2014 open to review?'))window.open(d.editUrl,'_blank');}else{alert((d&&d.error)||'Import failed');}}).catch(function(e){alert('Import error: '+e);});}catch(e){alert('Bookmarklet error: '+e);}})();`;
}

export default async function ToolsPage() {
  await requireAdmin();
  const token = process.env.IMPORT_TOKEN ?? "";

  return (
    <Container className="max-w-3xl">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Back to products
      </Link>

      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        Quick-import bookmarklet
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        Import a product from any page — doppel.fit, a marketplace listing, an
        agent page — with one click. It finds the Taobao / Weidian / 1688 link on
        the page and creates a draft with your affiliate buy buttons.
      </p>

      {!token ? (
        <div className="mt-8 rounded-3xl border border-[#b42318]/20 bg-[#b42318]/5 p-6 text-sm leading-relaxed text-ink">
          <p className="font-semibold text-[#b42318]">Setup needed</p>
          <p className="mt-2 text-muted">
            Set an <strong>IMPORT_TOKEN</strong> environment variable in Vercel
            (Project → Settings → Environment Variables) to a long random secret,
            then redeploy. The bookmarklet uses it to authenticate. Keep it
            private — anyone with it can create draft products.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-8 rounded-3xl border border-line bg-canvas p-6 shadow-soft sm:p-8">
            <h2 className="text-base font-semibold text-ink">1. Install it</h2>
            <p className="mt-1 text-sm text-muted">
              Drag this button onto your browser&apos;s bookmarks bar:
            </p>
            <div className="mt-5">
              <BookmarkletLink
                code={buildBookmarklet(token)}
                className="inline-flex cursor-grab items-center gap-2 rounded-full bg-ink px-6 py-3 text-[0.95rem] font-medium text-canvas shadow-soft active:cursor-grabbing"
              >
                <Bookmark className="size-4" />
                Import to PepFinds
              </BookmarkletLink>
            </div>
            <p className="mt-4 text-xs text-muted-soft">
              Can&apos;t drag it? Create a new bookmark manually and paste the
              code below as its URL.
            </p>
            <textarea
              readOnly
              rows={4}
              value={buildBookmarklet(token)}
              className="mt-3 w-full rounded-xl border border-line bg-surface-soft px-3.5 py-3 font-mono text-xs text-muted"
            />
          </div>

          <div className="mt-6 rounded-3xl border border-line bg-canvas p-6 shadow-soft sm:p-8">
            <h2 className="text-base font-semibold text-ink">2. Use it</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted marker:text-muted-soft">
              <li>Open any product page (e.g. on doppel.fit).</li>
              <li>
                Click the <strong>Import to PepFinds</strong> bookmark.
              </li>
              <li>
                A draft is created with the buy buttons generated from the
                marketplace link. Confirm the popup to open it and review.
              </li>
            </ol>
            <p className="mt-4 text-xs text-muted-soft">
              Notes: it only creates <strong>drafts</strong> (never publishes),
              and skips items already in your catalog. Imported images come from
              the page and may need replacing — titles, images and descriptions
              are easy to tidy on the edit screen before publishing.
            </p>
          </div>
        </>
      )}
    </Container>
  );
}
