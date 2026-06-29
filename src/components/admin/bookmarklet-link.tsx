"use client";

import * as React from "react";

/**
 * Renders a draggable bookmarklet link. React strips `javascript:` hrefs from
 * JSX, so we set it on the DOM node after mount instead. Clicking it on this
 * page does nothing useful, so the click is suppressed — it's meant to be
 * dragged onto the bookmarks bar.
 */
export function BookmarkletLink({
  code,
  className,
  children,
}: {
  code: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLAnchorElement>(null);

  React.useEffect(() => {
    ref.current?.setAttribute("href", code);
  }, [code]);

  return (
    <a
      ref={ref}
      className={className}
      onClick={(e) => e.preventDefault()}
      draggable
    >
      {children}
    </a>
  );
}
