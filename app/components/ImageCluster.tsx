"use client";

import { useEffect, useRef, useState } from "react";
import type { ProjectImage } from "../content/projects";
import { seeded, useCanDrag } from "./drag";
import styles from "./feed.module.css";

// Layouts from Figma 43:9981, in px relative to the text column's left edge at 1440 wide.
// Each cluster overlaps and tilts its images; the whole cluster scales down to fit.
type Slot = { x: number; y: number; w: number; rot: number };
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

type State = { dx: number; dy: number; w: number };

export function ImageCluster({ images, variant, seed }: { images: ProjectImage[]; variant: number; seed: string }) {
  const canDrag = useCanDrag();
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [stack, setStack] = useState(false);
  const options = LAYOUTS[Math.min(images.length, 3)];
  const slots = options[variant % options.length];
  const [state, setState] = useState<State[]>(() => slots.map((s) => ({ dx: 0, dy: 0, w: s.w })));
  const [order, setOrder] = useState<number[]>(() => slots.map((_, i) => i));

  // Natural layout width, so the cluster scales to the column instead of overflowing it.
  const layoutW = Math.max(...slots.map((s) => s.x + s.w));
  const layoutH = Math.max(...slots.map((s, i) => s.y + (s.w * images[i].height) / images[i].width));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width;
      setStack(w < 560);
      setScale(Math.min(1, w / layoutW));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [layoutW]);

  const raise = (i: number) => setOrder((o) => [...o.filter((k) => k !== i), i]);
  const update = (i: number, patch: Partial<State>) =>
    setState((all) => all.map((s, k) => (k === i ? { ...s, ...patch } : s)));

  if (stack) {
    return (
      <div ref={ref} className={styles.clusterStack}>
        {images.map((im, i) => (
          <img
            key={im.src}
            className={styles.clusterImg}
            src={im.src}
            alt={im.alt}
            width={im.width}
            height={im.height}
            loading="lazy"
            decoding="async"
            style={{ transform: `rotate(${(seeded(`${seed}-${i}`) * 1).toFixed(2)}deg)` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className={styles.cluster} style={{ height: layoutH * scale }}>
      {images.slice(0, slots.length).map((im, i) => {
        const s = slots[i];
        const st = state[i];
        return (
          <figure
            key={im.src}
            className={styles.clusterItem}
            data-draggable={canDrag || undefined}
            style={{
              left: s.x * scale,
              top: s.y * scale,
              width: st.w * scale,
              transform: `translate(${st.dx}px, ${st.dy}px) rotate(${s.rot}deg)`,
              zIndex: order.indexOf(i) + 1,
            }}
            onPointerDown={(e) => {
              if (!canDrag || e.button !== 0) return;
              if ((e.target as HTMLElement).dataset.handle) return;
              e.currentTarget.setPointerCapture(e.pointerId);
              raise(i);
              const sx = e.clientX, sy = e.clientY, ox = st.dx, oy = st.dy;
              const move = (ev: PointerEvent) => update(i, { dx: ox + ev.clientX - sx, dy: oy + ev.clientY - sy });
              const up = () => {
                window.removeEventListener("pointermove", move);
                window.removeEventListener("pointerup", up);
              };
              window.addEventListener("pointermove", move);
              window.addEventListener("pointerup", up);
            }}
          >
            <img
              className={styles.clusterImg}
              src={im.src}
              alt={im.alt}
              width={im.width}
              height={im.height}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
            {canDrag && (
              <span
                className={styles.resize}
                data-handle="resize"
                role="presentation"
                onPointerDown={(e) => {
                  if (e.button !== 0) return;
                  e.stopPropagation();
                  e.currentTarget.setPointerCapture(e.pointerId);
                  raise(i);
                  const sx = e.clientX, ow = st.w;
                  const move = (ev: PointerEvent) =>
                    update(i, { w: Math.max(MIN_W, Math.min(MAX_W, ow + (ev.clientX - sx) / scale)) });
                  const up = () => {
                    window.removeEventListener("pointermove", move);
                    window.removeEventListener("pointerup", up);
                  };
                  window.addEventListener("pointermove", move);
                  window.addEventListener("pointerup", up);
                }}
              />
            )}
          </figure>
        );
      })}
    </div>
  );
}
