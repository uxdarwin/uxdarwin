import styles from "./panel.module.css";

// The "D" from the Figma logo: 10 concentric rings, each a line that runs across,
// around a half circle and back. Geometry is the centerline of the exported rings
// (34:1938); the draw-on follows the keyframes in the file (each ring starts 60ms
// before the one outside it), then holds the full mark for 5s before redrawing.

const DRAW = 2; // seconds, the original Figma loop
const HOLD = 5; // seconds of rest between loops
const CYCLE = DRAW + HOLD;

const RINGS = Array.from({ length: 10 }, (_, k) => {
  const top = 0.7076 + 2.6366 * k;
  const bottom = 55.3347 - 2.6366 * k;
  const r = (bottom - top) / 2;
  const cx = 21.0924 - 1.6478 * k;
  return `M0 ${top.toFixed(3)}H${cx.toFixed(3)}A${r.toFixed(3)} ${r.toFixed(3)} 0 0 1 ${cx.toFixed(3)} ${bottom.toFixed(3)}H0`;
});

export function DMark() {
  return (
    <span className={styles.dmark} aria-hidden="true">
      <svg className={styles.rings} viewBox="0 0 50 57" fill="none">
        <defs>
          <linearGradient id="ring-fade" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        {RINGS.map((d, k) => (
          <path
            key={k}
            d={d}
            pathLength={1}
            stroke="url(#ring-fade)"
            strokeWidth={1.4007}
            className={styles.ring}
            style={{ animationName: `ring-${k}`, animationDuration: `${CYCLE}s` }}
          />
        ))}
      </svg>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.portrait} src="/images/portrait.png" alt="" width={62} height={56} />
      <style>{RINGS.map((_, k) => {
        const s = Math.round(((0.37 - 0.03 * k) * DRAW * 1000) / CYCLE) / 10;
        const e = Math.round(((0.82 - 0.03 * k) * DRAW * 1000) / CYCLE) / 10;
        return `@keyframes ring-${k}{0%,${s}%{stroke-dasharray:0 1}${e}%,100%{stroke-dasharray:1 1}}`;
      }).join("")}</style>
    </span>
  );
}
