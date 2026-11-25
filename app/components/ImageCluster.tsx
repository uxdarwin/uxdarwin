"use client";

import { useEffect, useRef, useState } from "react";
import type { ProjectImage } from "../content/projects";
import { seeded, useCanDrag } from "./drag";
import styles from "./feed.module.css";

// Layouts from Figma 43:9981, in px relative to the text column's left edge at 1440 wide.
// Each cluster overlaps and tilts its images; the whole cluster scales down to fit.
export type Slot = { x: number; y: number; w: number; rot: number };
const LAYOUTS: Record<number, Slot[][]> = {
  1: [[{ x: 0, y: 0, w: 720, rot: -1 }]],
  2: [
    [
      { x: -17, y: 30, w: 470, rot: 2 },
      { x: 430, y: 0, w: 420, rot: -2 },
    ],
  ],
  3: [
    [
      { x: -17, y: 27, w: 391, rot: 2 },
      { x: 623, y: 112, w: 307, rot: -2 },
      { x: 388, y: 0, w: 332, rot: 0 },
    ],
    [
      { x: -40, y: 139, w: 391, rot: 2 },
      { x: 530, y: 150, w: 401, rot: -2 },
      { x: 150, y: 0, w: 488, rot: 0 },
    ],
  ],
};

const MIN_W = 160;
const MAX_W = 1100;

/** Figma-style handles: four corners plus four edges. Images keep their proportions. */
const HANDLES = ["nw", "n", "ne", "e", "se", "s", "sw", "w"] as const;
type Handle = (typeof HANDLES)[number];

type State = { dx: number; dy: number; w: number };

/** An image, or a muted clip that plays only on screen and never with reduced motion. */
function ClusterMedia({ im, style }: { im: ProjectImage; style?: React.CSSProperties }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  if (im.video)
    return (
      <video
        ref={ref}
        className={styles.clusterImg}
        src={im.video}
        poster={im.src}
        width={im.width}
        height={im.height}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={im.alt}
        style={style}
      />
    );
  return (
    <img
      className={styles.clusterImg}
      src={im.src}
      alt={im.alt}
      width={im.width}
      height={im.height}
      loading="lazy"
      decoding="async"
      draggable={false}
      style={style}
    />
  );
}

