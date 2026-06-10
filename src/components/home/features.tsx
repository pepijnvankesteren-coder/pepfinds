import { Sparkles, ShoppingBag, Zap, type LucideIcon } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Sparkles,
    title: "Hand-Picked Catalog",
    description:
      "Every product is personally curated — no scraped listings, no noise. Only finds worth your time.",
  },
  {
    icon: ShoppingBag,
    title: "One-Tap Agent Links",
    description:
      "Each product links straight to trusted buying agents like Superbuy, Oopbuy, and Kakobuy — ready to order.",
  },
  {
    icon: Zap,
    title: "Instant Search",
    description:
      "Find anything in the catalog by name, tag, or category in an instant, from one focused interface.",
  },
];

/** Three-up feature grid explaining the core value props. */
export function Features() {
  return (
    <section id="features" className="scroll-mt-24 py-24 sm:py-32">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Everything you need to source smarter
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-muted text-balance">
            A premium discovery layer on top of the world&apos;s largest
            marketplaces.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.08}>
              <div className="flex h-full flex-col rounded-3xl border border-line bg-canvas p-8 shadow-soft transition-shadow duration-500 hover:shadow-float">
                <div className="grid size-12 place-items-center rounded-2xl bg-ink text-canvas">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-ink">
                  {feature.title}
                </h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">
                  {feature.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
