import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

const BEATS = [
  {
    act: "Z",
    src: "/garden-porch.jpg",
    motion: "/motion/porch-face.mp4",
    title: "Ever fallen",
    line: "Version Z. The side wheel walks it. She notices you. The lantern is already lit.",
  },
  {
    act: "Z",
    src: "/stare.png",
    motion: "/motion/stare-wink.mp4",
    title: "The minute before",
    line: "She holds your eyes. One notch is one picture. The fight has not started.",
  },
  {
    act: "Z",
    src: "/ring.png",
    motion: "/motion/ring.mp4",
    title: "The ring",
    line: "The boards are still dry. Nobody has been put down. Scroll does not make a winner.",
  },
  {
    act: "Z",
    src: "/weather.jpg",
    motion: "/motion/rain.mp4",
    title: "Red rain",
    line: "The red is the weather. Reign, if you want the other word. It is not a fall.",
  },
  {
    act: "Z",
    src: "/farther-well.jpg",
    motion: "/motion/farther-well.mp4",
    title: "Beside",
    line: "The deer stands behind her shoulder, not on the path ahead. The wheel does not lead either.",
  },
  {
    act: "Z",
    src: "/beat05.jpg",
    motion: "/motion/crown.mp4",
    title: "The arch",
    line: "The deer becomes a door of blossoms. A crown that grows. Not taken.",
  },
  {
    act: "Z",
    src: "/well-cry.jpg",
    title: "The well",
    line: "The anger stayed in the ring. Here she only cries, and the water keeps it.",
  },
  {
    act: "Z",
    src: "/beat01.jpg",
    motion: "/motion/well.mp4",
    title: "It remembers",
    line: "The well was already awake. Same water, other weather, the plate before the rain.",
  },
  {
    act: "Z",
    src: "/pink-forest.jpg",
    motion: "/motion/pink-forest.mp4",
    title: "Pink, for rest",
    line: "Ever fallen. She went down into the weather and came up still herself.",
  },
  {
    act: "Z",
    src: "/everdelve.jpg",
    motion: "/motion/delve.mp4",
    title: "Ever delve",
    line: "Version Z stays open. One step farther is still the same story. The porch is beside you, not ahead.",
  },
];

export const Route = createFileRoute("/fallen")({
  component: Fallen,
});

export function Fallen() {
  const rail = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);
  const [hint, setHint] = useState(true);
  const beat = BEATS[at] ?? BEATS[0];

  const go = (n: number) => {
    const el = rail.current;
    if (!el) return;
    const next = Math.max(0, Math.min(BEATS.length - 1, n));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    setHint(false);
  };

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const panels = [...el.querySelectorAll<HTMLElement>(".z-beat")];
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.6) continue;
          const n = Number((entry.target as HTMLElement).dataset.i);
          if (!Number.isNaN(n)) setAt(n);
        }
      },
      { root: el, threshold: 0.6 },
    );
    panels.forEach((panel) => obs.observe(panel));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    let acc = 0;
    let locked = false;
    const onWheel = (event: WheelEvent) => {
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (!delta) return;
      event.preventDefault();
      setHint(false);
      if (locked) return;
      acc += delta;
      if (Math.abs(acc) < 28) return;
      const dir = acc > 0 ? 1 : -1;
      acc = 0;
      locked = true;
      const width = el.clientWidth || 1;
      const current = Math.round(el.scrollLeft / width);
      const next = Math.max(0, Math.min(BEATS.length - 1, current + dir));
      el.scrollTo({ left: next * width, behavior: "smooth" });
      window.setTimeout(() => {
        locked = false;
      }, 520);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") go(at + 1);
      if (event.key === "ArrowLeft") go(at - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [at]);

  return (
    <div className="tableau">
      <div className="z-rail" ref={rail}>
        {BEATS.map((item, n) => (
          <section className="z-beat" data-i={n} key={item.src + item.title}>
            <img src={item.src} alt="" />
            {item.motion && n === at ? (
              <video src={item.motion} poster={item.src} muted loop playsInline autoPlay />
            ) : null}
          </section>
        ))}
      </div>
      <header className="player-chrome">
        {at === 0 ? (
          <Link to="/walk" className="nav-link">
            porch
          </Link>
        ) : (
          <button type="button" className="nav-link" onClick={() => go(at - 1)}>
            back
          </button>
        )}
        <p className="brand">
          ver. Z · {beat.title}
        </p>
        <div className="right">
          {at === BEATS.length - 1 ? (
            <Link to="/walk" className="nav-link">
              porch
            </Link>
          ) : (
            <button type="button" className="nav-link" onClick={() => go(at + 1)}>
              on
            </button>
          )}
        </div>
      </header>
      {hint ? <p className="z-hint">side wheel</p> : null}
      <p className="tableau-line">{beat.line}</p>
      <div className="tableau-dots" style={{ transform: `scaleX(${(at + 1) / BEATS.length})` }} />
    </div>
  );
}
