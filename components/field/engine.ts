/*
  The field.

  The background is not decoration — it is the building's air. Every station
  in the cathedral owns a real anchor node in the field. Point at a chapel
  anywhere on the site and its anchor blooms, pulls its neighbours into orbit,
  and repaints its region of the field in that chapel's own glass.

  Two layers:

    1. A WebGL2 fragment shader painting a slow, domain-warped aurora. One
       fullscreen triangle, rendered at 0.7x resolution because the signal is
       entirely low-frequency and nobody can see the difference.

    2. A Canvas2D constellation network. Neighbour lookup goes through a
       uniform spatial hash, so link-finding is O(n) rather than the O(n²) a
       double loop would cost — which is what lets the node count go up while
       the frame cost goes down.

  Everything degrades: no WebGL2 drops layer 1 and keeps layer 2; reduced
  motion renders a single composed still frame and never starts a rAF loop; a
  hidden tab stops the clock entirely.
*/

/* ── Public surface ──────────────────────────────────────────────────────── */

export interface FieldAPI {
  /** Bloom one station's anchor and dim the rest. `null` releases. */
  focus(slug: string | null): void;
  /** Emit a ripple through the network at viewport coordinates. */
  pulse(x: number, y: number, strength?: number): void;
  /** Lerp the ambient tint toward a hex colour. */
  tint(hex: string): void;
  /** Fade the whole field. The threshold pushes it back while it plays. */
  dim(level: number): void;
  destroy(): void;
}

declare global {
  interface Window {
    cotekField?: FieldAPI;
  }
}

/* ── Tuning ──────────────────────────────────────────────────────────────── */

const CFG = {
  /** One node per N px² of viewport, clamped. */
  density: 15_500,
  minNodes: 46,
  maxNodes: 190,
  /** Link radius in CSS pixels. Also the spatial-hash cell size. */
  link: 132,
  /** Pointer influence radius. */
  reach: 220,
  /** Ripple expansion, px per second. */
  rippleSpeed: 620,
  rippleBand: 70,
  glScale: 0.7,
  maxDpr: 2,
} as const;

/* ── Small helpers ───────────────────────────────────────────────────────── */

