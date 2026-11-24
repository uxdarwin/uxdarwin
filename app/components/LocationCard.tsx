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

/** Dotted globe centered on Medellín, drawn with cobe (WebGL). */
function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let globe: { update: (s: Record<string, unknown>) => void; destroy: () => void } | null = null;
    let raf = 0;
    let cancelled = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { lat, lng } = profile.location;
    const basePhi = Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2);
    const theta = (lat * Math.PI) / 180;

    import("cobe").then(({ default: createGlobe }) => {
      if (cancelled) return;
      const size = canvas.offsetWidth;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      try {
        globe = createGlobe(canvas, {
          devicePixelRatio: dpr,
          width: size * dpr,
          height: size * dpr,
          phi: basePhi,
          theta,
          dark: 1,
          diffuse: 1.1,
          mapSamples: 26000,
          mapBrightness: 3.2,
          mapBaseBrightness: 0,
          baseColor: [0.28, 0.28, 0.32],
          markerColor: [1, 1, 1],
          glowColor: [0.06, 0.06, 0.09],
          markers: [{ location: [lat, lng], size: 0.045 }],
          opacity: 0.9,
        });
      } catch {
        return; // No WebGL: the card still reads fine without the globe.
      }
      canvas.dataset.ready = "true";
      if (reduce) return;
      const start = performance.now();
      const loop = (t: number) => {
        // Gentle sway around Medellín so the marker stays in view.
        globe?.update({ phi: basePhi + Math.sin((t - start) / 4000) * 0.35 });
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
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
  return (
    <section className={`${styles.card} ${styles.location}`} aria-label="Location">
      <Globe />
      <div className={styles.locationText}>
        <p className={styles.cardTitle}>{profile.location.label}</p>
        <LocalTime />
        <a className={styles.textLink} href={profile.linkedin} target="_blank" rel="noopener noreferrer">
          Discover more about me
        </a>
      </div>
    </section>
  );
}
