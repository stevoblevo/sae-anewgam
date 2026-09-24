import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

const BEATS = [
  {
    src: "/garden-porch.jpg",
    title: "Ever fallen",
    line: "She is on the painted porch, and she notices you. Nothing has been lost yet.",
  },
  {
    src: "/stare.png",
    title: "The minute before",
    line: "The ring is drawn. She is still on her feet. This is not the fall.",
  },
  {
    src: "/weather.jpg",
    title: "Red rain",
    line: "The same place, other weather. The red is the rain. It is not a fall.",
  },
  {
    src: "/farther-well.jpg",
    title: "Beside",
    line: "A deer stands with you, not ahead. Dear. Not a trophy.",
  },
  {
    src: "/well-cry.jpg",
    title: "The well",
    line: "What was angry stays on the porch. Here she only cries, and the water keeps it.",
  },
  {
    src: "/pink-forest.jpg",
    title: "Ever fallen",
    line: "Pink is for rest. She fell into the weather, and the weather held.",
  },
];

export const Route = createFileRoute("/fallen")({
  component: Fallen,
});

export function Fallen() {
  const [at, setAt] = useState(0);
  const beat = BEATS[at];

  return (
    <div className="tableau">
      <img key={beat.src} src={beat.src} alt="" />
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
        <p className="brand">{beat.title}</p>
        <div className="right">
          {at < BEATS.length - 1 ? (
            <button type="button" className="nav-link" onClick={() => setAt((n) => n + 1)}>
              on
            </button>
          ) : (
            <Link to="/walk" className="nav-link">
              porch
            </Link>
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
