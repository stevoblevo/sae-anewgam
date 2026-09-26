import { useEffect, useState } from "react";
import { useAxis } from "@/components/glue";

const MOVES = [
  { id: "still", src: "/anna.jpg" },
  { id: "side", src: "/beat02.jpg" },
  { id: "rise", src: "/trace-tall.jpg" },
  { id: "group", src: "/face-lock.jpg" },
  { id: "pass", src: "/depth-well.jpg" },
];

export function Rite({ onWalk }: { onWalk: () => void }) {
  const [at, setAt] = useState(0);
  const [playing, setPlaying] = useState(true);
  const move = MOVES[at] ?? MOVES[0];

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setAt((n) => (n + 1) % MOVES.length), 4200);
    return () => window.clearInterval(id);
  }, [playing]);

  useAxis(
    () => setAt((n) => (n + 1) % MOVES.length),
    () => setAt((n) => (n + 1) % MOVES.length),
  );

  return (
    <div className="rite">
      <img key={move.src} src={move.src} alt="" decoding="async" fetchPriority="high" />
      <header className="player-chrome">
        <button type="button" className="nav-link" onClick={onWalk}>
          walk
        </button>
        <p className="brand">{move.id}</p>
        <div className="right">
          <button type="button" className="nav-link" onClick={() => setPlaying((on) => !on)}>
            {playing ? "hold" : "play"}
          </button>
        </div>
      </header>
      <div className="rite-marks">
        {MOVES.map((item, n) => (
          <button key={item.id} type="button" className={n === at ? "on" : ""} onClick={() => setAt(n)} aria-label={item.id} />
        ))}
      </div>
    </div>
  );
}
