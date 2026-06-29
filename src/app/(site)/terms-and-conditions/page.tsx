import type { Metadata } from "next";

import { SITE, CONTACT_EMAIL } from "@/lib/site";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms governing your use of PepFinds, a free product-discovery service that links to third-party marketplaces and purchasing agents.",
};

const UPDATED = "27 June 2026";

export default function TermsPage() {
  const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

  return (
    <LegalPage
      title="Terms & Conditions"
      updated={UPDATED}
      intro={
        <>
          These Terms govern your use of {SITE.name} (&ldquo;PepFinds&rdquo;,
          &ldquo;we&rdquo;, &ldquo;us&rdquo;). By using the site you agree to
          these Terms. If you do not agree, please do not use PepFinds.
        </>
      }
    >
      <h2>1. Who we are</h2>
      <p>
        PepFinds is operated from the Netherlands by a private individual. You
        can contact us at {mail}. These Terms are governed by Dutch law (see
        section 14).
      </p>

      <h2>2. What PepFinds is — and is not</h2>
      <p>
        PepFinds is a free <strong>information and product-discovery service</strong>.
        We curate listings that can be found on third-party marketplaces (such as
        Weidian, Taobao, and 1688) and provide links to third-party purchasing
        agents that can buy and forward those items.
      </p>
      <p>
        <strong>PepFinds is not a shop and is not a party to any purchase.</strong>{" "}
        We do not sell, manufacture, import, stock, ship, or handle payment for
        any product. We hold no inventory and process no orders. Every purchase
        is a contract solely between you and the third-party marketplace and/or
        agent you choose, subject to their terms, prices, and policies.
      </p>

      <h2>3. Affiliate links</h2>
      <p>
        Some links on PepFinds contain an affiliate or referral code. If you buy
        through such a link, we may receive a commission from the agent or
        marketplace, <strong>at no additional cost to you</strong>. This helps
        keep PepFinds free. Affiliate relationships never change the price you
        pay and do not influence whether an item is listed.
      </p>

      <h2>4. No affiliation with brands, marketplaces, or agents</h2>
      <p>
        PepFinds is independent. We are not affiliated with, endorsed by, or
        sponsored by any brand, marketplace, or purchasing agent. Any brand,
        product, marketplace, or agent names and logos are the property of their
        respective owners and are used only to identify or describe products and
        services (nominative use).
      </p>

      <h2>5. Product listings, authenticity, and your responsibility</h2>
      <p>
        Listings on PepFinds point to goods offered by independent third-party
        sellers. We do not inspect, source, or guarantee any item.{" "}
        <strong>
          Items linked from PepFinds may be unofficial, unbranded, replica, or
          &ldquo;inspired-by&rdquo; products
        </strong>{" "}
        sold by third parties. We make no representation that any item is
        genuine, licensed, of any particular quality, or legal to import into
        your country.
      </p>
      <p>You are responsible for:</p>
      <ul>
        <li>
          deciding whether to purchase an item and from whom;
        </li>
        <li>
          complying with all laws that apply to you, including your country&apos;s
          import, customs, tax, and intellectual-property rules; and
        </li>
        <li>
          any duties, taxes, seizures, or consequences arising from your order.
        </li>
      </ul>
      <p>
        If you believe a listing infringes intellectual-property rights or is
        otherwise unlawful, please see our{" "}
        <a href="/ip">Intellectual Property</a> and <a href="/dsa">DSA</a> pages,
        which explain how to report it.
      </p>

      <h2>6. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>use PepFinds for any unlawful purpose or in breach of these Terms;</li>
        <li>
          scrape, copy, or republish substantial parts of the site, or interfere
          with its operation or security;
        </li>
        <li>
          attempt to gain unauthorized access to any part of the site or its
          systems.
        </li>
      </ul>

      <h2>7. Intellectual property in the site</h2>
      <p>
        The PepFinds name, design, layout, and original text are protected and
        remain ours or our licensors&apos;. You may use the site for personal,
        non-commercial browsing. Product images and listing details displayed on
        PepFinds originate from third-party sellers and remain the property of
        their respective owners.
      </p>

      <h2>8. Third-party websites</h2>
      <p>
        PepFinds links to websites we do not control. We are not responsible for
        their content, products, prices, availability, or practices, and linking
        does not imply endorsement. Your dealings with any third party are solely
        between you and that third party.
      </p>

      <h2>9. No warranties</h2>
      <p>
        PepFinds is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;.
        To the fullest extent permitted by law, we make no warranties about the
        accuracy, completeness, availability, or reliability of the site or any
        listing, and we may change, suspend, or discontinue any part of it at any
        time.
      </p>

      <h2>10. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, PepFinds is not liable for any
        loss or damage arising from your use of the site, from any third-party
        marketplace, agent, or product, or from your reliance on any listing.
        Nothing in these Terms excludes or limits liability that cannot be
        excluded or limited under applicable law, and your mandatory rights as a
        consumer under Dutch and EU law are not affected.
      </p>

      <h2>11. Indemnity</h2>
      <p>
        You agree to hold PepFinds harmless from claims arising out of your
        misuse of the site or your breach of these Terms or of applicable law.
      </p>

      <h2>12. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. The &ldquo;last
        updated&rdquo; date above reflects the current version; continued use of
        the site means you accept the updated Terms.
      </p>

      <h2>13. Severability</h2>
      <p>
        If any provision of these Terms is found invalid or unenforceable, the
        remaining provisions continue in full force.
      </p>

      <h2>14. Governing law and jurisdiction</h2>
      <p>
        These Terms and any dispute arising from them are governed by Dutch law.
        Disputes will be submitted to the competent court in the Netherlands,
        without prejudice to any mandatory consumer-protection rights you have in
        your country of residence, including the right to bring proceedings in
        your local courts where the law allows.
      </p>

      <h2>15. Contact</h2>
      <p>Questions about these Terms? Email {mail}.</p>
    </LegalPage>
  );
}