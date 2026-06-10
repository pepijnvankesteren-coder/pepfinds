import Link from "next/link";

import { Container } from "@/components/ui/container";
import { FOOTER_LINKS, SITE } from "@/lib/site";

/** Minimal footer — brand mark, primary links, and a quiet disclaimer. */
export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <Container className="py-14">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <Link
              href="/"
              className="flex items-center gap-2 text-base font-semibold text-ink"
            >
              <span className="grid size-6 place-items-center rounded-md bg-ink text-canvas text-xs font-bold">
                P
              </span>
              {SITE.name}
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {SITE.description}
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted-soft sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p>
            Not affiliated with Weidian, Taobao, 1688, or any purchasing
            agent.
          </p>
        </div>
      </Container>
    </footer>
  );
}
