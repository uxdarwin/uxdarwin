"use client";

import { useRef } from "react";
import { useStickyFit } from "./sticky";

/** The left column; it stays in view while the projects grid scrolls. */
export function PanelAside({ className, children }: { className: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useStickyFit(ref);
  return (
    <aside ref={ref} className={className} aria-label="About Darwin">
      {children}
    </aside>
  );
}
