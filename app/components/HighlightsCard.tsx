"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { highlights } from "../content/profile";
import { BrandMark } from "./BrandMark";
import styles from "./panel.module.css";

// Floating previews need a pointer that can hover and room to the right of the panel.
const FLOAT_QUERY = "(hover: hover) and (pointer: fine) and (min-width: 1024px)";

function useFloating() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(FLOAT_QUERY);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(FLOAT_QUERY).matches,
    () => true,
  );
}

// Intro for the floating previews: the image arrives through a soft liquid ripple that
// settles to sharp while it fades and scales in (SVG turbulence + displacement).
const DISTORT_MS = 750;
const DISTORT_MAX = 28; // displacement in px at the first frame
const SHADOW = "drop-shadow(0 24px 48px rgb(0 0 0 / 0.55))";

export function HighlightsCard() {
  const floating = useFloating();
  const [active, setActive] = useState<number | null>(null);
  const [shift, setShift] = useState(0);
  const cardRef = useRef<HTMLElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);
  const [distorting, setDistorting] = useState<number | null>(null);

  useEffect(() => {
    if (!floating || active === null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const disp = dispRef.current;
    if (!disp) return;
    let raf = 0;
    const start = performance.now();
    setDistorting(active);
    const tick = (now: number) => {
      const t = Math.min((now - start) / DISTORT_MS, 1);
      const settle = 1 - Math.pow(1 - t, 3); // ease-out cubic
      disp.setAttribute("scale", String(DISTORT_MAX * (1 - settle)));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDistorting(null); // drop the filter once settled so the image is crisp
    };
    disp.setAttribute("scale", String(DISTORT_MAX));
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      setDistorting(null);
    };
  }, [active, floating]);

  // Keep the floating preview inside the viewport on short screens.
  useEffect(() => {
    if (!floating || active === null || !cardRef.current) return;
    const p = highlights[active].preview;
    const cardTop = cardRef.current.getBoundingClientRect().top;
    const top = cardTop + p.top;
    const bottom = top + p.height;
    const max = window.innerHeight - 8;
    setShift(bottom > max ? max - bottom : top < 8 ? 8 - top : 0);
  }, [active, floating]);

  return (
    <section ref={cardRef} className={`${styles.card} ${styles.highlights}`} aria-label="Highlights">
      <ul className={styles.list} onPointerLeave={() => floating && setActive(null)}>
        {highlights.map((h, i) => {
          const isActive = active === i;
          return (
            <li key={h.title} className={styles.highlightItem}>
              <button
                type="button"
                className={styles.row}
                data-sound-hover=""
                data-cuelume-tap=""
                data-active={isActive}
                aria-expanded={floating ? undefined : isActive}
                aria-describedby={isActive ? `hl-preview-${i}` : undefined}
                style={{ "--brand": `var(--brand-${h.brand})` } as React.CSSProperties}
                onPointerEnter={(e) => e.pointerType === "mouse" && floating && setActive(i)}
                onFocus={() => floating && setActive(i)}
                onBlur={() => floating && setActive(null)}
                onClick={() => !floating && setActive(isActive ? null : i)}
              >
                <BrandMark brand={h.brand} id={`hl-${i}`} />
                <span className={styles.rowText}>
                  <span className={styles.rowTitle}>{h.title}</span>
                  <span className={styles.rowSub}>{h.subtitle}</span>
                </span>
                <span className={styles.rowMeta}>{h.date}</span>
              </button>
              {!floating && (
                <div className={styles.inlinePreview} data-open={isActive}>
                  <div className={styles.inlinePreviewInner}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={h.preview.src} alt={h.preview.alt} width={h.preview.width} height={h.preview.height} loading="lazy" />
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {floating && (
        <div className={styles.previewLayer} aria-hidden={active === null}>
          <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
            <filter id="hl-distort" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves={2} seed={7} result="noise" />
              <feDisplacementMap ref={dispRef} in="SourceGraphic" in2="noise" scale={0} xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </svg>
          {highlights.map((h, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={h.title}
              id={`hl-preview-${i}`}
              className={styles.preview}
              data-show={active === i}
              src={h.preview.src}
              alt={h.preview.alt}
              width={h.preview.width}
              height={h.preview.height}
              style={{
                left: h.preview.left,
                top: h.preview.top + (active === i ? shift : 0),
                filter: distorting === i ? `url(#hl-distort) ${SHADOW}` : undefined,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
