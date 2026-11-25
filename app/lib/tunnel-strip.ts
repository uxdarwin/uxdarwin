// Tunnel Strip: a looping WebGL image strip that bends gently toward the viewer.
// Engine from Darwin's spec (tunnel-strip-implementation.md); presets are his tuned values.
export type TunnelConfig = {
  curve: number; speed: number; gap: number; radius: number;
  fold: number; smear: number; fringe: number;
  zone: number; edge: number; aberration: number; distortion: number; flare: number;
};
export type TunnelLayout = {
  baseWidth: number; cardWidth: number; cardHeight: number; canvasHeight: number;
  centre: "seam" | "card";
};

export const LAYOUTS: Record<"wide" | "card", TunnelLayout> = {
  wide: { baseWidth: 1274, cardWidth: 501, cardHeight: 409, canvasHeight: 467, centre: "card" },
  card: { baseWidth: 1084, cardWidth: 318.67, cardHeight: 336, canvasHeight: 400, centre: "seam" },
};

export const PRESETS: Record<"wide" | "card", TunnelConfig> = {
  wide: { curve: 20, speed: 48, gap: 2, radius: 12, fold: 100, smear: 100, fringe: 100, zone: 20, edge: 20, aberration: 100, distortion: 100, flare: 20 },
  card: { curve: 30, speed: 40, gap: 2, radius: 4, fold: 45, smear: 50, fringe: 35, zone: 55, edge: 25, aberration: 30, distortion: 25, flare: 15 },
};

// Vertex: places each card on a circular arc (arc-length param u), so cards bend smoothly.
// Edge effects use screen-space x (vSx) so they stay pinned to the section edges.
const VS = `
attribute vec2 aPos;
uniform float uS, uK, uD, uFlare, uZoneV;
uniform vec2 uSize;
uniform mat4 uP;
varying vec2 vUv, vLoc, vHalf;
varying float vSx;
void main(){
  float u = uS + aPos.x * uSize.x;
  float y = aPos.y * uSize.y;
  vec3 p;
  if (abs(uK) < 1e-6) p = vec3(u, y, -uD);
  else { float t = u * uK; p = vec3(sin(t) / uK, y, -uD + (1. - cos(t)) / uK); }
  gl_Position = uP * vec4(p, 1.);
  float sx = gl_Position.x / gl_Position.w;
  float ev = smoothstep(uZoneV, 1.15, abs(sx));
  gl_Position.y *= 1. + uFlare * ev * ev * .45;
  vUv = aPos + .5; vLoc = aPos * uSize; vHalf = uSize * .5; vSx = sx;
}`;

const FS = `
precision mediump float;
uniform sampler2D uT;
uniform vec2 uUV;
uniform float uR, uVel, uSm, uFr, uEd, uAb, uDi, uZone;
varying vec2 vUv, vLoc, vHalf;
varying float vSx;
vec2 m(vec2 q){ return 1. - abs(1. - mod(q, 2.)); } // mirror sampling: no edge streaks
void main(){
  float side = vSx < 0. ? -1. : 1.;
  float e = smoothstep(uZone, 1., abs(vSx)); float e2 = e * e;
  float yc = vUv.y - .5;
  vec2 uv = (vUv - .5) * uUV + .5;                       // object-fit: cover
  uv.x -= side * uDi * e2 * .17 * (1. - 4. * yc * yc);   // lens distortion
  uv.y = .5 + (uv.y - .5) * (1. - uDi * e2 * .2);
  float sm = uVel * uSm * (.15 + e) * .09;                // exit smear
  vec2 ab = vec2(side, yc * .8) * uAb * e2 * .024         // edge aberration
          + vec2(uVel * uFr * (.4 + e) * .014, 0.);       // fling fringe
  vec3 c = vec3(0.);
  for (int i = 0; i < 5; i++) {
    float f = float(i) / 4. - .5;
    vec2 q = uv + vec2(sm * f, 0.);
    c.r += texture2D(uT, m(q + ab)).r;
    c.g += texture2D(uT, m(q)).g;
    c.b += texture2D(uT, m(q - ab)).b;
  }
  c /= 5.;
  vec2 d2 = abs(vLoc) - (vHalf - uR);
  float d = length(max(d2, 0.)) + min(max(d2.x, d2.y), 0.) - uR; // rounded corners
  float a = clamp(.5 - d / .8, 0., 1.) * (1. - uEd * e2);           // edge fade (alpha)
  gl_FragColor = vec4(c * a, a);
}`;

