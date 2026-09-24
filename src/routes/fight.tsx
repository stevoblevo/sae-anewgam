import { useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

const BEATS = 3;
const DURATION = 1600;

export const Route = createFileRoute("/fight")({
  component: Fight,
});

export function Fight() {
  const [hits, setHits] = useState(0);
  const [line, setLine] = useState("Hold the stare. Tap when the ring meets her.");
  const [round, setRound] = useState(0);
  const start = useRef(performance.now());
  const done = hits >= BEATS;

  const tap = () => {
    if (done) return;
    const t = (performance.now() - start.current) / DURATION;
    const met = t >= 0.62 && t <= 0.84;
    if (!met) {
      setLine(t < 0.62 ? "Too soon. She holds." : "Too late. She holds.");
      start.current = performance.now();
      setRound((n) => n + 1);
      return;
    }
    const next = hits + 1;
    setHits(next);
    setLine(next >= BEATS ? "She isn't angry at the well. The fight stayed on the porch." : "She holds.");
    start.current = performance.now();
    setRound((n) => n + 1);
  };

  return (
    <div className="fight" onPointerDown={tap}>
      <img className="tale-world" alt="" src={done ? "/well-cry.jpg" : "/ring.png"} />
      {!done ? <img className="fight-face" alt="" src="/stare.png" /> : null}
      {!done ? <span key={round} className="fight-pulse" /> : null}
      <header className="player-chrome">
        <Link to="/walk" className="nav-link" onPointerDown={(e) => e.stopPropagation()}>
          porch
        </Link>
        <p className="brand">porch fight</p>
        <div className="right">
          <Link to="/tale" className="nav-link" onPointerDown={(e) => e.stopPropagation()}>
            words
          </Link>
        </div>
      </header>
      <p className="fight-line">
        {line}
        {done ? "" : `  ${hits} / ${BEATS}`}
      </p>
    </div>
  );
}
