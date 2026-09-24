import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

const SCENES = [
  { id: "peach", title: "peach fall.", note: "she winks.", src: "/portrait/peach.jpg", motion: "/motion/peach-tall.mp4" },
  { id: "pink", title: "her, in pink.", note: "anna.", src: "/portrait/pink.jpg", motion: "/motion/pink-tall.mp4" },
  { id: "sisters", title: "say who. say hi.", note: "peach, and her red sister.", src: "/portrait/sisters.jpg", motion: "/motion/sisters-tall.mp4" },
  { id: "painted", title: "the stare, painted.", note: "same face, garden.", src: "/portrait/painted.jpg", motion: "/motion/painted-tall.mp4" },
  { id: "stare", title: "pf stare.", note: "she winks too.", src: "/portrait/stare.jpg", motion: "/motion/stare-tall.mp4" },
  { id: "reign", title: "red reign.", note: "same place. another feeling.", src: "/portrait/rain.jpg", motion: "/motion/rain-tall.mp4" },
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
