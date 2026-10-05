import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useAxis } from "@/components/glue";

const CHAPTERS = [
  { id: "porchlight", src: "/anne-porch.jpg", line: "still here." },
  { id: "sandman", src: "/anne-sand.jpg", line: "the unseen walks ahead." },
  { id: "savanna", src: "/anne-savanna.jpg", line: "wider, together." },
  { id: "home", src: "/anne-home.jpg", line: "the light came in." },
];

export function Immerse({ onPlay, onFurther }: { onPlay: () => void; onFurther: () => void }) {
  const [at, setAt] = useState(0);
  const [line, setLine] = useState("you came.");
  const [shown, setShown] = useState(true);
  const last = useRef(0);
  const frame = CHAPTERS[at] ?? CHAPTERS[0];
  const step = (dir: number) => setAt((n) => (n + dir + CHAPTERS.length) % CHAPTERS.length);

  useAxis(step, step);

  const say = (next: string) => {
    setLine(next);
    setShown(true);
    window.setTimeout(() => setShown(false), 2800);
  };

  useEffect(() => {
    const id = window.setTimeout(() => setShown(false), 2800);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => step(1), 6400);
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
      if (Math.abs(dx) >= 28 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
      else step(1);
    };
    window.addEventListener("pointerup", up);
  };

  return (
    <div className="immerse" onPointerDown={onStage}>
      <div key={frame.src} className="immerse-world">
        <img src={frame.src} alt="" />
      </div>
      <div className="immerse-veil" />
      <p className={shown ? "immerse-line on" : "immerse-line"}>{line}</p>
      <nav className="immerse-signs" aria-label="ways">
        <button
          type="button"
          className="on"
          onClick={() => {
            say(frame.line);
          }}
        >
          <strong>home</strong>
          <span>still here</span>
        </button>
        <button
          type="button"
          onClick={() => {
            say("left on the rail.");
            window.setTimeout(onPlay, 280);
          }}
        >
          <strong>play</strong>
          <span>the dream</span>
        </button>
        <button
          type="button"
          onClick={() => {
            say("together, further.");
            window.setTimeout(onFurther, 280);
          }}
        >
          <strong>continue</strong>
          <span>further</span>
        </button>
      </nav>
    </div>
  );
}
