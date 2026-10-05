import { useRef, useState } from "react";
import { Back } from "@/components/back";
import { MODULES, type ModuleId } from "@/lib/modules";

export function Games({ onClose, onOpen }: { onClose: () => void; onOpen: (id: ModuleId) => void }) {
  const [pos, setPos] = useState({ x: 24, y: 72 });
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  return (
    <section className="games" style={{ left: pos.x, top: pos.y }} aria-label="the games">
      <div
        className="games-bar"
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          setPos({ x: d.px + e.clientX - d.x, y: d.py + e.clientY - d.y });
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
      >
        <strong>the games</strong>
        <Back label="back" onClick={onClose} />
      </div>
      {MODULES.map((m) => (
        <button key={m.id} type="button" className="games-row" onClick={() => onOpen(m.id)}>
          <span>{m.name}</span>
          <small>{m.id === "reel" ? "the site, or a game, plays itself" : m.frame === "float" ? "floats, the walk stays" : "takes the picture"}</small>
          <em>{m.line}</em>
        </button>
      ))}
    </section>
  );
}
