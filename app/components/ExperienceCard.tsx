"use client";

import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { experience } from "../content/profile";
import { BrandMark } from "./BrandMark";
import { CvModal } from "./CvModal";
import { setCompany, useCompany } from "./filter";
import { FileTextIcon } from "./logos";
import styles from "./panel.module.css";
import { TenureLabel } from "./TenureLabel";

export function ExperienceCard() {
  const [cvOpen, setCvOpen] = useState(false);
  const tipRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const company = useCompany();
  const pathname = usePathname();
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);

  // "Show projects" filters the feed to that company; clicking the active row clears it.
  // From a project page it goes back to the feed, already filtered.
  const toggle = (brand: (typeof experience)[number]["brand"]) => {
    const next = company === brand ? null : brand;
    if (pathname !== "/") {
      router.push(next ? `/?company=${next}` : "/");
      setCompany(next);
      return;
    }
    setCompany(next);
    document.getElementById("projects-title")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
              onPointerEnter={() => setHovered(item.brand)}
              onClick={() => toggle(item.brand)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle(item.brand);
                }
              }}
              role="button"
              tabIndex={0}
              aria-pressed={company === item.brand}
              aria-label={`${item.company}, ${item.role}. ${company === item.brand ? "Show all projects" : "Show projects"}`}
              data-active={company === item.brand ? "true" : undefined}
              data-sound-hover=""
              data-cuelume-tap=""
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
          {hovered && hovered === company ? "Show all projects" : "Show projects"}
        </div>
      </div>

      <button type="button" className={styles.more} onClick={() => setCvOpen(true)} aria-haspopup="dialog" data-sound-hover="" data-cuelume-tap="">
        <span className={styles.moreIcon} aria-hidden="true">
          <FileTextIcon />
        </span>
        <span className={styles.moreText}>
          <span className={styles.moreTitle}>And more</span>
          <span className={styles.textLink}>Read full CV</span>
        </span>
      </button>

      <CvModal open={cvOpen} onClose={() => setCvOpen(false)} />
    </section>
  );
}
