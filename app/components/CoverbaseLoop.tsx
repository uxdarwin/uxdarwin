"use client";

import { useEffect, useRef, useState } from "react";

const SRC = "/images/coverbase-loop.webp"; // Plays once (loop count 1), ends on the static logo.
let blobPromise: Promise<Blob> | null = null;

function getBlob() {
  blobPromise ??= fetch(SRC).then((r) => r.blob());
  return blobPromise;
}

/**
 * Overlays the Coverbase logo animation on top of a static logo and plays it once each
 * time the closest `[data-loop-host]` ancestor is hovered or focused. A fresh object URL
 * per hover restarts the animation without downloading the file again.
 */
export function CoverbaseLoop({ size, className }: { size: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const host = ref.current?.closest<HTMLElement>("[data-loop-host]");
    if (!host) return;
    let current: string | null = null;
    let token = 0;

    const play = async () => {
      const t = ++token;
      const blob = await getBlob().catch(() => null);
      if (!blob || t !== token) return;
      if (current) URL.revokeObjectURL(current);
      current = URL.createObjectURL(blob);
      setUrl(current);
    };
    const stop = () => {
      token++;
      setUrl(null);
    };
    const prefetch = () => void getBlob().catch(() => null);

    host.addEventListener("pointerenter", play);
    host.addEventListener("focusin", play);
    host.addEventListener("pointerleave", stop);
    host.addEventListener("focusout", stop);
    host.addEventListener("pointerover", prefetch, { once: true });
    return () => {
      host.removeEventListener("pointerenter", play);
      host.removeEventListener("focusin", play);
      host.removeEventListener("pointerleave", stop);
      host.removeEventListener("focusout", stop);
      if (current) URL.revokeObjectURL(current);
    };
  }, []);

  return (
    <span ref={ref} className={className} data-playing={url ? "true" : "false"} aria-hidden="true">
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" width={size} height={size} style={{ width: size, height: size, display: "block" }} />
      )}
    </span>
  );
}
