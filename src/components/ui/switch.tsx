import * as React from "react";

import { cn } from "@/lib/utils";

interface SwitchProps {
  name: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
  className?: string;
}

/**
 * Apple-style toggle built on a visually hidden checkbox, so it submits a
 * normal "on" value through FormData without any client-side JavaScript.
 */
export function Switch({
  name,
  label,
  description,
  defaultChecked = false,
  className,
}: SwitchProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer select-none items-start justify-between gap-6",
        className,
      )}
    >
      <span className="min-w-0">
        <span className="text-sm font-medium text-ink">{label}</span>
        {description && (
          <span className="mt-0.5 block text-xs leading-relaxed text-muted">
            {description}
          </span>
        )}
      </span>
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          "relative mt-0.5 inline-block h-6 w-10 shrink-0 rounded-full bg-line",
          "transition-colors duration-300 peer-checked:bg-ink",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-ink/70 peer-focus-visible:ring-offset-2",
          "after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-canvas after:shadow-soft",
          "after:transition-transform after:duration-300 after:ease-[var(--ease-out-expo)]",
          "peer-checked:after:translate-x-4",
        )}
      />
    </label>
  );
}
