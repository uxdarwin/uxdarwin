import { profile } from "../content/profile";
import styles from "./feed.module.css";

export function Footer() {
  const year = 2026;
  return (
    <footer className={styles.footer}>
      <div className={styles.footerMain}>
        <p className={styles.footerName}>
          Darwin Álvarez
          <span>Staff Product Designer · Medellín, Colombia</span>
        </p>
        <nav className={styles.footerLinks} aria-label="Contact">
          <a href={`mailto:${profile.email}`} data-sound-hover="" data-cuelume-tap="">
            Email
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" data-sound-hover="" data-cuelume-tap="">
            LinkedIn
          </a>
          <a href={profile.cv.pdf} target="_blank" rel="noreferrer" data-sound-hover="" data-cuelume-tap="">
            CV
          </a>
        </nav>
      </div>
      <p className={styles.footerFine}>
        <span>© {year} Darwin Álvarez</span>
        <a href="#top" data-cuelume-tap="">
          Back to top
        </a>
      </p>
    </footer>
  );
}
