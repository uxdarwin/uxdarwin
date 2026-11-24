"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { projects, type Project } from "../content/projects";
import { ProjectMeta } from "./ProjectMeta";
import { seeded, useCanDrag } from "./drag";
import styles from "./feed.module.css";

const TILT_MAX = 2; // degrees
const NUDGE_MAX = 20; // px, horizontal jitter so the columns don't read as a grid
const CLICK_SLOP = 4; // px a press may move and still count as a click

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
      <header className={styles.pageHead}>
        <h1 id="projects-title" className={styles.title}>
          Projects
        </h1>
      </header>
      {years.map((year) => {
        const items = projects.filter((p) => p.year === year);
        const cols: Project[][] = [[], []];
        items.forEach((p, i) => cols[i % 2].push(p));
        return (
          <div key={year} className={styles.year}>
            <span className={styles.yearNumber} aria-hidden="true">
              {year}
            </span>
            <h2 className={styles.srOnly}>{year}</h2>
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
  const drag = useRef<{ id: number; sx: number; sy: number; ox: number; oy: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (!canDrag || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: offset.x, oy: offset.y, moved: false };
    suppressClick.current = false;
    onLift(true);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (!d.moved && Math.hypot(dx, dy) < CLICK_SLOP) return;
    d.moved = true;
    onMove({ x: d.ox + dx, y: d.oy + dy });
  };
  const end = (e: React.PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    suppressClick.current = d.moved; // a drag is not a click
    drag.current = null;
    onLift(false);
  };

  return (
    <Link
      href={`/projects/${p.slug}`}
      className={styles.card}
      draggable={false}
      data-draggable={canDrag || undefined}
      data-lifted={lifted || undefined}
      data-sound-hover=""
      data-cuelume-tap=""
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
      onClick={(e) => {
        if (suppressClick.current) {
          e.preventDefault();
          suppressClick.current = false;
        }
      }}
    >
      <div className={styles.head}>
        <ProjectMeta project={p} />
        <p className={styles.description}>{p.description}</p>
      </div>
      <div className={styles.media}>
        {p.image ? (
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
        ) : (
          <div className={styles.cover} data-brand={p.employer.brand ?? "none"} aria-hidden="true">
            <span>{p.client}</span>
          </div>
        )}
        <div className={styles.teaser}>
          <span>{p.teaser}</span>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={styles.arrow}>
            <path d="M7 17 17 7M7 7h10v10" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
