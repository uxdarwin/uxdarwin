import type { Brand } from "../content/profile";
import type { Project } from "../content/projects";
import { CoverbaseLogo, MercadoLibreMono, RainforestLogo, RedValleyLogo, ToptalLogo } from "./logos";
import styles from "./feed.module.css";

/** Employer logo in the muted 60% white of the meta line. */
function MetaLogo({ brand, id }: { brand: Brand; id: string }) {
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
      {withUrl && p.url && (
        <>
          <span aria-hidden="true">·</span>
          <a className={styles.metaLink} href={p.url} target="_blank" rel="noreferrer">
            {p.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          </a>
        </>
      )}
    </p>
  );
}
