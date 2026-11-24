"use client";

import Link from "next/link";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { projects, type Project } from "../content/projects";
import { CompanyPanel } from "./CompanyPanel";
import { MotionGrid } from "./MotionGrid";
import { ProjectMeta } from "./ProjectMeta";
import { seeded, useCanDrag } from "./drag";
import { setCompany, useCompany } from "./filter";
import { experience } from "../content/profile";
import styles from "./feed.module.css";

const TILT_MAX = 2; // degrees
const CLICK_SLOP = 4; // px a press may move and still count as a click
const DESIGN_W = 1032; // feed width at 1440, from the title to the right edge

// Scattered layout: each card gets a seeded width and lands where it fits highest among a few
// seeded x positions (a skyline pack), so the feed reads as a loose pile, not a grid.
const WIDTHS_IMAGE = [380, 440, 500];
const WIDTHS_COVER = [290, 320, 350, 400];
const CANDIDATES = 6;
const GROUP_GAP = 120; // space before each new year
const YEAR_OVERLAP = 96;
const YEAR_W = 520; // width of the 200px mono year number // cards start this far below the top of the big year number

type Offset = { x: number; y: number };
type Box = { x: number; y: number; w: number; h: number };

/** Height before the browser has measured: header + description lines + media. */
function estimate(p: Project, w: number) {
  const lines = Math.max(1, Math.ceil((p.description.length * 8.2) / (w - 32)));
  const ratio = p.motion ? 0.5 + 8 / w : p.image ? p.image.height / p.image.width : 170 / 391;
  return 16 + 12 + 12 + lines * 19.2 + 16 + (w - 8) * ratio + 5;
}

function layout(list: Project[], width: number, heights: Record<string, { w: number; h: number }>, boost = 1) {
  const k = Math.max(0.62, Math.min(1, width / DESIGN_W)) * boost;
  const years = [...new Set(list.map((p) => p.year))].sort((a, b) => b - a);
  const boxes: Record<string, Box> = {};
  const yearTops: { year: number; top: number }[] = [];
  let floor = 0;

  years.forEach((year, gi) => {
    const top = gi === 0 ? 0 : floor + GROUP_GAP;
    yearTops.push({ year, top });
    const placed: Box[] = [];
    const start = top + YEAR_OVERLAP;
    list
      .filter((p) => p.year === year)
      .forEach((p, i) => {
        const set = p.image ? WIDTHS_IMAGE : WIDTHS_COVER;
        const base = set[Math.floor(((seeded(`${p.slug}-w`) + 1) / 2) * set.length) % set.length] * k;
        // Never narrower than 300px, never wider than about half the pile plus a bit.
        const w = Math.round(Math.min(Math.max(base, 300), width * (boost > 1 ? 0.66 : 0.6)));
        // Measured heights belong to the width the card had; rescale when it changes.
        const m = heights[p.slug];
        const h = m && Math.abs(m.w - w) < 2 ? m.h : estimate(p, w);
        const room = Math.max(0, width - w);
        // Skyline candidates: hug the edges, sit beside each placed card, or land somewhere
        // seeded. Each is jittered a little so columns never line up.
        const xs = [0, room, ...placed.flatMap((b) => [b.x + b.w + 28, b.x - w - 28])];
        for (let c = 0; c < CANDIDATES; c++) xs.push(((seeded(`${p.slug}-x${c}`) + 1) / 2) * room);
        let best: Box | null = null;
        xs.forEach((cx, c) => {
          if (cx < 0 || cx > room) return;
          const x = Math.round(Math.min(room, Math.max(0, cx + seeded(`${p.slug}-j${c}`) * 18)));
          const gap = 36 + ((seeded(`${p.slug}-g${c}`) + 1) / 2) * 40;
          // Cards clear of the big year number may start level with its top.
          const clearOfYear = x + w < width - YEAR_W * k;
          let y = clearOfYear ? top + 8 : start;
          for (const b of placed) {
            if (x < b.x + b.w + 24 && x + w > b.x - 24) y = Math.max(y, b.y + b.h + gap);
          }
          if (!best || y < best.y - 4) best = { x, y, w, h };
        });
        placed.push(best!);
        boxes[p.slug] = best!;
      });
    floor = Math.max(start + 60, ...placed.map((b) => b.y + b.h));
  });

  return { boxes, yearTops, height: floor };
}

