import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Download, Home, Pause, Play } from "lucide-react";
import { MotionModeControl } from "@/components/motion-mode-control";
import { PLATES } from "@/lib/plates";

const STORY = ["remember", "trace", "notice", "beside", "bambi", "farther"];
const HEADS = [{ id: "stare", src: "/stare.png", label: "face lock" }];
const LOCK = ["remember", "stare", "farther"];
const LEAD = ["anna", "bambi", "painted-stare", "painted-porch", "blossom", "weather"];
const LEAD_AT = LEAD.flatMap((id) => {
  const n = PLATES.findIndex((p) => p.id === id);
  return n >= 0 ? [n] : [];
});
const START = LEAD_AT[0] ?? 0;
const BEAT_MS = 6000;
const MOTION = LEAD_AT;
const SHOW = LEAD_AT;

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type InstallStatus = "ready" | "unavailable" | "installing" | "waiting" | "error";

export function Player() {
  const [i, setI] = useState(START);
  const [playing, setPlaying] = useState(false);
  const [gallery, setGallery] = useState(false);
  const [whisper, setWhisper] = useState(false);
  const [marks, setMarks] = useState(0);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [installStatus, setInstallStatus] = useState<InstallStatus>("ready");
  const iRef = useRef(START);
  const traceRef = useRef<string[]>([]);
  const wheelAt = useRef(0);
  const touchY = useRef<number | null>(null);
  const installLock = useRef(false);
  const navigate = useNavigate();

  const plate = PLATES[i] ?? PLATES[0];

  const go = useCallback((n: number, keepPlay = false) => {
    const next = ((n % PLATES.length) + PLATES.length) % PLATES.length;
    iRef.current = next;
    setI(next);
    if (!keepPlay) setPlaying(false);
  }, []);

  const stepShow = useCallback(
    (dir: number) => {
      const at = SHOW.indexOf(iRef.current);
      const from = at < 0 ? 0 : at;
      const next = SHOW[(from + dir + SHOW.length) % SHOW.length] ?? 0;
      go(next);
    },
    [go],
  );

  const step = useCallback(() => {
    const at = MOTION.indexOf(iRef.current);
    const next = MOTION[(at + 1) % MOTION.length] ?? MOTION[0] ?? 0;
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
      stepShow(e.deltaY > 0 ? 1 : -1);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [gallery, stepShow]);

  useEffect(() => {
    const displayMode = window.matchMedia?.("(display-mode: standalone)").matches;
    const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone;
    const isInstalled = Boolean(displayMode || iosStandalone);
    setInstalled(isInstalled);
    if (isInstalled) setInstallStatus("ready");

    const capturePrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const confirmInstalled = () => {
      setInstallPrompt(null);
      setInstalled(true);
      setInstallStatus("ready");
    };
    window.addEventListener("beforeinstallprompt", capturePrompt);
    window.addEventListener("appinstalled", confirmInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", capturePrompt);
      window.removeEventListener("appinstalled", confirmInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (installed || installLock.current) return;
    if (!installPrompt) {
      setInstallStatus("unavailable");
      return;
    }
    installLock.current = true;
    setInstallPrompt(null);
    setInstallStatus("installing");
    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      setInstallStatus(choice.outcome === "accepted" ? "waiting" : "ready");
    } catch {
      setInstallStatus("error");
    } finally {
      installLock.current = false;
    }
  }, [installed, installPrompt]);

  const installCopy = installed
    ? "installed"
    : installStatus === "unavailable"
      ? "install unavailable · open the guide"
      : installStatus === "installing" || installStatus === "waiting"
        ? "install prompt open"
        : installStatus === "error"
          ? "install prompt failed · try again"
          : "";

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
      <MotionModeControl posterSrc={plate.src} motionSrc={plate.motion} />

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
            aria-label={installed ? "Sae is installed" : "Install Sae"}
            onClick={() => void install()}
            disabled={installed || installStatus === "installing" || installStatus === "waiting"}
          >
            <Download size={14} aria-hidden /> {installed ? "installed" : "install"}
          </button>
          {installStatus === "unavailable" ? (
            <a href="/?install=1" className="nav-link">
              guide
            </a>
          ) : null}
          {installCopy ? <span aria-live="polite">{installCopy}</span> : null}
          {Math.max(0, LEAD_AT.indexOf(i)) + 1} / {LEAD_AT.length}
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

        <section className="room">
          <p className="line">{plate.title}</p>
          <p className="tag" aria-live="polite">
            {whisper
              ? "remember · the face · farther"
              : playing
                ? `${plate.note} · auto · pause to browse`
                : `${plate.note} · swipe to explore`}
          </p>
          <div className="heads">
            {HEADS.map((h) => (
              <button key={h.id} type="button" className="face-lock" onClick={() => touch(h.id)}>
                <img src={h.src} alt="" />
                <span>{h.label}</span>
              </button>
            ))}
          </div>
          <div className="bubbles">
            {(() => {
              const at = LEAD_AT.indexOf(i);
              const n = LEAD_AT[(at < 0 ? 0 : at + 1) % LEAD_AT.length] ?? LEAD_AT[0];
              const p = n == null ? undefined : PLATES[n];
              if (!p || n == null) return null;
              return (
                <button
                  type="button"
                  className="glass"
                  aria-label="next room"
                  onClick={() => go(n)}
                >
                  <img src={p.src} alt="" />
                  <span>next</span>
                </button>
              );
            })()}
          </div>
          <div className="traces" aria-hidden>
            {LOCK.map((_, n) => (
              <i key={n} className={n < marks ? "on" : ""} />
            ))}
          </div>
          <div className="controls">
            <div className="bar">
              <button type="button" aria-label="previous room" onClick={() => stepShow(-1)}>
                <ArrowLeft size={18} strokeWidth={1.6} />
              </button>
              <button type="button" aria-label="next room" onClick={() => stepShow(1)}>
                <ArrowRight size={18} strokeWidth={1.6} />
              </button>
              <button
                type="button"
                aria-label={playing ? "pause" : "play"}
                title={playing ? "Pause autoplay" : "Autoplay each room"}
                onClick={() => setPlaying((p) => !p)}
              >
                {playing ? (
                  <Pause size={18} strokeWidth={1.6} />
                ) : (
                  <Play size={18} strokeWidth={1.6} />
                )}
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
        {SHOW.map((n) => {
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
                {p.id === "bambi"
                  ? "peach"
                  : p.id === "anna"
                    ? "pink"
                    : p.id === "blossom"
                      ? "ring"
                      : p.id === "painted-porch"
                        ? "porch"
                        : p.id === "weather"
                          ? "rain"
                          : "stare"}
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
            <div className="gallery-grid">
              {PLATES.map((p, n) =>
                p.shelf === "study" || p.shelf === "later" ? null : (
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
                ),
              )}
            </div>
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
