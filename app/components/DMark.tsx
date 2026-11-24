import styles from "./panel.module.css";

// The "D" from the Figma logo: 10 concentric rings, each a line that runs across,
// around a half circle and back. Geometry is the centerline of the exported rings
// (34:1938). Motion is the keyframe timeline on 27:2: a 5.2s loop where the rings
// draw in from the inside out, swell in a wave, then wipe away and redraw.

const CYCLE = 5.2; // seconds
const W = 1.4007; // base stroke (17 in the Figma frame)
const W_PEAK = (W * 27) / 17;

// Per ring, outermost first (Anillo 1..10). Times are fractions of the cycle.
// draw: [start drawing, fully drawn, start wiping, fully wiped]
// swell: [start, peak, settle]
const TIMING = [
  { draw: [0.142, 0.315, 0.758, 0.931], swell: [0.5038, 0.5904, 0.6769] },
  { draw: [0.131, 0.304, 0.746, 0.919], swell: [0.4885, 0.575, 0.6615] },
  { draw: [0.119, 0.292, 0.735, 0.908], swell: [0.4731, 0.5596, 0.6462] },
  { draw: [0.108, 0.281, 0.723, 0.896], swell: [0.4577, 0.5442, 0.6308] },
  { draw: [0.096, 0.269, 0.712, 0.885], swell: [0.4423, 0.5288, 0.6154] },
  { draw: [0.085, 0.258, 0.7, 0.873], swell: [0.4269, 0.5135, 0.6] },
  { draw: [0.073, 0.246, 0.688, 0.862], swell: [0.4115, 0.4981, 0.5846] },
  { draw: [0.062, 0.235, 0.677, 0.85], swell: [0.3962, 0.4827, 0.5692] },
  { draw: [0.05, 0.223, 0.665, 0.838], swell: [0.3808, 0.4673, 0.5538] },
  { draw: [0.038, 0.212, 0.654, 0.827], swell: [0.3654, 0.4519, 0.5385] },
];

const pct = (t: number) => `${+(t * 100).toFixed(2)}%`;
const EASE = "cubic-bezier(0.42,0,0.58,1)";

const KEYFRAMES = TIMING.map(({ draw: [d0, d1, d2, d3], swell: [s0, s1, s2] }, k) =>
  `@keyframes ring-draw-${k}{` +
  `0%,${pct(d0)}{stroke-dasharray:0 1;stroke-dashoffset:0;animation-timing-function:linear}` +
  `${pct(d1)}{stroke-dasharray:1 1;stroke-dashoffset:0;animation-timing-function:linear}` +
  `${pct(d2)}{stroke-dasharray:1 1;stroke-dashoffset:0;animation-timing-function:${EASE}}` +
  `${pct(d3)},100%{stroke-dasharray:0 1;stroke-dashoffset:-1}}` +
  `@keyframes ring-swell-${k}{` +
  `0%,${pct(s0)}{stroke-width:${W};animation-timing-function:${EASE}}` +
  `${pct(s1)}{stroke-width:${W_PEAK.toFixed(4)};animation-timing-function:${EASE}}` +
  `${pct(s2)},100%{stroke-width:${W}}}`,
).join("");

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
            strokeWidth={W}
            className={styles.ring}
            style={{ animationName: `ring-draw-${k}, ring-swell-${k}`, animationDuration: `${CYCLE}s` }}
          />
        ))}
      </svg>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.portrait} src="/images/portrait.png" alt="" width={62} height={56} />
      <style>{KEYFRAMES}</style>
    </span>
  );
}
