"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { ChromaFlow, CustomShader, Shader, Swirl } from "shaders/react";
import { RadialFlutes } from "./radialFlutes";

// Darkest palette color (--bg) instead of pure black.
const BG = "#0a0a0f";
// Darwin wants a very subtle effect: 20% of the full-strength shader over --bg.
const STRENGTH = 0.2;

// Each glass arc is this many CSS pixels wide (Darwin's spec).
const ARC_PX = 24;

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
 * flow, seen through concentric fluted-glass arcs. Browsers without WebGPU, and visitors who prefer
 * reduced motion, simply see the flat --bg color underneath.
 */
export function ShaderBackground() {
  const reduce = useReducedMotion();
  const [state, setState] = useState("loading");
  const [band, setBand] = useState(ARC_PX / 900);

  // The filter measures in uv-height units; convert 24px for the current window height.
  useEffect(() => {
    const fit = () => setBand(ARC_PX / Math.max(window.innerHeight, 1));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // The shader follows the cursor through window "mousemove" events. Some interactions
  // (pressing on controls, focus moves) can leave the browser sending only pointer
  // events for a while, which froze the effect. Re-emit a mousemove whenever the
  // pointer moves and no native mousemove came with it.
  useEffect(() => {
    if (reduce) return;
    let lastMouse = 0;
    let pending = 0;
    const onMouse = (e: MouseEvent) => {
      if (e.isTrusted) lastMouse = e.timeStamp;
    };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const { clientX, clientY, timeStamp } = e;
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(() => {
        if (lastMouse >= timeStamp) return; // the browser already sent one
        window.dispatchEvent(new MouseEvent("mousemove", { clientX, clientY }));
      });
    };
    window.addEventListener("mousemove", onMouse, true);
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(pending);
      window.removeEventListener("mousemove", onMouse, true);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [reduce]);

  if (reduce || state.startsWith("unavailable")) return null;
  return (
    <div
      aria-hidden="true"
      data-shader-state={state}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: STRENGTH }}
    >
      <Shader
        disableTelemetry
        style={{ width: "100%", height: "100%" }}
        onReady={() => setState("ready")}
        onUnavailable={(reason) => setState(`unavailable:${String(reason)}`)}
      >
        {/* Glass arcs fanning out from the left edge, over the ambient swirl and cursor flow */}
        <CustomShader src={RadialFlutes} centerX={0} centerY={0.5} band={band} refraction={1.2} sheen={0.006}>
          <Swirl blend={36} detail={1.5} stops={[{ color: BG, position: 0 }, { color: "#3d3d40", position: 1 }]} />
          <ChromaFlow baseColor={BG} downColor={BG} leftColor={BG} rightColor={BG} upColor={BG} />
        </CustomShader>
      </Shader>
    </div>
  );
}
