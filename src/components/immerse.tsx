import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { FRIEND_LINE, PRESENT, filmFor, type ReelId } from "@/lib/present";
import { peaceLine, peaceMark, peaceWord, type PeaceMark } from "@/lib/bpeace";
import { FORMS, chooseForm, readForm, type FormId } from "@/lib/forms";
import { PeaceIcon } from "@/components/peace-mark";

const POPS = [
  { id: "hi", src: "/pop-hi.jpg", word: "hi" },
  { id: "wink", src: "/pop-wink.jpg", word: "" },
  { id: "blink", src: "/pop-blink.jpg", word: "" },
] as const;

const CLOSER = 1.12;
const CREW = [
  { id: "spekl", src: "/show-speckle.jpg", dress: "/show-party.jpg", line: "this dress", sing: "" },
  { id: "golden", src: "/show-golden.jpg", dress: "/show-golden.jpg", line: "the silk", sing: "" },
  { id: "reign", src: "/portrait/rain.jpg", dress: "/portrait/rain.jpg", line: "red reign", sing: "/audio/scenes/raindear.mp3" },
  { id: "ball", src: "/portrait/peach.jpg", dress: "/portrait/peach.jpg", line: "peach ball", sing: "/audio/scenes/bambi.mp3" },
] as const;

type CrewLook = { id: (typeof CREW)[number]["id"]; mode: "dress" | "dance" | "sing" };

const SWIPE = 64;

function receiptKey(reel: ReelId) {
  if (reel === "friend") return "sae-receipt-friend";
  if (reel === "peach") return "sae-receipt-peach";
  if (reel === "show") return "sae-receipt-show";
  return "sae-receipt";
}

function readReceipt(reel: ReelId): number[] {
  try {
    const saved = JSON.parse(sessionStorage.getItem(receiptKey(reel)) || "");
    if (Array.isArray(saved) && saved.every((n) => typeof n === "number")) return saved.slice(-24);
  } catch {
    /* a new sitting */
  }
  return [0];
}

function sliceCopy(beat: { id: string; word?: string; line?: string; mark?: PeaceMark }) {
  return {
    word: beat.word || peaceWord(beat.id),
    line: beat.id === "pane" ? "" : beat.line || peaceLine(beat.id),
    mark: (beat.mark || peaceMark(beat.id)) as PeaceMark,
  };
}

