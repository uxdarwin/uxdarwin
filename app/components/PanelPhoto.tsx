"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./feed.module.css";

// Same intro as the Highlights hover previews: on hover the photo scales up 30% past
// the panel edge and turns to color, arriving through a liquid ripple with a short
// red/blue channel split that settles to sharp.
const DISTORT_MS = 750;
const DISTORT_MAX = 28;
const SPLIT_MAX = 4;

type Photo = { src: string; width: number; height: number; caption: string };

export function PanelPhoto({ photo }: { photo: Photo }) {
  const [hover, setHover] = useState(false);
  const [distorting, setDistorting] = useState(false);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);
  const redRef = useRef<SVGFEOffsetElement>(null);
  const blueRef = useRef<SVGFEOffsetElement>(null);
  const filterId = `cp-distort-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    if (!hover) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const disp = dispRef.current;
    const red = redRef.current;
    const blue = blueRef.current;
    if (!disp || !red || !blue) return;
    const set = (k: number) => {
      disp.setAttribute("scale", String(DISTORT_MAX * k));
      red.setAttribute("dx", String(SPLIT_MAX * k));
      blue.setAttribute("dx", String(-SPLIT_MAX * k));
    };
    let raf = 0;
    const start = performance.now();
    setDistorting(true);
    const tick = (now: number) => {
      const t = Math.min((now - start) / DISTORT_MS, 1);
      set(Math.pow(1 - t, 3));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDistorting(false);
    };
    set(1);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      setDistorting(false);
    };
  }, [hover]);

  return (
    <figure
      className={styles.cpPhoto}
      data-hover={hover}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
        <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves={2} seed={7} result="noise" />
          <feDisplacementMap ref={dispRef} in="SourceGraphic" in2="noise" scale={0} xChannelSelector="R" yChannelSelector="G" result="warped" />
          <feOffset ref={redRef} in="warped" dx={0} result="rShift" />
          <feColorMatrix in="rShift" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
          <feColorMatrix in="warped" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
          <feOffset ref={blueRef} in="warped" dx={0} result="bShift" />
          <feColorMatrix in="bShift" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
          <feComposite in="r" in2="g" operator="arithmetic" k2={1} k3={1} result="rg" />
          <feComposite in="rg" in2="b" operator="arithmetic" k2={1} k3={1} />
        </filter>
      </svg>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.src}
        alt={photo.caption}
        width={photo.width}
        height={photo.height}
        loading="lazy"
        style={distorting ? { filter: `url(#${filterId})` } : undefined}
      />
      <figcaption>{photo.caption}</figcaption>
    </figure>
  );
}
