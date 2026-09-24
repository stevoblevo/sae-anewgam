import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

const SCENES = [
  { id: "peach", title: "peach fall.", note: "she winks.", src: "/bambi.jpg", motion: "/motion/wink.mp4" },
  { id: "pink", title: "her, in pink.", note: "anna.", src: "/anna.jpg", motion: "/motion/anna.mp4" },
  { id: "sisters", title: "say who. say hi.", note: "peach, and her red sister.", src: "/sisters.jpg", motion: "/motion/sisters.mp4" },
  { id: "painted", title: "the stare, painted.", note: "same face, garden.", src: "/garden-stare.jpg", motion: "/motion/painted-stare.mp4" },
  { id: "stare", title: "pf stare.", note: "she winks too.", src: "/stare.png", motion: "/motion/stare-wink.mp4" },
  { id: "reign", title: "red reign.", note: "same place. another feeling.", src: "/weather.jpg", motion: "/motion/rain.mp4" },
];

export const Route = createFileRoute("/ball")({
  component: Ball,
});

export function Ball() {
  const root = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);
  const [at, setAt] = useState(0);
  const atRef = useRef(0);

  const go = (n: number) => {
    const next = (n + SCENES.length) % SCENES.length;
    atRef.current = next;
    setAt(next);
    root.current?.querySelectorAll(".ball-scene")[next]?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => go(atRef.current + 1), 5000);
    return () => window.clearInterval(id);
  }, [playing]);

  return (
    <div
      className="ball"
      ref={root}
      onWheel={() => setPlaying(false)}
      onTouchStart={() => setPlaying(false)}
    >
      <header className="player-chrome">
        <a className="nav-link" href="/?home=1">
          back
        </a>
        <p className="brand">peach ball</p>
        <div className="right">
          <button type="button" className="nav-link" onClick={() => setPlaying((p) => !p)}>
            {playing ? "pause" : "play"}
          </button>
          <Link to="/her" className="nav-link">
            her
          </Link>
        </div>
      </header>
      <nav className="ball-dots" aria-label="scenes">
        {SCENES.map((s, n) => (
          <button key={s.id} type="button" className={n === at ? "on" : ""} aria-label={s.note} onClick={() => go(n)} />
        ))}
      </nav>
      {SCENES.map((s) => (
        <section key={s.id} className="ball-scene" onClick={() => setPlaying((p) => !p)}>
          <img alt="" src={s.src} />
          {s.motion ? <video src={s.motion} muted loop playsInline autoPlay /> : null}
          <div className="ball-cap">
            <p className="line">{s.title}</p>
            <p className="tag">{s.note}</p>
          </div>
        </section>
      ))}
    </div>
  );
}
