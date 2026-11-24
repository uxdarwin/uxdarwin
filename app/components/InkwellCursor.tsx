"use client";

import { useEffect, useRef } from "react";

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

// Universal pointer tracker. Writes --x/--y/--angle/--speed and toggles .is-active
// (pointer inside) and .is-near (near centre). The box covers the viewport and lets
// pointer events through, so it listens on the window. Everything else is CSS.
function bindCursor(box: HTMLElement) {
  let lx = 0, ly = 0, has = false;
  let idle: ReturnType<typeof setTimeout> | undefined;
  const set = (p: string, v: string) => box.style.setProperty(p, v);
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const r = box.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    if (has) {
      const dx = x - lx, dy = y - ly, d = Math.hypot(dx, dy);
      if (d > 0.5) set("--angle", Math.atan2(dy, dx).toFixed(3) + "rad");
      set("--speed", Math.min(1, d / 32).toFixed(3));
    }
    set("--x", x.toFixed(1) + "px");
    set("--y", y.toFixed(1) + "px");
    box.classList.toggle("is-near", Math.hypot(x - r.width / 2, y - r.height / 2) < 60);
    box.classList.add("is-active");
    lx = x; ly = y; has = true;
    clearTimeout(idle);
    idle = setTimeout(() => set("--speed", "0"), 120); // relax when the pointer stops
  };
  const onLeave = () => {
    box.classList.remove("is-active", "is-near");
    set("--speed", "0");
    has = false;
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  return () => {
    clearTimeout(idle);
    window.removeEventListener("pointermove", onMove);
    document.documentElement.removeEventListener("pointerleave", onLeave);
  };
}

export function InkwellCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = ref.current;
    if (!box || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const html = document.documentElement;
    html.classList.add("has-cur");
    const unbind = bindCursor(box);
    const click = makeClick();
    const onDown = (e: PointerEvent) => e.pointerType === "mouse" && click();
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      unbind();
      html.classList.remove("has-cur");
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <div ref={ref} className="cur cur-blend" data-cursor="blend" aria-hidden="true">
      <i className="cursor" style={{ "--i": 0 } as React.CSSProperties} />
    </div>
  );
}
