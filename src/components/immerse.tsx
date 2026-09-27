import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { PRESENT } from "@/lib/present";
import { BPEACE, peaceMark, peaceWord } from "@/lib/bpeace";
import { PeaceIcon } from "@/components/peace-mark";

const RECEIPT = "sae-receipt";

function readReceipt(): number[] {
  try {
    const saved = JSON.parse(sessionStorage.getItem(RECEIPT) || "");
    if (Array.isArray(saved) && saved.every((n) => typeof n === "number")) return saved.slice(-24);
  } catch {
    /* a new sitting */
  }
  return [0];
}

export function Immerse({ onWalk }: { onWalk: () => void }) {
  const [at, setAt] = useState(0);
  const [open, setOpen] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [depth, setDepth] = useState<-1 | 0 | 1>(0);
  const [both, setBoth] = useState(false);
  const [ways, setWays] = useState(false);
  const [lit, setLit] = useState(false);
  const [trail, setTrail] = useState<number[]>(readReceipt);
  const rose = useRef(false);
  const sank = useRef(false);
  const skip = useRef(false);
  const potato = useRef<HTMLDivElement>(null);
  const atRef = useRef(0);
  atRef.current = at;
  const frame = PRESENT[at] ?? PRESENT[0];
  const navigate = useNavigate();

  const land = (n: number) => {
    const dest = ((n % PRESENT.length) + PRESENT.length) % PRESENT.length;
    setDepth(0);
    setZoom(1);
    setAt(dest);
    potato.current?.querySelectorAll(".slice")[dest]?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  useEffect(() => {
    if (skip.current) {
      skip.current = false;
      return;
    }
    setTrail((prev) => {
      if (prev[prev.length - 1] === at) return prev;
      const next = [...prev, at].slice(-24);
      try {
        sessionStorage.setItem(RECEIPT, JSON.stringify(next));
      } catch {
        /* the trail still lives in the page */
      }
      return next;
    });
  }, [at]);

  const rollback = () => {
    if (trail.length < 2) return;
    const next = trail.slice(0, -1);
    const dest = next[next.length - 1] ?? 0;
    skip.current = true;
    try {
      sessionStorage.setItem(RECEIPT, JSON.stringify(next));
    } catch {
      /* the shorter trail still sits in the page */
    }
    setTrail(next);
    land(dest);
  };

  useEffect(() => {
    const light = () => setLit(true);
    const onMsg = (event: MessageEvent) => {
      if (event.data?.type === "sae-light") light();
    };
    navigator.serviceWorker?.addEventListener("message", onMsg);
    const img = new Image();
    img.onload = light;
    img.src = PRESENT[0].src;
    return () => navigator.serviceWorker?.removeEventListener("message", onMsg);
  }, []);

  useEffect(() => {
    const root = potato.current;
    if (!root) return;
    const slices = [...root.querySelectorAll<HTMLElement>(".slice")];
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.6) continue;
          const n = Number((entry.target as HTMLElement).dataset.i);
          if (!Number.isNaN(n)) setAt(n);
        }
      },
      { root, threshold: [0.6] },
    );
    slices.forEach((slice) => obs.observe(slice));
    return () => obs.disconnect();
  }, [open]);

  const layer = (dir: -1 | 1) => {
    setDepth((now) => {
      if (now === dir) return 0;
      if (dir < 0) rose.current = true;
      else sank.current = true;
      if (rose.current && sank.current) setBoth(true);
      return dir;
    });
  };

  return (
    <section className={`immerse${open ? " open" : ""}${lit ? " lit" : ""}`} data-cast={frame.id} style={{ ["--zoom" as string]: zoom }}>
      <header className="player-chrome fold-chrome still-nav">
        <button type="button" className="mark" onClick={rollback} disabled={trail.length < 2}>
          <PeaceIcon mark="feather" />
          <span>back</span>
        </button>
        <button type="button" className={ways ? "mark on" : "mark"} onClick={() => setWays((on) => !on)}>
          <PeaceIcon mark="circle" />
          <span>ways</span>
        </button>
        <Link to="/goal" className="mark">
          <PeaceIcon mark="spark" />
          <span>glow</span>
        </Link>
        {ways ? (
          <div className="way-pics">
            <button type="button" onClick={onWalk}>
              <img src="/peachfall-walk.jpg" alt="" />
            </button>
            <Link to="/fallen">
              <img src="/everdelve.jpg" alt="" />
            </Link>
            <Link to="/her">
              <img src="/her-pink.jpg" alt="" />
            </Link>
            <Link to="/knight">
              <img src="/knight-beside.jpg" alt="" />
            </Link>
            <Link to="/fight">
              <img src="/pillow-fight.jpg" alt="" />
            </Link>
            <Link to="/leaf">
              <img src="/leaf-path.jpg" alt="" />
            </Link>
            <Link to="/marks">
              <img src="/garden-ring.jpg" alt="" />
            </Link>
            <Link to="/farther">
              <img src="/farther-well.jpg" alt="" />
            </Link>
            <Link to="/layers" search={{ img: "/peachfall-walk.jpg" }}>
              <img src="/love-arch.jpg" alt="" />
            </Link>
          </div>
        ) : null}
      </header>
      <div className="receipt">
        {trail.map((n, i) => (
          <button
            key={`${n}-${i}`}
            type="button"
            style={{ background: PRESENT[n]?.color ?? "#f6efe8" }}
            onClick={() => {
              skip.current = true;
              const next = trail.slice(0, i + 1);
              try {
                sessionStorage.setItem(RECEIPT, JSON.stringify(next));
              } catch {
                /* the click still rolls back */
              }
              setTrail(next);
              land(n);
            }}
          />
        ))}
      </div>
      {open ? (
        <>
        <div
          className="potato"
          ref={potato}
          onClick={(event) => {
            const slice = (event.target as HTMLElement).closest(".slice");
            if (!slice) return;
            const beat = PRESENT[Number(slice.getAttribute("data-i"))];
            if (beat?.id === "glow") navigate({ to: "/goal" });
          }}
          onWheel={(event) => {
            if (!event.ctrlKey && !event.metaKey) return;
            event.preventDefault();
            setZoom((z) => Math.min(2.4, Math.max(1, z + (event.deltaY < 0 ? 0.06 : -0.06))));
          }}
        >
          {PRESENT.map((beat, n) => (
            <article key={beat.id} className={`slice${n === at ? " on" : ""}${n === at && depth < 0 ? " risen" : ""}${n === at && depth > 0 ? " sunk" : ""}${both && n === at ? " both" : ""}`} data-i={n}>
              <img className="face" src={beat.src} alt="" style={n === at ? { transform: `scale(${zoom})` } : undefined} />
              <img className="over" src={beat.high} alt="" />
              <img className="under" src={beat.low} alt="" />
            </article>
          ))}
        </div>
        <nav className="hfilm">
          {PRESENT.map((beat, n) => (
            <button key={beat.id} type="button" className={n === at ? "on" : ""} onClick={() => land(n)}>
              <img src={beat.src} alt="" />
              <PeaceIcon mark={peaceMark(beat.id)} />
              <span>{peaceWord(beat.id)}</span>
            </button>
          ))}
        </nav>
        <p className="hfilm-line">{BPEACE.story}</p>
        </>
      ) : (
        <img className="frame" src={depth < 0 ? frame.high : depth > 0 ? frame.low : frame.src} alt="" />
      )}
      <div className="beads">
        {PRESENT.map((beat, n) => (
          <button
            key={beat.id}
            type="button"
            className={n === at ? "on" : ""}
            style={{ background: beat.color }}
            onClick={() => land(n)}
          />
        ))}
      </div>
      <div className="axis-marks">
        <button type="button" className={depth < 0 ? "rise on" : "rise"} onClick={() => layer(-1)}>
          <i />
        </button>
        <button type="button" className={depth > 0 ? "delve on" : "delve"} onClick={() => layer(1)}>
          <i />
        </button>
      </div>
      <button type="button" className="all-mark" onClick={() => setOpen((on) => !on)}>
        <i />
        <i />
        <i />
        <i />
      </button>
    </section>
  );
}
