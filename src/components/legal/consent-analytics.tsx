"use client";

import * as React from "react";
import { Analytics } from "@vercel/analytics/react";

import { getCookieConsent } from "@/components/legal/cookie-consent";

/**
 * Mounts Vercel Web Analytics only after the visitor has accepted optional
 * analytics via the cookie banner. Vercel Web Analytics is privacy-friendly and
 * cookieless, but we still gate it on consent to honor the choice in the banner
 * and what our Cookie Policy promises. Re-checks on the `pf-consent-changed`
 * event so accepting takes effect without a reload.
 */
export function ConsentAnalytics() {
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    const update = () => setEnabled(getCookieConsent() === "accepted");
    update();
    window.addEventListener("pf-consent-changed", update);
    return () => window.removeEventListener("pf-consent-changed", update);
  }, []);

  return enabled ? <Analytics /> : null;
}