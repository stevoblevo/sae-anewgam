import { useEffect, useState } from "react";
import { useAxis } from "@/components/glue";
import { usePlateTouch } from "@/components/use-plate-touch";

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
  const frame = CHAPTERS[at] ?? CHAPTERS[0];
  const step = (dir: number) => setAt((n) => (n + dir + CHAPTERS.length) % CHAPTERS.length);
  const plate = usePlateTouch({
    onSwipe: (dir) => step(dir),
    onTap: () => step(1),
  });

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
    const id = window.setInterval(() => {
      if (plate.blocked.current) return;
      step(1);
    }, 6400);
    return () => window.clearInterval(id);
  }, [at]);

  useEffect(() => {
    plate.reset();
  }, [at]);

  return (
    <div className="immerse" {...plate.handlers}>
      <div key={frame.src} className="immerse-world">
        <img
          src={frame.src}
          alt=""
          draggable={false}
          className={plate.live ? "zoomed" : ""}
          style={
            plate.live
              ? { transform: `translate3d(${plate.frame.x}px, ${plate.frame.y}px, 0) scale(${plate.frame.z})` }
              : undefined
          }
        />
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
