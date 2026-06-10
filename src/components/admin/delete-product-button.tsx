"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface DeleteProductButtonProps {
  /** Server action with the product id already bound. */
  action: () => Promise<void>;
  title: string;
  className?: string;
}

/** Delete button with a native confirmation prompt — deletion is permanent. */
export function DeleteProductButton({
  action,
  title,
  className,
}: DeleteProductButtonProps) {
  const [pending, startTransition] = React.useTransition();

  const handleClick = () => {
    const confirmed = window.confirm(
      `Delete "${title}" permanently? This cannot be undone.`,
    );
    if (confirmed) {
      startTransition(() => action());
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-label={`Delete ${title}`}
      className={cn(
        "grid size-9 place-items-center rounded-full text-muted",
        "transition-colors duration-300 hover:bg-[#b42318]/8 hover:text-[#b42318]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/70 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
    >
      <Trash2 className="size-4" />
    </button>
  );
}
