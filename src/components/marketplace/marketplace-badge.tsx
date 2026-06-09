import { cn } from "@/lib/utils";
import { getMarketplace } from "@/lib/marketplaces";
import type { MarketplaceId } from "@/lib/types";

interface MarketplaceBadgeProps {
  marketplace: MarketplaceId;
  className?: string;
}

/** Small pill identifying a product's source marketplace. */
export function MarketplaceBadge({
  marketplace,
  className,
}: MarketplaceBadgeProps) {
  const data = getMarketplace(marketplace);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        data.accent.bg,
        data.accent.text,
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {data.name}
    </span>
  );
}
