import * as React from "react";

import { cn } from "@/lib/utils";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Optional helper line rendered under the label text. */
  hint?: string;
}

/** Form label with an optional muted hint line. */
export function Label({ className, hint, children, ...props }: LabelProps) {
  return (
    <label
      className={cn("block text-sm font-medium text-ink", className)}
      {...props}
    >
      {children}
      {hint && (
        <span className="mt-0.5 block text-xs font-normal text-muted">
          {hint}
        </span>
      )}
    </label>
  );
}

/** Inline validation message shown under a field. */
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm text-[#b42318]">{message}</p>;
}
