"use client";

import * as React from "react";
import Link from "next/link";

const CONSENT_COOKIE = "pf_cookie_consent";
const ONE_YEAR = 60 * 60 * 24 * 365;

type Choice = "accepted" | "rejected";

function readConsent(): Choice | null {
  const match = document.cookie.match(/(?:^|;\s*)pf_cookie_consent=(accepted|rejected)/);
  return match ? (match[1] as Choice) : null;
}

/**
 * Consent banner for non-essential (analytics) cookies. PepFinds sets no
 * analytics cookies today, so a choice here only records the visitor's
 * preference — when analytics is added it must be gated on
 * `getCookieConsent() === "accepted"`. The consent cookie itself and the admin
 * session are strictly necessary and don't require consent.
 */
export function CookieConsent() {
  const [decided, setDecided] = React.useState(true);

  React.useEffect(() => {
    setDecided(readConsent() !== null);
  }, []);

  const choose = (choice: Choice) => {
    document.cookie = `${CONSENT_COOKIE}=${choice}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
    setDecided(true);
    // Let the analytics gate react immediately, without a page reload.
    window.dispatchEvent(new Event("pf-consent-changed"));
  };

  if (decided) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-line bg-canvas p-5 shadow-float sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-muted">
          PepFinds only uses cookies that are strictly necessary to run the
          site. We&apos;d also like your consent for optional analytics cookies
          to understand how the site is used. See our{" "}
          <Link href="/cookies" className="font-medium text-ink underline underline-offset-2">
            Cookie Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose("rejected")}
            className="inline-flex h-10 items-center justify-center rounded-full border border-line bg-canvas px-5 text-sm font-medium text-ink transition-colors hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/70 focus-visible:ring-offset-2"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="inline-flex h-10 items-center justify-center rounded-full bg-ink px-5 text-sm font-medium text-canvas shadow-soft transition-colors hover:bg-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/70 focus-visible:ring-offset-2"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

/** Read the stored analytics-cookie consent (client-side), for gating scripts. */
export function getCookieConsent(): Choice | null {
  if (typeof document === "undefined") return null;
  return readConsent();
}