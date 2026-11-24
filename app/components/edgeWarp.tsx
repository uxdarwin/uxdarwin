"use client";

import { useEffect } from "react";

// Bottom-edge distortion for the projects grid. While the page scrolls, cards in the bottom
// 15% of the window lean toward the viewer, stretch downward and smear with a red/blue split,
// in proportion to the scroll speed. When scrolling stops, they settle back to flat and sharp.

const ZONE = 0.15; // share of the window height
const LEVELS = 4; // filter strengths, from soft to strongest

/** The SVG filters the cards switch between: a vertical smear plus a red/blue split. */
export function EdgeWarpFilters() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
      <defs>
        {Array.from({ length: LEVELS }, (_, i) => {
          const k = (i + 1) / LEVELS;
          const blur = (5 * k).toFixed(1);
          const split = (4 * k).toFixed(1);
          return (
            <filter
              key={i}
              id={`edgewarp-${i + 1}`}
              x="-4%"
              y="-8%"
              width="108%"
              height="116%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur in="SourceGraphic" stdDeviation={`0 ${blur}`} result="b" />
              <feOffset in="b" dx="0" dy={split} result="ro" />
              <feColorMatrix in="ro" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="r" />
              <feOffset in="b" dx="0" dy={`-${split}`} result="bo" />
              <feColorMatrix in="bo" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="bl" />
              <feColorMatrix in="b" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="g" />
              <feBlend in="r" in2="g" mode="screen" result="rg" />
              <feBlend in="rg" in2="bl" mode="screen" />
            </filter>
          );
        })}
      </defs>
    </svg>
  );
}

export function useEdgeWarp(ref: React.RefObject<HTMLElement | null>, key: string) {
  useEffect(() => {
    const grid = ref.current;
    if (!grid) return;
    const phone = window.matchMedia("(max-width: 639px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let energy = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let touched = new Set<HTMLElement>();

    const clear = (el: HTMLElement) => {
      el.style.transform = "";
      el.style.transformOrigin = "";
      el.style.filter = "";
    };

    const tick = (now: number) => {
      const dt = Math.max(1, now - lastT);
      const v = Math.abs(window.scrollY - lastY) / dt; // px per ms
      lastY = window.scrollY;
      lastT = now;
      // Speed sets the target; it rises quickly and eases off over about half a second.
      const target = Math.min(1, v / 3);
      energy = target > energy ? energy + (target - energy) * 0.35 : energy * Math.exp(-dt / 220);

      const vh = window.innerHeight;
      const line = vh * (1 - ZONE);
      const next = new Set<HTMLElement>();
      if (energy > 0.02) {
        grid.querySelectorAll<HTMLElement>("[data-warp]").forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.bottom <= line || r.top >= vh) return;
          // How far into the zone the card reaches: full strength once it covers it.
          const reach = Math.min(1, (Math.min(r.bottom, vh) - Math.max(r.top, line)) / (vh - line));
          const s = energy * (0.4 + 0.6 * reach);
          el.style.transformOrigin = `50% ${(line - r.top).toFixed(0)}px`;
          el.style.transform = `perspective(1100px) rotateX(${(-7 * s).toFixed(2)}deg) scaleY(${(1 + 0.05 * s).toFixed(3)})`;
          const level = Math.ceil(s * LEVELS);
          el.style.filter = level > 0 ? `url(#edgewarp-${Math.min(LEVELS, level)})` : "";
          next.add(el);
        });
      }
      touched.forEach((el) => !next.has(el) && clear(el));
      touched = next;

      frame = energy > 0.02 || next.size ? requestAnimationFrame(tick) : 0;
    };

    const onScroll = () => {
      if (phone.matches || still.matches) return;
      if (!frame) {
        lastT = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      touched.forEach(clear);
    };
  }, [ref, key]);
}
