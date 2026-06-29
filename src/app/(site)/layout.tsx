import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CookieConsent } from "@/components/legal/cookie-consent";
import { ConsentAnalytics } from "@/components/legal/consent-analytics";

/** Public site chrome: floating navbar + footer around every visitor page. */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <CookieConsent />
      <ConsentAnalytics />
    </>
  );
}