export function ProjectsFeed() {
  const canDrag = useCanDrag();
  const [offsets, setOffsets] = useState<Record<string, Offset>>({});
  const [lifted, setLifted] = useState<string | null>(null);
  const [order, setOrder] = useState<string[]>([]); // last-touched cards sit on top
  const [width, setWidth] = useState(DESIGN_W);
  const [heights, setHeights] = useState<Record<string, { w: number; h: number }>>({});
  const [ready, setReady] = useState(false);
  const company = useCompany();
  const pileRef = useRef<HTMLDivElement>(null);

  // Measure the pile and every card, and re-pack when either changes.
  useLayoutEffect(() => {
    const pile = pileRef.current;
    if (!pile) return;
    const measure = () => {
      setWidth(pile.clientWidth);
      const next: Record<string, { w: number; h: number }> = {};
      pile.querySelectorAll<HTMLElement>("[data-slug]").forEach((el) => {
        next[el.dataset.slug!] = { w: el.offsetWidth, h: el.offsetHeight };
      });
      setHeights((prev) => {
        const same = Object.keys(next).every(
          (k) => prev[k] && Math.abs(prev[k].h - next[k].h) < 1 && Math.abs(prev[k].w - next[k].w) < 1,
        );
        return same ? prev : next;
      });
    };
    measure();
    // Animate re-packs only after the first real measurement, so the page doesn't slide on load.
    const t = window.setTimeout(() => setReady(true), 400);
    const ro = new ResizeObserver(measure);
    ro.observe(pile);
    pile.querySelectorAll("[data-slug]").forEach((el) => ro.observe(el));
    return () => {
      ro.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  // Filtering re-packs only the matching cards, a size up, so the feed stays full; the rest
  // fade out where they were.
  const visible = useMemo(() => (company ? projects.filter((p) => p.employer.brand === company) : projects), [company]);
  const full = useMemo(() => layout(projects, width, heights), [width, heights]);
  const shown = useMemo(
    () => (company ? layout(visible, width, heights, 1.22) : full),
    [company, visible, width, heights, full],
  );
  const { yearTops, height } = shown;
  const companyName = experience.find((e) => e.brand === company)?.company;

  const raise = useCallback((slug: string) => {
    setOrder((o) => [...o.filter((s) => s !== slug), slug]);
  }, []);

  return (
    <section className={styles.feed} aria-labelledby="projects-title">
      <header className={styles.pageHead}>
        <h1 id="projects-title" className={styles.title}>
          Projects
        </h1>
        {company && companyName && (
          <button type="button" className={styles.chip} onClick={() => setCompany(null)} data-cuelume-tap="" data-sound-hover="">
            <span>
              {companyName} · {visible.length} {visible.length === 1 ? "project" : "projects"}
            </span>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 7l10 10M17 7 7 17" stroke="currentColor" strokeWidth="1.25" />
            </svg>
            <span className={styles.srOnly}>Show all projects</span>
          </button>
        )}
      </header>
      <div className={styles.feedBody} data-panel={company ? "" : undefined}>
      <div ref={pileRef} className={styles.pile} data-ready={ready || undefined} style={{ height }}>
        {full.yearTops.map(({ year, top }) => {
          const at = yearTops.find((y) => y.year === year);
          return (
            <span
              key={year}
              className={styles.yearNumber}
              data-hidden={!at || undefined}
              style={{ top: at ? at.top : top }}
              aria-hidden="true"
            >
              {year}
            </span>
          );
        })}
        {full.yearTops.map(({ year }) => (
          <div key={year} className={styles.yearGroup} role="group" aria-label={String(year)}>
            {projects
              .filter((p) => p.year === year)
              .map((p) => (
                <ProjectCard
                  key={p.slug}
                  project={p}
                  box={shown.boxes[p.slug] ?? full.boxes[p.slug]}
                  hidden={!shown.boxes[p.slug]}
                  canDrag={canDrag}
                  offset={offsets[p.slug]}
                  lifted={lifted === p.slug}
                  z={order.indexOf(p.slug) + 2}
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
      {company && <CompanyPanel brand={company} />}
      </div>
    </section>
  );
}

function ProjectCard({
  project: p,
  box,
  hidden,
  canDrag,
  offset = { x: 0, y: 0 },
  lifted,
  z,
  onLift,
  onMove,
}: {
  project: Project;
  box: Box;
  hidden: boolean;
  canDrag: boolean;
  offset?: Offset;
  lifted: boolean;
  z: number;
  onLift: (on: boolean) => void;
  onMove: (o: Offset) => void;
}) {
  const tilt = (seeded(p.slug) * TILT_MAX).toFixed(2);
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
      data-slug={p.slug}
      data-draggable={canDrag || undefined}
      data-lifted={lifted || undefined}
      data-hidden={hidden || undefined}
      inert={hidden}
      aria-hidden={hidden || undefined}
      data-sound-hover=""
      data-cuelume-tap=""
      style={
        {
          "--tilt": `${tilt}deg`,
          "--dx": `${offset.x}px`,
          "--dy": `${offset.y}px`,
          left: box.x,
          top: box.y,
          width: box.w,
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
        {p.motion ? (
          <MotionGrid clips={p.motion} />
        ) : p.image ? (
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