const FOV = (32 * Math.PI) / 180;

export function createTunnel(
  root: HTMLElement,
  canvas: HTMLCanvasElement,
  opts: { images: string[]; layout: TunnelLayout; config: TunnelConfig; onFallback?: () => void },
) {
  let { layout, config } = opts;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, antialias: true, alpha: true });
  if (!gl) { opts.onFallback?.(); return { destroy() {}, setConfig() {}, setPaused() {} }; }

  const sh = (t: number, s: string) => {
    const x = gl.createShader(t)!; gl.shaderSource(x, s); gl.compileShader(x);
    if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(x) || "shader");
    return x;
  };
  const prog = gl.createProgram()!;
  try {
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || "link");
  } catch (err) { console.warn(err); opts.onFallback?.(); return { destroy() {}, setConfig() {}, setPaused() {} }; }
  gl.useProgram(prog);

  const U: Record<string, WebGLUniformLocation | null> = {};
  ["uS","uK","uD","uSize","uP","uT","uUV","uR","uVel","uSm","uFr","uEd","uAb","uDi","uZone","uZoneV","uFlare"]
    .forEach((n) => (U[n] = gl.getUniformLocation(prog, n)));

  // 48 x-segments so the card can bend
  const SEG = 48, verts: number[] = [];
  for (let i = 0; i < SEG; i++) {
    const a = i / SEG - .5, b = (i + 1) / SEG - .5;
    verts.push(a,-.5, b,-.5, a,.5, a,.5, b,-.5, b,.5);
  }
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const vertCount = verts.length / 2;
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // textures: 1px placeholder until each image loads
  type Tex = { t: WebGLTexture; ar: number; loaded: boolean };
  const texParams = () => {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  };
  const texs: Tex[] = opts.images.map((src) => {
    const t = gl.createTexture()!; gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([24,24,27,255]));
    texParams();
    const tex: Tex = { t, ar: 1, loaded: false };
    const img = new Image(); img.crossOrigin = "anonymous"; img.decoding = "async";
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      texParams(); tex.ar = img.naturalWidth / img.naturalHeight; tex.loaded = true;
    };
    img.src = src;
    return tex;
  });

  // sizing
  let W = 0, H = 0, sc = 1;
  const size = () => {
    const w = root.clientWidth;
    sc = Math.max(.5, Math.min(1, w / layout.baseWidth));
    const h = Math.round(layout.canvasHeight * sc);
    canvas.style.height = h + "px";
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = w; H = h; canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
  };
  const ro = new ResizeObserver(size); ro.observe(root); size();

  // motion state
  let offset = 0, vel = 0, vn = 0, dir = 1, paused = false, visible = true, raf = 0, last = performance.now();
  let drag: { x: number; t: number; v: number } | null = null;

  const draw = () => {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    const D = H / 2 / Math.tan(FOV / 2), near = 10, far = D * 4, f = 1 / Math.tan(FOV / 2), A = W / H;
    gl.uniformMatrix4fv(U.uP, false, [f/A,0,0,0, 0,f,0,0, 0,0,(far+near)/(near-far),-1, 0,0,(2*far*near)/(near-far),0]);
    const c = config;
    const k = ((c.curve / 100) * .0028 + (reduce ? 0 : (c.fold / 100) * vn * .0022)) * (1084 / layout.baseWidth) / sc;
    // Every card shares one height; its width follows its image, so nothing is cropped.
    // Until an image loads, its card keeps the layout's default width.
    const ch = layout.cardHeight * sc, gap = c.gap * sc, n = texs.length;
    const ws = texs.map((t) => (t.ar > 0 && t.loaded ? ch * t.ar : layout.cardWidth * sc));
    const cyc = ws.reduce((a, w) => a + w + gap, 0);
    const reps = Math.max(1, Math.ceil((W * 2.4) / cyc)), M = n * reps, L = reps * cyc;
    const starts: number[] = []; let acc = 0;
    for (let i = 0; i < n; i++) { starts.push(acc + ws[i] / 2); acc += ws[i] + gap; }
    gl.uniform1f(U.uK, k); gl.uniform1f(U.uD, D); gl.uniform1f(U.uR, c.radius * sc);
    gl.uniform1f(U.uVel, vn); gl.uniform1f(U.uSm, c.smear / 100); gl.uniform1f(U.uFr, (c.fringe / 100) * dir);
    gl.uniform1f(U.uEd, (c.edge / 100) * .95);
    const zone = 1 - c.zone / 100; gl.uniform1f(U.uZone, zone); gl.uniform1f(U.uZoneV, zone);
    gl.uniform1f(U.uAb, c.aberration / 100); gl.uniform1f(U.uDi, c.distortion / 100); gl.uniform1f(U.uFlare, c.flare / 100);

    // project arc position -> screen x (px from centre), for culling; skip anything past ~83° of arc
    const proj = (u: number) => {
      if (Math.abs(u * k) > 1.45) return Infinity * Math.sign(u);
      const t = u * k, x = k < 1e-6 ? u : Math.sin(t) / k, z = k < 1e-6 ? -D : -D + (1 - Math.cos(t)) / k;
      return (x * D) / -z;
    };
    const base = (layout.centre === "seam" ? -(ws[0] + gap) / 2 : 0) - starts[0];
    for (let i = 0; i < M; i++) {
      const j = i % n, cw = ws[j];
      const s = (((((Math.floor(i / n) * cyc + starts[j]) + offset + base + L / 2) % L) + L) % L) - L / 2;
      const a = proj(s - cw / 2), b = proj(s + cw / 2);
      if (!isFinite(a) && !isFinite(b)) continue;
      if (Math.min(a, b) > W / 2 + 4 || Math.max(a, b) < -W / 2 - 4) continue;
      const tx = texs[j], ca = cw / ch;
      gl.uniform2f(U.uSize, cw, ch);
      gl.uniform2f(U.uUV, tx.ar > ca ? ca / tx.ar : 1, tx.ar > ca ? 1 : tx.ar / ca);
      gl.bindTexture(gl.TEXTURE_2D, tx.t); gl.uniform1f(U.uS, s);
      gl.drawArrays(gl.TRIANGLES, 0, vertCount);
    }
  };

  const frame = (now: number) => {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    const cruise = paused || reduce ? 0 : -config.speed;
    if (!drag) { vel += (cruise - vel) * (1 - Math.exp(-dt * 2.2)); offset += vel * dt; }
    else drag.v *= Math.exp(-dt * 10);
    const sp = Math.min(1, Math.abs(vel) / 1400);
    vn += (sp - vn) * (1 - Math.exp(-dt * 9));
    if (Math.abs(vel) > 1) dir = Math.sign(vel);
    draw();
    raf = visible && !document.hidden ? requestAnimationFrame(frame) : 0;
  };
  const start = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };

  // input
  const onDown = (e: PointerEvent) => { if (e.button) return; root.setPointerCapture(e.pointerId); drag = { x: e.clientX, t: performance.now(), v: 0 }; };
  const onMove = (e: PointerEvent) => {
    if (!drag) return;
    const now = performance.now(), dx = e.clientX - drag.x, dt = Math.max(1, now - drag.t) / 1000;
    offset += dx; drag.v = drag.v * .6 + (dx / dt) * .4; drag.x = e.clientX; drag.t = now; vel = drag.v;
  };
  const onUp = () => { if (drag) { vel = Math.max(-4000, Math.min(4000, drag.v)); drag = null; } };
  const onWheel = (e: WheelEvent) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); vel -= e.deltaX * 9; } };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") { vel += 900; e.preventDefault(); }
    if (e.key === "ArrowRight") { vel -= 900; e.preventDefault(); }
    if (e.key === " ") { paused = !paused; e.preventDefault(); }
  };
  root.addEventListener("pointerdown", onDown);
  root.addEventListener("pointermove", onMove);
  root.addEventListener("pointerup", onUp);
  root.addEventListener("pointercancel", onUp);
  root.addEventListener("wheel", onWheel, { passive: false });
  root.addEventListener("keydown", onKey);

  const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) start(); });
  io.observe(root);
  const onVis = () => { if (!document.hidden) start(); };
  document.addEventListener("visibilitychange", onVis);
  start();

  return {
    setConfig(next: Partial<TunnelConfig>) { config = { ...config, ...next }; },
    setPaused(p: boolean) { paused = p; },
    destroy() {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      root.removeEventListener("pointerdown", onDown); root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerup", onUp); root.removeEventListener("pointercancel", onUp);
      root.removeEventListener("wheel", onWheel); root.removeEventListener("keydown", onKey);
      texs.forEach((t) => gl.deleteTexture(t.t)); gl.deleteBuffer(buf); gl.deleteProgram(prog);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
