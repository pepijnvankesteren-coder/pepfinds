import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Text input matching the platform's soft, minimal form language:
 * hairline border, generous radius, and a quiet ink-tinted focus ring.
 */
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "h-11 w-full rounded-xl border border-line bg-canvas px-4 text-[0.95rem] text-ink",
      "placeholder:text-muted-soft",
      "transition-[border-color,box-shadow] duration-300",
      "focus:border-ink/30 focus:outline-none focus:ring-4 focus:ring-ink/5",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
