import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { MarketplaceCard } from "@/components/marketplace/marketplace-card";
import { MARKETPLACE_LIST } from "@/lib/marketplaces";

/** Supported-marketplaces section with clean logo cards. */
export function MarketplacesSection() {
  return (
    <section id="marketplaces" className="scroll-mt-24 py-24 sm:py-32">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Every major source, unified
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-muted text-balance">
            We connect the marketplaces that power global product sourcing.
          </p>
        </Reveal>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3">
          {MARKETPLACE_LIST.map((marketplace, index) => (
            <Reveal key={marketplace.id} delay={index * 0.08}>
              <MarketplaceCard marketplace={marketplace} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
