import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

const STEPS = [
  {
    src: "/leaf-path.jpg",
    title: "The leaf",
    line: "One leaf on the stones. It is not ahead of you.",
    choices: [
      { label: "walk ahead", line: "The path goes on without you. Stay beside the leaf." },
      { label: "stay beside", ok: true },
      { label: "take it", line: "It is not a trophy. Leave it where it fell." },
    ],
  },
  {
    src: "/leaf-shoe.jpg",
    title: "The shoe",
    line: "One shoe, and a space beside it. The other has not come.",
    choices: [
      { label: "take the shoe", line: "Leave it. The porch is not a prize." },
      { label: "leave it", ok: true },
      { label: "look for the fight", line: "The fight is not on this path." },
    ],
  },
  {
    src: "/leaf-deer.jpg",
    title: "Beside",
    line: "She is at the well. The deer stands with her, not in front.",
    choices: [
      { label: "follow the deer", line: "It will not lead. Stand where you are." },
      { label: "stand with her", ok: true },
      { label: "look in the well", line: "The water can wait. She is the one who is here." },
    ],
  },
  {
    src: "/leaf-door.jpg",
    title: "The door",
    line: "The door is open. You can go back, or through.",
    choices: [],
  },
];

export const Route = createFileRoute("/leaf")({
  component: Leaf,
});

function Leaf() {
  const [at, setAt] = useState(0);
  const [note, setNote] = useState("");
  const step = STEPS[at] ?? STEPS[0];
  const last = at === STEPS.length - 1;

  const choose = (ok: boolean | undefined, line: string | undefined) => {
    if (ok) {
      setNote("");
      setAt((n) => Math.min(STEPS.length - 1, n + 1));
      return;
    }
    setNote(line ?? "Not that way.");
  };

  return (
    <div className="leaf">
      <img key={step.src} src={step.src} alt="" />
      <header className="player-chrome">
        {at === 0 ? (
          <Link to="/" className="nav-link">
            back
          </Link>
        ) : (
          <button
            type="button"
            className="nav-link"
            onClick={() => {
              setNote("");
              setAt((n) => n - 1);
            }}
          >
            back
          </button>
        )}
        <p className="brand">
          {at + 1} / {STEPS.length} · {step.title}
        </p>
        <div className="right">
          <Link to="/walk" className="nav-link">
            porch
          </Link>
        </div>
      </header>
      <p className="leaf-line">{note || step.line}</p>
      <div className="leaf-choices">
        {step.choices.map((choice) => (
          <button key={choice.label} type="button" onClick={() => choose(choice.ok, choice.line)}>
            {choice.label}
          </button>
        ))}
        {last ? (
          <>
            <Link to="/">version Z</Link>
            <Link to="/walk">porch</Link>
          </>
        ) : null}
      </div>
    </div>
  );
}
