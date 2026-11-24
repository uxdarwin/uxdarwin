import { defineShader, wgsl } from "shaders/std";

/**
 * Fluted glass bent into concentric arcs around a point (default: left edge, vertical
 * middle). Each band refracts the layer inside it toward its own center line, with a soft
 * sheen along the band, like reeded glass seen end on.
 *
 * `band` is the arc width in uv-height units, so a fixed pixel width is `px / viewportHeight`.
 */
export const RadialFlutes = defineShader({
  name: "RadialFlutes",
  description: "Concentric fluted-glass arcs around a point",
  props: {
    centerX: { default: 0 },
    centerY: { default: 0.5 },
    band: { default: 0.03 },
    refraction: { default: 1.2 },
    sheen: { default: 0.006 },
  },
  effect: wgsl`
    let c = vec2f(centerX, centerY);
    let d = (uv - c) * vec2f(aspect, 1.0);
    let r = length(d);
    let dir = select(vec2f(1.0, 0.0), d / max(r, 1e-5), r > 1e-5);
    let f = fract(r / band);
    let s = f * 2.0 - 1.0;               // -1 at the inner edge, +1 at the outer edge
    let lens = s * band * 0.5 * refraction;
    let offset = dir * lens / vec2f(aspect, 1.0);
    let col = textureSample(childTexture, childSampler, uv - offset);
    let glow = sheen * (1.0 - s * s) * col.a; // linear RGB: keep tiny
    let seam = smoothstep(0.9, 1.0, abs(s)) * 0.35;
    let rgb = col.rgb * (1.0 - seam) + vec3f(glow);
    return vec4f(rgb, col.a);
  `,
});
