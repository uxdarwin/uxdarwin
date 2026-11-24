"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createTunnel, LAYOUTS, PRESETS, type TunnelConfig } from "../lib/tunnel-strip";
import styles from "./TunnelStrip.module.css";

// Full-width carousel for project rows (Darwin's Tunnel Strip spec). The strip is drag-only;
// a click without a drag, or the caption, opens the project.

type Props = {
  variant?: "wide" | "card";
  images: string[];
  href: string;
  year: string;
  client: string;
  /** Card variant: a 14×12 mark before the client name. */
  icon?: ReactNode;
  title: string;
  config?: Partial<TunnelConfig>;
};

export function TunnelStrip({ variant = "wide", images, href, year, client, icon, title, config }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);
  const router = useRouter();
  const down = useRef<{ x: number; y: number } | null>(null);
  const key = images.join("|");
  const cfg = JSON.stringify(config ?? {});

  useEffect(() => {
    if (!stageRef.current || !canvasRef.current) return;
    const t = createTunnel(stageRef.current, canvasRef.current, {
      images: key.split("|"),
      layout: LAYOUTS[variant],
      config: { ...PRESETS[variant], ...JSON.parse(cfg) },
      onFallback: () => setFallback(true),
    });
    return () => t.destroy();
  }, [variant, key, cfg]);

  return (
    <section className={`${styles.root} ${styles[variant]}`} data-reveal="" data-sound-hover="">
      <div
        ref={stageRef}
        className={styles.stage}
        tabIndex={0}
        role="group"
        aria-label={`${client} project gallery. Drag, scroll sideways or use the arrow keys to move it.`}
        onPointerDown={(e) => (down.current = { x: e.clientX, y: e.clientY })}
        onClick={(e) => {
          const d = down.current;
          if (d && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 6) router.push(href);
        }}
      >
        {fallback ? (
          <img className={styles.fallback} src={images[0]} alt="" />
        ) : (
          <canvas ref={canvasRef} className={styles.canvas} />
        )}
      </div>
      <Link href={href} className={styles.cap} data-cuelume-tap="">
        <span className={styles.meta}>
          <b>{year}</b>
          <span aria-hidden="true">·</span>
          {variant === "card" && icon}
          <span>{client.toUpperCase()}</span>
        </span>
        <h3 className={styles.title}>{title}</h3>
      </Link>
    </section>
  );
}
