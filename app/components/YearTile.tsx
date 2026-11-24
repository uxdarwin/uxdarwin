"use client";

import { useEffect, useRef } from "react";
import styles from "./feed.module.css";

// Hover effect for the blue year tiles: rings ripple out from the pointer through the pixel
// digits, with a line wave like the logo animation and a red/cyan split like the hover intros.
// Moving the pointer stirs it; resting lets it settle back to sharp.

const VERT = `attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;uv.y=1.-uv.y;gl_Position=vec4(p,0.,1.);}`;
const FRAG = `precision mediump float;
varying vec2 uv;
uniform sampler2D tex;
uniform vec2 mouse;
uniform float aspect;
uniform float time;
uniform float amp;
uniform vec3 bg;
uniform vec3 fg;
void main(){
  vec2 d=(uv-mouse)*vec2(aspect,1.);
  float r=length(d);
  float ring=sin(r*34.-time*9.)*exp(-r*2.4);
  vec2 dir=r>0.0001?d/r:vec2(0.);
  vec2 off=dir*ring*.022*amp/vec2(aspect,1.);
  off.x+=sin(uv.y*90.+time*7.)*.004*amp;
  float ab=.007*amp*(.5+abs(ring));
  vec2 q=uv+off;
  float m=texture2D(tex,q).r;
  float mr=texture2D(tex,q+vec2(ab,0.)).r;
  float mb=texture2D(tex,q-vec2(ab,0.)).r;
  vec3 col=mix(bg,fg,m);
  col+=vec3(1.,.25,.45)*max(mr-m,0.)*.75;
  col+=vec3(.2,.85,1.)*max(mb-m,0.)*.75;
  gl_FragColor=vec4(col,1.);
}`;

const rgb = (css: string) => (css.match(/[\d.]+/g) ?? ["0", "0", "0"]).slice(0, 3).map((n) => Number(n) / 255);

export function YearTile({ year, order }: { year: number; order: number }) {
  const tileRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const tile = tileRef.current;
    const text = textRef.current;
    const canvas = canvasRef.current;
    if (!tile || !text || !canvas) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    let gl: WebGLRenderingContext | null = null;
    let u: Record<string, WebGLUniformLocation | null> = {};
    let texture: WebGLTexture | null = null;
    let frame = 0;
    let start = 0;
    let last = 0;
    let hovering = false;
    let amp = 0;
    let energy = 0;
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

    // Paints the digits as CSS places them into a white-on-black mask at device resolution;
    // the shader colors it with the tile's own fill and digit colors.
    const paint = () => {
      if (!gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = tile.clientWidth;
      const h = tile.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      const src = document.createElement("canvas");
      src.width = canvas.width;
      src.height = canvas.height;
      const ctx = src.getContext("2d")!;
      const cs = getComputedStyle(text);
      ctx.scale(dpr, dpr);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      ctx.fillStyle = "#fff";
      const m = ctx.measureText(String(year));
      const x = w / 2 - (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2 + m.actualBoundingBoxLeft;
      const y = h / 2 + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
      ctx.fillText(String(year), x, y);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
      gl.uniform1f(u.aspect, w / h);
      gl.uniform3fv(u.bg, rgb(getComputedStyle(tile).backgroundColor));
      gl.uniform3fv(u.fg, rgb(cs.color));
    };

    const init = () => {
      gl = canvas.getContext("webgl", { premultipliedAlpha: false, antialias: false });
      if (!gl) return false;
      const sh = (type: number, code: string) => {
        const s = gl!.createShader(type)!;
        gl!.shaderSource(s, code);
        gl!.compileShader(s);
        return s;
      };
      const prog = gl.createProgram()!;
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
      gl.useProgram(prog);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "p");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      for (const [k, v] of [
        [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE],
        [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE],
        [gl.TEXTURE_MIN_FILTER, gl.LINEAR],
        [gl.TEXTURE_MAG_FILTER, gl.LINEAR],
      ])
        gl.texParameteri(gl.TEXTURE_2D, k, v);
      u = Object.fromEntries(
        ["mouse", "aspect", "time", "amp", "bg", "fg"].map((n) => [n, gl!.getUniformLocation(prog, n)]),
      );
      paint();
      return true;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      mouse.x += (mouse.tx - mouse.x) * Math.min(1, dt * 10);
      mouse.y += (mouse.ty - mouse.y) * Math.min(1, dt * 10);
      energy *= Math.exp(-dt * 2.6); // resting settles back to sharp
      const target = hovering ? Math.min(1, energy) : 0;
      amp += (target - amp) * Math.min(1, dt * (hovering ? 8 : 5));
      if (gl) {
        gl.uniform2f(u.mouse, mouse.x, mouse.y);
        gl.uniform1f(u.time, (now - start) / 1000);
        gl.uniform1f(u.amp, amp);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      if (!hovering && amp < 0.004) {
        tile.dataset.fx = "off";
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const local = (e: PointerEvent) => {
      const r = tile.getBoundingClientRect();
      return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
    };
    const onEnter = (e: PointerEvent) => {
      if (still.matches || e.pointerType !== "mouse") return;
      if (!gl && !init()) return;
      const p = local(e);
      mouse.x = mouse.tx = p.x;
      mouse.y = mouse.ty = p.y;
      hovering = true;
      energy = 1.1; // a splash on the way in
      if (!frame) {
        start = last = performance.now();
        tile.dataset.fx = "on";
        frame = requestAnimationFrame(tick);
      }
    };
    const onMove = (e: PointerEvent) => {
      if (!hovering) return;
      const p = local(e);
      energy = Math.min(1.2, energy + Math.hypot(p.x - mouse.tx, p.y - mouse.ty) * 2.2);
      mouse.tx = p.x;
      mouse.ty = p.y;
    };
    const onLeave = () => {
      hovering = false;
    };
    const ro = new ResizeObserver(() => paint());
    ro.observe(tile);
    tile.addEventListener("pointerenter", onEnter);
    tile.addEventListener("pointermove", onMove);
    tile.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      tile.removeEventListener("pointerenter", onEnter);
      tile.removeEventListener("pointermove", onMove);
      tile.removeEventListener("pointerleave", onLeave);
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [year]);

  return (
    <div ref={tileRef} className={styles.yearTile} style={{ order }} role="heading" aria-level={2} data-fx="off">
      <span ref={textRef}>{year}</span>
      <canvas ref={canvasRef} className={styles.yearFx} aria-hidden="true" />
    </div>
  );
}
