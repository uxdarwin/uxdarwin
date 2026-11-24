"use client";

import { useRef } from "react";
import { companies } from "../content/companies";
import { experience, type Brand } from "../content/profile";
import { CoverbaseLogo, MercadoLibreColor, RedValleyLogo, ToptalLogo } from "./logos";
import { setCompany } from "./filter";
import { PanelPhoto } from "./PanelPhoto";
import { useStickyFit } from "./sticky";
import styles from "./feed.module.css";

/** Narrow side panel with short company context, shown while the feed is filtered to that company. */
export function CompanyPanel({ brand }: { brand: Brand }) {
  const ref = useRef<HTMLElement>(null);
  useStickyFit(ref);
  const c = companies[brand];
  const item = experience.find((e) => e.brand === brand);
  if (!c || !item) return null;

  return (
    <aside ref={ref} key={brand} className={styles.companyPanel} aria-label={`About my time at ${item.company}`}>
      <div className={styles.cpHead}>
        <span className={styles.cpMark} style={{ "--brand": `var(--brand-${brand})` } as React.CSSProperties}>
          <ColorLogo brand={brand} />
        </span>
        <div className={styles.cpName}>
          <h2>{item.company}</h2>
          <p>{c.where}</p>
          {c.domain && <p className={styles.cpDomain}>{c.domain}</p>}
        </div>
        <button
          type="button"
          className={styles.cpClose}
          onClick={() => setCompany(null)}
          aria-label="Close and show all projects"
          data-sound-hover=""
          data-cuelume-tap=""
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 7l10 10M17 7 7 17" stroke="currentColor" strokeWidth="1.25" />
          </svg>
        </button>
      </div>

      <p className={styles.cpAbout}>{c.about}</p>

      <ul className={styles.cpRoles}>
        {c.roles.map((r) => (
          <li key={r.title}>
            <span>{r.title}</span>
            <span className={styles.cpDates}>{r.dates}</span>
          </li>
        ))}
      </ul>

      <ul className={styles.cpPoints}>
        {c.points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>

      {c.photo && <PanelPhoto photo={c.photo} />}
    </aside>
  );
}

/** The brand-color logo, the same one the Experience row shows on hover. */
function ColorLogo({ brand }: { brand: Brand }) {
  switch (brand) {
    case "coverbase":
      return <CoverbaseLogo id="cp-coverbase" />;
    case "mercadolibre":
      return <MercadoLibreColor />;
    case "toptal":
      return <ToptalLogo />;
    case "redvalley":
      return <RedValleyLogo />;
    default:
      return null;
  }
}
