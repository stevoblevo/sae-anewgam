import { useEffect, useState } from "react";
import { useAxis } from "@/components/glue";

const IN = [
  { id: "reign", src: "/depth-thea.jpg" },
  { id: "well", src: "/reign-well.jpg" },
  { id: "porch", src: "/porchfight-gal.jpg" },
  { id: "peach", src: "/peachfall-walk.jpg" },
  { id: "face", src: "/face-lock.jpg" },
  { id: "path", src: "/beat02.jpg" },
  { id: "sisters", src: "/sisters-well.jpg" },
];

export function InGam({ onWalk, onRite }: { onWalk: () => void; onRite: () => void }) {
  const [at, setAt] = useState(0);
  const [playing, setPlaying] = useState(false);
  const frame = IN[at] ?? IN[0];

  useEffect(() => {
    document.documentElement.dataset.eye = "in";
    return () => {
      delete document.documentElement.dataset.eye;
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setAt((n) => (n + 1) % IN.length), 4200);
    return () => window.clearInterval(id);
  }, [playing]);

  useAxis(
    (dir) => setAt((n) => (n + dir + IN.length) % IN.length),
    (dir) => setAt((n) => (n + dir + IN.length) % IN.length),
  );

  return (
    <div className="rite">
      <img key={frame.src} src={frame.src} alt="" decoding="async" fetchPriority="high" />
      <header className="player-chrome">
        <button type="button" className="nav-link" onClick={onRite}>
          rite
        </button>
        <p className="brand">in.gam</p>
        <div className="right">
          <button type="button" className="nav-link" onClick={onWalk}>
            walk
          </button>
          <button type="button" className="nav-link" onClick={() => setPlaying((on) => !on)}>
            {playing ? "hold" : "play"}
          </button>
        </div>
      </header>
      <div className="rite-marks">
        {IN.map((item, n) => (
          <button key={item.src} type="button" className={n === at ? "on" : ""} aria-label={item.id} onClick={() => setAt(n)} />
        ))}
      </div>
    </div>
  );
}
