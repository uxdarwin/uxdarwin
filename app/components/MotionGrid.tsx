import type { MotionClip } from "../content/projects";
import { Lottie } from "./Lottie";
import styles from "./feed.module.css";

/** Lottie clips on a light sheet, two per row, each in a 2:1 cell. */
export function MotionGrid({ clips, size = "card" }: { clips: MotionClip[]; size?: "card" | "page" }) {
  return (
    <div className={styles.motionGrid} data-size={size}>
      {clips.map((c) => (
        <div key={c.src} className={styles.motionCell} data-icon={c.width === c.height || undefined}>
          <Lottie src={c.src} label={`${c.label} animation`} className={styles.motionPlayer} />
          {size === "page" && <span className={styles.motionLabel}>{c.label}</span>}
        </div>
      ))}
    </div>
  );
}
