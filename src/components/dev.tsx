import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { TIM } from "@/lib/tim";

/** Latest course, not the Anne loop. Still / side / rise / group / pass, then home. */
const STATIONS = [
  { id: "peach", verb: "grow", line: "a tale about time and friendship", src: "/peachfall-walk.jpg" },
  { id: "reign", verb: "gather", line: "peachfall leads to red reign", src: "/weather.jpg" },
  { id: "thea", verb: "dream", line: "under us, Thea.", src: "/depth-thea.jpg" },
  { id: "dora", verb: "map", line: "look back this session", src: "/beat01.jpg" },
  { id: "kk", verb: "gen", line: "the loom is the door", src: "/loom.png" },
  { id: "saelion", verb: "sync", line: "a little farther. the way home stays open.", src: "/beat06.jpg" },
] as const;

export function Dev({ onAnne }: { onAnne: () => void }) {
  const [at, setAt] = useState(0);
  const last = useRef(0);
  const station = STATIONS[at] ?? STATIONS[0];
  const step = (dir: number) => setAt((n) => (n + dir + STATIONS.length) % STATIONS.length);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => step(1), TIM.ms);
    return () => window.clearInterval(id);
  }, [at]);

  const onStage = (event: ReactPointerEvent) => {
    if ((event.target as HTMLElement).closest("button, a")) return;
    const startX = event.clientX;
    const startY = event.clientY;
    const up = (ev: PointerEvent) => {
      window.removeEventListener("pointerup", up);
      const now = performance.now();
      if (now - last.current < 380) return;
      last.current = now;
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if (Math.abs(dx) < 28 && Math.abs(dy) < 28) step(1);
      else if (Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
      else step(dy < 0 ? 1 : -1);
    };
    window.addEventListener("pointerup", up);
  };

  return (
    <div className="dev-door" onPointerDown={onStage}>
      <img key={station.src} className="dev-plate" src={station.src} alt="" />
      <p className="dev-tag">dev</p>
      <p className="dev-line">{station.line}</p>
      <nav className="anne-marks dev-marks" aria-label="course">
        {STATIONS.map((item, n) => (
          <button
            key={item.id}
            type="button"
            className={n === at ? "on" : ""}
            aria-label={item.id}
            onClick={() => setAt(n)}
          >
            <i />
            {n === at ? <span>{item.verb}</span> : null}
          </button>
        ))}
      </nav>
      <button type="button" className="nav-link anne-night" onClick={onAnne}>
        anne
      </button>
    </div>
  );
}
