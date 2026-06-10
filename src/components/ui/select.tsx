import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/** Native select styled to match the Input component, with a custom chevron. */
const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={cn(
        "h-11 w-full appearance-none rounded-xl border border-line bg-canvas pl-4 pr-10 text-[0.95rem] text-ink",
        "transition-[border-color,box-shadow] duration-300",
        "focus:border-ink/30 focus:outline-none focus:ring-4 focus:ring-ink/5",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </select>
    <ChevronDown
      className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
      aria-hidden="true"
    />
  </div>
));
Select.displayName = "Select";

export { Select };