export function Immerse({
  onWalk,
  onRestart,
  start = "present",
  startAt = 0,
  tell = false,
}: {
  onWalk: () => void;
  onRestart?: () => void;
  start?: ReelId;
  startAt?: number;
  tell?: boolean;
}) {
  const [reel, setReel] = useState<ReelId>(start);
  const [at, setAt] = useState(startAt);
  const [open, setOpen] = useState(true);
  const [zoom, setZoom] = useState(CLOSER);
  const [bare, setBare] = useState(true);
  const [gate, setGate] = useState<"land" | "four" | "port">("land");
  const [depth, setDepth] = useState<-1 | 0 | 1>(0);
  const [both, setBoth] = useState(false);
  const [ways, setWays] = useState(false);
  const [lit, setLit] = useState(false);
  const [gone, setGone] = useState(false);
  const [form, setForm] = useState<FormId>("daylight");
  const [pick, setPick] = useState(false);
  const [play, setPlay] = useState<string | null>(null);
  const [said, setSaid] = useState<string | null>(null);
  const [crew, setCrew] = useState<CrewLook | null>(null);
  const [pup, setPup] = useState(false);
  const song = useRef<HTMLAudioElement | null>(null);
  const [fold, setFold] = useState(tell);
  const [trail, setTrail] = useState<number[]>(() => readReceipt(start));
  const rose = useRef(false);
  const sank = useRef(false);
  const skip = useRef(false);
  const potato = useRef<HTMLDivElement>(null);
  const zoomRef = useRef(1);
  const drag = useRef({ x: 0, y: 0, moved: false });
  const reelRef = useRef<ReelId>(start);
  reelRef.current = reel;
  zoomRef.current = zoom;
  const film = filmFor(reel);
  const frame = film[at] ?? film[0];
  const copy = sliceCopy(frame);
  if (typeof document !== "undefined") document.documentElement.dataset.bare = bare ? "1" : "0";

  useEffect(() => {
    document.documentElement.dataset.bare = bare ? "1" : "0";
  }, [bare]);

  useEffect(() => {
    if (frame.id !== "party") {
      setCrew(null);
      song.current?.pause();
    }
  }, [frame.id]);
  const lean = form === "pi" || form === "netbook";
  const navigate = useNavigate();

  const land = (n: number, which: ReelId = reelRef.current) => {
    const length = filmFor(which).length;
    const dest = ((n % length) + length) % length;
    setDepth(0);
    setZoom(CLOSER);
    zoomRef.current = 1;
    setAt(dest);
    setPlay(null);
    potato.current?.querySelectorAll(".slice")[dest]?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  useEffect(() => {
    if (!startAt) return;
    const id = requestAnimationFrame(() => land(startAt, start));
    return () => cancelAnimationFrame(id);
    // land the opened plate once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enter = (next: ReelId) => {
    if (next === reelRef.current) {
      land(0, next);
      setWays(false);
      return;
    }
    reelRef.current = next;
    skip.current = true;
    setReel(next);
    setAt(0);
    setPlay(null);
    setDepth(0);
    setZoom(CLOSER);
    zoomRef.current = 1;
    setGone(false);
    setWays(false);
    setTrail(readReceipt(next));
    requestAnimationFrame(() => {
      const root = potato.current;
      if (!root) return;
      root.scrollLeft = 0;
    });
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
        sessionStorage.setItem(receiptKey(reelRef.current), JSON.stringify(next));
      } catch {
        /* the trail still lives in the page */
      }
      return next;
    });
  }, [at, reel]);

  const rollback = () => {
    if (trail.length < 2) return;
    const next = trail.slice(0, -1);
    const dest = next[next.length - 1] ?? 0;
    skip.current = true;
    try {
      sessionStorage.setItem(receiptKey(reel), JSON.stringify(next));
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
    const paint = () => setForm(readForm());
    paint();
    window.addEventListener("sae-form", paint);
    return () => window.removeEventListener("sae-form", paint);
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
  }, [open, reel]);

  useEffect(() => {
    const root = potato.current;
    if (!root) return;
    let start = 0;
    let base = 1;
    const dist = (event: TouchEvent) => {
      const a = event.touches[0];
      const b = event.touches[1];
      if (!a || !b) return 0;
      return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    };
    const onStart = (event: TouchEvent) => {
      if (event.touches.length !== 2) return;
      start = dist(event);
      base = zoomRef.current;
    };
    const onMove = (event: TouchEvent) => {
      if (event.touches.length !== 2 || !start) return;
      event.preventDefault();
      const next = Math.min(2.4, Math.max(1, base * (dist(event) / start)));
      zoomRef.current = next;
      setZoom(next);
    };
    const onEnd = () => {
      start = 0;
    };
    root.addEventListener("touchstart", onStart, { passive: true });
    root.addEventListener("touchmove", onMove, { passive: false });
    root.addEventListener("touchend", onEnd);
    return () => {
      root.removeEventListener("touchstart", onStart);
      root.removeEventListener("touchmove", onMove);
      root.removeEventListener("touchend", onEnd);
    };
  }, [open, reel]);

  const layer = (dir: -1 | 1) => {
    setDepth((now) => {
      if (now === dir) return 0;
      if (dir < 0) rose.current = true;
      else sank.current = true;
      if (rose.current && sank.current) setBoth(true);
      return dir;
    });
  };

  const onPotatoDown = (event: React.PointerEvent<HTMLDivElement>) => {
    drag.current = { x: event.clientX, y: event.clientY, moved: false };
  };

  const onPotatoMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    if (Math.abs(dx) >= SWIPE && Math.abs(dx) > Math.abs(dy)) drag.current.moved = true;
  };

  return (
    <section
      className={`immerse gate-${gate}${bare ? " bare" : ""}${open ? " open" : ""}${lit ? " lit" : ""}${gone ? " gone" : ""}${fold ? " telling" : ""}`}
      data-cast={frame.id}
      data-reel={reel}
      style={{ ["--zoom" as string]: zoom }}
    >
      <header className="player-chrome fold-chrome still-nav">
        <button type="button" className="mark" onClick={rollback} disabled={trail.length < 2}>
          <PeaceIcon mark="feather" />
          <span>back</span>
        </button>
        <button type="button" className={ways ? "mark on" : "mark"} onClick={() => setWays((on) => !on)}>
          <PeaceIcon mark="circle" />
          <span>ways</span>
        </button>
        <button type="button" className={gone ? "mark on" : "mark"} onClick={() => setGone((on) => !on)}>
          <PeaceIcon mark="sun" />
          <span>light</span>
        </button>
        <button type="button" className={pick ? "mark on" : "mark"} onClick={() => setPick((on) => !on)}>
          <span>form</span>
        </button>
        {pick ? (
          <div className="form-pick">
            {FORMS.map((item) => (
              <button key={item.id} type="button" className={form === item.id ? "on" : ""} onClick={() => chooseForm(item.id)}>
                {item.name}
              </button>
            ))}
          </div>
        ) : null}
        <button type="button" className={fold ? "mark on" : "mark"} onClick={() => setFold((on) => !on)}>
          <span>story</span>
        </button>
        <button type="button" className={reel === "show" ? "mark on" : "mark"} onClick={() => enter("show")}>
          <span>show</span>
        </button>
        <Link to="/wall" className="mark">
          <span>wall</span>
        </Link>
        <Link to="/goal" className="mark">
          <PeaceIcon mark="spark" />
          <span>glow</span>
        </Link>
        <span className="bench-read">
          <b>{reel === "friend" ? "friend" : reel === "peach" ? "peach" : reel === "show" ? "show" : "dawn"}</b>
          <i>{String(at + 1).padStart(2, "0")}</i>
          <em>{copy.word}</em>
        </span>
        <button type="button" className={depth < 0 ? "mark on" : "mark"} onClick={() => layer(-1)}>
          <span>rise</span>
        </button>
        <button type="button" className={depth > 0 ? "mark on" : "mark"} onClick={() => layer(1)}>
          <span>delve</span>
        </button>
        <button type="button" className={open ? "mark on" : "mark"} onClick={() => setOpen((on) => !on)}>
          <span>all</span>
        </button>
        <button
          type="button"
          className={gate !== "land" ? "mark on" : "mark"}
          onClick={() => setGate((now) => (now === "land" ? "four" : now === "four" ? "port" : "land"))}
        >
          <span>{gate === "land" ? "16:10" : gate === "four" ? "4:3" : "10:16"}</span>
        </button>
        {"motion" in frame && frame.motion ? (
          <button type="button" className={play === frame.id ? "mark on" : "mark"} onClick={() => setPlay((now) => (now === frame.id ? null : frame.id))}>
            <span>{play === frame.id ? "still" : "play"}</span>
          </button>
        ) : null}
        {ways ? (
          <div className="way-pics discover">
            <button type="button" onClick={() => enter("present")}><img src="/sae-do.jpg" alt="" /><span>present</span></button>
            <button type="button" onClick={() => enter("peach")}><img src="/peachfall-walk.jpg" alt="" /><span>peach</span></button>
            <button type="button" onClick={() => enter("friend")}><img src="/farther-well.jpg" alt="" /><span>friend</span></button>
            <button type="button" onClick={() => enter("show")}><img src="/show-party.jpg" alt="" /><span>show</span></button>
            <Link to="/wall"><img src="/garden-ring.jpg" alt="" /><span>wall</span></Link>
            <Link to="/story" search={{ at: 0 }}><img src="/leaf-deer.jpg" alt="" /><span>story</span></Link>
            <Link to="/ball" search={{ stay: 1 }}><img src="/portrait/peach.jpg" alt="" /><span>ball</span></Link>
            <Link to="/goal"><img src="/glow.jpg" alt="" /><span>glow</span></Link>
            <Link to="/her"><img src="/her-pink.jpg" alt="" /><span>her</span></Link>
            <Link to="/knight"><img src="/knight-beside.jpg" alt="" /><span>knight</span></Link>
            <Link to="/fight"><img src="/pillow-fight.jpg" alt="" /><span>fight</span></Link>
            <Link to="/leaf"><img src="/leaf-path.jpg" alt="" /><span>leaf</span></Link>
            <Link to="/marks"><img src="/mark-leaf.jpg" alt="" /><span>marks</span></Link>
            <Link to="/fallen"><img src="/everdelve.jpg" alt="" /><span>delve</span></Link>
            <Link to="/farther"><img src="/depth-well.jpg" alt="" /><span>farther</span></Link>
            <Link to="/tale"><img src="/porch.jpg" alt="" /><span>tale</span></Link>
            <Link to="/ci"><img src="/sky-ski.jpg" alt="" /><span>sky</span></Link>
            <Link to="/layers" search={{ img: "/peachfall-walk.jpg" }}><img src="/love-arch.jpg" alt="" /><span>layers</span></Link>
            <Link to="/walk"><img src="/peachfall-on.jpg" alt="" /><span>walk</span></Link>
            <Link to="/in/gam"><img src="/knight-beside.jpg" alt="" /><span>play</span></Link>
            {onRestart ? (
              <button type="button" onClick={onRestart}>
                <img src="/scene-sun.jpg" alt="" />
                <span>restart</span>
              </button>
            ) : null}
          </div>
        ) : null}
      </header>
      <div className="receipt">
        {trail.map((n, i) => (
          <button
            key={`${reel}-${n}-${i}`}
            type="button"
            style={{ backgroundColor: film[n]?.color ?? "#f6efe8" }}
            onClick={() => {
              skip.current = true;
              const next = trail.slice(0, i + 1);
              try {
                sessionStorage.setItem(receiptKey(reel), JSON.stringify(next));
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
            onPointerDown={onPotatoDown}
            onPointerMove={onPotatoMove}
            onClick={(event) => {
              if (drag.current.moved) return;
              if ((event.target as HTMLElement).closest("button, a")) return;
              const slice = (event.target as HTMLElement).closest(".slice");
              if (!slice) return;
              const box = event.currentTarget.getBoundingClientRect();
              const x = (event.clientX - box.left) / box.width;
              const y = (event.clientY - box.top) / box.height;
              const dx = Math.min(x, 1 - x);
              const dy = Math.min(y, 1 - y);
              if (dx < 0.22 && dx < dy) {
                land(x < 0.5 ? at - 1 : at + 1);
                return;
              }
              if (dy < 0.22) {
                layer(y < 0.5 ? -1 : 1);
                return;
              }
              const beat = film[Number(slice.getAttribute("data-i"))];
              if (reel === "present" && beat?.id === "glow") navigate({ to: "/goal" });
              if (reel === "show" && beat?.id === "ball") navigate({ to: "/ball", search: { stay: 1 } });
            }}
            onWheel={(event) => {
              if (!event.ctrlKey && !event.metaKey) return;
              event.preventDefault();
              setZoom((z) => {
                const next = Math.min(2.4, Math.max(1, z + (event.deltaY < 0 ? 0.06 : -0.06)));
                zoomRef.current = next;
                return next;
              });
            }}
          >
            {film.map((beat, n) => (
              <article
                key={`${reel}-${beat.id}`}
                className={`slice${n === at ? " on" : ""}${n === at && depth < 0 ? " risen" : ""}${n === at && depth > 0 ? " sunk" : ""}${both && n === at ? " both" : ""}`}
                data-i={n}
              >
                <img className="face" src={beat.src} alt="" />
                {lean ? null : <img className="over" src={beat.high} alt="" />}
                {lean ? null : <img className="under" src={beat.low} alt="" />}
                {"motion" in beat && beat.motion && play === beat.id ? (
                  <video className="play-mov" src={beat.motion} autoPlay playsInline onEnded={() => setPlay(null)} />
                ) : null}
              </article>
            ))}
          </div>
          <nav className="hfilm">
            {film.map((beat, n) => {
              const words = sliceCopy(beat);
              return (
                <button
                  key={`${reel}-${beat.id}`}
                  type="button"
                  className={n === at ? "on" : ""}
                  onClick={() => {
                    land(n);
                    setGone(beat.id === "light");
                  }}
                >
                  <img src={beat.src} alt="" />
                  <PeaceIcon mark={words.mark} />
                  <span>{words.word}</span>
                </button>
              );
            })}
          </nav>
          {copy.line ? (
            <p key={`${reel}-${frame.id}`} className="unveil">
              {copy.line}
            </p>
          ) : null}
          {fold ? (
            <aside className="story-fold">
              <p>{reel === "friend" ? FRIEND_LINE : reel === "show" ? "Held for her. Then the show." : reel === "peach" ? "Peach, and who stays beside her." : "A kinder way."}</p>
              {film.map((beat, n) => {
                const words = sliceCopy(beat);
                return (
                  <button key={`${reel}-tell-${beat.id}`} type="button" className={n === at ? "on" : ""} onClick={() => land(n)}>
                    <i style={{ background: beat.color }} />
                    <b>{words.word}</b>
                    <span>{words.line}</span>
                  </button>
                );
              })}
            </aside>
          ) : null}
          {reel === "present" ? (
            <div className="pups">
              <button type="button" className={pup ? "on" : ""} onClick={() => setPup((on) => !on)} aria-label="behind">
                <img src="/pup-avatar.jpg" alt="" />
              </button>
              {pup ? (
                <figure>
                  <img src="/pup-haze.jpg" alt="" />
                </figure>
              ) : null}
            </div>
          ) : null}
          {reel === "show" && frame.id === "party" ? (
            <div className="crew">
              {CREW.map((one) => {
                const on = crew?.id === one.id;
                return (
                  <button
                    key={one.id}
                    type="button"
                    className={on ? `said ${crew.mode}` : ""}
                    onClick={() => {
                      setCrew((now) => {
                        if (now?.id !== one.id) return { id: one.id, mode: "dress" };
                        if (now.mode === "dress") return { id: one.id, mode: "dance" };
                        if (one.sing && now.mode === "dance") {
                          song.current?.pause();
                          const audio = new Audio(one.sing);
                          song.current = audio;
                          audio.play().catch(() => undefined);
                          return { id: one.id, mode: "sing" };
                        }
                        song.current?.pause();
                        return null;
                      });
                    }}
                  >
                    <img src={one.src} alt="" />
                    {on ? <span>{crew.mode === "sing" ? "sing" : one.line}</span> : null}
                  </button>
                );
              })}
              {crew ? (
                <figure className={crew.mode}>
                  <img src={CREW.find((one) => one.id === crew.id)?.dress} alt="" />
                </figure>
              ) : null}
              <button type="button" className="making" onClick={() => setSaid((now) => (now === "making" ? null : "making"))}>
                {said === "making" ? "Spekl at the party. Not a portrait." : "making"}
              </button>
            </div>
          ) : null}
          <div className="pops">
            {POPS.map((bubble) => (
              <button
                key={bubble.id}
                type="button"
                className={said === bubble.id ? "said" : ""}
                onClick={() => setSaid((now) => (now === bubble.id ? null : bubble.id))}
              >
                <img src={bubble.src} alt="" />
                {bubble.word ? <span>{bubble.word}</span> : null}
              </button>
            ))}
            <button type="button" className="chat-say" onClick={() => enter("friend")}>
              hi
            </button>
            <Link to="/wall" className="chat-ease">
              gallery
            </Link>
          </div>
          <div className="light-wash" />
        </>
      ) : (
        <img className="frame" src={depth < 0 ? frame.high : depth > 0 ? frame.low : frame.src} alt="" />
      )}
      <div className="beads">
        {film.map((beat, n) => (
          <button
            key={`${reel}-${beat.id}`}
            type="button"
            className={n === at ? "on" : ""}
            style={{ backgroundColor: beat.color }}
            onClick={() => land(n)}
            aria-label={sliceCopy(beat).word}
          />
        ))}
      </div>
      <button type="button" className={bare ? "peach-fold" : "peach-fold on"} onClick={() => setBare((on) => !on)} aria-label={bare ? "open" : "fold"} />
    </section>
  );
}
