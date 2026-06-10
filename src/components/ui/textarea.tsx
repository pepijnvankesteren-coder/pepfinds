import * as React from "react";

import { cn } from "@/lib/utils";

/** Multiline counterpart to the Input component. */
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-xl border border-line bg-canvas px-4 py-3 text-[0.95rem] leading-relaxed text-ink",
      "placeholder:text-muted-soft",
      "transition-[border-color,box-shadow] duration-300",
      "focus:border-ink/30 focus:outline-none focus:ring-4 focus:ring-ink/5",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
