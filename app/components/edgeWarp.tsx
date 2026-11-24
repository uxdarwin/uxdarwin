"use client";

import { useEffect } from "react";

// Bottom-edge 3D for the projects grid: as cards near the bottom of the window they tip back
// in perspective, as if the grid rolled away over a drum, and straighten as they scroll up.
// Driven by position, so it's smooth while scrolling and still at rest.

const START = 0.62; // card centers below this share of the window start to tip
const MAX_TILT = 34; // degrees at the very bottom

export function useEdgeWarp(ref: React.RefObject<HTMLElement | null>, key: string) {
  useEffect(() => {
    const grid = ref.current;
    if (!grid) return;
    const phone = window.matchMedia("(max-width: 639px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let touched = new Set<HTMLElement>();

    const clear = (el: HTMLElement) => {
      el.style.transform = "";
      el.style.transformOrigin = "";
    };

    const apply = () => {
      frame = 0;
      const next = new Set<HTMLElement>();
      if (!phone.matches && !still.matches) {
        const vh = window.innerHeight;
        const start = vh * START;
        grid.querySelectorAll<HTMLElement>("[data-warp]").forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.bottom <= start || r.top >= vh) return;
          const mid = r.top + Math.min(r.height, vh * 0.5) / 2;
          const p = Math.min(1, Math.max(0, (mid - start) / (vh - start)));
          if (p <= 0) return;
          const e = p * p * (3 - 2 * p); // smoothstep
          el.style.transformOrigin = "50% 0";
          el.style.transform = `perspective(1000px) rotateX(${(MAX_TILT * e).toFixed(2)}deg) scale(${(1 - 0.06 * e).toFixed(3)})`;
          next.add(el);
        });
      }
      touched.forEach((el) => !next.has(el) && clear(el));
      touched = next;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
      touched.forEach(clear);
    };
  }, [ref, key]);
}
