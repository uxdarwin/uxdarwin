"use client";

import { useLayoutEffect } from "react";

/**
 * Sticky columns taller than the window: sets --sticky-top so the column scrolls with the page
 * until its bottom is in view, then stays put, instead of hiding its lower part.
 */
export function useStickyFit(ref: React.RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      const gap = 12;
      el.style.setProperty("--sticky-top", `${Math.min(gap, window.innerHeight - el.offsetHeight - gap)}px`);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [ref]);
}
