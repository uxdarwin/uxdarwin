import { ExperienceCard } from "./components/ExperienceCard";
import { HighlightsCard } from "./components/HighlightsCard";
import { IntroCard } from "./components/IntroCard";
import { LocationCard } from "./components/LocationCard";
import { ProjectsFeed } from "./components/ProjectsFeed";
import styles from "./components/panel.module.css";

export default function Home() {
  return (
    <div className={styles.shell}>
      <aside className={styles.panel} aria-label="About Darwin">
        <IntroCard />
        <ExperienceCard />
        <HighlightsCard />
        <LocationCard />
      </aside>
      <main className={styles.content}>
        <ProjectsFeed />
      </main>
    </div>
  );
}
