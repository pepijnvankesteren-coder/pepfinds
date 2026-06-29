import type { Metadata } from "next";

import { SITE, CONTACT_EMAIL } from "@/lib/site";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Digital Services Act (DSA)",
  description:
    "PepFinds' single point of contact and the mechanism for reporting illegal content under the EU Digital Services Act.",
};

const UPDATED = "27 June 2026";

export default function DsaPage() {
  const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

  return (
    <LegalPage
      title="Digital Services Act (DSA)"
      updated={UPDATED}
      intro={
        <>
          This page provides information required by, and in the spirit of, the
          EU Digital Services Act (Regulation (EU) 2022/2065). It sets out how to
          contact {SITE.name} and how to report content you believe is illegal.
        </>
      }
    >
      <h2>1. Our service</h2>
      <p>
        PepFinds is a small, independently operated product-discovery website. We
        curate and link to listings on third-party marketplaces and purchasing
        agents. We are not a marketplace, do not sell products, and do not host
        user-generated content. To the extent the DSA applies to our service, we
        provide the following point of contact and reporting mechanism.
      </p>

      <h2>2. Single point of contact</h2>
      <p>
        For both authorities and users (recipients of the service), our point of
        contact is:
      </p>
      <ul>
        <li>
          <strong>Email:</strong> {mail}
        </li>
        <li>
          <strong>Languages:</strong> English and Dutch
        </li>
      </ul>
      <p>
        We do not currently use an automated single point of contact; please
        reach us by email and we will respond as soon as reasonably possible.
      </p>

      <h2>3. Reporting illegal content (notice and action)</h2>
      <p>
        If you consider that specific content displayed or linked on PepFinds is
        illegal, you can notify us at {mail} with the subject line &ldquo;DSA
        Notice&rdquo;. To help us assess and act on your report, please include:
      </p>
      <ul>
        <li>
          a clear explanation of why you consider the content illegal;
        </li>
        <li>
          the exact URL(s) on PepFinds where the content appears;
        </li>
        <li>
          your name and email address (except for reports concerning certain
          offences against minors, where you may remain anonymous); and
        </li>
        <li>
          a statement of your good-faith belief that the information in the
          notice is accurate and complete.
        </li>
      </ul>
      <p>
        For intellectual-property complaints specifically, you may instead use
        our <a href="/ip">Intellectual Property</a> page, which asks for the same
        kind of detail.
      </p>

      <h2>4. How we handle reports</h2>
      <p>
        We review notices in a timely, diligent, and non-arbitrary way. Where we
        decide content is illegal or breaches our <a href="/terms-and-conditions">Terms</a>,
        we may remove or disable access to it on PepFinds. We will, where
        required and where we have the means to contact you, inform you of our
        decision and the reasons for it. Because the underlying items are hosted
        and sold by third-party marketplaces, action on PepFinds does not remove
        content from those external sites.
      </p>

      <h2>5. Advertising and recommender systems</h2>
      <p>
        PepFinds does not display third-party advertising, does not use
        profiling-based advertising, and does not operate a recommender system
        that profiles users. Listings are curated manually by the operator.
      </p>

      <h2>6. Misuse</h2>
      <p>
        We may decline to act on notices that are manifestly unfounded or
        submitted abusively, and we keep a record of the notices we receive.
      </p>

      <h2>7. Contact</h2>
      <p>DSA point of contact: {mail}.</p>
    </LegalPage>
  );
}