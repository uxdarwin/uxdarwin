"use client";

import { useSyncExternalStore } from "react";

// Dragging needs a mouse-like pointer; on touch the page scrolls instead.
const DRAG_QUERY = "(hover: hover) and (pointer: fine)";

export function useCanDrag() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(DRAG_QUERY);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(DRAG_QUERY).matches,
    () => false,
  );
}

/** Stable pseudo-random number in [-1, 1] from a string, so tilts survive reloads. */
export function seeded(key: string) {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) / 4294967295) * 2 - 1;
}
