"use client";

import type { Brand } from "../content/profile";
import type { Project } from "../content/projects";
import { CoverbaseLogo, MercadoLibreMono, RainforestLogo, RedValleyLogo, ToptalLogo } from "./logos";
import styles from "./feed.module.css";

/** Employer logo in the muted 60% white of the meta line. */
export function MetaLogo({ brand, id }: { brand: Brand; id: string }) {
  switch (brand) {
    case "mercadolibre":
      return <MercadoLibreMono className={styles.logo} />;
    case "coverbase":
      return <CoverbaseLogo id={`meta-${id}`} className={`${styles.logo} ${styles.logoFlat}`} />;
    case "toptal":
      return <ToptalLogo className={`${styles.logo} ${styles.logoFlat}`} />;
    case "redvalley":
      return <RedValleyLogo className={`${styles.logo} ${styles.logoFlat}`} />;
    case "rainforest":
      return <RainforestLogo className={`${styles.logo} ${styles.logoFlat}`} />;
    default:
      return null;
  }
}

const domain = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/.*$/, "");

/** "2026 · [logo] EMPLOYER · CLIENT [· URL]" in Geist Mono caps. */
export function ProjectMeta({ project: p, withUrl = false }: { project: Project; withUrl?: boolean }) {
  return (
    <p className={styles.meta}>
      <span className={styles.metaYear}>{p.year}</span>
      <span aria-hidden="true">·</span>
      <span className={styles.employer}>
        {p.employer.brand && <MetaLogo brand={p.employer.brand} id={p.slug} />}
        {p.employer.label}
      </span>
      <span aria-hidden="true">·</span>
      <span>{p.client}</span>
      {p.url && (
        <>
          <span aria-hidden="true">·</span>
          {withUrl ? (
            <a className={styles.metaLink} href={p.url} target="_blank" rel="noreferrer">
              {domain(p.url)}
              <LiveArrow />
            </a>
          ) : (
            // Cards are links already, so the live site opens from a span (no nested anchors).
            <span
              role="link"
              tabIndex={0}
              className={styles.metaLink}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(p.url, "_blank", "noreferrer");
              }}
              onPointerDown={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                e.preventDefault();
                e.stopPropagation();
                window.open(p.url, "_blank", "noreferrer");
              }}
              aria-label={`Open ${domain(p.url)} in a new tab`}
            >
              {domain(p.url)}
              <LiveArrow />
            </span>
          )}
        </>
      )}
    </p>
  );
}

function LiveArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={styles.metaArrow}>
      <path d="M7 17 17 7M7 7h10v10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
