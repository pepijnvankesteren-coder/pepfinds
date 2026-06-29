import type { Metadata } from "next";

import { SITE, CONTACT_EMAIL } from "@/lib/site";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Intellectual Property Policy",
  description:
    "How rights holders can report alleged intellectual-property infringement on PepFinds, and how we respond.",
};

const UPDATED = "27 June 2026";

export default function IpPage() {
  const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

  return (
    <LegalPage
      title="Intellectual Property Policy"
      updated={UPDATED}
      intro={
        <>
          {SITE.name} respects the intellectual-property rights of others and
          expects its users to do the same. This page explains our role and how
          rights holders can report content they believe infringes their rights.
        </>
      }
    >
      <h2>1. Our role</h2>
      <p>
        PepFinds is an independent product-discovery service. We link to, and
        display previews of, listings offered by third-party sellers on external
        marketplaces. We do not manufacture, sell, stock, or ship any product,
        and we are not affiliated with any brand. Brand names and trademarks that
        appear on the site belong to their respective owners and are used only to
        identify or describe products (nominative use), not to suggest any
        endorsement or partnership.
      </p>

      <h2>2. Notice-and-takedown</h2>
      <p>
        If you are a rights holder (or authorized to act for one) and believe
        that content displayed or linked on PepFinds infringes your trademark,
        copyright, or other intellectual-property right, please send a notice to{" "}
        {mail} with the subject line &ldquo;IP Notice&rdquo;.
      </p>
      <p>To allow us to act quickly, please include:</p>
      <ul>
        <li>
          your name and contact details, and the rights holder you represent;
        </li>
        <li>
          the right you rely on (e.g. the registered trademark or copyrighted
          work), with a registration number or proof of ownership where
          available;
        </li>
        <li>
          the exact URL(s) on PepFinds of the content you are reporting;
        </li>
        <li>
          a brief explanation of why you believe the content infringes;
        </li>
        <li>
          a statement that you have a good-faith belief that the use is not
          authorized by the rights holder, its agent, or the law; and
        </li>
        <li>
          a statement that the information in your notice is accurate.
        </li>
      </ul>

      <h2>3. How we respond</h2>
      <p>
        We review valid notices promptly and, where appropriate, will remove or
        disable access to the reported content on PepFinds. We may also inform
        the person who submitted the relevant listing where applicable. Because
        the underlying products are hosted and sold on third-party marketplaces,
        removing a listing from PepFinds does not remove it from those external
        sites; for that, please contact the relevant marketplace directly.
      </p>

      <h2>4. Repeat and abusive notices</h2>
      <p>
        We may decline to act on notices that are incomplete, manifestly
        unfounded, or abusive, and we keep a record of notices received. If you
        submit a notice in bad faith you may be liable for resulting damages
        under applicable law.
      </p>

      <h2>5. Counter-information</h2>
      <p>
        If content you submitted has been removed and you believe this was a
        mistake, you may contact us at {mail} explaining why, and we will
        reconsider.
      </p>

      <h2>6. Reporting other illegal content</h2>
      <p>
        For reports that are not about intellectual property, please use the
        mechanism described on our <a href="/dsa">Digital Services Act</a> page.
      </p>

      <h2>7. Contact</h2>
      <p>Intellectual-property questions or notices: {mail}.</p>
    </LegalPage>
  );
}