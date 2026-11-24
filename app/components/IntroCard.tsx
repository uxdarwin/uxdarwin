import { profile } from "../content/profile";
import { CoverbaseLoop } from "./CoverbaseLoop";
import { DMark } from "./DMark";
import { CoverbaseLogo, LinkedInFilledIcon, LinkedInIcon, MailIcon } from "./logos";
import styles from "./panel.module.css";

export function IntroCard() {
  return (
    <section className={`${styles.card} ${styles.intro}`} aria-label="Introduction">
      <div className={styles.introTop}>
        <h1 className={styles.wordmark} data-sound-hover="">
          <DMark />
          <span className={styles.wordmarkText}>
            <span className={styles.wordmarkName}>Darwin</span>
            <span className={styles.wordmarkSub}>Design</span>
          </span>
          <span className="sr-only">{profile.name}</span>
        </h1>
        <div className={styles.social}>
          <a className={`${styles.roundBtn} ${styles.mailBtn}`} href={`mailto:${profile.email}`} aria-label="Email Darwin" data-sound-hover="" data-cuelume-tap="">
            <MailIcon className={styles.roundIcon} />
          </a>
          <a
            className={`${styles.roundBtn} ${styles.linkedinBtn}`}
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Darwin on LinkedIn"
            data-sound-hover=""
            data-cuelume-tap=""
          >
            <LinkedInIcon className={`${styles.roundIcon} ${styles.iconIdle}`} />
            <LinkedInFilledIcon className={`${styles.roundIcon} ${styles.iconHover}`} />
          </a>
        </div>
      </div>

      <p className={styles.headline}>{profile.headline}</p>
      <p className={styles.at}>
        at{" "}
        <a className={styles.companyLink} href={profile.company.url} target="_blank" rel="noopener noreferrer" data-loop-host="" data-sound-hover="" data-cuelume-tap="">
          <span className={styles.companyLogo} aria-hidden="true">
            <CoverbaseLogo id="intro-cb-gray" tone="gray" className={styles.companyLogoIdle} viewBox="8.03 8.03 23.95 23.95" />
            <CoverbaseLogo id="intro-cb-color" className={styles.companyLogoHover} viewBox="8.03 8.03 23.95 23.95" />
            <CoverbaseLoop size={20} className={styles.loopIntro} />
          </span>
          <span className={styles.companyName}>{profile.company.name}</span>
        </a>
      </p>
      <p className={styles.summary}>{profile.summary}</p>
    </section>
  );
}
