"use client";

import { useRef, useState } from "react";
import { experience } from "../content/profile";
import { BrandMark } from "./BrandMark";
import { CvModal } from "./CvModal";
import { FileTextIcon } from "./logos";
import styles from "./panel.module.css";
import { TenureLabel } from "./TenureLabel";

export function ExperienceCard() {
  const [cvOpen, setCvOpen] = useState(false);
  const tipRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // The "Show projects" tooltip follows the pointer along the row.
  const moveTip = (e: React.PointerEvent<HTMLLIElement>) => {
    if (e.pointerType !== "mouse" || !tipRef.current || !listRef.current) return;
    const list = listRef.current.getBoundingClientRect();
    const row = e.currentTarget.getBoundingClientRect();
    tipRef.current.style.setProperty("--x", `${e.clientX - list.left}px`);
    tipRef.current.style.setProperty("--y", `${row.top - list.top}px`);
    tipRef.current.dataset.show = "true";
  };
  const hideTip = () => {
    if (tipRef.current) tipRef.current.dataset.show = "false";
  };

  return (
    <section className={`${styles.card} ${styles.experience}`} aria-labelledby="experience-title">
      <h2 id="experience-title" className={styles.cardTitle}>
        Experience
      </h2>
      <div className={styles.listWrap}>
        <ul ref={listRef} className={styles.list} onPointerLeave={hideTip}>
          {experience.map((item, i) => (
            <li
              key={item.company}
              className={styles.row}
              style={{ "--brand": `var(--brand-${item.brand})` } as React.CSSProperties}
              onPointerMove={moveTip}
              data-loop-host={item.brand === "coverbase" ? "" : undefined}
            >
              <BrandMark brand={item.brand} id={`exp-${i}`} />
              <span className={styles.rowText}>
                <span className={styles.rowTitle}>{item.company}</span>
                <span className={styles.rowSub}>{item.role}</span>
              </span>
              <TenureLabel tenure={item.tenure} className={styles.rowMeta} />
            </li>
          ))}
        </ul>
        <div ref={tipRef} className={styles.tooltip} data-show="false" aria-hidden="true">
          Show projects
        </div>
      </div>

      <div className={styles.more}>
        <span className={styles.moreIcon} aria-hidden="true">
          <FileTextIcon />
        </span>
        <span className={styles.moreText}>
          <span className={styles.moreTitle}>And more</span>
          <button type="button" className={styles.textLink} onClick={() => setCvOpen(true)} aria-haspopup="dialog">
            Read full CV
          </button>
        </span>
      </div>

      <CvModal open={cvOpen} onClose={() => setCvOpen(false)} />
    </section>
  );
}
