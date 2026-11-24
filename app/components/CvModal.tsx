"use client";

import { useEffect, useRef } from "react";
import { profile } from "../content/profile";
import { CloseIcon, DownloadIcon } from "./logos";
import styles from "./cv.module.css";

/** CV preview. Pages are pre-rendered images so the preview looks the same on every browser, phones included. */
export function CvModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby="cv-title"
      onClose={() => {
        document.documentElement.style.overflow = "";
        onClose();
      }}
      onClick={(e) => {
        // Click on the backdrop (the dialog element itself) closes it.
        if (e.target === e.currentTarget) ref.current?.close();
      }}
    >
      <div className={styles.sheet}>
        <header className={styles.header}>
          <div>
            <h2 id="cv-title" className={styles.title}>
              Curriculum Vitae
            </h2>
            <p className={styles.meta}>{profile.name} · PDF · 2 pages</p>
          </div>
          <div className={styles.actions}>
            <a className={styles.download} href={profile.cv.pdf} download={profile.cv.downloadName} data-sound-hover="" data-cuelume-tap="">
              <DownloadIcon className={styles.icon} />
              <span>Download</span>
            </a>
            <button type="button" className={styles.close} onClick={() => ref.current?.close()} aria-label="Close CV preview" data-sound-hover="" data-cuelume-tap="">
              <CloseIcon className={styles.icon} />
            </button>
          </div>
        </header>
        <div className={styles.pages}>
          {profile.cv.pages.map((p, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={p.src}
              className={styles.page}
              src={p.src}
              width={p.width}
              height={p.height}
              alt={i === 0 ? `${profile.name} CV, page 1 of 2` : "CV, page 2 of 2"}
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </dialog>
  );
}
