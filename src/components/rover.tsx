import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Back } from "@/components/back";

type Stop = { x: number; y: number; name: string };
type Mission = {
  id: string;
  name: string;
  year: string;
  place: string;
  speed: number;
  seed: number;
  dirt: string;
  tint: string;
  craft: "rover" | "drone";
  ground: "flood" | "basalt" | "plain" | "layers" | "delta" | "photo";
  plate?: string;
  note: string;
  stops: Stop[];
};

const MISSIONS: Mission[] = [
  {
    id: "sojourner",
    name: "Sojourner",
    year: "1997",
    place: "Ares Vallis",
    speed: 26,
    seed: 1,
    dirt: "#a56a45",
    tint: "#e7b089",
    craft: "rover",
    ground: "flood",
    note: "Flood rubble. Not the flown path.",
    stops: [
      { x: 0.38, y: 0.62, name: "Barnacle Bill" },
      { x: 0.74, y: 0.34, name: "Yogi" },
    ],
  },
  {
    id: "spirit",
    name: "Spirit",
    year: "2004",
    place: "Gusev",
    speed: 40,
    seed: 2,
    dirt: "#5c342c",
    tint: "#c48474",
    craft: "rover",
    ground: "basalt",
    note: "Dark volcanic plain. Not the flown path.",
    stops: [
      { x: 0.42, y: 0.68, name: "Bonneville" },
      { x: 0.78, y: 0.3, name: "Columbia Hills" },
    ],
  },
  {
    id: "opportunity",
    name: "Opportunity",
    year: "2004",
    place: "Meridiani",
    speed: 40,
    seed: 3,
    dirt: "#c4a07a",
    tint: "#f3cf8f",
    craft: "rover",
    ground: "plain",
    note: "Pale sulfate plain. Not the flown path.",
    stops: [
      { x: 0.32, y: 0.58, name: "Eagle" },
      { x: 0.7, y: 0.32, name: "Endurance" },
    ],
  },
  {
    id: "curiosity",
    name: "Curiosity",
    year: "2012",
    place: "Gale",
    speed: 48,
    seed: 4,
    dirt: "#8a5a3c",
    tint: "#f4c9a8",
    craft: "rover",
    ground: "layers",
    note: "Layered mound. Not the flown path.",
    stops: [
      { x: 0.34, y: 0.64, name: "Glenelg" },
      { x: 0.76, y: 0.28, name: "Mount Sharp" },
    ],
  },
  {
    id: "perseverance",
    name: "Perseverance",
    year: "2021",
    place: "Jezero",
    speed: 52,
    seed: 5,
    dirt: "#4e342c",
    tint: "#d7a090",
    craft: "rover",
    ground: "delta",
    note: "Delta sediments. Not the flown path.",
    stops: [
      { x: 0.3, y: 0.66, name: "Octavia E. Butler" },
      { x: 0.74, y: 0.32, name: "the delta" },
    ],
  },
  {
    id: "moon",
    name: "Moon",
    year: "",
    place: "the silver ground",
    speed: 36,
    seed: 6,
    dirt: "#9aa3ad",
    tint: "#e8eef4",
    craft: "rover",
    ground: "photo",
    plate: "/beats/moon.jpg",
    note: "The picture is the ground.",
    stops: [
      { x: 0.28, y: 0.72, name: "near crater" },
      { x: 0.72, y: 0.28, name: "far light" },
    ],
  },
  {
    id: "europa",
    name: "Europa",
    year: "",
    place: "the marble ice",
    speed: 44,
    seed: 7,
    dirt: "#d7e4ea",
    tint: "#b7d4e2",
    craft: "drone",
    ground: "photo",
    plate: "/beats/europa.jpg",
    note: "Spec sim. A drone on the ice.",
    stops: [
      { x: 0.22, y: 0.78, name: "the near crack" },
      { x: 0.78, y: 0.22, name: "the far light" },
    ],
  },
];

