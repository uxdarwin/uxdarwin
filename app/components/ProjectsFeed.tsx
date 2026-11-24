"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { media, type MediaTile } from "../content/media";
import { projects, type Project } from "../content/projects";
import { CompanyPanel } from "./CompanyPanel";
import { MotionGrid } from "./MotionGrid";
import { MetaLogo } from "./ProjectMeta";
import { seeded } from "./drag";
import { useCompany } from "./filter";
import { TunnelStrip } from "./TunnelStrip";
import { useReveal } from "./reveal";
import styles from "./feed.module.css";

// Rows from Figma 79:13196, newest first. Seven row types:
//   three        three cards, square covers
//   cardMedia    a card (one third) and a wide photo (two thirds)
//   mediaCard    the same, mirrored
//   strip        one project across the row as a Tunnel Strip carousel (5+ images)
//   two          two cards, wide covers
//   wideMedia    a wide card (two thirds) and a tall photo (one third)
//   mediaWide    the same, mirrored
// Projects with a carousel of 5+ images take a strip row; the rest follow PATTERN, which drops a photo
// row once its kind of photo runs out. Covers are cropped to their frames.

type RowType = "three" | "two" | "cardMedia" | "mediaCard" | "wideMedia" | "mediaWide" | "strip" | "single";
type Row = { type: RowType; projects: Project[]; media?: MediaTile };

const PATTERN: RowType[] = ["three", "cardMedia", "two", "wideMedia", "three", "mediaCard", "two", "mediaWide"];
const NEED: Record<RowType, number> = { three: 3, two: 2, cardMedia: 1, mediaCard: 1, wideMedia: 1, mediaWide: 1, strip: 1, single: 1 };
const MEDIA_KIND: Partial<Record<RowType, MediaTile["kind"]>> = {
  cardMedia: "wide",
  mediaCard: "wide",
  wideMedia: "narrow",
  mediaWide: "narrow",
};

/** Carousel rows need at least 5 images (Darwin's rule); fewer and the project is a card. */
const MIN_CAROUSEL = 5;
const isCarousel = (p: Project) => (p.carousel?.length ?? 0) >= MIN_CAROUSEL;

function rowsOf(list: Project[], pool: MediaTile[]): Row[] {
  const left = { wide: pool.filter((m) => m.kind === "wide"), narrow: pool.filter((m) => m.kind === "narrow") };
  const rows: Row[] = [];
  let i = 0;
  let step = 0;
  while (i < list.length) {
    if (isCarousel(list[i])) {
      rows.push({ type: "strip", projects: [list[i++]] });
      continue;
    }
    // Cards available before the next strip project.
    let room = 0;
    while (i + room < list.length && !isCarousel(list[i + room])) room++;

    let type: RowType | null = null;
    for (let tries = 0; tries < PATTERN.length && !type; tries++, step++) {
      const t = PATTERN[step % PATTERN.length];
      const kind = MEDIA_KIND[t];
      if (kind && !left[kind].length) continue;
      if (NEED[t] > room) continue;
      // Never leave a lone card before a strip or the end when no photo can pair with it.
      if (room - NEED[t] === 1 && !left.wide.length && !left.narrow.length) continue;
      type = t;
    }
    if (!type) {
      // Not enough cards left for the next row: pair one with a photo if any remain, else
      // two side by side, else one across the row.
      if (room >= 2) type = "two";
      else if (left.wide.length) type = "cardMedia";
      else if (left.narrow.length) type = "wideMedia";
      else type = "single";
    }
    const kind = MEDIA_KIND[type];
    rows.push({ type, projects: list.slice(i, i + NEED[type]), media: kind ? left[kind].shift() : undefined });
    i += NEED[type];
  }
  return rows;
}

export function ProjectsFeed() {
  const company = useCompany();

  const rows = useMemo(() => {
    const list = company ? projects.filter((p) => p.employer.brand === company) : projects;
    // A filtered feed skips team photos: the company panel beside it already shows its own.
    const pool = company ? media.filter((m) => !m.brand) : media;
    return rowsOf(list, pool);
  }, [company]);

  const gridRef = useRef<HTMLDivElement>(null);
  useReveal(gridRef, company ?? "all");

  return (
    <section className={styles.feed} aria-label="Projects">
      <div className={styles.feedBody} data-panel={company ? "" : undefined}>
        <div ref={gridRef} className={styles.rows}>
          {rows.map((row) => (
            <div key={row.projects[0].slug} className={styles.row} data-type={row.type}>
              {row.type === "strip" ? (
                <CarouselRow project={row.projects[0]} />
              ) : (
                <>
                  {(row.type === "mediaCard" || row.type === "mediaWide") && row.media && <Media tile={row.media} />}
                  {row.projects.map((p) => (
                    <ProjectCard key={p.slug} project={p} />
                  ))}
                  {(row.type === "cardMedia" || row.type === "wideMedia") && row.media && <Media tile={row.media} />}
                </>
              )}
            </div>
          ))}
        </div>
        {company && <CompanyPanel key={company} brand={company} />}
      </div>
    </section>
  );
}

function Media({ tile }: { tile: MediaTile }) {
  const ref = useRef<HTMLVideoElement>(null);

  // Clips play only on screen, and never with reduced motion (the poster stays).
  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()));
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const pos = tile.focus ? { objectPosition: tile.focus } : undefined;
  return (
    <figure className={styles.media} data-reveal="" data-sound-hover={tile.caption ? "" : undefined}>
      {tile.video ? (
        <video ref={ref} src={tile.video} poster={tile.src} muted loop playsInline preload="metadata" aria-label={tile.alt} style={pos} />
      ) : (
        <img src={tile.src} alt={tile.alt} width={tile.width} height={tile.height} loading="lazy" decoding="async" draggable={false} style={pos} />
      )}
      {tile.caption && <figcaption className={styles.mediaCaption}>{tile.caption}</figcaption>}
    </figure>
  );
}

function Teaser({ text }: { text: string }) {
  return (
    <div className={styles.teaser}>
      <span>{text}</span>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={styles.arrow}>
        <path d="M7 17 17 7M7 7h10v10" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  );
}

function CardText({ project: p }: { project: Project }) {
  return (
    <div className={styles.cardText}>
      <p className={styles.cardMeta}>
        <span className={styles.metaYear}>{p.year}</span>
        <span aria-hidden="true">·</span>
        <span className={styles.employer}>
          {p.employer.brand && <MetaLogo brand={p.employer.brand} id={`card-${p.slug}`} />}
          {p.employer.label}
        </span>
      </p>
      <h3 className={styles.cardTitle}>{p.description}</h3>
    </div>
  );
}

const tiltOf = (key: string) => ({ "--tilt": `${seeded(key).toFixed(2)}deg` }) as React.CSSProperties;

function ProjectCard({ project: p }: { project: Project }) {
  return (
    <Link href={`/projects/${p.slug}`} className={styles.card} style={tiltOf(p.slug)} data-reveal="" data-sound-hover="" data-cuelume-tap="">
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
        <Teaser text={p.teaser} />
      </div>
      <CardText project={p} />
    </Link>
  );
}

function CarouselRow({ project: p }: { project: Project }) {
  return (
    <TunnelStrip
      variant="wide"
      images={p.carousel!}
      href={`/projects/${p.slug}`}
      year={String(p.year)}
      client={p.client}
      title={p.description}
    />
  );
}
