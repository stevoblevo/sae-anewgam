import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

const BEATS = [
  {
    act: "Z",
    src: "/garden-porch.jpg",
    motion: "/motion/porch-face.mp4",
    title: "Ever fallen",
    line: "Version Z. The side wheel walks. She notices you. The lantern is already lit.",
    over: "Look up. The lantern is the whole sky.",
    under: "Look down. The boards are warm, and they remember shoes.",
  },
  {
    act: "Z",
    src: "/stare.png",
    motion: "/motion/stare-wink.mp4",
    title: "The minute before",
    line: "She holds your eyes. The fight has not started.",
    over: "Above her, nothing is swinging. No bell. No prize.",
    under: "Her shoes stay on the porch. That is the whole stance.",
  },
  {
    act: "Z",
    src: "/ring.png",
    motion: "/motion/ring.mp4",
    title: "The ring",
    line: "The boards are still dry. Nobody has been put down.",
    over: "Rise and the red is only lantern.",
    under: "Delve and you find the second pair of shoes, still missing.",
  },
  {
    act: "Z",
    src: "/weather.jpg",
    motion: "/motion/rain.mp4",
    title: "Red rain",
    line: "The red is the weather. It is not a fall.",
    over: "Above the rain the sky is still a sky.",
    under: "Under the rain the well is the same well.",
  },
  {
    act: "Z",
    src: "/farther-well.jpg",
    motion: "/motion/farther-well.mp4",
    title: "Beside",
    line: "The deer stands behind her shoulder, not ahead.",
    over: "Rise and the deer is only light on the water.",
    under: "Delve and the deer stays. It does not become a path.",
  },
  {
    act: "Z",
    src: "/beat05.jpg",
    motion: "/motion/crown.mp4",
    title: "The arch",
    line: "The deer becomes a door of blossoms.",
    over: "The crown is leaves. It was not taken.",
    under: "Step under the arch. It is a door, not a trophy.",
  },
  {
    act: "Z",
    src: "/well-cry.jpg",
    title: "The well",
    line: "The anger stayed in the ring. Here she only cries.",
    over: "Rise and her face is quiet, not fierce.",
    under: "Delve and the water keeps what she gives it.",
  },
  {
    act: "Z",
    src: "/beat01.jpg",
    motion: "/motion/well.mp4",
    title: "It remembers",
    line: "The well was already awake.",
    over: "The surface holds a peach-colored sky.",
    under: "Under that, two marks. Not a score.",
  },
  {
    act: "Z",
    src: "/pink-forest.jpg",
    motion: "/motion/pink-forest.mp4",
    title: "Pink, for rest",
    line: "She went down into the weather and came up still herself.",
    over: "Rise. Pink is only rest.",
    under: "Delve. The path is gold at the edges and quiet in the middle.",
  },
  {
    act: "Z",
    src: "/everdelve.jpg",
    motion: "/motion/delve.mp4",
    title: "Ever delve",
    line: "Walk sideways. Rise and delve are the other wheel.",
    over: "You rose. The story got lighter, and sillier, and still true.",
    under: "You delved. Same pictures. The underneath was always there.",
  },
];

export const Route = createFileRoute("/fallen")({
  component: Fallen,
});

export function Fallen() {
  const rail = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);
  const [depth, setDepth] = useState<-1 | 0 | 1>(0);
  const [both, setBoth] = useState(false);
  const [hint, setHint] = useState(true);
  const rose = useRef(false);
  const sank = useRef(false);
  const beat = BEATS[at] ?? BEATS[0];
  const look = depth < 0 ? "center 16%" : depth > 0 ? "center 84%" : "center 46%";
  const spoken =
    depth < 0 ? beat.over : depth > 0 ? beat.under : at === BEATS.length - 1 && both ? "You rose and you delved. Weee. The story fits." : beat.line;

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
    let accX = 0;
    let accY = 0;
    let locked = false;
    const onWheel = (event: WheelEvent) => {
      const ax = Math.abs(event.deltaX);
      const ay = Math.abs(event.deltaY);
      if (ax < 1 && ay < 1) return;
      event.preventDefault();
      setHint(false);
      if (locked) return;
      if (ax > ay) {
        accX += event.deltaX;
        if (Math.abs(accX) < 28) return;
        const dir = accX > 0 ? 1 : -1;
        accX = 0;
        locked = true;
        const width = el.clientWidth || 1;
        const current = Math.round(el.scrollLeft / width);
        const next = Math.max(0, Math.min(BEATS.length - 1, current + dir));
        el.scrollTo({ left: next * width, behavior: "smooth" });
      } else {
        accY += event.deltaY;
        if (Math.abs(accY) < 28) return;
        const down = accY > 0;
        accY = 0;
        locked = true;
        setDepth(down ? 1 : -1);
        if (down) sank.current = true;
        else rose.current = true;
        if (rose.current && sank.current) setBoth(true);
      }
      window.setTimeout(() => {
        locked = false;
      }, 420);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") go(at + 1);
      if (event.key === "ArrowLeft") go(at - 1);
      if (event.key === "ArrowUp") setDepth(-1);
      if (event.key === "ArrowDown") setDepth(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [at]);

  return (
    <div className="tableau">
      <div className="z-rail" ref={rail}>
        {BEATS.map((item, n) => (
          <section className="z-beat" data-i={n} key={item.src + item.title}>
            <img src={item.src} alt="" style={{ objectPosition: look }} />
            {item.motion && n === at ? (
              <video src={item.motion} poster={item.src} muted loop playsInline autoPlay style={{ objectPosition: look }} />
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
          ver. Z · {depth < 0 ? "rise" : depth > 0 ? "delve" : "walk"} · {beat.title}
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
      {hint ? <p className="z-hint">side wheel walks · wheel delves</p> : null}
      <p className="tableau-line">{spoken}</p>
      <div className="tableau-dots" style={{ transform: `scaleX(${(at + 1) / BEATS.length})` }} />
    </div>
  );
}
