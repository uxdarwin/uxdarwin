"use client";

import Link from "next/link";
import { useLayoutEffect, useMemo, useRef } from "react";
import { media, type MediaTile } from "../content/media";
import { projects, type Project, type ProjectImage } from "../content/projects";
import { CompanyPanel } from "./CompanyPanel";
import { Lottie } from "./Lottie";
import { MotionGrid } from "./MotionGrid";
import { MetaLogo } from "./ProjectMeta";
import { seeded } from "./drag";
import { useCompany } from "./filter";
import { useReveal } from "./reveal";
import styles from "./feed.module.css";

// Rows from Figma 79:13196, newest first. Seven row types:
//   three        three cards, square covers
//   cardMedia    a card (one third) and a wide photo (two thirds)
//   mediaCard    the same, mirrored
//   strip        one project across the row, its images in a strip that bleeds off both edges
//   two          two cards, wide covers
//   wideMedia    a wide card (two thirds) and a tall photo (one third)
//   mediaWide    the same, mirrored
// Projects with several images take a strip row; the rest follow PATTERN, which drops a photo
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

/** The images a strip row shows: Lottie clips, or the cover followed by the story images. */
function stripOf(p: Project): { motion?: Project["motion"]; images?: ProjectImage[] } | null {
  if (p.motion && p.motion.length > 1) return { motion: p.motion };
  const seen = new Set<string>();
  const images = [p.image, ...p.story.flatMap((b) => (b.type === "images" ? b.items : []))].filter(
    (i): i is ProjectImage => !!i && !seen.has(i.src) && !!seen.add(i.src),
  );
  return images.length >= 3 ? { images } : null;
}

function rowsOf(list: Project[], pool: MediaTile[]): Row[] {
  const left = { wide: pool.filter((m) => m.kind === "wide"), narrow: pool.filter((m) => m.kind === "narrow") };
  const rows: Row[] = [];
  let i = 0;
  let step = 0;
  while (i < list.length) {
    if (stripOf(list[i])) {
      rows.push({ type: "strip", projects: [list[i++]] });
      continue;
    }
    // Cards available before the next strip project.
    let room = 0;
    while (i + room < list.length && !stripOf(list[i + room])) room++;

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
                <StripCard project={row.projects[0]} />
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
  return (
    <figure className={styles.media} data-reveal="">
      <img
        src={tile.src}
        alt={tile.alt}
        width={tile.width}
        height={tile.height}
        loading="lazy"
        decoding="async"
        draggable={false}
        style={tile.focus ? { objectPosition: tile.focus } : undefined}
      />
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

/**
 * One project across the row (Figma row 4): its images sit in a strip that bleeds off both
 * edges, starts centered and can be dragged sideways (or swiped) to see the rest.
 */
function StripCard({ project: p }: { project: Project }) {
  const strip = stripOf(p)!;
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const center = () => (el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2);
    center();
    const ro = new ResizeObserver(center);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!el || e.pointerType !== "mouse" || e.button !== 0) return;
    const x0 = e.clientX;
    const s0 = el.scrollLeft;
    dragged.current = false;
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - x0;
      if (Math.abs(dx) > 4) dragged.current = true;
      el.scrollLeft = s0 - dx;
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const frames = strip.motion ? strip.motion.length : strip.images!.length;

  return (
    <Link
      href={`/projects/${p.slug}`}
      className={`${styles.card} ${styles.stripCard}`}
      draggable={false}
      data-reveal=""
      data-sound-hover=""
      data-cuelume-tap=""
      onClickCapture={(e) => {
        if (dragged.current) {
          e.preventDefault();
          dragged.current = false;
        }
      }}
    >
      <div className={styles.stripWrap}>
        <div ref={scrollRef} className={styles.strip} style={{ "--frames": frames } as React.CSSProperties} onPointerDown={onPointerDown}>
          {strip.motion
            ? strip.motion.map((c) => (
                <div key={c.src} className={`${styles.frame} ${styles.motionFrame}`} style={tiltOf(c.src)} data-icon={c.width === c.height || undefined}>
                  <Lottie src={c.src} label={`${c.label} animation`} className={styles.motionPlayer} />
                </div>
              ))
            : strip.images!.map((im) => (
                <div key={im.src} className={styles.frame} style={tiltOf(im.src)}>
                  <img src={im.src} alt={im.alt} width={im.width} height={im.height} loading="lazy" decoding="async" draggable={false} />
                </div>
              ))}
        </div>
        <Teaser text={p.teaser} />
      </div>
      <CardText project={p} />
    </Link>
  );
}
