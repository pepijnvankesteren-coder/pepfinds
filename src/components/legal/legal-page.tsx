import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Container } from "@/components/ui/container";

interface LegalPageProps {
  title: string;
  /** Human-readable last-updated date, e.g. "27 June 2026". */
  updated: string;
  /** Short lead paragraph shown under the title. */
  intro?: ReactNode;
  children: ReactNode;
}

/**
 * Shared shell for the static legal pages (privacy, terms, IP, DSA, cookies).
 * Content is plain semantic markup — headings, paragraphs, lists — styled here
 * so each page reads like a clean legal document without per-page styling.
 */
export function LegalPage({ title, updated, intro, children }: LegalPageProps) {
  return (
    <section className="pb-24 pt-28 sm:pt-32">
      <Container className="max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" />
          Back to PepFinds
        </Link>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-soft">Last updated: {updated}</p>
        {intro && (
          <p className="mt-6 text-[0.95rem] leading-relaxed text-muted">{intro}</p>
        )}

        <div className="mt-8 text-[0.95rem] leading-relaxed text-muted [&_a]:font-medium [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-10 [&_h2]:scroll-mt-24 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-ink [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-ink [&_li]:marker:text-muted-soft [&_p]:mt-3 [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
          {children}
        </div>
      </Container>
    </section>
  );
}
