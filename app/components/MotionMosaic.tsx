"use client";

import { useEffect, useRef } from "react";
import type { PageVideoSrc } from "../content/projects";
import styles from "./feed.module.css";

/** One muted loop that plays only on screen and never with reduced motion (the poster stays). */
function Clip({ v }: { v: PageVideoSrc }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? el.play().catch(() => {}) : el.pause()), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      className={styles.mosaicClip}
      style={{ flexGrow: v.width / v.height }}
      src={v.src}
      poster={v.poster}
      width={v.width}
      height={v.height}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={v.alt}
    />
  );
}

/** Four screen animations in two rows of equal height (Darwin's layout): square and wide on top,
    wide and square below. */
export function MotionMosaic({ clips, size = "card" }: { clips: PageVideoSrc[]; size?: "card" | "page" }) {
  const rows = [clips.slice(0, 2), clips.slice(2, 4)];
  return (
    <div className={styles.mosaic} data-size={size}>
      {rows.map((r, i) => (
        <div key={i} className={styles.mosaicRow}>
          {r.map((v) => (
            <Clip key={v.src} v={v} />
          ))}
        </div>
      ))}
    </div>
  );
}
