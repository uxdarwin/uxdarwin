"use client";

import Link from "next/link";
import { Fragment, useLayoutEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { projects, type Project } from "../content/projects";
import { CompanyPanel } from "./CompanyPanel";
import { MotionGrid } from "./MotionGrid";
import { MetaLogo } from "./ProjectMeta";
import { useCompany } from "./filter";
import { YearTile } from "./YearTile";
import { useEdgeWarp } from "./edgeWarp";
import styles from "./feed.module.css";

// Grid from Figma 75:12973: three columns (two beside the company panel or on tablets, one on
// phones), newest first across the rows, a blue year tile ahead of each year's projects.

type Item = { kind: "year"; year: number } | { kind: "project"; project: Project };

const keyOf = (it: Item) => (it.kind === "year" ? `year-${it.year}` : it.project.slug);

/** Height of an item relative to the column width, for balancing the columns before measuring. */
function estimate(it: Item) {
  if (it.kind === "year") return 240 / 360;
  const p = it.project;
  const ratio = p.motion ? 0.56 : p.image ? p.image.height / p.image.width : 0.62;
  return (ratio * 312 + 110) / 360;
}

// Relative scroll speed of each column. Columns get content in proportion, so a faster column is
// a longer one, and the parallax below can start and end every column together.
const SPEEDS: Record<number, number[]> = { 1: [1], 2: [1, 1.16], 3: [1, 1.2, 1.1] };

/** Each item goes into the column with the most room left for its speed, in reading order. */
function columnsOf(items: Item[], cols: number) {
  const out: { it: Item; i: number }[][] = Array.from({ length: cols }, () => []);
  const h = new Array(cols).fill(0);
  const speed = SPEEDS[cols];
  items.forEach((it, i) => {
    let c = 0;
    for (let k = 1; k < cols; k++) if (h[k] / speed[k] < h[c] / speed[c] - 0.05) c = k;
    out[c].push({ it, i });
    h[c] += estimate(it);
  });
  return out;
}

// Column count follows the viewport; the server renders three.
const queries = ["(max-width: 639px)", "(max-width: 1023px)"];
function subscribe(cb: () => void) {
  const mqs = queries.map((q) => window.matchMedia(q));
  mqs.forEach((m) => m.addEventListener("change", cb));
  return () => mqs.forEach((m) => m.removeEventListener("change", cb));
}
function viewport() {
  if (window.matchMedia(queries[0]).matches) return "phone";
  if (window.matchMedia(queries[1]).matches) return "tablet";
  return "desktop";
}

export function ProjectsFeed() {
  const company = useCompany();
  const size = useSyncExternalStore(subscribe, viewport, () => "desktop" as const);
  const cols = size === "phone" ? 1 : size === "tablet" || company ? 2 : 3;

  const items = useMemo(() => {
    const list = company ? projects.filter((p) => p.employer.brand === company) : projects;
    const years = [...new Set(list.map((p) => p.year))].sort((a, b) => b - a);
    return years.flatMap<Item>((year) => [
      { kind: "year", year },
      ...list.filter((p) => p.year === year).map((project) => ({ kind: "project" as const, project })),
    ]);
  }, [company]);
  const columns = useMemo(() => columnsOf(items, cols), [items, cols]);

  const gridRef = useRef<HTMLDivElement>(null);
  useParallax(gridRef, `${cols}-${company}`);
  useEdgeWarp(gridRef, `${cols}-${company}`);

  return (
    <section className={styles.feed} aria-label="Projects">
      <div className={styles.feedBody} data-panel={company ? "" : undefined}>
        <div ref={gridRef} className={styles.grid} style={{ "--cols": cols } as React.CSSProperties}>
          {columns.map((col, c) => (
            <div key={c} className={styles.column}>
              {col.map(({ it, i }) => (
                <Fragment key={keyOf(it)}>
                  {it.kind === "year" ? (
                    <YearTile year={it.year} order={i} />
                  ) : (
                    <ProjectCard project={it.project} order={i} />
                  )}
                </Fragment>
              ))}
            </div>
          ))}
        </div>
        {company && <CompanyPanel key={company} brand={company} />}
      </div>
    </section>
  );
}

/**
 * Columns scroll at different speeds: the grid is as tall as its shortest column, and the taller
 * ones travel faster so every column starts at the top and ends at the bottom together.
 */
function useParallax(ref: React.RefObject<HTMLDivElement | null>, key: string) {
  useLayoutEffect(() => {
    const grid = ref.current;
    if (!grid) return;
    const cols = [...grid.children] as HTMLElement[];
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let heights: number[] = [];
    let short = 0;
    let frame = 0;

    const apply = () => {
      frame = 0;
      if (cols.length < 2 || still.matches) return;
      const rect = grid.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const range = Math.max(1, top + short - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / range));
      cols.forEach((col, i) => {
        col.style.transform = `translate3d(0, ${(-(heights[i] - short) * p).toFixed(1)}px, 0)`;
      });
    };
    const measure = () => {
      cols.forEach((col) => (col.style.transform = ""));
      grid.style.height = "";
      if (cols.length < 2 || still.matches) return;
      heights = cols.map((c) => c.offsetHeight);
      short = Math.min(...heights);
      grid.style.height = `${short}px`;
      apply();
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    measure();
    const ro = new ResizeObserver(measure);
    cols.forEach((c) => ro.observe(c));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    still.addEventListener("change", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      still.removeEventListener("change", measure);
      cancelAnimationFrame(frame);
      cols.forEach((col) => (col.style.transform = ""));
      grid.style.height = "";
    };
  }, [ref, key]);
}

function ProjectCard({ project: p, order }: { project: Project; order: number }) {
  return (
    <Link href={`/projects/${p.slug}`} className={styles.card} style={{ order }} data-warp="" data-sound-hover="" data-cuelume-tap="">
      <div className={styles.thumb}>
        {p.motion ? (
          <MotionGrid clips={p.motion.slice(0, 4)} />
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
      <p className={styles.cardMeta}>
        <span className={styles.metaYear}>{p.year}</span>
        <span aria-hidden="true">·</span>
        <span className={styles.employer}>
          {p.employer.brand && <MetaLogo brand={p.employer.brand} id={`card-${p.slug}`} />}
          {p.employer.label}
        </span>
      </p>
      <h3 className={styles.cardTitle}>{p.description}</h3>
    </Link>
  );
}
