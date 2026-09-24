import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Home, Pause, Play } from "lucide-react";
import { PLATES, platesIn, type Cast } from "@/lib/plates";
import { WAYS } from "@/lib/ways";

const STORY = ["remember", "trace", "notice", "beside", "bambi", "farther"];
const HEADS = [{ id: "stare", src: "/stare.png", label: "face lock" }];
const LOCK = ["remember", "stare", "farther"];
const START = Math.max(0, PLATES.findIndex((p) => p.id === "weather"));
const BEAT_MS = 6000;
const SHOWN = new Set(["painted-stare", "savannah", "bambi", "anna", "sisters", "stare", "loom", "weather", "kirby"]);
const RING_STORY = [
  "She is in the ring. The boards are still dry. Nobody has been put down on them.",
  "The red is the lantern light, pulled in close. It looks like a loss if you only see the color. Look at her feet. They are under her. Look at her mouth. It is almost a smile.",
  "This is not the minute after. This is the minute she is getting ready. The other one has not stepped in. The ring is waiting on a second pair of shoes.",
  "If she loses, the story changes. It has not changed yet.",
];
const PEACH = ["hold.", "she smiles.", "again."];
const CASTS: Cast[] = ["porch", "peach", "rain", "well", "kirby", "white"];
const CAST_NAME: Record<Cast, string> = {
  porch: "porch fight",
  peach: "peach ball",
  rain: "red rain",
  well: "the well",
  kirby: "say kirby",
  white: "white ring",
};

