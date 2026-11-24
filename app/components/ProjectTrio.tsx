"use client";

import { useEffect, useRef } from "react";
import type { PageVideoSrc, ProjectImage } from "../content/projects";
import styles from "./feed.module.css";

// Two tilted, overlapping images with a portrait video between them (Darwin's Parque Caudal mock).
// The video plays only on screen and never with reduced motion.
export function ProjectTrio({ left, video, right }: { left: ProjectImage; video: PageVideoSrc; right: ProjectImage }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <figure className={styles.trio} data-reveal="">
      <img className={styles.trioLeft} src={left.src} alt={left.alt} width={left.width} height={left.height} decoding="async" draggable={false} />
      <img className={styles.trioRight} src={right.src} alt={right.alt} width={right.width} height={right.height} decoding="async" draggable={false} />
      <video
        ref={ref}
        className={styles.trioVideo}
        src={video.src}
        poster={video.poster}
        width={video.width}
        height={video.height}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={video.alt}
      />
    </figure>
  );
}