type RGB = [number, number, number];

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function hexToRgb(hex: string): RGB {
  const h = hex.trim().replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = Number.parseInt(full, 16);
  if (!Number.isFinite(n)) return [1, 1, 1];
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/** Deterministic PRNG, so the field composes identically on every load. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ── Shaders ─────────────────────────────────────────────────────────────── */

const VERT = /* glsl */ `#version 300 es
// A single oversized triangle covers the viewport with no vertex buffer at
// all — cheaper than a quad and it avoids the diagonal seam.
const vec2 P[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
out vec2 vUv;
void main() {
  vec2 p = P[gl_VertexID];
  vUv = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}`;

const FRAG = /* glsl */ `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 outColor;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uPointer;    // 0..1, spring-smoothed
uniform float uPointerAmp; // 0 when the pointer has never moved
uniform vec3  uAccent;     // the room's glass
uniform vec3  uAccent2;    // the focused station's glass
uniform float uFocus;      // 0..1 blend toward uAccent2
uniform float uScroll;     // 0..1 document progress
uniform float uDim;        // 1 = full, 0 = out

// Ashima simplex noise (public domain). Compact, no texture lookups.
vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec2 mod289(vec2 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865, 0.366025404, -0.577350269, 0.024390244);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float sum = 0.0, amp = 0.5;
  for (int i = 0; i < 4; i++) {
    sum += amp * snoise(p);
    p = p * 2.02 + 17.3;
    amp *= 0.5;
  }
  return sum;
}

// Hash-based grain. Breaks up the banding that any smooth gradient shows on
// an 8-bit display, far more cheaply than dithering.
float grain(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;
  // Correct for aspect so the noise cells stay round on wide screens.
  vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0);

  float t = uTime * 0.021;

  // Domain warp: sample noise with an offset that is itself noise. This is
  // what turns generic cloud fbm into something that looks like it flows.
  vec2 warp = vec2(
    fbm(p * 1.25 + vec2(t, -t * 0.7)),
    fbm(p * 1.25 + vec2(-t * 0.8, t * 1.1) + 4.2)
  );

  // The pointer drags the field rather than lighting a circle under itself.
  vec2 toPointer = p - (uPointer - 0.5) * vec2(uRes.x / uRes.y, 1.0);
  float pd = length(toPointer);
  float drag = uPointerAmp * exp(-pd * 2.1);
  warp += normalize(toPointer + 1e-5) * drag * 0.34;

  float n = fbm(p * 1.7 + warp * 0.85 + vec2(0.0, t * 0.55));
  n = n * 0.5 + 0.5;

  // Two thresholded bands read as depth; one alone reads as fog. The
  // thresholds sit high on purpose — the field should suggest volume at the
  // edge of perception, not sit on the page as visible smoke.
  float band1 = smoothstep(0.54, 0.94, n);
  float band2 = smoothstep(0.68, 1.02, n) * 0.55;

  vec3 tint = mix(uAccent, uAccent2, uFocus);

  vec3 col = vec3(0.0);
  col += tint * band1 * 0.072;
  col += mix(tint, vec3(0.55, 0.72, 1.0), 0.5) * band2 * 0.044;

  // A slow drift keyed to scroll, so the page feels like it travels.
  col += tint * 0.012 * (0.5 + 0.5 * sin(uScroll * 3.1415 * 2.0 + uTime * 0.08));

  // Heat under the pointer, additive and small.
  col += tint * drag * 0.07;

  // Vignette, biased slightly high — content sits above centre.
  float vig = smoothstep(1.16, 0.2, length((uv - vec2(0.5, 0.44)) * vec2(1.15, 1.0)));
  col *= vig * uDim;

  col += (grain(uv * uRes + uTime) - 0.5) * 0.016;

  outColor = vec4(max(col, 0.0), 1.0);
}`;

/* ── Node model ──────────────────────────────────────────────────────────── */

interface Anchor {
  slug: string;
  rgb: RGB;
  hex: string;
  /** 0..1 bloom, eased toward `target`. */
  focus: number;
  target: number;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  /** Baseline opacity. */
  base: number;
  /** Transient brightness from pointer and ripples, decays every frame. */
  energy: number;
  /** Free-running phase so nodes don't pulse in lockstep. */
  phase: number;
  anchor: Anchor | null;
  /** Home position, used to reel anchors and their orbits back. */
  hx: number;
  hy: number;
}

interface Ripple {
  x: number;
  y: number;
  age: number;
  strength: number;
}

export interface AnchorSpec {
  slug: string;
  color: string;
}

/* ── Engine ──────────────────────────────────────────────────────────────── */

export function createField(host: HTMLElement, anchorSpec: AnchorSpec[]): FieldAPI {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(pointer: fine)").matches;

  /* Canvases. The GL layer sits behind the 2D layer; both are decorative and
     hidden from assistive tech. */
  const glCanvas = document.createElement("canvas");
  const c2d = document.createElement("canvas");
  for (const el of [glCanvas, c2d]) {
    el.setAttribute("aria-hidden", "true");
    el.className = "field-layer";
    host.appendChild(el);
  }

  const ctx = c2d.getContext("2d", { alpha: true, desynchronized: true });
  if (!ctx) {
    return { focus() {}, pulse() {}, tint() {}, dim() {}, destroy() {} };
  }

  /* ── State ─────────────────────────────────────────────────────────────── */

  let W = 0;
  let H = 0;
  let dpr = 1;
  let nodes: Node[] = [];
  let ripples: Ripple[] = [];
  let raf = 0;
  let running = false;
  const t0 = performance.now();
  let last = t0;
  let scrollN = 0;
  let dimTarget = 1;
  let dimNow = 1;

  // Pointer: raw target, spring-smoothed actual, and an amplitude that stays
  // at zero until the user has actually moved — no phantom hotspot at 0,0.
  const ptr = { tx: -9999, ty: -9999, x: -9999, y: -9999, amp: 0, down: false, vx: 0, vy: 0 };

  const anchors: Anchor[] = anchorSpec.map((a) => ({
    slug: a.slug,
    hex: a.color,
    rgb: hexToRgb(a.color),
    focus: 0,
    target: 0,
  }));
  const anchorBySlug = new Map(anchors.map((a) => [a.slug, a]));
  let focused: Anchor | null = null;
  /* The node carrying the focused anchor. Resolved once when focus changes
     rather than searched for inside the per-node loop — that search was the
     one genuinely quadratic thing left in the frame. */
  let focusedNode: Node | null = null;

  const accent: RGB = hexToRgb("#2fdcb4");
  let accentTarget: RGB = [...accent] as RGB;

  /* ── Spatial hash ──────────────────────────────────────────────────────── */
  /* A uniform grid with cell size == link radius. Every node touches at most
     nine cells' worth of candidates, so the link pass is linear in node count
     instead of quadratic. Buckets are reused between frames. */

  let cols = 0;
  let rows = 0;
  let buckets: number[][] = [];

  function rebuildGrid() {
    cols = Math.max(1, Math.ceil(W / CFG.link));
    rows = Math.max(1, Math.ceil(H / CFG.link));
    buckets = Array.from({ length: cols * rows }, () => [] as number[]);
  }

  function fillGrid() {
    for (let i = 0; i < buckets.length; i++) buckets[i]!.length = 0;
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i]!;
      const cx = clamp((n.x / CFG.link) | 0, 0, cols - 1);
      const cy = clamp((n.y / CFG.link) | 0, 0, rows - 1);
      buckets[cy * cols + cx]!.push(i);
    }
  }

  /* ── Composition ───────────────────────────────────────────────────────── */

  function build() {
    const target = clamp(Math.round((W * H) / CFG.density), CFG.minNodes, CFG.maxNodes);
    const rnd = mulberry32(0x0c07e1);
    const next: Node[] = [];

    // Anchors first, on a jittered ring so the stations are always legible as
    // a constellation rather than landing on top of each other.
    const ringR = Math.min(W, H) * 0.36;
    anchors.forEach((a, i) => {
      const ang = (i / anchors.length) * Math.PI * 2 + rnd() * 0.4 - 0.2;
      const rr = ringR * (0.62 + rnd() * 0.55);
      const x = W * 0.5 + Math.cos(ang) * rr * (W > H ? 1.35 : 0.85);
      const y = H * 0.5 + Math.sin(ang) * rr;
      next.push({
        x: clamp(x, 40, W - 40),
        y: clamp(y, 40, H - 40),
        hx: clamp(x, 40, W - 40),
        hy: clamp(y, 40, H - 40),
        vx: 0,
        vy: 0,
        r: 2.6,
        base: 0.85,
        energy: 0,
        phase: rnd() * Math.PI * 2,
        anchor: a,
      });
    });

    for (let i = next.length; i < target; i++) {
      const x = rnd() * W;
      const y = rnd() * H;
      next.push({
        x,
        y,
        hx: x,
        hy: y,
        vx: (rnd() - 0.5) * 0.16,
        vy: (rnd() - 0.5) * 0.16,
        r: 0.5 + rnd() * 1.5,
        base: 0.2 + rnd() * 0.5,
        energy: 0,
        phase: rnd() * Math.PI * 2,
        anchor: null,
      });
    }

    nodes = next;
    focusedNode = focused ? (nodes.find((n) => n.anchor === focused) ?? null) : null;
    rebuildGrid();
  }

  /* ── Sizing ────────────────────────────────────────────────────────────── */

  function resize() {
    const w = host.clientWidth || window.innerWidth;
    // Use the layout viewport height, not innerHeight: on mobile the URL bar
    // collapsing must not trigger a rebuild on every scroll frame.
    const h = host.clientHeight || window.innerHeight;
    if (w === W && h === H) return;

    W = w;
    H = h;
    dpr = Math.min(window.devicePixelRatio || 1, CFG.maxDpr);

    c2d.width = Math.round(W * dpr);
    c2d.height = Math.round(H * dpr);
    c2d.style.width = `${W}px`;
    c2d.style.height = `${H}px`;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

    glCanvas.width = Math.round(W * CFG.glScale);
    glCanvas.height = Math.round(H * CFG.glScale);
    glCanvas.style.width = `${W}px`;
    glCanvas.style.height = `${H}px`;

    build();
    if (gl) gl.viewport(0, 0, glCanvas.width, glCanvas.height);
    if (reduced) drawStill();
  }

  /* ── WebGL layer ───────────────────────────────────────────────────────── */

  const gl = glCanvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });

  let program: WebGLProgram | null = null;
  const uni: Record<string, WebGLUniformLocation | null> = {};

  if (gl) {
    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        // Fail quietly in production; the 2D layer alone still looks composed.
        console.warn("[field] shader:", gl.getShaderInfoLog(sh));
        return null;
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (vs && fs) {
      const p = gl.createProgram()!;
      gl.attachShader(p, vs);
      gl.attachShader(p, fs);
      gl.linkProgram(p);
      if (gl.getProgramParameter(p, gl.LINK_STATUS)) {
        program = p;
        gl.useProgram(p);
        for (const name of [
          "uRes",
          "uTime",
          "uPointer",
          "uPointerAmp",
          "uAccent",
          "uAccent2",
          "uFocus",
          "uScroll",
          "uDim",
        ]) {
          uni[name] = gl.getUniformLocation(p, name);
        }
      }
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    }
  }

  function drawGL(time: number) {
    if (!gl || !program) return;
    gl.useProgram(program);
    gl.uniform2f(uni.uRes!, glCanvas.width, glCanvas.height);
    gl.uniform1f(uni.uTime!, time);
    gl.uniform2f(
      uni.uPointer!,
      ptr.x < -1000 ? 0.5 : ptr.x / Math.max(W, 1),
      ptr.x < -1000 ? 0.5 : 1 - ptr.y / Math.max(H, 1),
    );
    gl.uniform1f(uni.uPointerAmp!, ptr.amp);
    gl.uniform3f(uni.uAccent!, accent[0], accent[1], accent[2]);
    const f = focused;
    gl.uniform3f(
      uni.uAccent2!,
      f ? f.rgb[0] : accent[0],
      f ? f.rgb[1] : accent[1],
      f ? f.rgb[2] : accent[2],
    );
    gl.uniform1f(uni.uFocus!, f ? f.focus : 0);
    gl.uniform1f(uni.uScroll!, scrollN);
    gl.uniform1f(uni.uDim!, dimNow);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  /* ── Simulation ────────────────────────────────────────────────────────── */

  function step(dt: number) {
    // Spring the pointer. Chasing the raw position makes the field twitch;
    // easing it gives the whole thing a sense of mass.
    if (ptr.tx > -1000) {
      const nx = lerp(ptr.x < -1000 ? ptr.tx : ptr.x, ptr.tx, 1 - Math.exp(-dt * 9));
      const ny = lerp(ptr.y < -1000 ? ptr.ty : ptr.y, ptr.ty, 1 - Math.exp(-dt * 9));
      ptr.vx = nx - ptr.x;
      ptr.vy = ny - ptr.y;
      ptr.x = nx;
      ptr.y = ny;
      ptr.amp = lerp(ptr.amp, 1, 1 - Math.exp(-dt * 3));
    } else {
      ptr.amp = lerp(ptr.amp, 0, 1 - Math.exp(-dt * 2));
    }

    // Ease anchor bloom, ambient tint and the global dim.
    for (const a of anchors) {
      a.focus = lerp(a.focus, a.target, 1 - Math.exp(-dt * 6));
    }
    const k = 1 - Math.exp(-dt * 2.5);
    accent[0] = lerp(accent[0], accentTarget[0], k);
    accent[1] = lerp(accent[1], accentTarget[1], k);
    accent[2] = lerp(accent[2], accentTarget[2], k);
    dimNow = lerp(dimNow, dimTarget, 1 - Math.exp(-dt * 3.5));

    // Ripples.
    for (const r of ripples) r.age += dt;
    ripples = ripples.filter((r) => r.age * CFG.rippleSpeed < Math.hypot(W, H) * 1.1);

    const f = focused;
    const orbitR = Math.min(W, H) * 0.17;

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i]!;

      /* Pointer force. Pressed = attract (a gravity well you can drag around),
         released = gentle repulsion. Both scale with distance so the boundary
         of the effect is soft. */
      const dx = n.x - ptr.x;
      const dy = n.y - ptr.y;
      const d2 = dx * dx + dy * dy;
      if (ptr.amp > 0.01 && d2 < CFG.reach * CFG.reach) {
        const d = Math.sqrt(d2) || 1;
        const falloff = (1 - d / CFG.reach) * ptr.amp;
        const sign = ptr.down ? -1.9 : 1;
        const force = falloff * 46 * sign * dt;
        n.vx += (dx / d) * force;
        n.vy += (dy / d) * force;
        // Pointer motion drags nearby nodes along with it — the field feels
        // like it has viscosity rather than just a force field.
        n.vx += ptr.vx * falloff * 0.5;
        n.vy += ptr.vy * falloff * 0.5;
        n.energy = Math.max(n.energy, falloff);
      }

      // Ripple front.
      for (const rp of ripples) {
        const rr = rp.age * CFG.rippleSpeed;
        const d = Math.hypot(n.x - rp.x, n.y - rp.y);
        const band = Math.abs(d - rr);
        if (band < CFG.rippleBand) {
          const kk = (1 - band / CFG.rippleBand) * rp.strength * Math.exp(-rp.age * 1.1);
          n.energy = Math.max(n.energy, kk);
          const inv = d || 1;
          n.vx += ((n.x - rp.x) / inv) * kk * 26 * dt;
          n.vy += ((n.y - rp.y) / inv) * kk * 26 * dt;
        }
      }

      /* Focus behaviour. The focused anchor drifts to centre-ish and a third
         of the free nodes are reeled into a ring around it, so pointing at a
         chapel literally assembles its constellation. */
      if (f) {
        if (n.anchor === f) {
          n.vx += (W * 0.5 - n.x) * 0.9 * dt * f.focus;
          n.vy += (H * 0.46 - n.y) * 0.9 * dt * f.focus;
          n.energy = Math.max(n.energy, f.focus);
        } else if (!n.anchor && i % 3 === 0 && focusedNode) {
          const ang = (i / nodes.length) * Math.PI * 2;
          const tx = focusedNode.x + Math.cos(ang) * orbitR;
          const ty = focusedNode.y + Math.sin(ang) * orbitR;
          n.vx += (tx - n.x) * 0.55 * dt * f.focus;
          n.vy += (ty - n.y) * 0.55 * dt * f.focus;
        }
      } else if (n.anchor) {
        // Released anchors drift home rather than snapping.
        n.vx += (n.hx - n.x) * 0.35 * dt;
        n.vy += (n.hy - n.y) * 0.35 * dt;
      }

      // Integrate with damping.
      n.x += n.vx * dt * 60;
      n.y += n.vy * dt * 60;
      const damp = Math.exp(-dt * (ptr.down ? 1.4 : 0.9));
      n.vx *= damp;
      n.vy *= damp;
      n.energy *= Math.exp(-dt * 2.2);
      n.phase += dt * 0.7;

      // Wrap with a margin so nothing pops at the edge.
      const m = 60;
      if (n.x < -m) n.x = W + m;
      else if (n.x > W + m) n.x = -m;
      if (n.y < -m) n.y = H + m;
      else if (n.y > H + m) n.y = -m;
    }
  }

  /* ── Painting ──────────────────────────────────────────────────────────── */

  function paint() {
    const g = ctx!;
    g.clearRect(0, 0, W, H);
    if (dimNow < 0.02) return;
    fillGrid();

    const f = focused;
    // When a chapel is focused everything unrelated recedes, so the eye has
    // somewhere to go.
    const globalDim = (f ? 1 - f.focus * 0.55 : 1) * dimNow;

    /* Links. Each cell only tests the four forward neighbour cells plus its
       own, which visits every pair exactly once with no dedupe bookkeeping. */
    g.lineWidth = 0.8;
    for (let cy = 0; cy < rows; cy++) {
      for (let cx = 0; cx < cols; cx++) {
        const cell = buckets[cy * cols + cx]!;
        if (cell.length === 0) continue;

        for (let oy = 0; oy <= 1; oy++) {
          for (let ox = oy === 0 ? 0 : -1; ox <= 1; ox++) {
            const nx = cx + ox;
            const ny = cy + oy;
            if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
            const other = buckets[ny * cols + nx]!;
            if (other.length === 0) continue;
            const same = ox === 0 && oy === 0;

            for (let ii = 0; ii < cell.length; ii++) {
              const a = nodes[cell[ii]!]!;
              for (let jj = same ? ii + 1 : 0; jj < other.length; jj++) {
                const b = nodes[other[jj]!]!;
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const d2 = dx * dx + dy * dy;
                if (d2 > CFG.link * CFG.link) continue;

                const d = Math.sqrt(d2);
                const heat = Math.max(a.energy, b.energy);
                let alpha = (1 - d / CFG.link) * (0.13 + heat * 0.55) * globalDim;
                if (alpha < 0.004) continue;

                // A link inherits colour from whichever end is an anchor, so
                // constellations read as belonging to their station.
                const owner = a.anchor ?? b.anchor;
                let col: RGB;
                if (owner && (owner === f || !f)) {
                  col = owner.rgb;
                  alpha *= 1 + owner.focus * 1.6;
                } else {
                  col = accent;
                }

                g.strokeStyle = `rgba(${(col[0] * 255) | 0},${(col[1] * 255) | 0},${(col[2] * 255) | 0},${alpha.toFixed(3)})`;
                g.beginPath();
                g.moveTo(a.x, a.y);
                g.lineTo(b.x, b.y);
                g.stroke();
              }
            }
          }
        }
      }
    }

    /* Nodes. Anchors are drawn last and larger so stations sit on top of the
       ambient field rather than getting lost in it. */
    for (const n of nodes) {
      if (n.anchor) continue;
      const pulse = 0.72 + 0.28 * Math.sin(n.phase);
      const alpha = clamp((n.base * pulse + n.energy * 0.8) * globalDim, 0, 1);
      if (alpha < 0.02) continue;
      g.beginPath();
      g.arc(n.x, n.y, n.r + n.energy * 1.4, 0, Math.PI * 2);
      g.fillStyle = `rgba(${(accent[0] * 255) | 0},${(accent[1] * 255) | 0},${(accent[2] * 255) | 0},${alpha.toFixed(3)})`;
      g.fill();
    }

    for (const n of nodes) {
      const a = n.anchor;
      if (!a) continue;
      const [r, gg, b] = a.rgb;
      const R = (r * 255) | 0;
      const G = (gg * 255) | 0;
      const B = (b * 255) | 0;
      const bloom = a.focus;
      const pulse = 0.8 + 0.2 * Math.sin(n.phase * 1.4);
      const rad = (n.r + bloom * 5 + n.energy * 2) * pulse;

      // Halo: generous in radius, restrained in alpha. A focused chapel should
      // colour the region behind the copy, not sit on top of it as a flare.
      const haloR = rad * (5 + bloom * 14);
      const halo = g.createRadialGradient(n.x, n.y, 0, n.x, n.y, haloR);
      halo.addColorStop(0, `rgba(${R},${G},${B},${(dimNow * (0.13 + bloom * 0.17)).toFixed(3)})`);
      halo.addColorStop(0.45, `rgba(${R},${G},${B},${(dimNow * (0.05 + bloom * 0.08)).toFixed(3)})`);
      halo.addColorStop(1, `rgba(${R},${G},${B},0)`);
      g.fillStyle = halo;
      g.beginPath();
      g.arc(n.x, n.y, haloR, 0, Math.PI * 2);
      g.fill();

      // Core
      g.beginPath();
      g.arc(n.x, n.y, rad, 0, Math.PI * 2);
      g.fillStyle = `rgba(${R},${G},${B},${(dimNow * (0.6 + bloom * 0.4)).toFixed(3)})`;
      g.fill();

      // A ring only on the focused anchor — a label would be noise at this size.
      if (bloom > 0.02) {
        g.beginPath();
        g.arc(n.x, n.y, rad + 10 + bloom * 16, 0, Math.PI * 2);
        g.strokeStyle = `rgba(${R},${G},${B},${(bloom * 0.5 * dimNow).toFixed(3)})`;
        g.lineWidth = 1;
        g.stroke();
      }
    }

    // Ripple fronts, drawn as thin expanding rings.
    for (const rp of ripples) {
      const rr = rp.age * CFG.rippleSpeed;
      const alpha = Math.max(0, rp.strength * Math.exp(-rp.age * 1.5) * 0.4 * dimNow);
      if (alpha < 0.01) continue;
      const c = focused ? focused.rgb : accent;
      g.beginPath();
      g.arc(rp.x, rp.y, rr, 0, Math.PI * 2);
      g.strokeStyle = `rgba(${(c[0] * 255) | 0},${(c[1] * 255) | 0},${(c[2] * 255) | 0},${alpha.toFixed(3)})`;
      g.lineWidth = 1.2;
      g.stroke();
    }
  }

  /** One composed frame for reduced-motion users. Still a real composition. */
  function drawStill() {
    dimNow = dimTarget;
    step(0.016);
    paint();
    drawGL(0);
  }

  /* ── Loop ──────────────────────────────────────────────────────────────── */

  function frame(now: number) {
    if (!running) return;
    // Clamp dt so a backgrounded tab returning does not launch every node into
    // orbit on the first frame after it resumes.
    const dt = clamp((now - last) / 1000, 0, 0.05);
    last = now;
    const time = (now - t0) / 1000;

    step(dt);
    paint();
    drawGL(time);

    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || reduced) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  /* ── Events ────────────────────────────────────────────────────────────── */

  const onPointerMove = (e: PointerEvent) => {
    ptr.tx = e.clientX;
    ptr.ty = e.clientY;
  };
  const onPointerDown = (e: PointerEvent) => {
    ptr.down = true;
    ptr.tx = e.clientX;
    ptr.ty = e.clientY;
  };
  const onPointerUp = (e: PointerEvent) => {
    ptr.down = false;
    api.pulse(e.clientX, e.clientY, 1);
  };
  const onPointerLeave = () => {
    ptr.tx = -9999;
    ptr.ty = -9999;
    ptr.down = false;
  };

  /* Touch devices have no hover, so the field would otherwise be inert. Tilt
     drives a virtual pointer instead. No permission prompt is raised — where
     the browser withholds the event, the field simply stays calm. */
  const onTilt = (e: DeviceOrientationEvent) => {
    if (fine || e.gamma == null || e.beta == null) return;
    ptr.tx = W * 0.5 + clamp(e.gamma / 35, -1, 1) * W * 0.42;
    ptr.ty = H * 0.5 + clamp((e.beta - 45) / 40, -1, 1) * H * 0.35;
  };

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollN = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
  };

  const onVisibility = () => {
    if (document.hidden) stop();
    else start();
  };

  const ro = new ResizeObserver(() => resize());

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerdown", onPointerDown, { passive: true });
  window.addEventListener("pointerup", onPointerUp, { passive: true });
  window.addEventListener("pointercancel", onPointerLeave, { passive: true });
  document.addEventListener("pointerleave", onPointerLeave, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("deviceorientation", onTilt, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  ro.observe(host);

  /* ── API ───────────────────────────────────────────────────────────────── */

  const api: FieldAPI = {
    focus(slug) {
      const next = slug ? (anchorBySlug.get(slug) ?? null) : null;
      if (next === focused) return;
      for (const a of anchors) a.target = 0;
      focused = next;
      focusedNode = next ? (nodes.find((n) => n.anchor === next) ?? null) : null;
      if (next) next.target = 1;
      if (reduced) drawStill();
    },
    pulse(x, y, strength = 1) {
      if (reduced) return;
      // Cap the queue: a user holding down the mouse should not be able to
      // build an unbounded ripple list.
      if (ripples.length > 6) ripples.shift();
      ripples.push({ x, y, age: 0, strength });
    },
    tint(hex) {
      accentTarget = hexToRgb(hex);
      if (reduced) drawStill();
    },
    dim(level) {
      dimTarget = clamp(level, 0, 1);
      if (reduced) drawStill();
    },
    destroy() {
      stop();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerLeave);
      document.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("deviceorientation", onTilt);
      document.removeEventListener("visibilitychange", onVisibility);
      glCanvas.remove();
      c2d.remove();
    },
  };

  resize();
  onScroll();
  if (reduced) drawStill();
  else start();

  return api;
}
