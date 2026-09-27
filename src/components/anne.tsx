import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useAxis } from "@/components/glue";

const ANNE = [
  { id: "notice", src: "/anne-16x10.jpg" },
  { id: "feel", src: "/night-doll.jpg" },
  { id: "flow", src: "/night-sand.jpg" },
  { id: "home", src: "/night-home.jpg" },
];

export function Anne({ onNight }: { onNight: () => void }) {
  const [at, setAt] = useState(0);
  const last = useRef(0);
  const frame = ANNE[at] ?? ANNE[0];
  const step = (dir: number) => setAt((n) => (n + dir + ANNE.length) % ANNE.length);

  useAxis(step, step);

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
    <div className="anne" onPointerDown={onStage}>
      <div className="anne-frame">
        <img src={frame.src} alt="" />
      </div>
      <nav className="anne-marks" aria-label="anne">
        {ANNE.map((item, n) => (
          <button key={item.id} type="button" className={n === at ? "on" : ""} aria-label={item.id} onClick={() => setAt(n)}>
            <i />
            {n === at ? <span>{item.id}</span> : null}
          </button>
        ))}
      </nav>
      <button type="button" className="nav-link anne-night" onClick={onNight}>
        night
      </button>
    </div>
  );
}
