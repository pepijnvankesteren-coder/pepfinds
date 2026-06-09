import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Consistent max-width + horizontal padding wrapper. Keeps the generous,
 * Apple-style gutters uniform across every section.
 */
export function Container({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-6 sm:px-8", className)}
      {...props}
    >
      {children}
    </div>
  );
}
