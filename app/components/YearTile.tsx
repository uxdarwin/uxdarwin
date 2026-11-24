"use client";

import { useEffect, useRef } from "react";
import styles from "./feed.module.css";

// Hover effect for the blue year tiles: rings ripple out from the pointer through the pixel
// digits, with a line wave like the logo animation and a red/cyan split like the hover intros.
// Moving the pointer stirs it; resting lets it settle back to sharp. It also plays by itself
// now and then while the tile is in view.

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
  vec2 off=dir*ring*.018*amp/vec2(aspect,1.);
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

const MAX_SPEED = 0.9; // tile widths per second
const MAX_ENERGY = 0.9;

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
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    let gl: WebGLRenderingContext | null = null;
    let u: Record<string, WebGLUniformLocation | null> = {};
    let texture: WebGLTexture | null = null;
    let frame = 0;
    let start = 0;
    let last = 0;
    let hovering = false;
    let autoUntil = 0; // the self-playing ripple runs until this time
    let drift = 0;
    let timer = 0;
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
      // Place the digits exactly where the page draws them, so switching to the canvas never
      // shifts them: the span is trimmed to cap height and baseline, so its left edge is the
      // text origin and its bottom edge is the baseline.
      // Layout offsets ignore transforms, so the scroll-in scale
      // never skew the measurement (the tile is position: relative, so it is the offsetParent).
      ctx.textBaseline = "alphabetic";
      ctx.textAlign = "left";
      ctx.fillText(String(year), text.offsetLeft, text.offsetTop + text.offsetHeight);
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
      const auto = !hovering && now < autoUntil;
      if (auto) mouse.tx += drift * dt; // the self-playing ripple drifts across the digits
      // The ripple's center follows the pointer at a capped speed, so fast flicks glide.
      const dx = mouse.tx - mouse.x;
      const dy = mouse.ty - mouse.y;
      const dist = Math.hypot(dx, dy);
      const step = Math.min(dist * Math.min(1, dt * 6), MAX_SPEED * dt);
      if (dist > 0) {
        mouse.x += (dx / dist) * step;
        mouse.y += (dy / dist) * step;
      }
      energy *= Math.exp(-dt * 2.6); // resting settles back to sharp
      const active = hovering || auto;
      const target = active ? Math.min(hovering ? 0.85 : 0.7, energy) : 0;
      amp += (target - amp) * Math.min(1, dt * 4);
      if (gl) {
        gl.uniform2f(u.mouse, mouse.x, mouse.y);
        gl.uniform1f(u.time, (now - start) / 1000);
        gl.uniform1f(u.amp, amp);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      if (!active && amp < 0.004) {
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
      energy = Math.max(energy, 0.9); // a splash on the way in
      run();
    };
    const onMove = (e: PointerEvent) => {
      if (!hovering) return;
      const p = local(e);
      // Movement adds energy in small, capped steps, so a fast pointer can't overdrive it.
      energy = Math.min(MAX_ENERGY, energy + Math.min(0.06, Math.hypot(p.x - mouse.tx, p.y - mouse.ty) * 1.2));
      mouse.tx = p.x;
      mouse.ty = p.y;
    };
    const onLeave = () => {
      hovering = false;
    };

    const run = () => {
      if (!frame) {
        start = last = performance.now();
        tile.dataset.fx = "on";
        frame = requestAnimationFrame(tick);
      }
    };

    // Plays on its own: once soon after the tile comes into view, then every 7 to 12 seconds
    // while it stays in view, from a different spot each time. Touch screens get it too.
    const autoplay = () => {
      if (still.matches || hovering || document.hidden) return;
      if (!gl && !init()) return;
      const fromLeft = Math.random() < 0.5;
      mouse.x = mouse.tx = fromLeft ? 0.2 + Math.random() * 0.2 : 0.6 + Math.random() * 0.2;
      mouse.y = mouse.ty = 0.35 + Math.random() * 0.3;
      drift = (fromLeft ? 1 : -1) * 0.18;
      energy = 0.85;
      autoUntil = performance.now() + 1800;
      run();
    };
    const schedule = (delay: number) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        autoplay();
        schedule(7000 + Math.random() * 5000);
      }, delay);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) schedule(400 + Math.random() * 900);
        else window.clearTimeout(timer);
      },
      { threshold: 0.6 },
    );
    io.observe(tile);
    const ro = new ResizeObserver(() => paint());
    document.fonts?.ready.then(() => paint());
    ro.observe(tile);
    tile.addEventListener("pointerenter", onEnter);
    tile.addEventListener("pointermove", onMove);
    tile.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      io.disconnect();
      ro.disconnect();
      tile.removeEventListener("pointerenter", onEnter);
      tile.removeEventListener("pointermove", onMove);
      tile.removeEventListener("pointerleave", onLeave);
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [year]);

  return (
    <div ref={tileRef} className={styles.yearTile} style={{ order }} role="heading" aria-level={2} data-fx="off" data-reveal="">
      <span ref={textRef}>{year}</span>
      <canvas ref={canvasRef} className={styles.yearFx} aria-hidden="true" />
    </div>
  );
}
