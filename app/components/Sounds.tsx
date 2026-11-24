"use client";

import { useEffect } from "react";
import { bind, play, setEnabled, setTheme, setVolume } from "cuelume";
import { THEMES } from "cuelume/themes";

// Interaction sounds, synthesized live by Cuelume in its Mech theme.
// Clicks: elements marked `data-cuelume-tap` play `tap` (wired by bind()).
// Hover: elements marked `data-sound-hover` play `loading` when a fine mouse
// pointer enters them. Cuelume deprecated its own hover attribute, so hover
// is a small delegated listener here instead.
//
// Nothing sounds before the visitor has interacted with the page (Cuelume
// stays silent while the browser blocks audio), and everything is muted
// for visitors who ask for reduced motion.

const HOVER_SELECTOR = "[data-sound-hover]";
const HOVER_GAP_MS = 150;
// Hover cue tuning, per Darwin: half as loud, 1.25x faster.
const HOVER_VOLUME = 0.5;
const HOVER_SPEED = 1.25;

// Cuelume has no speed option, so shorten the Mech loading cue's envelope
// once, in place. Pitch is left alone so it keeps the Mech material.
let hoverTuned = false;
function tuneHoverCue() {
  if (hoverTuned) return;
  hoverTuned = true;
  for (const layer of THEMES.mech.loading.layers as Array<{ attack: number; decay: number }>) {
    layer.attack /= HOVER_SPEED;
    layer.decay /= HOVER_SPEED;
  }
}

export function Sounds() {
  useEffect(() => {
    setTheme("mech");
    tuneHoverCue();
    setVolume(0.6);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fineHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const syncEnabled = () => setEnabled(!reduce.matches);
    syncEnabled();
    reduce.addEventListener("change", syncEnabled);

    const unbind = bind();

    let lastHover = -Infinity;
    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !fineHover.matches) return;
      if (!(event.target instanceof Element)) return;
      const zone = event.target.closest(HOVER_SELECTOR);
      if (!zone) return;
      // Moving between children of the same zone is not a new hover.
      const from = event.relatedTarget;
      if (from instanceof Node && zone.contains(from)) return;
      const now = performance.now();
      if (now - lastHover < HOVER_GAP_MS) return;
      lastHover = now;
      play("loading", { emphasis: "subtle", volume: HOVER_VOLUME });
    };
    document.addEventListener("pointerover", onPointerOver);

    return () => {
      unbind();
      reduce.removeEventListener("change", syncEnabled);
      document.removeEventListener("pointerover", onPointerOver);
    };
  }, []);

  return null;
}
