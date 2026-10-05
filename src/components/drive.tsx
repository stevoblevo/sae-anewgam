import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { Back } from "@/components/back";

const ROOMS = [
  { id: "mint", src: "/beats/mint.jpg" },
  { id: "blue", src: "/beats/blue.jpg" },
  { id: "green", src: "/beats/green.jpg" },
  { id: "obsidian", src: "/beats/obsidian.jpg" },
  { id: "dawn", src: "/beats/dawn.jpg" },
  { id: "redsun", src: "/beats/redsun.jpg" },
  { id: "mercury", src: "/beats/mercury.jpg" },
  { id: "moon", src: "/beats/moon.jpg" },
  { id: "europa", src: "/beats/europa.jpg" },
];

const GOAL = ROOMS.length - 1;

export function Drive({ onGoal, onClose, self = false }: { onGoal: () => void; onClose: () => void; self?: boolean }) {
  const [at, setAt] = useState(0);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const goalRef = useRef(onGoal);
  goalRef.current = onGoal;
  const room = ROOMS[at] ?? ROOMS[0];

  useEffect(() => {
    if (!self) return;
    const t = window.setInterval(() => {
      setAt((a) => {
        if (a >= GOAL) return a;
        const next = a + 1;
        if (next === GOAL) goalRef.current();
        return next;
      });
    }, 1800);
    return () => window.clearInterval(t);
  }, [self]);

  const move = (dir: -3 | -1 | 1 | 3) => {
    const row = Math.floor(at / 3);
    const col = at % 3;
    if (dir === -3 && row === 0) return;
    if (dir === 3 && row === 2) return;
    if (dir === -1 && col === 0) return;
    if (dir === 1 && col === 2) return;
    const next = at + dir;
    setAt(next);
    if (next === GOAL) onGoal();
  };

  return (
    <div
      className="drive"
      onPointerDown={(e) => setStart({ x: e.clientX, y: e.clientY })}
      onPointerUp={(e) => {
        if (!start) return;
        const dx = e.clientX - start.x;
        const dy = e.clientY - start.y;
        setStart(null);
        if (Math.abs(dx) < 36 && Math.abs(dy) < 36) return;
        if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 1 : -1);
        else move(dy > 0 ? 3 : -3);
      }}
    >
      <img className="plate" src={room.src} alt="" />
      <Back stage label="back" onClick={onClose} />
      <div className="drive-map" aria-hidden>
        {ROOMS.map((r, n) => (
          <i key={r.id} className={n === at ? "here" : n === GOAL ? "goal" : ""} />
        ))}
      </div>
      <div className="drive-pad">
        <button type="button" className="up" aria-label="up" onClick={() => move(-3)}>
          <ChevronUp size={22} />
        </button>
        <button type="button" className="left" aria-label="left" onClick={() => move(-1)}>
          <ChevronLeft size={22} />
        </button>
        <button type="button" className="down" aria-label="down" onClick={() => move(3)}>
          <ChevronDown size={22} />
        </button>
        <button type="button" className="right" aria-label="right" onClick={() => move(1)}>
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
}
