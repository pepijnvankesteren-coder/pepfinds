import { Sparkles } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

/** Shown on the homepage while the catalog has no published products yet. */
export function CatalogEmptyState() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <div className="mx-auto flex max-w-2xl flex-col items-center rounded-[2.5rem] border border-line bg-surface px-8 py-20 text-center">
            <div className="grid size-14 place-items-center rounded-2xl bg-ink text-canvas shadow-soft">
              <Sparkles className="size-6" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              The catalog is being curated
            </h2>
            <p className="mt-3 max-w-md text-base leading-relaxed text-muted text-balance">
              Every product on PepFinds is hand-picked — no scraped listings,
              no filler. The first finds are on their way. Check back soon.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
