"use client";

import { useEffect, useRef } from "react";
import styles from "./cursor.module.css";

// Pointer from Figma (34:8220): concentric 0.5px rings, brighter toward the edge.
// Ten rings here, as requested: the center dot plus nine rings 1px apart.
const RINGS = Array.from({ length: 10 }, (_, i) => ({
  r: 0.75 + i,
  opacity: i === 0 ? 1 : 0.1 + i * 0.1,
}));

const INTERACTIVE = "a, button:not([data-cursor-plain]), [role=button], summary, label, [data-cursor]";

/** Soft, short "tick" made with Web Audio, so there's no sound file to load. */
function makeClick() {
  let ctx: AudioContext | null = null;
  return () => {
    try {
      ctx ??= new AudioContext();
      if (ctx.state === "suspended") void ctx.resume();
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.exponentialRampToValueAtTime(420, t + 0.05);
      filter.type = "lowpass";
      filter.frequency.value = 1800;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.045, t + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
      osc.connect(filter).connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.08);
    } catch {
      // Audio unavailable: stay silent.
    }
  };
}

export function RingCursor() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rings = Array.from(root.children) as HTMLElement[];
    // Inner rings follow tightly, outer rings trail a little: a soft echo of the D mark.
    const pos = rings.map(() => ({ x: -100, y: -100 }));
    const target = { x: -100, y: -100 };
    let raf = 0;
    let visible = false;
    const click = makeClick();

    document.documentElement.classList.add(styles.hideNative);

    const frame = () => {
      rings.forEach((el, i) => {
        const k = reduce ? 1 : 0.55 - i * 0.03;
        pos[i].x += (target.x - pos[i].x) * k;
        pos[i].y += (target.y - pos[i].y) * k;
        el.style.transform = `translate3d(${pos[i].x}px, ${pos[i].y}px, 0)`;
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        pos.forEach((p) => ((p.x = target.x), (p.y = target.y)));
        root.dataset.visible = "true";
      }
      const el = e.target instanceof Element ? e.target.closest(INTERACTIVE) : null;
      root.dataset.hover = el ? "true" : "false";
    };
    const onLeave = () => {
      visible = false;
      root.dataset.visible = "false";
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      root.dataset.press = "true";
      click();
    };
    const onUp = () => {
      root.dataset.press = "false";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove(styles.hideNative);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.cursor} data-visible="false" data-hover="false" data-press="false" aria-hidden="true">
      {RINGS.map((ring, i) => (
        <span key={i} className={styles.ring} style={{ "--i": i } as React.CSSProperties}>
          <svg viewBox="-10 -10 20 20" width="20" height="20">
            <circle r={ring.r} fill="none" stroke="#fff" strokeWidth={0.5} opacity={ring.opacity} />
          </svg>
        </span>
      ))}
    </div>
  );
}