export function ImageCluster({
  images,
  variant,
  seed,
  layout,
  center,
}: {
  images: ProjectImage[];
  variant: number;
  seed: string;
  /** A custom arrangement instead of the preset for this many images. */
  layout?: Slot[];
  /** Centre the arrangement on the text column instead of starting at its left edge,
      using the page's left margin when it is wider than the column. */
  center?: boolean;
}) {
  const canDrag = useCanDrag();
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState(0);
  const [stack, setStack] = useState(false);
  const options = LAYOUTS[Math.min(images.length, 3)];
  const slots = layout ?? options[variant % options.length];
  const [state, setState] = useState<State[]>(() => slots.map((s) => ({ dx: 0, dy: 0, w: s.w })));
  const [order, setOrder] = useState<number[]>(() => slots.map((_, i) => i));
  const [selected, setSelected] = useState<number | null>(null);

  const layoutW = Math.max(...slots.map((s) => s.x + s.w));
  const layoutH = Math.max(...slots.map((s, i) => s.y + (s.w * images[i].height) / images[i].width));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width;
      setStack(w < 560);
      if (!center) {
        setScale(Math.min(1, w / layoutW));
        return;
      }
      // Room to the left of the column: the parent's left padding beyond the page inset.
      const parent = el.parentElement;
      const cs = parent ? getComputedStyle(parent) : null;
      const inset = cs ? parseFloat(cs.getPropertyValue("--title-inset")) || 0 : 0;
      const room = cs ? Math.max(0, parseFloat(cs.paddingLeft) - inset) : 0;
      const sc = Math.min(1, (w + room) / layoutW);
      const shown = layoutW * sc;
      const ideal = (Math.min(w, 720) - shown) / 2;
      setScale(sc);
      setOffset(Math.max(-room, Math.min(w - shown, ideal)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [layoutW, center]);

  // Click anywhere else (or press Escape) to deselect, like Figma.
  useEffect(() => {
    if (selected === null) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setSelected(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  const raise = (i: number) => setOrder((o) => [...o.filter((k) => k !== i), i]);
  const update = (i: number, patch: Partial<State>) =>
    setState((all) => all.map((s, k) => (k === i ? { ...s, ...patch } : s)));

  const track = (move: (ev: PointerEvent) => void) => {
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      document.body.style.cursor = "";
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const startResize = (i: number, h: Handle, e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    raise(i);
    setSelected(i);
    const st = state[i];
    const ratio = images[i].height / images[i].width;
    const sx = e.clientX, sy = e.clientY;
    const ow = st.w, odx = st.dx, ody = st.dy;
    document.body.style.cursor = getComputedStyle(e.currentTarget).cursor;
    track((ev) => {
      const px = (ev.clientX - sx) / scale; // pointer delta in layout px
      const py = (ev.clientY - sy) / scale;
      // Width change implied by each axis; corners follow whichever axis moved more.
      const fromX = h.includes("e") ? px : h.includes("w") ? -px : 0;
      const fromY = h.includes("s") ? py / ratio : h.includes("n") ? -py / ratio : 0;
      const dw = Math.abs(fromX) >= Math.abs(fromY) ? fromX : fromY;
      const w = Math.max(MIN_W, Math.min(MAX_W, ow + dw));
      const grow = w - ow;
      // Keep the opposite edge or corner pinned; edge handles grow around the center.
      const shiftX = h.includes("w") ? -grow : h === "n" || h === "s" ? -grow / 2 : 0;
      const shiftY = h.includes("n") ? -grow * ratio : h === "e" || h === "w" ? (-grow * ratio) / 2 : 0;
      update(i, { w, dx: odx + shiftX * scale, dy: ody + shiftY * scale });
    });
  };

  if (stack) {
    return (
      <div ref={ref} className={styles.clusterStack}>
        {images.map((im, i) => (
          <ClusterMedia key={im.src} im={im} style={{ transform: `rotate(${(seeded(`${seed}-${i}`) * 1).toFixed(2)}deg)` }} />
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className={styles.cluster} style={{ height: layoutH * scale }}>
      {images.slice(0, slots.length).map((im, i) => {
        const s = slots[i];
        const st = state[i];
        const isSel = selected === i;
        const shownW = Math.round(st.w * scale);
        const shownH = Math.round(st.w * scale * (im.height / im.width));
        return (
          <figure
            key={im.src}
            className={styles.clusterItem}
            data-draggable={canDrag || undefined}
            data-selected={isSel || undefined}
            style={{
              left: offset + s.x * scale,
              top: s.y * scale,
              width: st.w * scale,
              transform: `translate(${st.dx}px, ${st.dy}px) rotate(${s.rot}deg)`,
              zIndex: order.indexOf(i) + 1,
            }}
            onPointerDown={(e) => {
              if (!canDrag || e.button !== 0) return;
              e.preventDefault();
              raise(i);
              setSelected(i);
              const sx = e.clientX, sy = e.clientY, ox = st.dx, oy = st.dy;
              track((ev) => update(i, { dx: ox + ev.clientX - sx, dy: oy + ev.clientY - sy }));
            }}
          >
            <ClusterMedia im={im} />
            {canDrag && (
              <>
                <span className={styles.selection} aria-hidden="true" />
                {HANDLES.map((h) => (
                  <span
                    key={h}
                    className={styles.handle}
                    data-h={h}
                    aria-hidden="true"
                    onPointerDown={(e) => startResize(i, h, e)}
                  />
                ))}
                <span className={styles.dims} aria-hidden="true">
                  {shownW} × {shownH}
                </span>
              </>
            )}
          </figure>
        );
      })}
    </div>
  );
}
