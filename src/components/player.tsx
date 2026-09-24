import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Home, Pause, Play } from "lucide-react";
import { PLATES, platesIn, type Cast } from "@/lib/plates";

const STORY = ["remember", "trace", "notice", "beside", "bambi", "farther"];
const HEADS = [{ id: "stare", src: "/stare.png", label: "face lock" }];
const LOCK = ["remember", "stare", "farther"];
const START = Math.max(0, PLATES.findIndex((p) => p.id === "savannah"));
const BEAT_MS = 6000;
const PEACH = ["hold.", "she smiles.", "again."];
const CASTS: Cast[] = ["porch", "peach", "rain", "well", "kirby"];
const CAST_NAME: Record<Cast, string> = {
  porch: "porch fight",
  peach: "peach ball",
  rain: "red rain",
  well: "the well",
  kirby: "say kirby",
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
  const [peach, setPeach] = useState(0);
  const [cast, setCast] = useState<Cast>("porch");
  const [phone, setPhone] = useState(false);
  const installRef = useRef<any>(null);
  const iRef = useRef(START);
  const traceRef = useRef<string[]>([]);
  const wheelAt = useRef(0);
  const touchY = useRef<number | null>(null);
  const navigate = useNavigate();

  const plate = PLATES[i] ?? PLATES[0];
  const shown = phone && plate.srcPhone ? plate.srcPhone : plate.src;
  const path = platesIn(cast);
  const pathRef = useRef(path);
  pathRef.current = path;

  const go = useCallback((n: number, keepPlay = false) => {
    const next = ((n % PLATES.length) + PLATES.length) % PLATES.length;
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
      if (acc >= BEAT_MS) {
        acc = 0;
        step();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, gallery, step]);

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

  const motionOn = motionChoice ?? !reduced;

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

  return (
    <div
      className="player-shell"
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
      <img key={shown} className="world" alt="" src={shown} />
      {plate.motion ? (
        <video
          key={plate.motion}
          className={`world film-layer${motionOn ? " on" : ""}`}
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
          <p className="line">{plate.title}</p>
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
          <p className="tag">{whisper ? "remember · the face · farther" : `${plate.note} · scroll`}</p>
          <div className="heads">
            {HEADS.map((h) => (
              <button key={h.id} type="button" className="face-lock" onClick={() => touch(h.id)}>
                <img src={h.src} alt="" />
                <span>{h.label}</span>
              </button>
            ))}
          </div>
          <div className="bubbles">
            {["painted-stare", "savannah", "bambi", "anna", "sisters", "stare", "loom", "weather", "kirby"].map((id) => {
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
                  onClick={() => go(n)}
                >
                  {pip && p.motion ? (
                    <video src={p.motion} muted loop playsInline autoPlay />
                  ) : (
                    <img src={p.src} alt="" />
                  )}
                  <span>{pip ? "garden" : p.id === "savannah" ? "cute" : p.id === "bambi" ? "peach" : p.id === "anna" ? "pink" : p.id === "sisters" ? "hi" : p.id === "stare" ? "stare" : p.id === "loom" ? "loom" : p.id === "weather" ? "rain" : "kirby"}</span>
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
            {CASTS.map((c) => (
              <section key={c}>
                <p className="shelf-label">{CAST_NAME[c]}</p>
                <div className="gallery-grid">
                  {PLATES.map((p, n) =>
                    p.cast === c && p.shelf !== "study" && p.shelf !== "later" ? (
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
              </section>
            ))}
            <p className="shelf-label">kept</p>
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
          </div>
        </div>
      ) : null}
    </div>
  );
}
