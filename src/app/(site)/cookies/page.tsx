import type { Metadata } from "next";

import { SITE, CONTACT_EMAIL } from "@/lib/site";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Which cookies PepFinds uses, why, and how you can manage your consent.",
};

const UPDATED = "27 June 2026";

export default function CookiesPage() {
  const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

  return (
    <LegalPage
      title="Cookie Policy"
      updated={UPDATED}
      intro={
        <>
          This Cookie Policy explains how {SITE.name} uses cookies and similar
          technologies. It should be read together with our{" "}
          <a href="/privacy-policy">Privacy Policy</a>.
        </>
      }
    >
      <h2>1. What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device when you visit a
        website. They are widely used to make sites work, remember preferences,
        and gather information. Some are &ldquo;strictly necessary&rdquo; for a
        site to function; others are optional and require your consent.
      </p>

      <h2>2. Cookies we use</h2>
      <h3>Strictly necessary (no consent required)</h3>
      <ul>
        <li>
          <strong>pf_admin_session</strong> — set only when the site
          administrator logs in to the private admin area. Regular visitors never
          receive this cookie. It keeps the administrator signed in and is
          essential for security.
        </li>
        <li>
          <strong>pf_cookie_consent</strong> — remembers your choice on this
          cookie banner so we don&apos;t ask again. Without it we could not honor
          your preference.
        </li>
      </ul>
      <h3>Analytics / statistics (optional, consent required)</h3>
      <p>
        We do <strong>not</strong> currently use any analytics, statistics, or
        tracking cookies. If we introduce them in the future, they will only be
        placed <strong>after you accept</strong> them via our cookie banner, and
        this page will be updated to list each cookie, its provider, and its
        retention period before they go live.
      </p>
      <h3>Advertising / tracking</h3>
      <p>
        We do not use advertising, profiling, or cross-site tracking cookies, and
        we do not sell your data.
      </p>

      <h2>3. Affiliate links and third-party sites</h2>
      <p>
        When you click a &ldquo;buy&rdquo; button you leave PepFinds for a
        third-party marketplace or purchasing agent. Those sites may set their
        own cookies (including to attribute a referral) under their own policies.
        We have no control over third-party cookies; please review the relevant
        site&apos;s cookie policy.
      </p>

      <h2>4. Managing your consent</h2>
      <p>
        You can accept or decline optional cookies via the banner shown on your
        first visit. You can change your mind at any time by clearing the{" "}
        <strong>pf_cookie_consent</strong> cookie in your browser, after which
        the banner will appear again. You can also block or delete cookies
        through your browser settings; note that blocking strictly necessary
        cookies may stop parts of the site from working.
      </p>

      <h2>5. Changes</h2>
      <p>
        We may update this Cookie Policy as our use of cookies changes. The
        &ldquo;last updated&rdquo; date above reflects the current version.
      </p>

      <h2>6. Contact</h2>
      <p>Questions about cookies? Email {mail}.</p>
    </LegalPage>
  );
}