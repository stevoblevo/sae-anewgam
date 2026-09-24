import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

const BEATS = [
  {
    act: "I",
    src: "/garden-porch.jpg",
    motion: "/motion/porch-face.mp4",
    title: "Ever fallen",
    line: "She is on the painted porch, and she notices you. The lantern is already lit. Nothing has been lost.",
  },
  {
    act: "I",
    src: "/stare.png",
    motion: "/motion/stare-wink.mp4",
    title: "The minute before",
    line: "She holds your eyes. The ring is only a ring. If there is a fight, it has not started.",
  },
  {
    act: "II",
    src: "/weather.jpg",
    motion: "/motion/rain.mp4",
    title: "Red rain",
    line: "The red comes down as rain. Reign, if you want the other word. It is the weather, not a fall.",
  },
  {
    act: "II",
    src: "/farther-well.jpg",
    motion: "/motion/farther-well.mp4",
    title: "Beside",
    line: "A deer stands with you, not ahead. Dear. It will not lead, and it will not leave.",
  },
  {
    act: "II",
    src: "/well-cry.jpg",
    title: "The well",
    line: "She was angry in the ring. The anger stayed there. At the well she only cries, and the water keeps it.",
  },
  {
    act: "III",
    src: "/pink-forest.jpg",
    motion: "/motion/pink-forest.mp4",
    title: "Pink, for rest",
    line: "This is ever fallen. She went down into the weather and came up still herself. Pink is the rest after.",
  },
  {
    act: "III",
    src: "/everdelve.jpg",
    title: "Ever delve",
    line: "One step farther, the same story. You can stay in it, or go back to the porch.",
  },
];

export const Route = createFileRoute("/fallen")({
  component: Fallen,
});

export function Fallen() {
  const [at, setAt] = useState(0);
  const [moving, setMoving] = useState(false);
  const [live, setLive] = useState(false);
  const beat = BEATS[at];
  const last = at === BEATS.length - 1;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") setAt((n) => Math.min(BEATS.length - 1, n + 1));
      if (event.key === "ArrowLeft") setAt((n) => Math.max(0, n - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMoving(Boolean(beat.motion) && !reduce);
    setLive(false);
  }, [beat.motion]);

  const on = () => {
    if (!last) setAt((n) => n + 1);
  };

  return (
    <div className="tableau">
      <button type="button" className="tableau-stage" onClick={on} aria-label={last ? beat.title : "on"}>
        <img key={beat.src} src={beat.src} alt="" />
        {moving && beat.motion ? (
          <video
            key={beat.motion}
            src={beat.motion}
            poster={beat.src}
            muted
            loop
            playsInline
            autoPlay
            style={{ opacity: live ? 1 : 0 }}
            onPlaying={() => setLive(true)}
            onError={() => setMoving(false)}
          />
        ) : null}
      </button>
      <header className="player-chrome">
        {at === 0 ? (
          <Link to="/walk" className="nav-link">
            porch
          </Link>
        ) : (
          <button type="button" className="nav-link" onClick={() => setAt((n) => n - 1)}>
            back
          </button>
        )}
        <p className="brand">
          {beat.act} · {beat.title}
        </p>
        <div className="right">
          {last ? (
            <Link to="/walk" className="nav-link">
              porch
            </Link>
          ) : (
            <button type="button" className="nav-link" onClick={on}>
              on
            </button>
          )}
        </div>
      </header>
      <p className="tableau-line">{beat.line}</p>
      <div className="tableau-dots">
        {BEATS.map((item, n) => (
          <button key={item.src} type="button" aria-label={item.title} className={n === at ? "on" : ""} onClick={() => setAt(n)} />
        ))}
      </div>
    </div>
  );
}
