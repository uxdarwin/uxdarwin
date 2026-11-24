"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "../content/profile";
import styles from "./panel.module.css";

const timeFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: profile.location.timeZone,
  hour: "numeric",
  minute: "2-digit",
});

function LocalTime() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      setNow(new Date());
      t = setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50);
    };
    tick();
    return () => clearTimeout(t);
  }, []);
  return (
    <time className={styles.time} dateTime={now.toISOString()} suppressHydrationWarning>
      {timeFormat.format(now)}
      <span className="sr-only"> local time in Medellín</span>
    </time>
  );
}

type GlobeHandle = { update: (s: Record<string, unknown>) => void; destroy: () => void };

// Resting pose: the globe sits turned a little away, with a dim marker. On hover it
// spins Medellín into view and the marker lights up (after dannpetty.com's card).
const REST = { phi: -0.45, theta: -0.2, marker: 0.04, light: 0.6 };
const FOCUS = { phi: 0, theta: 0, marker: 0.06, light: 1 };

/** Dotted globe centered on Medellín, drawn with cobe (WebGL). */
function Globe({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const kick = useRef<() => void>(() => {});

  useEffect(() => {
    activeRef.current = active;
    kick.current();
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let globe: GlobeHandle | null = null;
    let raf = 0;
    let cancelled = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { lat, lng } = profile.location;
    const basePhi = Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2);
    const baseTheta = (lat * Math.PI) / 180;

    // Spring state per channel.
    const keys = ["phi", "theta", "marker", "light"] as const;
    const pos = { ...REST };
    const vel = { phi: 0, theta: 0, marker: 0, light: 0 };

    const pose = () => ({
      phi: basePhi + pos.phi,
      theta: baseTheta + pos.theta,
      markers: [
        { location: [lat, lng], size: pos.marker, color: [pos.light, pos.light, pos.light] },
      ],
    });

    let last = 0;
    let warmUntil = 0;
    const step = (t: number) => {
      const dt = Math.min((t - (last || t)) / 1000, 1 / 30);
      last = t;
      const target = activeRef.current ? FOCUS : REST;
      let moving = false;
      for (const k of keys) {
        if (reduce) {
          pos[k] = target[k];
          continue;
        }
        // Critically-damped-ish spring: quick, no wobble.
        const a = 90 * (target[k] - pos[k]) - 17 * vel[k];
        vel[k] += a * dt;
        pos[k] += vel[k] * dt;
        if (Math.abs(target[k] - pos[k]) > 1e-4 || Math.abs(vel[k]) > 1e-4) moving = true;
      }
      globe?.update(pose());
      // Keep drawing briefly after load so the map texture shows once it arrives.
      if (t < warmUntil) moving = true;
      raf = moving ? requestAnimationFrame(step) : 0;
      if (!moving) last = 0;
    };
    kick.current = () => {
      if (globe && !raf) raf = requestAnimationFrame(step);
    };

    import("cobe").then(({ default: createGlobe }) => {
      if (cancelled) return;
      const size = canvas.offsetWidth;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      try {
        globe = createGlobe(canvas, {
          devicePixelRatio: dpr,
          width: size * dpr,
          height: size * dpr,
          ...pose(),
          dark: 1,
          diffuse: 1.2,
          mapSamples: 16000,
          mapBrightness: 4,
          mapBaseBrightness: 0,
          baseColor: [0.32, 0.32, 0.35],
          markerColor: [1, 1, 1],
          glowColor: [0.05, 0.05, 0.07],
          opacity: 0.85,
        } as Parameters<typeof createGlobe>[1]);
      } catch {
        return; // No WebGL: the card still reads fine without the globe.
      }
      canvas.dataset.ready = "true";
      warmUntil = performance.now() + 2500;
      kick.current();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      globe?.destroy();
    };
  }, []);

  return (
    <div className={styles.globeWrap} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.globe} />
    </div>
  );
}

export function LocationCard() {
  const [active, setActive] = useState(false);
  return (
    <section
      className={`${styles.card} ${styles.location}`}
      aria-label="Location"
      data-sound-hover=""
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <Globe active={active} />
      <div className={styles.locationText}>
        <p className={styles.cardTitle}>{profile.location.label}</p>
        <LocalTime />
        <a className={styles.textLink} href={profile.linkedin} target="_blank" rel="noopener noreferrer" data-cuelume-tap="">
          Discover more about me
        </a>
      </div>
    </section>
  );
}
