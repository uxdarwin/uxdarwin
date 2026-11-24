"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { projects, type Project } from "../content/projects";
import { MercadoLibreMono } from "./logos";
import styles from "./feed.module.css";

// Dragging needs a mouse-like pointer; on touch the page scrolls instead.
const DRAG_QUERY = "(hover: hover) and (pointer: fine)";

function useCanDrag() {
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
function seeded(key: string) {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) / 4294967295) * 2 - 1;
}

const TILT_MAX = 2; // degrees
const NUDGE_MAX = 20; // px, horizontal jitter so the columns don't read as a grid

type Offset = { x: number; y: number };

export function ProjectsFeed() {
  const canDrag = useCanDrag();
  const [offsets, setOffsets] = useState<Record<string, Offset>>({});
  const [lifted, setLifted] = useState<string | null>(null);
  const [order, setOrder] = useState<string[]>([]); // last-touched cards sit on top

  const years = [...new Set(projects.map((p) => p.year))].sort((a, b) => b - a);

  const raise = useCallback((slug: string) => {
    setOrder((o) => [...o.filter((s) => s !== slug), slug]);
  }, []);

  return (
    <section className={styles.feed} aria-labelledby="projects-title">
      <h2 id="projects-title" className={styles.title}>
        Projects
      </h2>
      {years.map((year) => {
        const items = projects.filter((p) => p.year === year);
        const cols: Project[][] = [[], []];
        items.forEach((p, i) => cols[i % 2].push(p));
        return (
          <div key={year} className={styles.year}>
            <span className={styles.yearNumber} aria-hidden="true">
              {year}
            </span>
            <h3 className={styles.srOnly}>{year}</h3>
            {cols.map((col, c) => (
              <div key={c} className={styles.column} data-col={c}>
                {col.map((p) => (
                  <ProjectCard
                    key={p.slug}
                    project={p}
                    canDrag={canDrag}
                    offset={offsets[p.slug]}
                    lifted={lifted === p.slug}
                    z={order.indexOf(p.slug) + 1}
                    onLift={(on) => {
                      setLifted(on ? p.slug : null);
                      if (on) raise(p.slug);
                    }}
                    onMove={(o) => setOffsets((all) => ({ ...all, [p.slug]: o }))}
                  />
                ))}
              </div>
            ))}
          </div>
        );
      })}
    </section>
  );
}

function ProjectCard({
  project: p,
  canDrag,
  offset = { x: 0, y: 0 },
  lifted,
  z,
  onLift,
  onMove,
}: {
  project: Project;
  canDrag: boolean;
  offset?: Offset;
  lifted: boolean;
  z: number;
  onLift: (on: boolean) => void;
  onMove: (o: Offset) => void;
}) {
  const tilt = (seeded(p.slug) * TILT_MAX).toFixed(2);
  const nudge = Math.round(seeded(`${p.slug}-x`) * NUDGE_MAX);
  const drag = useRef<{ id: number; sx: number; sy: number; ox: number; oy: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (!canDrag || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: offset.x, oy: offset.y };
    onLift(true);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    onMove({ x: d.ox + e.clientX - d.sx, y: d.oy + e.clientY - d.sy });
  };
  const end = (e: React.PointerEvent<HTMLElement>) => {
    if (!drag.current || drag.current.id !== e.pointerId) return;
    drag.current = null;
    onLift(false);
  };

  return (
    <article
      className={styles.card}
      data-draggable={canDrag || undefined}
      data-lifted={lifted || undefined}
      data-sound-hover
      tabIndex={0}
      aria-label={`${p.client}, ${p.year}. ${p.description}`}
      style={
        {
          "--tilt": `${tilt}deg`,
          "--nudge": `${nudge}px`,
          "--dx": `${offset.x}px`,
          "--dy": `${offset.y}px`,
          zIndex: lifted ? 100 : z,
        } as React.CSSProperties
      }
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={end}
      onPointerCancel={end}
    >
      <div className={styles.head}>
        <p className={styles.meta}>
          <span className={styles.metaYear}>{p.year}</span>
          <span aria-hidden="true">·</span>
          <span className={styles.employer}>
            {p.employer.brand === "mercadolibre" && <MercadoLibreMono className={styles.logo} />}
            {p.employer.label}
          </span>
          <span aria-hidden="true">·</span>
          <span>{p.client}</span>
        </p>
        <p className={styles.description}>{p.description}</p>
      </div>
      <div className={styles.media}>
        <img
          className={styles.image}
          src={p.image.src}
          alt={p.image.alt}
          width={p.image.width}
          height={p.image.height}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
        <div className={styles.teaser}>
          <span>{p.teaser}</span>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={styles.arrow}>
            <path d="M7 17 17 7M7 7h10v10" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
      </div>
    </article>
  );
}