function rocksFor(seed: number, stops: Stop[], ground: Mission["ground"]) {
  if (ground === "photo") return [];
  let a = seed * 9973;
  const next = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const count = ground === "flood" ? 18 : ground === "plain" ? 28 : ground === "basalt" ? 7 : 10;
  const rocks: { x: number; y: number; r: number }[] = [];
  for (let i = 0; i < count; i++) {
    const x = 0.08 + next() * 0.84;
    const y = 0.08 + next() * 0.84;
    const clear = stops.every((s) => Math.hypot(s.x - x, s.y - y) > 0.14);
    if (!clear || Math.hypot(x - 0.14, y - 0.82) < 0.14) continue;
    const r = ground === "plain" ? 1.5 + next() * 2 : ground === "flood" ? 5 + next() * 9 : 6 + next() * 8;
    rocks.push({ x, y, r });
  }
  return rocks;
}

export function Rover({ onClose, self = false }: { onClose: () => void; self?: boolean }) {
  const [mission, setMission] = useState(0);
  const [stop, setStop] = useState(0);
  const [done, setDone] = useState(false);
  const [pip, setPip] = useState("");
  const [sheet, setSheet] = useState(false);
  const [pos, setPos] = useState({ x: 28, y: 72 });
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keys = useRef<Record<string, boolean>>({});
  const aim = useRef<{ x: number; y: number } | null>(null);
  const rover = useRef({ x: 0.14, y: 0.82, h: -0.6 });
  const stopRef = useRef(0);
  const selfRef = useRef(self);
  selfRef.current = self;
  const m = MISSIONS[mission] ?? MISSIONS[0];

  useEffect(() => {
    rover.current = { x: 0.14, y: 0.82, h: -0.6 };
    stopRef.current = 0;
    setStop(0);
    setDone(false);
    setPip("");
  }, [mission]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
    };
    const up = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rocks = rocksFor(m.seed, m.stops, m.ground);
    const photo = m.plate ? new Image() : null;
    if (photo && m.plate) photo.src = m.plate;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const body = rover.current;
      const k = keys.current;
      const hands = k.arrowleft || k.a || k.arrowright || k.d || k.arrowup || k.w || k.arrowdown || k.s;
      if (selfRef.current && !hands && stopRef.current < m.stops.length) {
        const goal = m.stops[stopRef.current];
        if (goal) aim.current = { x: goal.x, y: goal.y };
      }
      let turn = (k.arrowleft || k.a ? -1 : 0) + (k.arrowright || k.d ? 1 : 0);
      let gas = (k.arrowup || k.w ? 1 : 0) + (k.arrowdown || k.s ? -0.6 : 0);
      if (aim.current) {
        const dx = aim.current.x - body.x;
        const dy = aim.current.y - body.y;
        const want = Math.atan2(dy, dx);
        let diff = want - body.h;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        turn = Math.max(-1, Math.min(1, diff * 2));
        gas = Math.hypot(dx, dy) > 0.03 ? 1 : 0;
      }
      body.h += turn * dt * 2.2;
      const step = gas * m.speed * dt * 0.004;
      let nx = body.x + Math.cos(body.h) * step;
      let ny = body.y + Math.sin(body.h) * step;
      nx = Math.min(0.94, Math.max(0.06, nx));
      ny = Math.min(0.92, Math.max(0.08, ny));
      const hit = rocks.some((r) => Math.hypot(nx - r.x, ny - r.y) < r.r / 280 + 0.03);
      if (!hit) {
        body.x = nx;
        body.y = ny;
      }
      const goal = m.stops[stopRef.current];
      if (goal && Math.hypot(body.x - goal.x, body.y - goal.y) < 0.06) {
        const next = stopRef.current + 1;
        stopRef.current = next;
        setStop(next);
        setPip(goal.name);
        if (next >= m.stops.length) setDone(true);
      }
      const w = canvas.width;
      const h = canvas.height;
      if (photo && photo.complete && photo.naturalWidth) {
        ctx.drawImage(photo, 0, 0, w, h);
      } else {
        ctx.fillStyle = m.dirt;
        ctx.fillRect(0, 0, w, h);
        if (m.ground === "layers" || m.ground === "delta") {
          for (let i = 0; i < 5; i++) {
            ctx.fillStyle = i % 2 ? "#00000018" : "#ffffff14";
            ctx.fillRect(0, 18 + i * 28, w, 10);
          }
        }
        if (m.ground === "basalt") {
          ctx.fillStyle = "#2a1814";
          ctx.fillRect(0, 0, w, 36);
        }
        const rockColor = m.ground === "plain" ? "#6d5438" : "#3a221c";
        for (const r of rocks) {
          ctx.fillStyle = rockColor;
          ctx.beginPath();
          ctx.arc(r.x * w, r.y * h, r.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      m.stops.forEach((s, i) => {
        ctx.strokeStyle = i < stopRef.current ? "#7ff4bd" : i === stopRef.current ? "#f3cf8f" : "#ffffffaa";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, 11, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.save();
      ctx.translate(body.x * w, body.y * h);
      ctx.rotate(body.h);
      ctx.fillStyle = "#e8f6ee";
      ctx.beginPath();
      if (m.craft === "drone") {
        ctx.ellipse(0, 0, 14, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#e8f6ee";
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.moveTo(12, 0);
        ctx.lineTo(-8, 6);
        ctx.lineTo(-8, -6);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [m]);

  const hold = (key: string, on: boolean) => {
    keys.current[key] = on;
  };

  const point = (e: PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    aim.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  };

  return (
    <section className="rover" style={{ left: pos.x, top: pos.y }} aria-label="rover sim" onPointerDown={(e) => e.stopPropagation()}>
      <header
        className="rover-bar"
        onPointerDown={(e) => {
          drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          setPos({
            x: Math.max(8, e.clientX - drag.current.dx),
            y: Math.max(8, e.clientY - drag.current.dy),
          });
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
      >
        <i className="rover-mint" />
        <Back label="back" onClick={onClose} />
      </header>
      <div className="rover-field">
        <canvas
          ref={canvasRef}
          width={320}
          height={180}
          onPointerDown={point}
          onPointerMove={(e) => {
            if (e.buttons) point(e);
          }}
          onPointerUp={() => {
            aim.current = null;
          }}
          onPointerLeave={() => {
            aim.current = null;
          }}
        />
        {pip ? (
          <p className="rover-pip" style={{ background: m.tint }}>
            {pip}
          </p>
        ) : null}
        <button type="button" className="rover-more" aria-label={sheet ? "less" : "more"} onClick={() => setSheet((s) => !s)}>
          {sheet ? "‹" : "›"}
        </button>
      </div>
      {sheet ? (
        <div className="rover-sheet">
          <p className="rover-place">
            {m.name}
            {m.year ? ` · ${m.year}` : ""} · {m.place}
            {done ? " · arrived" : stop < m.stops.length ? ` · ${m.stops[stop]?.name}` : ""}
          </p>
          <p className="rover-note">{m.note}</p>
          <div className="rover-missions">
            {MISSIONS.map((item, n) => (
              <button key={item.id} type="button" className={n === mission ? "on" : ""} aria-label={item.name} onClick={() => setMission(n)}>
                {item.name}
              </button>
            ))}
          </div>
          <div className="rover-pad">
            <button type="button" aria-label="rover forward" onPointerDown={() => hold("w", true)} onPointerUp={() => hold("w", false)} onPointerLeave={() => hold("w", false)}>
              ↑
            </button>
            <button type="button" aria-label="rover left" onPointerDown={() => hold("a", true)} onPointerUp={() => hold("a", false)} onPointerLeave={() => hold("a", false)}>
              ←
            </button>
            <button type="button" aria-label="rover back" onPointerDown={() => hold("s", true)} onPointerUp={() => hold("s", false)} onPointerLeave={() => hold("s", false)}>
              ↓
            </button>
            <button type="button" aria-label="rover right" onPointerDown={() => hold("d", true)} onPointerUp={() => hold("d", false)} onPointerLeave={() => hold("d", false)}>
              →
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
