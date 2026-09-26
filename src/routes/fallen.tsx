import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, createFileRoute } from "@tanstack/react-router";
import { PLATES } from "@/lib/plates";
import { decodeHeat, markSeen, readFaves, readSeen, shareHeat, toggleFave } from "@/lib/seen";

const BEATS = [
  {
    act: "Z",
    src: "/peachfall-walk.jpg",
    title: "Peach fall",
    line: "The red-haired one looks down. Pink and purple walk beside her, on the golden path.",
    over: "Rise and the blossoms are the weather.",
    under: "Delve and the path is gold under their feet.",
  },
  {
    act: "Z",
    src: "/peachfall-on.jpg",
    title: "A little farther",
    line: "They have not left her. The path stays gold.",
    over: "Rise. She is still sad, and still walking.",
    under: "Delve. Nobody is ahead of her.",
  },
  {
    act: "Z",
    src: "/scroll-doors.jpg",
    title: "The corridor",
    line: "Each doorway is a chapter. Down the hall is the scroll. Sideways still walks.",
    over: "Rise and the doors are only light.",
    under: "Delve and the floor remembers every step.",
  },
  {
    act: "Z",
    src: "/scroll-dear.jpg",
    title: "Dear",
    line: "She is at the well. The deer stands beside her, not ahead.",
    over: "Rise and the sky is only dusk.",
    under: "Delve and the well keeps what it was given.",
  },
  {
    act: "Z",
    src: "/scroll-meet.jpg",
    title: "Orange, and red",
    line: "The door is light. The circle takes the weather and stays whole.",
    over: "Rise and neither covers the other.",
    under: "Delve and the water holds both.",
  },
  {
    act: "Z",
    src: "/scroll-leaf.jpg",
    title: "The leaf, again",
    line: "One leaf, where the orange path meets the rain. It is not a trophy.",
    over: "Rise and the leaf is still beside you.",
    under: "Delve and the path does not ask you to take it.",
  },
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

const DEPTH: Record<string, { high: string; low: string }> = {
  "/porch-face.jpg": { high: "/porch-lift.jpg", low: "/garden-porch.jpg" },
  "/small-one.jpg": { high: "/sisters.jpg", low: "/anna.jpg" },
  "/garden-porch.jpg": { high: "/stare.png", low: "/ring.png" },
  "/stare.png": { high: "/weather.jpg", low: "/well-cry.jpg" },
  "/ring.png": { high: "/garden-ring.jpg", low: "/well-cry.jpg" },
  "/weather.jpg": { high: "/farther-well.jpg", low: "/beat01.jpg" },
  "/farther-well.jpg": { high: "/beat05.jpg", low: "/well-cry.jpg" },
  "/beat05.jpg": { high: "/pink-forest.jpg", low: "/beat01.jpg" },
  "/well-cry.jpg": { high: "/stare.png", low: "/beat01.jpg" },
  "/beat01.jpg": { high: "/weather.jpg", low: "/pink-forest.jpg" },
  "/pink-forest.jpg": { high: "/sisters.jpg", low: "/everdelve.jpg" },
  "/loom.png": { high: "/kirby.png", low: "/porch.jpg" },
  "/everdelve.jpg": { high: "/pink-forest.jpg", low: "/loom.png" },
};

const ALL = [
  ...BEATS,
  ...PLATES.flatMap((p) =>
    p.shelf === "study" || BEATS.some((b) => b.src === p.src)
      ? []
      : [
          {
            act: "Z",
            src: p.src,
            motion: p.motion,
            title: p.title,
            line: p.note,
            over: p.note,
            under: p.note,
          },
        ],
  ),
];

export const Route = createFileRoute("/fallen")({
  component: Fallen,
});

export function Fallen() {
  const root = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);
  const [depth, setDepth] = useState<-1 | 0 | 1>(0);
  const [side, setSide] = useState<-1 | 0 | 1>(0);
  const [both, setBoth] = useState(false);
  const [known, setKnown] = useState<Array<"walk" | "rise" | "delve">>([]);
  const [found, setFound] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [motion, setMotion] = useState(true);
  const [lineOn, setLineOn] = useState(false);
  const [bubbles, setBubbles] = useState(true);
  const [scroll, setScroll] = useState(false);
  const [heat, setHeat] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [faves, setFaves] = useState<string[]>([]);
  const [shared, setShared] = useState<Record<string, number> | null>(null);
  const scrollRef = useRef(false);
  scrollRef.current = scroll;
  const navigate = useNavigate();
  const rose = useRef(false);
  const sank = useRef(false);
  const knownRef = useRef(known);
  knownRef.current = known;
  const beat = ALL[at] ?? ALL[0];
  const fall = beat.src.startsWith("/peachfall");
  const frame = fall ? beat.src : ((depth < 0 ? DEPTH[beat.src]?.high : depth > 0 ? DEPTH[beat.src]?.low : beat.src) ?? beat.src);
  const look =
    side < 0
      ? { width: "190%", height: "190%", left: "2%", top: "-42%", right: "auto", bottom: "auto" }
      : side > 0
        ? { width: "190%", height: "190%", left: "-92%", top: "-42%", right: "auto", bottom: "auto" }
        : depth < 0
          ? { width: "170%", height: "170%", left: "-35%", top: "0%", right: "auto", bottom: "auto" }
          : depth > 0
            ? { width: "170%", height: "170%", left: "-35%", top: "-70%", right: "auto", bottom: "auto" }
            : { width: "100%", height: "100%", left: "0%", top: "0%", right: "auto", bottom: "auto" };
  const spoken =
    side < 0
      ? fall
        ? "Pink walks beside her. She has not gone ahead."
        : beat.line
      : side > 0
        ? fall
          ? "Purple stays at her other side. The path is still gold."
          : beat.line
        : !lineOn && depth === 0
          ? ""
          : depth < 0
            ? fall
              ? "The blossoms are only weather, and they let her through."
              : beat.over
            : depth > 0
              ? fall
                ? "Gold under their feet. The leaf is still beside the path."
                : beat.under
              : at === BEATS.length - 1 && both
                ? "You rose and you delved. Weee. The story fits."
                : beat.line;

  const learn = (axis: "walk" | "rise" | "delve") => {
    if (knownRef.current.includes(axis)) return;
    knownRef.current = [...knownRef.current, axis];
    setKnown(knownRef.current);
  };

  const go = (n: number) => {
    const el = rail.current;
    if (!el) return;
    const next = Math.max(0, Math.min(ALL.length - 1, n));
    if (next === at) return;
    setDepth(0);
    setSide(0);
    setLineOn(false);
    if (scrollRef.current) el.scrollTo({ top: next * el.clientHeight, behavior: "smooth" });
    else el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    learn("walk");
  };

  const along = (dir: -1 | 1) => {
    if (side === 0) {
      setDepth(0);
      setSide(dir);
      setLineOn(true);
      learn("walk");
      return;
    }
    if (side === -dir) {
      setSide(0);
      setLineOn(false);
      return;
    }
    setSide(0);
    go(at + dir);
  };

  const dive = (dir: -1 | 1) => {
    if (depth === dir) {
      setDepth(0);
      setLineOn(false);
      go(at + dir);
      return;
    }
    if (depth === -dir) {
      setDepth(0);
      setLineOn(false);
      return;
    }
    setSide(0);
    setDepth(dir);
    setLineOn(true);
    if (dir > 0) {
      sank.current = true;
      learn("delve");
    } else {
      rose.current = true;
      learn("rise");
    }
    if (rose.current && sank.current) setBoth(true);
  };

  const api = useRef({ go, along, dive, at, scroll });
  api.current = { go, along, dive, at, scroll };

  useEffect(() => {
    setCounts(readSeen());
    setFaves(readFaves());
    const params = new URLSearchParams(window.location.search);
    const heatQ = params.get("heat");
    if (heatQ) {
      setShared(decodeHeat(heatQ));
      setHeat(true);
      return;
    }
    try {
      if (sessionStorage.getItem("sae-door")) return;
      sessionStorage.setItem("sae-door", "1");
    } catch {
      return;
    }
    const doors = ["stay", "bubbles", "scroll", "line", "leaf", "marks", "walk", "ball", "fight", "tale", "her", "farther"] as const;
    const door = doors[Math.floor(Math.random() * doors.length)];
    if (door === "bubbles") setBubbles(true);
    else if (door === "scroll") setScroll(true);
    else if (door === "line") setLineOn(true);
    else if (door === "stay") {
      const n = Math.floor(Math.random() * ALL.length);
      window.setTimeout(() => api.current.go(n), 400);
    } else if (door === "ball") navigate({ to: "/ball", search: { stay: 1 } });
    else navigate({ to: `/${door}` });
  }, [navigate]);

  useEffect(() => {
    if (!beat?.src) return;
    setCounts(markSeen(beat.src));
  }, [beat.src]);

  useEffect(() => {
    if (!playing || found) return;
    const id = window.setInterval(() => {
      const next = api.current.at + 1;
      api.current.go(next >= ALL.length ? 0 : next);
    }, 4500);
    return () => window.clearInterval(id);
  }, [playing, found]);

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
    let locked = false;
    const onWheel = (event: WheelEvent) => {
      const t = event.target as HTMLElement | null;
      if (t?.closest(".z-find, .heat")) return;
      const ax = Math.abs(event.deltaX);
      const ay = Math.abs(event.deltaY);
      if (ax < 1 && ay < 1) return;
      event.preventDefault();
      setPlaying(false);
      if (api.current.scroll && !(event.shiftKey || ax > ay)) {
        rail.current?.scrollBy({ top: event.deltaY });
        return;
      }
      if (locked) return;
      locked = true;
      window.setTimeout(() => {
        locked = false;
      }, 420);
      const horizontal = event.shiftKey || ax > ay;
      if (horizontal) {
        const dir = (event.deltaX || event.deltaY) > 0 ? 1 : -1;
        api.current.along(dir);
      } else {
        api.current.dive(event.deltaY > 0 ? 1 : -1);
      }
    };
    window.addEventListener("wheel", onWheel, { capture: true, passive: false });
    return () => window.removeEventListener("wheel", onWheel, { capture: true });
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") api.current.along(1);
      if (event.key === "ArrowLeft") api.current.along(-1);
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
      }, 520);
    };
    const end = (event: PointerEvent) => {
      window.clearTimeout(held);
      if (!armed) return;
      armed = false;
      const dx = event.clientX - x;
      const dy = event.clientY - y;
      if (Math.hypot(dx, dy) < 18) {
        setLineOn((v) => !v);
        return;
      }
      if (Math.abs(dx) > Math.abs(dy)) api.current.along(dx < 0 ? 1 : -1);
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
  }, []);

  const seeds = ["/peachfall-walk.jpg", "/scroll-doors.jpg", "/scroll-dear.jpg", "/porch-face.jpg"];
  const seenOrder = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([src]) => src);
  const bubbleSrcs = Array.from(new Set([...seeds, ...seenOrder, beat.src])).filter((src) =>
    ALL.some((item) => item.src === src),
  );
  const spotsRef = useRef<Record<string, { x: number; y: number; g: string; placed: boolean; pop?: boolean; land?: boolean }>>({});
  const tapRef = useRef({ src: "", t: 0, timer: 0 });
  const [spots, setSpots] = useState(spotsRef.current);
  const [dragG, setDragG] = useState<string | null>(null);
  const [magnet, setMagnet] = useState<string | null>(null);
  spotsRef.current = spots;

  const bubbleKey = bubbleSrcs.join("|");

  useEffect(() => {
    const srcs = bubbleKey.split("|").filter(Boolean);
    setSpots((prev) => {
      let saved = prev;
      if (!Object.keys(prev).length) {
        try {
          saved = JSON.parse(localStorage.getItem("sae-bubble-spots") || "{}");
        } catch {
          saved = {};
        }
      }
      let changed = saved !== prev;
      const next = { ...saved };
      srcs.forEach((src, i) => {
        if (!next[src]) {
          next[src] = { x: 2 + (i % 4) * 2.1, y: 3, g: "pile", placed: false };
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [bubbleKey]);

  useEffect(() => {
    const src = beat?.src;
    if (!src) return;
    setSpots((prev) => {
      const cur = prev[src];
      if (cur?.placed) return prev;
      const mates = Object.entries(prev).filter(([key, spot]) => key !== src && spot.g === "pile");
      const anchor = mates.find(([, spot]) => spot.placed)?.[1] ?? mates[0]?.[1] ?? { x: 2, y: 3 };
      const i = mates.length;
      const x = Math.min(94, anchor.x + (i % 4) * 2.1);
      const y = Math.min(90, anchor.y + Math.floor(i / 4) * 2.2);
      if (cur && Math.abs(cur.x - x) < 0.4 && Math.abs(cur.y - y) < 0.4 && cur.g === "pile") return prev;
      return { ...prev, [src]: { x, y, g: "pile", placed: false, pop: !cur } };
    });
  }, [beat.src]);

  const grab = (src: string, event: React.PointerEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const rect = root.current?.getBoundingClientRect();
    if (!rect) return;
    const startX = event.clientX;
    const startY = event.clientY;
    const before = spotsRef.current;
    const g = before[src]?.g ?? src;
    const mates = bubbleSrcs.filter((item) => (before[item]?.g ?? item) === g);
    let moved = false;
    setDragG(g);
    const move = (ev: PointerEvent) => {
      const dx = ((ev.clientX - startX) / rect.width) * 100;
      const dy = ((ev.clientY - startY) / rect.height) * 100;
      if (Math.hypot(ev.clientX - startX, ev.clientY - startY) > 6) moved = true;
      const leadX = Math.min(94, Math.max(0, (before[src]?.x ?? 0) + dx));
      const leadY = Math.min(90, Math.max(0, (before[src]?.y ?? 0) + dy));
      let host: string | null = null;
      for (const other of bubbleSrcs) {
        if (mates.includes(other)) continue;
        const spot = before[other];
        if (spot && Math.hypot(spot.x - leadX, spot.y - leadY) < 10) host = spot.g;
      }
      setMagnet(host);
      setSpots((prev) => {
        const next = { ...prev };
        for (const item of mates) {
          const origin = before[item];
          if (!origin) continue;
          next[item] = {
            ...origin,
            x: Math.min(94, Math.max(0, origin.x + dx)),
            y: Math.min(90, Math.max(0, origin.y + dy)),
            placed: true,
          };
        }
        return next;
      });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      setDragG(null);
      setMagnet(null);
      if (!moved) {
        const now = Date.now();
        window.clearTimeout(tapRef.current.timer);
        if (tapRef.current.src === src && now - tapRef.current.t < 320) {
          tapRef.current = { src: "", t: 0, timer: 0 };
          setSpots((prev) => {
            const next = { ...prev, [src]: { ...prev[src], g: src, placed: true } };
            localStorage.setItem("sae-bubble-spots", JSON.stringify(next));
            return next;
          });
          return;
        }
        tapRef.current = {
          src,
          t: now,
          timer: window.setTimeout(() => {
            const n = ALL.findIndex((item) => item.src === src);
            if (n >= 0) {
              setPlaying(false);
              go(n);
            }
          }, 280),
        };
        return;
      }
      setSpots((prev) => {
        const me = prev[src];
        if (!me) return prev;
        let host: string | null = null;
        for (const other of bubbleSrcs) {
          if (mates.includes(other)) continue;
          const spot = prev[other];
          if (spot && Math.hypot(spot.x - me.x, spot.y - me.y) < 10) host = spot.g;
        }
        const next = { ...prev };
        const pile = host ? bubbleSrcs.filter((item) => mates.includes(item) || next[item]?.g === host) : mates;
        pile.forEach((item, i) => {
          const spot = next[item];
          if (!spot) return;
          next[item] = host
            ? {
                x: Math.min(94, Math.max(0, me.x + (i % 4) * 2.1)),
                y: Math.min(90, Math.max(0, me.y + Math.floor(i / 4) * 2.2)),
                g: host,
                placed: true,
                land: true,
              }
            : { ...spot, placed: true, land: true };
        });
        localStorage.setItem("sae-bubble-spots", JSON.stringify(next));
        window.setTimeout(() => {
          setSpots((cur) => {
            if (!Object.values(cur).some((spot) => spot.land || spot.pop)) return cur;
            const cleared = { ...cur };
            for (const key of Object.keys(cleared)) {
              if (cleared[key].land || cleared[key].pop) cleared[key] = { ...cleared[key], land: false, pop: false };
            }
            return cleared;
          });
        }, 520);
        return next;
      });
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  const heatCounts = shared ?? counts;
  const kept = faves.includes(beat.src);

  return (
    <div className={`tableau${scroll ? " scroll" : ""}`} ref={root}>
      <div className="z-rail" ref={rail}>
        {ALL.map((item, n) => (
          <section className="z-beat" data-i={n} key={`${n}-${item.src}`}>
            <img key={frame} src={frame} alt="" style={look} />
            {motion && item.motion && n === at && depth === 0 && side === 0 ? (
              <video src={item.motion} poster={item.src} muted loop playsInline autoPlay />
            ) : null}
          </section>
        ))}
      </div>
      <div className="z-compass">
        <button type="button" className="z-edge z-up" aria-label="rise" onClick={() => { setPlaying(false); dive(-1); }} />
        <button type="button" className="z-edge z-down" aria-label="delve" onClick={() => { setPlaying(false); dive(1); }} />
        <button type="button" className="z-edge z-left" aria-label="back" onClick={() => { setPlaying(false); along(-1); }} />
        <button type="button" className="z-edge z-right" aria-label="on" onClick={() => { setPlaying(false); along(1); }} />
      </div>
      <div className="z-dots">
        <button type="button" className={motion ? "on" : ""} aria-label={motion ? "still" : "motion"} onClick={() => setMotion((v) => !v)} />
        <button type="button" aria-label={found ? "close" : "map"} onClick={() => setFound((v) => !v)} />
      </div>
      {bubbles && bubbleSrcs.length ? (
        <div className="bubbles">
          {bubbleSrcs.map((src, i) => {
            const spot = spots[src] ?? { x: 2 + (i % 4) * 2.1, y: 3, g: "pile", placed: false };
            const grouped = bubbleSrcs.some((item) => item !== src && spots[item]?.g === spot.g);
            const cls = [
              dragG === spot.g ? "held" : "",
              magnet && (spot.g === magnet || spot.g === dragG) ? "near" : "",
              grouped ? "with" : "",
              spot.pop ? "pop" : "",
              spot.land ? "land" : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <button
                key={src}
                type="button"
                aria-label="return"
                className={cls}
                style={{ backgroundImage: `url(${src})`, left: `${spot.x}%`, top: `${spot.y}%`, zIndex: dragG === spot.g ? 40 : 6 + i }}
                onPointerDown={(event) => grab(src, event)}
              />
            );
          })}
        </div>
      ) : null}
      {heat ? (
        <div className="heat">
          <p>{shared ? "A shared heat." : "On this machine."}</p>
          <div>
            {ALL.map((item, n) => {
              const nSeen = heatCounts[item.src] || 0;
              return (
                <button
                  key={`${n}-${item.src}`}
                  type="button"
                  title={item.title}
                  style={{ opacity: nSeen ? 0.35 + Math.min(0.65, nSeen / 6) : 0.18 }}
                  onClick={() => {
                    setPlaying(false);
                    setHeat(false);
                    go(n);
                  }}
                >
                  <img src={item.src} alt="" />
                </button>
              );
            })}
          </div>
          <button type="button" onClick={() => shareHeat(counts)}>
            share with @stevoblevo
          </button>
          {shared ? (
            <button type="button" onClick={() => setShared(null)}>
              mine
            </button>
          ) : null}
          <button type="button" onClick={() => setHeat(false)}>
            close
          </button>
        </div>
      ) : null}
      {spoken ? <p className="tableau-line">{spoken}</p> : null}
      <div className="tableau-dots" style={{ transform: `scaleX(${(at + 1) / ALL.length})` }} />
      {found ? (
        <div className="z-find">
          <button type="button" onClick={() => setPlaying((v) => !v)}>
            {playing ? "pause" : "play"}
          </button>
          <button type="button" onClick={() => setMotion((v) => !v)}>
            {motion ? "still" : "motion"}
          </button>
          <button type="button" onClick={() => setBubbles((v) => !v)}>
            {bubbles ? "hide bubbles" : "bubbles"}
          </button>
          <button type="button" onClick={() => setScroll((v) => !v)}>
            {scroll ? "walk" : "scroll"}
          </button>
          <button
            type="button"
            onClick={() => {
              setFaves(toggleFave(beat.src));
            }}
          >
            {kept ? "kept" : "keep"}
          </button>
          <button type="button" onClick={() => setHeat(true)}>
            heat
          </button>
          <button type="button" onClick={() => shareHeat(counts)}>
            share with @stevoblevo
          </button>
          <p className="z-find-title">places</p>
          {ALL.map((item, n) => (
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
          <Link to="/leaf">the leaf</Link>
          <Link to="/marks">the marks</Link>
          <Link to="/walk">thumbnails</Link>
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
