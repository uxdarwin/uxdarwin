import { ExperienceCard } from "./ExperienceCard";
import { Footer } from "./Footer";
import { HighlightsCard } from "./HighlightsCard";
import { IntroCard } from "./IntroCard";
import { LocationCard } from "./LocationCard";
import styles from "./panel.module.css";

/** Left panel plus the center column, shared by the home feed and every project page. */
export function Shell({ children, page = "home" }: { children: React.ReactNode; page?: "home" | "project" }) {
  return (
    <div className={styles.shell} data-page={page}>
      <aside className={styles.panel} aria-label="About Darwin">
        <IntroCard />
        <ExperienceCard />
        <HighlightsCard />
        <LocationCard />
      </aside>
      <div className={styles.content}>
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