export function Player() {
  const [i, setI] = useState(START);
  const [playing, setPlaying] = useState(false);
  const [gallery, setGallery] = useState(false);
  const [whisper, setWhisper] = useState(false);
  const [marks, setMarks] = useState(0);
  const [motionChoice, setMotionChoice] = useState<boolean | null>(null);
  const [reduced, setReduced] = useState(false);
  const [vidOn, setVidOn] = useState(false);
  const [story, setStory] = useState(false);
  const [peach, setPeach] = useState(0);
  const [cast, setCast] = useState<Cast>(PLATES[START]?.cast ?? "rain");
  const [phone, setPhone] = useState(false);
  const [leaving, setLeaving] = useState<{ src: string; motion?: string } | null>(null);
  const [pop, setPop] = useState<{ n: number; top: number; left: number } | null>(null);
  const [pink, setPink] = useState(false);
  const [hear, setHear] = useState(true);
  const pinkRef = useRef(false);
  const seenRef = useRef({ deer: false, reign: false });
  const [immersive, setImmersive] = useState(false);
  const bedRef = useRef<HTMLAudioElement>(null);
  const nextRef = useRef<HTMLAudioElement>(null);
  const side = useRef(0);
  const installRef = useRef<any>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const iRef = useRef(START);
  const traceRef = useRef<string[]>([]);
  const wheelAt = useRef(0);
  const touchY = useRef<number | null>(null);
  const popRef = useRef<number | null>(null);
  const leaveTimer = useRef(0);
  const navigate = useNavigate();

  const plate = PLATES[i] ?? PLATES[0];
  const shown = phone && plate.srcPhone ? plate.srcPhone : plate.src;
  const path = platesIn(cast, pink);
  const pathRef = useRef(path);
  pathRef.current = path;

  const go = useCallback((n: number, keepPlay = false) => {
    const next = ((n % PLATES.length) + PLATES.length) % PLATES.length;
    const cur = PLATES[iRef.current];
    if (cur && next !== iRef.current) {
      setLeaving({ src: cur.src, motion: cur.motion });
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = window.setTimeout(() => setLeaving(null), 900);
    }
    const id = PLATES[next]?.id;
    if (id === "farther" || id === "reach") seenRef.current.deer = true;
    if (id === "weather") seenRef.current.reign = true;
    if (seenRef.current.deer && seenRef.current.reign && !pinkRef.current) {
      pinkRef.current = true;
      setPink(true);
      const forest = PLATES.findIndex((p) => p.id === "pink-forest");
      if (forest >= 0) setPop({ n: forest, top: 22, left: 18 });
      try {
        sessionStorage.setItem("sae-pink", "1");
      } catch {
        /* ignore */
      }
    }
    const nextCast = PLATES[next]?.cast;
    if (nextCast) setCast(nextCast);
    iRef.current = next;
    setI(next);
    if (!keepPlay) setPlaying(false);
  }, []);

  const stepShow = useCallback(
    (dir: number) => {
      const list = pathRef.current;
      if (!list.length) return;
      const at = list.indexOf(iRef.current);
      const from = at < 0 ? 0 : at;
      const next = list[(from + dir + list.length) % list.length] ?? list[0] ?? 0;
      go(next);
    },
    [go],
  );

  const step = useCallback(() => {
    const list = pathRef.current;
    if (!list.length) return;
    const at = list.indexOf(iRef.current);
    const next = list[(at + 1) % list.length] ?? list[0] ?? 0;
    go(next, true);
  }, [go]);

  const touch = useCallback(
    (id: string) => {
      const n = PLATES.findIndex((p) => p.id === id);
      if (n >= 0) go(n);
      const prev = traceRef.current;
      const expect = LOCK[prev.length];
      const next = id === expect ? [...prev, id] : id === LOCK[0] ? [LOCK[0]] : [];
      traceRef.current = next.length === LOCK.length ? [] : next;
      setMarks(next.length === LOCK.length ? 0 : next.length);
      if (next.length === LOCK.length) navigate({ to: "/farther" });
    },
    [go, navigate],
  );

  useEffect(() => {
    if (!playing || gallery) return;
    let raf = 0;
    let acc = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100);
      last = now;
      acc += dt;
      if (acc >= BEAT_MS * (PLATES[iRef.current]?.id === "farther" || PLATES[iRef.current]?.id === "reach" ? 2 : 1)) {
        acc = 0;
        const target = popRef.current;
        if (target != null && target !== iRef.current) go(target, true);
        else step();
        const hidden = PLATES.flatMap((p, n) =>
          n !== iRef.current && p.shelf !== "study" && (!p.gate || pinkRef.current) ? [n] : [],
        );
        if (hidden.length) {
          const n = hidden[Math.floor(Math.random() * hidden.length)] ?? hidden[0];
          popRef.current = n;
          setPop({ n, top: 16 + Math.random() * 46, left: 6 + Math.random() * 48 });
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, gallery, step, go]);

  useEffect(() => {
    if (!playing) {
      setPop(null);
      popRef.current = null;
    }
  }, [playing]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (gallery) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest(".film, .gallery, .skein-rail")) return;
      e.preventDefault();
      const now = performance.now();
      if (now - wheelAt.current < 380) return;
      wheelAt.current = now;
      setPlaying(false);
      stepShow(e.deltaY > 0 ? 1 : -1);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [gallery, stepShow]);

  useEffect(() => {
    const apply = () => setPhone(window.innerWidth / Math.max(window.innerHeight, 1) < 0.9);
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("sae-pink") === "1") {
        pinkRef.current = true;
        setPink(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const motionOn = motionChoice ?? !reduced;

  useEffect(() => {
    if (plate.id !== "ring") {
      setStory(false);
      return;
    }
    setStory(true);
  }, [plate.id]);

  useEffect(() => {
    setVidOn(false);
  }, [plate.motion]);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      installRef.current = e;
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setImmersive(false);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const immerse = () => {
    const el = shellRef.current;
    if (immersive) {
      setImmersive(false);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      return;
    }
    setImmersive(true);
    el?.requestFullscreen?.().catch(() => {});
  };

  useEffect(() => {
    const incoming = side.current === 0 ? bedRef.current : nextRef.current;
    const outgoing = side.current === 0 ? nextRef.current : bedRef.current;
    side.current = 1 - side.current;
    if (!incoming) return;
    const src = `/audio/scenes/${plate.id}.mp3`;
    incoming.src = src;
    incoming.loop = true;
    incoming.volume = 0;
    if (!hear) {
      incoming.pause();
      outgoing?.pause();
      window.speechSynthesis?.cancel();
      return;
    }
    incoming.play().catch(() => {});
    const start = performance.now();
    let raf = 0;
    const fade = (now: number) => {
      const t = Math.min(1, (now - start) / 700);
      incoming.volume = 0.55 * t;
      if (outgoing) outgoing.volume = 0.55 * (1 - t);
      if (t < 1) raf = requestAnimationFrame(fade);
      else outgoing?.pause();
    };
    raf = requestAnimationFrame(fade);
    return () => cancelAnimationFrame(raf);
  }, [hear, plate.id]);

  return (
    <div
      className={`player-shell${immersive ? " immersive" : ""}${cast === "white" ? " way-white" : ""}`}
      ref={shellRef}
      onPointerDown={() => {
        if (!hear) return;
        const live = side.current === 1 ? bedRef.current : nextRef.current;
        live?.play().catch(() => {});
      }}
      onTouchStart={(e) => {
        touchY.current = e.changedTouches[0]?.clientY ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchY.current;
        const end = e.changedTouches[0]?.clientY;
        touchY.current = null;
        if (start == null || end == null) return;
        const dy = start - end;
        if (Math.abs(dy) < 48) return;
        stepShow(dy > 0 ? 1 : -1);
      }}
    >
      <button
        type="button"
        className="exit-immerse"
        aria-label="close"
        hidden={!immersive}
        onClick={() => {
          setImmersive(false);
          if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
        }}
      >
        ×
      </button>
      <nav className="way-marks" aria-label="ways">
        {WAYS.map((w) => (
          <button
            key={w.id}
            type="button"
            className={cast === w.cast ? "on" : ""}
            style={{ background: w.color }}
            aria-label={w.name}
            onClick={() => {
              const n = PLATES.findIndex((p) => p.id === w.start);
              if (n >= 0) go(n, true);
              setPlaying(true);
            }}
          />
        ))}
      </nav>
      {plate.id === "ring" && story ? (
        <aside className="story">
          {RING_STORY.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <div>
            <button
              type="button"
              onClick={() => {
                if (typeof window.speechSynthesis === "undefined") return;
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(RING_STORY.join(" "));
                utterance.rate = 0.92;
                const emily = window.speechSynthesis.getVoices().find((v) => /emily/i.test(v.name));
                if (emily) utterance.voice = emily;
                window.speechSynthesis.speak(utterance);
              }}
            >
              read
            </button>
            <button type="button" onClick={() => setStory(false)}>
              close
            </button>
          </div>
        </aside>
      ) : plate.id === "ring" ? (
        <button type="button" className="story-mark" aria-label="story" onClick={() => setStory(true)} />
      ) : null}
      <audio ref={bedRef} preload="auto" />
      <audio ref={nextRef} preload="auto" />
      <img key={shown} className="world arriving" alt="" src={shown} />
      {leaving ? <img className="world leaving" alt="" src={leaving.src} /> : null}
      {leaving?.motion && motionOn ? (
        <video className="world film-layer on leaving" src={leaving.motion} muted loop playsInline autoPlay />
      ) : null}
      {plate.motion ? (
        <video
          key={plate.motion}
          className={`world film-layer arriving${motionOn ? " on" : ""}`}
          src={plate.motion}
          muted
          loop
          playsInline
          autoPlay={motionOn}
          preload="auto"
          onCanPlay={(e) => {
            if (!motionOn) return;
            e.currentTarget.play().catch(() => {});
            setVidOn(true);
          }}
        />
      ) : null}

      {playing && pop && PLATES[pop.n] ? (
        <button
          type="button"
          className="pop"
          style={{ top: `${pop.top}%`, left: `${pop.left}%` }}
          onClick={() => go(pop.n, true)}
        >
          <img src={PLATES[pop.n]?.src} alt="" />
          <span>{PLATES[pop.n]?.note}</span>
        </button>
      ) : null}

      <header className="player-chrome">
        <button type="button" className="nav-link" onClick={() => setGallery(true)}>
          gallery
        </button>
        <button type="button" className="brand brand-btn" onClick={() => setWhisper((w) => !w)}>
          Sae · .anewgam
        </button>
        <div className="right">
          <button
            type="button"
            className="nav-link"
            onClick={() => {
              const next = !motionOn;
              setMotionChoice(next);
              setVidOn(next);
              const v = document.querySelector("video.world") as HTMLVideoElement | null;
              if (next) v?.play().catch(() => {});
              else v?.pause();
            }}
          >
            {motionOn ? "motion on" : "motion"}
          </button>
          <button type="button" className="nav-link" onClick={() => setHear((h) => !h)}>
            {hear ? "quiet" : "hear"}
          </button>
          <button type="button" className="nav-link immerse" onClick={immerse}>
            {immersive ? "close" : "immerse"}
          </button>
          <Link to="/her" className="nav-link">
            her
          </Link>
          <Link to="/ball" className="nav-link">
            ball
          </Link>
          <a
            className="nav-link"
            href="/?install=1&platform=ios"
            onClick={(e) => {
              e.preventDefault();
              const prompt = installRef.current;
              if (prompt?.prompt) {
                prompt.prompt();
                installRef.current = null;
                return;
              }
              window.location.assign("/?install=1&platform=ios");
            }}
          >
            install
          </a>
          {Math.max(0, path.indexOf(i)) + 1} / {Math.max(path.length, 1)}
        </div>
      </header>

      <div className="player-stage">
        <aside className="skein-rail">
          {STORY.map((id) => {
            const n = PLATES.findIndex((p) => p.id === id);
            const p = PLATES[n];
            if (!p) return null;
            return (
              <button
                key={id}
                type="button"
                className={`rail-slot${n === i ? " on" : n < i ? " seen" : ""}`}
                onClick={() => touch(p.id)}
              >
                <div className="rail-ring" />
                {p.id}
              </button>
            );
          })}
        </aside>

        <section
          className="room"
          onClick={(e) => {
            if (plate.id !== "bambi") return;
            if ((e.target as HTMLElement).closest("button")) return;
            setPeach((n) => (n + 1) % PEACH.length);
          }}
        >
          <p key={plate.id} className="line">{plate.title}</p>
          {plate.id === "loom" ? (
            <div className="doors">
              <button type="button" className="nav-link" onClick={() => go(PLATES.findIndex((p) => p.id === "bambi"))}>
                peach fall
              </button>
              <button type="button" className="nav-link" onClick={() => go(PLATES.findIndex((p) => p.id === "weather"))}>
                red rain
              </button>
            </div>
          ) : null}
          {plate.href ? (
            <a className="nav-link" href={plate.href} target="_blank" rel="noreferrer">
              saelion · anewgam
            </a>
          ) : null}
          {plate.id === "bambi" ? <p className="tag">{PEACH[peach]}</p> : null}
          <p key={`${plate.id}-note`} className="tag">{whisper ? "remember · the face · farther" : `${plate.note} · scroll`}</p>
          <div className="heads">
            {HEADS.map((h) => (
              <button key={h.id} type="button" className="face-lock" onClick={() => touch(h.id)}>
                <img src={h.src} alt="" />
                <span>{h.label}</span>
              </button>
            ))}
          </div>
          <div className="bubbles">
            {(pink ? ["pink-forest", "remember", "painted-stare", "savannah", "bambi", "anna", "sisters", "stare", "loom", "weather", "kirby"] : ["remember", "painted-stare", "savannah", "bambi", "anna", "sisters", "stare", "loom", "weather", "kirby"]).map((id) => {
              const n = PLATES.findIndex((p) => p.id === id);
              const p = PLATES[n];
              if (!p || n < 0) return null;
              const pip = id === "painted-stare";
              return (
                <button
                  key={id}
                  type="button"
                  className={pip ? "glass pip" : "glass"}
                  aria-label={p.note}
                  onClick={() => {
                    go(n);
                    if (id === "remember") setPlaying(true);
                  }}
                >
                  {pip && p.motion ? (
                    <video src={p.motion} muted loop playsInline autoPlay />
                  ) : (
                    <img src={p.src} alt="" />
                  )}
                  <span>{id === "remember" || id === "pink-forest" ? "" : pip ? "garden" : p.id === "savannah" ? "cute" : p.id === "bambi" ? "peach" : p.id === "anna" ? "pink" : p.id === "sisters" ? "hi" : p.id === "stare" ? "stare" : p.id === "loom" ? "loom" : p.id === "weather" ? "rain" : "kirby"}</span>
                </button>
              );
            })}
          </div>
          <div className="traces" aria-hidden>
            {LOCK.map((_, n) => (
              <i key={n} className={n < marks ? "on" : ""} />
            ))}
          </div>
          <div className="controls">
            <div className="bar">
              <button type="button" aria-label="next" onClick={step}>
                <ArrowRight size={18} strokeWidth={1.6} />
              </button>
              <button
                type="button"
                aria-label={playing ? "pause" : "play"}
                onClick={() => setPlaying((p) => !p)}
              >
                {playing ? <Pause size={18} strokeWidth={1.6} /> : <Play size={18} strokeWidth={1.6} />}
              </button>
              <button
                type="button"
                aria-label="home"
                onClick={() => {
                  setPlaying(false);
                  go(START);
                }}
              >
                <Home size={18} strokeWidth={1.6} />
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className="film" role="list">
        {path.map((n) => {
          const p = PLATES[n];
          if (!p) return null;
          return (
            <button
              key={p.id}
              type="button"
              role="listitem"
              className={n === i ? "on" : ""}
              aria-label={p.note}
              onClick={() => go(n)}
            >
              <img src={p.src} alt="" />
              <span>
                {p.id === "savannah" ? "cute" : p.id === "violet" ? "purple" : p.id === "painted-porch" ? "porch" : p.id === "bambi" ? "peach" : p.id === "anna" ? "pink" : p.id === "weather" ? "rain" : p.id === "stare" ? "stare" : p.id === "recognition" ? "gen 2" : p.id === "crossing" ? "gen 4" : p.id === "further" ? "gen 22" : p.id === "loom" ? "loom" : p.cast ?? p.id}
              </span>
            </button>
          );
        })}
      </div>

      {gallery ? (
        <div className="gallery" onClick={(e) => e.target === e.currentTarget && setGallery(false)}>
          <div className="gallery-sheet">
            <header>
              <b>gallery · {PLATES.length}</b>
              <button type="button" onClick={() => setGallery(false)}>
                close
              </button>
            </header>
            <details open>
              <summary>ways</summary>
              <div className="gallery-grid">
                {WAYS.map((w) => {
                  const p = PLATES.find((plate) => plate.id === w.start);
                  const n = PLATES.findIndex((plate) => plate.id === w.start);
                  if (!p || n < 0) return null;
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => {
                        setCast(w.cast);
                        go(n);
                        setPlaying(true);
                        setGallery(false);
                      }}
                    >
                      <img src={p.src} alt="" />
                      <span>{w.name}</span>
                    </button>
                  );
                })}
                <Link to="/her" className="nav-link">
                  her
                </Link>
                <Link to="/ball" className="nav-link">
                  ball
                </Link>
                <Link to="/farther" className="nav-link">
                  farther
                </Link>
              </div>
            </details>
            {CASTS.map((c) => {
              const items = PLATES.flatMap((p, n) =>
                p.cast === c && p.shelf !== "study" && p.shelf !== "later" && (!p.gate || pink) ? [{ p, n }] : [],
              );
              return (
                <details key={c} open={c === cast}>
                  <summary>
                    {CAST_NAME[c]} · {items.length}
                  </summary>
                  <div className="gallery-grid">
                    {items.map(({ p, n }) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          go(n);
                          setGallery(false);
                        }}
                      >
                        <img src={p.src} alt="" />
                        <span>{p.note}</span>
                      </button>
                    ))}
                  </div>
                </details>
              );
            })}
            <details>
              <summary>kept · {PLATES.filter((p) => p.shelf === "study" || p.shelf === "later").length}</summary>
            <div className="gallery-grid studies">
              {PLATES.map((p, n) =>
                p.shelf === "study" || p.shelf === "later" ? (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      go(n);
                      setGallery(false);
                    }}
                  >
                    <img src={p.src} alt="" />
                    <span>{p.note}</span>
                  </button>
                ) : null,
              )}
            </div>
            </details>
          </div>
        </div>
      ) : null}
    </div>
  );
}
