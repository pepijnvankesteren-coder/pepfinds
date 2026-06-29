import type { Metadata } from "next";

import { SITE, CONTACT_EMAIL } from "@/lib/site";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How PepFinds handles personal data, in line with the EU General Data Protection Regulation (GDPR/AVG).",
};

const UPDATED = "27 June 2026";

export default function PrivacyPolicyPage() {
  const mail = (
    <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
  );

  return (
    <LegalPage
      title="Privacy Policy"
      updated={UPDATED}
      intro={
        <>
          This Privacy Policy explains how {SITE.name} (&ldquo;PepFinds&rdquo;,
          &ldquo;we&rdquo;, &ldquo;us&rdquo;) handles personal data. We process
          personal data in accordance with the EU General Data Protection
          Regulation (GDPR / &ldquo;AVG&rdquo;) and applicable Dutch law.
        </>
      }
    >
      <h2>1. Who we are</h2>
      <p>
        PepFinds is operated from the Netherlands by a private individual. We are
        the controller for the personal data described in this policy. You can
        reach us at any time at {mail}.
      </p>

      <h2>2. Our approach to data</h2>
      <p>
        PepFinds is a free product-discovery website. You do not need an account
        to use it, and we deliberately keep data collection to a minimum:
      </p>
      <ul>
        <li>
          <strong>Privacy-friendly analytics only</strong>: we use Vercel Web
          Analytics, which is cookieless and collects no personal data, and only
          after you accept analytics via our cookie banner. We use no advertising
          or profiling cookies.
        </li>
        <li>
          <strong>No sign-up, newsletter, or contact form</strong> — we collect
          no names, email addresses, or payment details from visitors.
        </li>
        <li>
          We do not sell, rent, or trade personal data.
        </li>
      </ul>

      <h2>3. What personal data we process</h2>
      <h3>Server and hosting logs</h3>
      <p>
        Like virtually every website, when you visit PepFinds our hosting and
        infrastructure providers automatically process technical data such as
        your IP address, browser type, the pages requested, and timestamps. This
        is necessary to deliver the site, keep it secure, and prevent abuse.
      </p>
      <h3>Cookies</h3>
      <p>
        We use a small number of strictly necessary cookies only (an admin-login
        cookie that visitors never receive, and a cookie that records your cookie
        choice). Our analytics (Vercel Web Analytics) is cookieless. See our{" "}
        <a href="/cookies">Cookie Policy</a> for the full list.
      </p>
      <h3>Outbound links to agents and marketplaces</h3>
      <p>
        Product &ldquo;buy&rdquo; buttons are links to third-party purchasing
        agents and marketplaces (such as Weidian, Taobao, 1688, and agents like
        Kakobuy, Oopbuy, and others). Some links contain an affiliate code so we
        may earn a commission at no extra cost to you. When you click such a
        link you leave PepFinds and the third party processes your data under
        its own privacy policy — we do not share your personal data with them.
      </p>

      <h2>4. Purposes and legal bases</h2>
      <ul>
        <li>
          <strong>Operating, securing, and maintaining the site</strong> —
          legal basis: our legitimate interests (Article 6(1)(f) GDPR) in
          running a functional, secure service.
        </li>
        <li>
          <strong>Strictly necessary cookies</strong> — legal basis: necessary
          for a service you request; no consent required under the ePrivacy
          rules.
        </li>
        <li>
          <strong>Optional analytics cookies (if enabled)</strong> — legal
          basis: your consent (Article 6(1)(a) GDPR), which you can withdraw at
          any time.
        </li>
      </ul>

      <h2>5. Who we share data with (processors)</h2>
      <p>
        We rely on a small number of service providers that process data on our
        behalf under data-processing agreements:
      </p>
      <ul>
        <li>
          <strong>Vercel Inc.</strong> — website hosting, content delivery, and
          privacy-friendly, cookieless web analytics (which runs only with your
          consent).
        </li>
        <li>
          <strong>Neon Inc.</strong> — managed database hosting (this stores our
          product catalog; it does not store visitor personal data).
        </li>
      </ul>
      <p>
        Some of these providers are based in, or may process data in, the United
        States. Where personal data is transferred outside the European Economic
        Area, it is protected by appropriate safeguards such as the EU Standard
        Contractual Clauses and/or the EU–US Data Privacy Framework.
      </p>

      <h2>6. How long we keep data</h2>
      <p>
        Technical server logs are retained only for a short period by our
        providers for security and troubleshooting and are then deleted or
        anonymized. Our product catalog contains no visitor personal data.
      </p>

      <h2>7. Your rights</h2>
      <p>Under the GDPR you have the right to:</p>
      <ul>
        <li>access the personal data we hold about you;</li>
        <li>have inaccurate data corrected;</li>
        <li>have your data erased;</li>
        <li>restrict or object to processing;</li>
        <li>data portability;</li>
        <li>withdraw consent at any time, where processing is based on consent.</li>
      </ul>
      <p>
        To exercise any of these rights, email us at {mail}. You also have the
        right to lodge a complaint with the Dutch Data Protection Authority
        (Autoriteit Persoonsgegevens, <a href="https://autoriteitpersoonsgegevens.nl">autoriteitpersoonsgegevens.nl</a>)
        or your local supervisory authority.
      </p>

      <h2>8. Security</h2>
      <p>
        We use industry-standard measures (including encrypted connections via
        HTTPS) to protect the site. No method of transmission or storage is ever
        completely secure, but we take reasonable steps to safeguard data.
      </p>

      <h2>9. Children</h2>
      <p>
        PepFinds is not directed at children under the age of 16 and we do not
        knowingly process their personal data.
      </p>

      <h2>10. Other websites</h2>
      <p>
        PepFinds links to third-party websites we do not control. We are not
        responsible for their content or privacy practices; please review their
        policies before sharing data with them.
      </p>

      <h2>11. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The &ldquo;last
        updated&rdquo; date above reflects the latest version. Material changes
        will be made clear on this page.
      </p>

      <h2>12. Contact</h2>
      <p>Questions about this policy or your data? Email {mail}.</p>
    </LegalPage>
  );
}