"use client";

import { useEffect, useRef } from "react";

/** Plays a Lottie file in a loop while it is on screen. With reduced motion it shows one still frame. */
export function Lottie({ src, label, className }: { src: string; label: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let anim: import("lottie-web").AnimationItem | null = null;
    let io: IntersectionObserver | null = null;
    let cancelled = false;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    (async () => {
      const [{ default: lottie }, data] = await Promise.all([
        import("lottie-web/build/player/lottie_light"),
        fetch(src).then((r) => r.json()),
      ]);
      if (cancelled) return;
      anim = lottie.loadAnimation({
        container: el,
        renderer: "svg",
        loop: true,
        autoplay: false,
        animationData: data,
        rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
      });
      if (still) {
        anim.goToAndStop(Math.floor(anim.totalFrames * 0.5), true);
        return;
      }
      io = new IntersectionObserver(([e]) => (e.isIntersecting ? anim?.play() : anim?.pause()));
      io.observe(el);
    })();

    return () => {
      cancelled = true;
      io?.disconnect();
      anim?.destroy();
    };
  }, [src]);

  return <div ref={ref} className={className} role="img" aria-label={label} />;
}
