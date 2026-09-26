import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

const MARKS = [
  {
    src: "/mark-orange.jpg",
    title: "Orange",
    line: "The leaf mark has walked. It stays beside the path.",
  },
  {
    src: "/mark-red.jpg",
    title: "Red",
    line: "More weather. The circle of the well is still whole.",
  },
  {
    src: "/mark-meet.jpg",
    title: "They meet",
    line: "Orange is the door. Red is the rain. Neither covers the other.",
  },
  {
    src: "/mark-under.jpg",
    title: "Under it",
    line: "They stand the same height. The red stays in the sky.",
  },
  {
    src: "/mark-leaf.jpg",
    title: "The leaf",
    line: "One mark, beside the path. Not ahead. Not taken.",
  },
  {
    src: "/mark-rain.jpg",
    title: "Red rain",
    line: "The red is weather falling. The circle of the well stays whole.",
  },
  {
    src: "/mark-beside.jpg",
    title: "Beside",
    line: "Two figures, the same height. Neither leads.",
  },
  {
    src: "/mark-rest.jpg",
    title: "Pink, for rest",
    line: "The gold path stops. Rest is the point of it.",
  },
  {
    src: "/mark-door.jpg",
    title: "The door",
    line: "One opening, and a small light beside it. The way is easy.",
  },
];

export const Route = createFileRoute("/marks")({
  component: Marks,
});

function Marks() {
  const [at, setAt] = useState(0);
  const mark = MARKS[at] ?? MARKS[0];

  return (
    <div className="leaf">
      <img key={mark.src} src={mark.src} alt="" />
      <header className="player-chrome">
        {at === 0 ? (
          <Link to="/" className="nav-link">
            back
          </Link>
        ) : (
          <button type="button" className="nav-link" onClick={() => setAt((n) => n - 1)}>
            back
          </button>
        )}
        <p className="brand">
          {at + 1} / {MARKS.length} · {mark.title}
        </p>
        <div className="right">
          {at < MARKS.length - 1 ? (
            <button type="button" className="nav-link" onClick={() => setAt((n) => n + 1)}>
              on
            </button>
          ) : (
            <Link to="/leaf" className="nav-link">
              leaf
            </Link>
          )}
        </div>
      </header>
      <p className="leaf-line">{mark.line}</p>
    </div>
  );
}
