import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

const BEATS = [
  {
    act: "Z",
    src: "/porch-face.jpg",
    motion: "/motion/porch-face.mp4",
    title: "The picture",
    line: "The picture is the screen. The dark only shows where it ends.",
    over: "Look up. The lantern is close enough to warm her face.",
    under: "Look down. It is still the porch.",
  },
  {
    act: "Z",
    src: "/small-one.jpg",
    title: "The words",
    line: "Peach and red, on the same step. The sentence sits on them and does not hide them.",
    over: "Rise and the light is behind them.",
    under: "Delve and the step is what they share.",
  },
  {
    act: "Z",
    src: "/garden-porch.jpg",
    motion: "/motion/porch-face.mp4",
    title: "Ever fallen",
    line: "She notices you. The lantern is already lit.",
    over: "Look up. The lantern is the whole sky.",
    under: "Look down. The boards are warm, and they remember shoes.",
  },
  {
    act: "Z",
    src: "/stare.png",
    motion: "/motion/stare.mp4",
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
    src: "/loom.png",
    motion: "/motion/loom.mp4",
    title: "The door",
    line: "This is the only layer that can cover the picture. The other plays are through it.",
    over: "Above them the room opens.",
    under: "Under the loom, the floor is the way out.",
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
  const root = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);
  const [depth, setDepth] = useState<-1 | 0 | 1>(0);
  const [both, setBoth] = useState(false);
  const [known, setKnown] = useState<Array<"walk" | "rise" | "delve">>([]);
  const [note, setNote] = useState("");
  const [found, setFound] = useState(false);
  const rose = useRef(false);
  const sank = useRef(false);
  const knownRef = useRef(known);
  knownRef.current = known;
  const beat = BEATS[at] ?? BEATS[0];
  const look = depth < 0 ? "center 16%" : depth > 0 ? "center 84%" : "center 46%";
  const spoken =
    depth < 0 ? beat.over : depth > 0 ? beat.under : at === BEATS.length - 1 && both ? "You rose and you delved. Weee. The story fits." : beat.line;
  const walked = known.includes("walk");
  const roseKnown = known.includes("rise");
  const sankKnown = known.includes("delve");

  const learn = (axis: "walk" | "rise" | "delve", phrase: string) => {
    if (knownRef.current.includes(axis)) return;
    knownRef.current = [...knownRef.current, axis];
    setKnown(knownRef.current);
    setNote(phrase);
  };

  const go = (n: number) => {
    const el = rail.current;
    if (!el) return;
    const next = Math.max(0, Math.min(BEATS.length - 1, n));
    if (next === at) return;
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    learn("walk", "sideways → walk");
  };

  const dive = (dir: -1 | 1) => {
    setDepth(dir);
    if (dir > 0) {
      sank.current = true;
      learn("delve", "down → delve");
    } else {
      rose.current = true;
      learn("rise", "up → rise");
    }
    if (rose.current && sank.current) setBoth(true);
  };

  const api = useRef({ go, dive, at });
  api.current = { go, dive, at };

  useEffect(() => {
    const id = window.setTimeout(() => setNote((cur) => cur || "sideways walks"), 2200);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!note) return;
    const id = window.setTimeout(() => setNote(""), 1700);
    return () => window.clearTimeout(id);
  }, [note]);

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
      if (locked) return;
      if (ax > ay) {
        accX += event.deltaX;
        if (Math.abs(accX) < 28) return;
        const dir = accX > 0 ? 1 : -1;
        accX = 0;
        locked = true;
        api.current.go(api.current.at + dir);
      } else {
        accY += event.deltaY;
        if (Math.abs(accY) < 28) return;
        const down = accY > 0;
        accY = 0;
        locked = true;
        api.current.dive(down ? 1 : -1);
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
      if (event.key === "ArrowRight") api.current.go(api.current.at + 1);
      if (event.key === "ArrowLeft") api.current.go(api.current.at - 1);
      if (event.key === "ArrowUp") api.current.dive(-1);
      if (event.key === "ArrowDown") api.current.dive(1);
      if (event.key === "Escape") setFound(false);
      if (event.key === "?" || event.key === "m") setFound(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let x = 0;
    let y = 0;
    let armed = false;
    let held = 0;
    const start = (event: PointerEvent) => {
      const t = event.target as HTMLElement | null;
      if (t?.closest("a, button, .z-find")) return;
      armed = true;
      x = event.clientX;
      y = event.clientY;
      held = window.setTimeout(() => {
        armed = false;
        setFound(true);
        setNote("hold → the list");
      }, 520);
    };
    const end = (event: PointerEvent) => {
      window.clearTimeout(held);
      if (!armed) return;
      armed = false;
      const dx = event.clientX - x;
      const dy = event.clientY - y;
      if (Math.hypot(dx, dy) < 18) {
        setNote((cur) => {
          if (!known.includes("walk")) return "sideways walks";
          if (!known.includes("rise") && !known.includes("delve")) return "up rises · down delves";
          return cur;
        });
        return;
      }
      if (Math.abs(dx) > Math.abs(dy)) api.current.go(api.current.at + (dx < 0 ? 1 : -1));
      else api.current.dive(dy > 0 ? 1 : -1);
    };
    el.addEventListener("pointerdown", start);
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
    return () => {
      window.clearTimeout(held);
      el.removeEventListener("pointerdown", start);
      el.removeEventListener("pointerup", end);
      el.removeEventListener("pointercancel", end);
    };
  }, [known]);

  const map = [
    ["sideways", "walk", walked],
    ["up", "rise", roseKnown],
    ["down", "delve", sankKnown],
    ["hold", "the list", found],
  ] as const;

  return (
    <div className="tableau" ref={root}>
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
      <div className="z-compass">
        <button type="button" className={roseKnown ? "z-edge z-up known" : "z-edge z-up"} onClick={() => dive(-1)}>
          rise
        </button>
        <button type="button" className={sankKnown ? "z-edge z-down known" : "z-edge z-down"} onClick={() => dive(1)}>
          delve
        </button>
        <button type="button" className={walked ? "z-edge z-left known" : "z-edge z-left"} onClick={() => go(at - 1)}>
          back
        </button>
        <button
          type="button"
          className={walked ? "z-edge z-right known" : "z-edge z-right"}
          onClick={() => (at === BEATS.length - 1 ? setFound(true) : go(at + 1))}
        >
          {at === BEATS.length - 1 ? "more" : "on"}
        </button>
      </div>
      <header className="player-chrome">
        <p className="brand">{beat.title}</p>
        <div className="right">
          <button type="button" className="nav-link" onClick={() => setFound((v) => !v)}>
            more
          </button>
        </div>
      </header>
      {note ? <p className="z-hint">{note}</p> : null}
      <p className="tableau-line">{spoken}</p>
      <div className="tableau-dots" style={{ transform: `scaleX(${(at + 1) / BEATS.length})` }} />
      {found ? (
        <div className="z-find">
          <p className="z-find-title">gesture map</p>
          {map.map(([from, to, seen]) => (
            <p key={from} className={seen ? "on" : ""}>
              {from} → {seen ? to : "not yet"}
            </p>
          ))}
          <p className="z-find-title">pictures</p>
          {BEATS.map((item, n) => (
            <button
              key={item.title}
              type="button"
              className={n === at ? "on" : ""}
              onClick={() => {
                go(n);
                setFound(false);
              }}
            >
              {item.title}
            </button>
          ))}
          <p className="z-find-title">plays</p>
          <button type="button" onClick={() => setFound(false)}>
            version Z · this
          </button>
          <Link to="/walk">porch walk · every scene</Link>
          <Link to="/ball" search={{ stay: 1 }}>
            peach ball
          </Link>
          <Link to="/fight">porch fight</Link>
          <Link to="/tale">the words</Link>
          <Link to="/her">her</Link>
          <Link to="/farther">a little farther</Link>
        </div>
      ) : null}
    </div>
  );
}
