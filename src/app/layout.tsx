import type { Metadata, Viewport } from "next";

import "./globals.css";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "Weidian",
    "Taobao",
    "1688",
    "China product search",
    "product discovery",
    "Chinese marketplaces",
  ],
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    images: [{ url: "/api/og", width: 1200, height: 630, alt: SITE.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: ["/api/og"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Navbar/Footer live in the (site) route group layout so the admin area
  // can render its own minimal chrome.
  return (
    <html lang="en">
      <body className="min-h-screen bg-canvas antialiased">{children}</body>
    </html>
  );
}
