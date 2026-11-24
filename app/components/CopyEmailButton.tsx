"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "../content/profile";
import { MailIcon } from "./logos";
import styles from "./panel.module.css";

/** Copies the email address instead of opening a mail app; confirms for 3 seconds. */
export function CopyEmailButton() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      // No clipboard access (old browser or insecure context): fall back to the mail app.
      window.location.href = `mailto:${profile.email}`;
      return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 3000);
  };

  return (
    <button
      type="button"
      className={`${styles.roundBtn} ${styles.mailBtn}`}
      onClick={copy}
      aria-label={`Copy email address, ${profile.email}`}
      data-copied={copied || undefined}
      data-sound-hover=""
      data-cuelume-tap=""
    >
      <MailIcon className={styles.roundIcon} />
      <span className={styles.btnTip} aria-hidden="true">
        {copied ? (
          <>
            <svg viewBox="0 0 24 24" fill="none" className={styles.btnTipCheck}>
              <path d="M5 12.5 10 17.5 19 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Copied {profile.email}
          </>
        ) : (
          "Copy email"
        )}
      </span>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? `Copied ${profile.email} to your clipboard` : ""}
      </span>
    </button>
  );
}
