import { useEffect, useRef } from "react";

const TINT: Record<string, [number, number, number]> = {
  rose: [0.95, 0.55, 0.68],
  sol: [0.98, 0.78, 0.42],
  mint: [0.45, 0.95, 0.72],
  yarn: [0.35, 0.78, 0.48],
  ice: [0.72, 0.86, 0.95],
  night: [0.9, 0.82, 0.7],
  warm: [0.96, 0.74, 0.62],
};

type Mote = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  s: number;
  r: number;
  g: number;
  b: number;
  hx: number;
  hy: number;
  hx2: number;
  hy2: number;
};

const VS = `
attribute vec2 a;
attribute float s;
attribute vec3 c;
uniform vec2 uRes;
varying vec3 vC;
void main() {
  vec2 clip = (a / uRes) * 2.0 - 1.0;
  clip.y = -clip.y;
  gl_Position = vec4(clip, 0.0, 1.0);
  gl_PointSize = s;
  vC = c;
}`;

const FS = `
precision mediump float;
varying vec3 vC;
void main() {
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  float d = dot(p, p);
  if (d > 1.0) discard;
  float a = pow(1.0 - d, 1.6);
  gl_FragColor = vec4(vC, a);
}`;

export function Field({ aura }: { aura: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const auraRef = useRef(aura);
  auraRef.current = aura;

  useEffect(() => {
    const canvasEl = canvas.current;
    if (!canvasEl) return;
    const gl = canvasEl.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: true });
    if (!gl) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = reduce ? 80 : Math.min(1600, Math.round((window.innerWidth * window.innerHeight) / 1100));

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram();
    const vsh = compile(gl.VERTEX_SHADER, VS);
    const fsh = compile(gl.FRAGMENT_SHADER, FS);
    if (!prog || !vsh || !fsh || !gl.getShaderParameter(vsh, gl.COMPILE_STATUS) || !gl.getShaderParameter(fsh, gl.COMPILE_STATUS)) {
      return;
    }
    gl.attachShader(prog, vsh);
    gl.attachShader(prog, fsh);
    gl.linkProgram(prog);

    const buf = gl.createBuffer();
    const stride = 6;
    const tails = 3;
    const data = new Float32Array(count * tails * stride);
    const aLoc = gl.getAttribLocation(prog, "a");
    const sLoc = gl.getAttribLocation(prog, "s");
    const cLoc = gl.getAttribLocation(prog, "c");
    const uRes = gl.getUniformLocation(prog, "uRes");

    const bind = () => {
      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(aLoc);
      gl.enableVertexAttribArray(sLoc);
      gl.enableVertexAttribArray(cLoc);
      gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, stride * 4, 0);
      gl.vertexAttribPointer(sLoc, 1, gl.FLOAT, false, stride * 4, 8);
      gl.vertexAttribPointer(cLoc, 3, gl.FLOAT, false, stride * 4, 12);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.viewport(0, 0, canvasEl.width, canvasEl.height);
    };

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.floor(window.innerWidth * dpr));
      const h = Math.max(1, Math.floor(window.innerHeight * dpr));
      if (canvasEl.width !== w || canvasEl.height !== h) {
        canvasEl.width = w;
        canvasEl.height = h;
      }
      canvasEl.style.width = "100%";
      canvasEl.style.height = "100%";
      bind();
    };

    const motes: Mote[] = [];
    const birth = (m: Mote) => {
      m.x = Math.random() * window.innerWidth;
      m.y = Math.random() * window.innerHeight;
      m.vx = (Math.random() - 0.5) * 0.4;
      m.vy = -0.2 - Math.random() * 0.45;
      m.s = 4 + Math.random() * 8;
      m.hx = m.x;
      m.hy = m.y;
      m.hx2 = m.x;
      m.hy2 = m.y;
    };
    for (let i = 0; i < count; i++) {
      const m: Mote = { x: 0, y: 0, vx: 0, vy: 0, s: 3, r: 1, g: 0.9, b: 0.7, hx: 0, hy: 0, hx2: 0, hy2: 0 };
      birth(m);
      motes.push(m);
    }

    const pointer = { x: window.innerWidth * 0.55, y: window.innerHeight * 0.42, down: false };
    let wind = 0;
    let trickle = 0;
    let splash: [number, number, number] | null = null;
    let splashUntil = 0;
    const onPlay = () => {
      splash = [0.45 + Math.random() * 0.55, 0.25 + Math.random() * 0.7, 0.35 + Math.random() * 0.65];
      splashUntil = performance.now() + 4200;
    };
    window.addEventListener("sae-play", onPlay);
    let lastTop = 0;
    let raf = 0;
    let alive = true;

    const burst = (x: number, y: number) => {
      for (const m of motes) {
        const dx = m.x - x;
        const dy = m.y - y;
        const d2 = dx * dx + dy * dy;
        if (d2 > 36000) continue;
        const f = 520 / (d2 + 90);
        m.vx += dx * f;
        m.vy += dy * f;
      }
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      document.documentElement.style.setProperty("--lx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--ly", `${e.clientY}px`);
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest(".wall, .rover, .drive, .reel-fold")) return;
      pointer.down = true;
      burst(e.clientX, e.clientY);
    };
    const onUp = () => {
      pointer.down = false;
    };
    const onScroll = () => {
      const scroller = document.querySelector(".show");
      if (!scroller) return;
      wind = (scroller.scrollTop - lastTop) * 0.05;
      lastTop = scroller.scrollTop;
    };

    fit();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("resize", fit);
    document.querySelector(".show")?.addEventListener("scroll", onScroll, { passive: true });

    const step = () => {
      if (!alive) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = canvasEl.width / Math.max(1, w);
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        m.hx2 = m.hx;
        m.hy2 = m.hy;
        m.hx = m.x;
        m.hy = m.y;
        const dx = pointer.x - m.x;
        const dy = pointer.y - m.y;
        const pull = pointer.down ? 0.004 : 0.0014;
        m.vx += dx * pull + (Math.random() - 0.5) * 0.03;
        m.vy += dy * pull - 0.006 + wind * 0.03;
        if (pointer.down) {
          m.vx += -dy * 0.0011;
          m.vy += dx * 0.0011;
        }
        m.vx *= 0.965;
        m.vy *= 0.965;
        m.x += m.vx;
        m.y += m.vy;
        if (m.y < -10) m.y = h + 8;
        if (m.y > h + 14) m.y = -8;
        if (m.x < -10) m.x = w + 8;
        if (m.x > w + 10) m.x = -8;
        const tint = TINT[auraRef.current] ?? TINT.night;
        const flow = splash && performance.now() < splashUntil ? splash : tint;
        const wave = Math.sin(trickle + i * 0.17) * 0.08;
        const wing = auraRef.current === "warm" && i % 5 === 0 ? ([0.62, 0.38, 0.78] as const) : flow;
        const glow = pointer.down ? 0.22 : 0;
        m.r += (Math.min(1, wing[0] + wave + glow) - m.r) * 0.05;
        m.g += (Math.min(1, wing[1] + wave * 0.4 + glow) - m.g) * 0.05;
        m.b += (Math.min(1, wing[2] - wave + glow * 0.5) - m.b) * 0.05;
        const write = (n: number, x: number, y: number, s: number, k: number) => {
          const o = n * stride;
          data[o] = x * dpr;
          data[o + 1] = y * dpr;
          data[o + 2] = s * dpr;
          data[o + 3] = m.r * k;
          data[o + 4] = m.g * k;
          data[o + 5] = m.b * k;
        };
        const head = pointer.down ? m.s * 1.7 : m.s;
        write(i * tails, m.hx2, m.hy2, m.s * 0.45, 0.28);
        write(i * tails + 1, m.hx, m.hy, m.s * 0.7, 0.55);
        write(i * tails + 2, m.x, m.y, head, 1);
      }
      wind *= 0.88;
      trickle += 0.015;
      gl.uniform2f(uRes, canvasEl.width, canvasEl.height);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, count * tails);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("resize", fit);
      window.removeEventListener("sae-play", onPlay);
      document.querySelector(".show")?.removeEventListener("scroll", onScroll);
      gl.deleteProgram(prog);
      gl.deleteShader(vsh);
      gl.deleteShader(fsh);
      gl.deleteBuffer(buf);
    };
  }, []);

  return <canvas ref={canvas} className="field" aria-hidden />;
}
