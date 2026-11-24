"use client";

import { useEffect } from "react";

/**
 * Scroll-in intro for the grid: cards below the window start a little low, small, soft and
 * faint, and settle once as they come into view. Tiles in the same row are staggered left to right.
 */
export function useReveal(ref: React.RefObject<HTMLElement | null>, key: string) {
  useEffect(() => {
    const grid = ref.current;
    if (!grid || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = [...grid.querySelectorAll<HTMLElement>("[data-reveal]")];
    const vh = window.innerHeight;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          const col = el.parentElement ? [...el.parentElement.children].indexOf(el) : 0;
          el.style.transitionDelay = `${Math.max(0, col) * 70}ms`;
          el.dataset.reveal = "in";
          // Drop the stagger afterwards so it never delays the hover.
          window.setTimeout(() => (el.style.transitionDelay = ""), 1200);
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -6% 0px" },
    );
    items.forEach((el) => {
      // Only cards that start below the window get the intro, so nothing on screen flashes.
      if (el.getBoundingClientRect().top < vh) return;
      el.dataset.reveal = "wait";
      io.observe(el);
    });
    return () => {
      io.disconnect();
      items.forEach((el) => {
        el.dataset.reveal = "";
        el.style.transitionDelay = "";
      });
    };
  }, [ref, key]);
}
