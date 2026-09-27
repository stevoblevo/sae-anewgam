import { useEffect, useState } from "react";
import { useAxis } from "@/components/glue";

const NIGHT = [
  { id: "notice", src: "/night-porch.jpg", motion: "/motion/night-porch.mp4" },
  { id: "feel", src: "/night-porch.jpg", motion: "/motion/night-porch.mp4" },
  { id: "choose", src: "/night-doll.jpg" },
  { id: "flow", src: "/night-sand.jpg" },
  { id: "grow", src: "/night-home.jpg" },
];

const MARKS = ["notice", "feel", "choose", "flow", "grow"];

const GALLEY = [
  { id: "porchlight", src: "/night-porch.jpg" },
  { id: "bambi", src: "/bambi.jpg" },
  { id: "path", src: "/beat02.jpg" },
  { id: "hearth", src: "/anna-hearth.jpg" },
  { id: "home", src: "/night-home.jpg" },
  { id: "sand", src: "/night-sand.jpg" },
];

export function Night({ onDay }: { onDay: () => void }) {
  const [at, setAt] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [shake, setShake] = useState(0);
  const [galley, setGalley] = useState(false);
  const [held, setHeld] = useState("");
  const frame = NIGHT[at] ?? NIGHT[0];
  const shown = held || frame.src;

  useEffect(() => {
    if (!playing || galley) return;
    const id = window.setInterval(() => {
      setAt((n) => (n + 1) % NIGHT.length);
      setShake((n) => n + 1);
    }, 4200);
    return () => window.clearInterval(id);
  }, [playing, galley]);

  useAxis(
    (dir) => {
      setAt((n) => (n + dir + NIGHT.length) % NIGHT.length);
      setShake((n) => n + 1);
    },
    () => setPlaying((on) => !on),
  );

  return (
    <div className="night">
      <div key={shake} className="red-shake">
        {frame.motion && playing && !held && !galley ? (
          <video src={frame.motion} poster={frame.src} autoPlay muted loop playsInline />
        ) : (
          <img src={shown} alt="" />
        )}
      </div>
      <button type="button" className="night-boop" aria-label="boop" onClick={() => setGalley(true)} />
      {galley ? (
        <div className="occult">
          <button type="button" className="layers-leave" onClick={() => { setGalley(false); setHeld(""); }}>
            leave
          </button>
          <div className="occult-galley">
            {GALLEY.map((item) => (
              <button key={item.id} type="button" className={shown === item.src ? "on" : ""} aria-label={item.id} onClick={() => setHeld(item.src)}>
                <img src={item.src} alt="" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <header className="player-chrome">
        <button type="button" className="nav-link" onClick={onDay}>
          day
        </button>
        <p className="brand">night</p>
        <div className="right">
          <button type="button" className="nav-link" onClick={() => setPlaying((on) => !on)}>
            {playing ? "hold" : "play"}
          </button>
        </div>
      </header>
      <nav className="night-rail" aria-label="night">
        {MARKS.map((mark, n) => (
          <button key={mark} type="button" className={n === at ? "on" : ""} onClick={() => setAt(n)} aria-label={mark}>
            <i />
            {n === at ? <span>{mark}</span> : null}
          </button>
        ))}
      </nav>
    </div>
  );
}
