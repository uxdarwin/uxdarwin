"use client";

import { useState, useSyncExternalStore } from "react";
import { ChromaFlow, FlutedGlass, Shader, Swirl } from "shaders/react";

// Darkest palette color (--bg) instead of pure black.
const BG = "#0a0a0f";

const REDUCE = "(prefers-reduced-motion: reduce)";

function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(REDUCE);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(REDUCE).matches,
    () => true, // server: render nothing until we know
  );
}

/**
 * Ambient WebGPU background from shaders.com: a slow swirl, a cursor-reactive chroma
 * flow and a fluted-glass distortion. Browsers without WebGPU, and visitors who prefer
 * reduced motion, simply see the flat --bg color underneath.
 */
export function ShaderBackground() {
  const reduce = useReducedMotion();
  const [state, setState] = useState("loading");
  if (reduce || state.startsWith("unavailable")) return null;
  return (
    <div
      aria-hidden="true"
      data-shader-state={state}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    >
      <Shader
        disableTelemetry
        style={{ width: "100%", height: "100%" }}
        onReady={() => setState("ready")}
        onUnavailable={(reason) => setState(`unavailable:${String(reason)}`)}
      >
        {/* Ambient background */}
        <Swirl blend={36} detail={1.5} stops={[{ color: BG, position: 0 }, { color: "#3d3d40", position: 1 }]} />
        {/* Interactive cursor effect */}
        <ChromaFlow baseColor={BG} downColor={BG} leftColor={BG} rightColor={BG} upColor={BG} />
        {/* Glass-like distortion */}
        <FlutedGlass
          aberration={0.36}
          angle={90}
          frequency={50}
          highlightColor="#ffffff"
          refraction={4}
          softness={1}
        />
      </Shader>
    </div>
  );
}
