"use client";

import { useEffect, useRef } from "react";
import styles from "./feed.module.css";

// Screen recording on a project page: plays only on screen, never with reduced motion.
export function PageVideo({ src, poster, alt, width, height }: { src: string; poster: string; alt: string; width: number; height: number }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <figure className={`${styles.pageVideo} ${height > width ? styles.pageVideoTall : ""}`} data-reveal="">
      <video ref={ref} src={src} poster={poster} muted loop playsInline preload="metadata" width={width} height={height} aria-label={alt} />
    </figure>
  );
}
