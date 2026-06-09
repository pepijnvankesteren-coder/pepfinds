import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { ProductShowcase } from "@/components/home/product-showcase";
import { MarketplacesSection } from "@/components/home/marketplaces-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <ProductShowcase />
      <MarketplacesSection />
    </>
  );
}
