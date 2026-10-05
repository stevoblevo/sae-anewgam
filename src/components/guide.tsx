import { useEffect, useRef, useState } from "react";

const LINES = [
  "Hover a glow on the picture. It names the next place.",
  "Drag a glow. When you let go, it winks.",
  "She winks on her own, when she feels like it.",
  "The field leaves a trail. Touch, and it glows.",
  "Somewhere new changes the color of the trickle.",
  "Invert turns the night inside out.",
  "The door on the picture is Sae’s room.",
];

export function Guide({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    if (step >= LINES.length) {
      done.current();
      return;
    }
    const t = window.setTimeout(() => setStep((s) => s + 1), 3200);
    return () => window.clearTimeout(t);
  }, [step]);

  if (step >= LINES.length) return null;
  const line = LINES[step];

  return (
    <button type="button" className="guide" onClick={() => setStep((s) => s + 1)} aria-label="next in the guide">
      <svg viewBox="0 0 64 48" aria-hidden>
        <ellipse cx="34" cy="30" rx="16" ry="10" fill="#e7b089" />
        <circle cx="48" cy="24" r="8" fill="#f3c6d8" />
        <circle cx="51" cy="23" r="1.3" fill="#2a1020" />
        <path d="M44 16c2-8 8-8 8-2" fill="none" stroke="#e7b089" strokeWidth="2" />
        <path d="M18 28c-8 2-10 8-6 10" fill="none" stroke="#c43b78" strokeWidth="2" strokeLinecap="round" />
        <ellipse className="guide-paw" cx="28" cy="40" rx="4" ry="2" fill="#f6e7ef" />
        <ellipse className="guide-paw" cx="40" cy="40" rx="4" ry="2" fill="#f6e7ef" />
      </svg>
      <span>{line}</span>
    </button>
  );
}
