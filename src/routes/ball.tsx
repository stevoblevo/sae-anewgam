import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

const SCENES = [
  { id: "pink", title: "her, in pink.", note: "freckles. blue eyes.", src: "/portrait/pink.jpg", motion: "/motion/pink-tall.mp4", audio: "/audio/scenes/anna.mp3" },
  { id: "real", title: "her, clearer.", note: "the same girl. sharp.", src: "/portrait/pink-real.jpg", motion: "/motion/pink-real.mp4", audio: "/audio/scenes/anna.mp3" },
  { id: "purple", title: "purple.", note: "blue eyes.", src: "/portrait/purple.jpg", motion: "/motion/purple-tall.mp4", audio: "/audio/scenes/savannah.mp3" },
  { id: "peach", title: "peach fall.", note: "she winks.", src: "/portrait/peach.jpg", motion: "/motion/peach-tall.mp4", audio: "/audio/scenes/bambi.mp3" },
  { id: "sisters", title: "say who. say hi.", note: "peach, and her red sister.", src: "/portrait/sisters.jpg", motion: "/motion/sisters-tall.mp4", audio: "/audio/scenes/sisters.mp3" },
  { id: "painted", title: "the stare, painted.", note: "same face, garden.", src: "/portrait/painted.jpg", motion: "/motion/painted-tall.mp4", audio: "/audio/scenes/painted-stare.mp3" },
  { id: "stare", title: "pf stare.", note: "she winks too.", src: "/portrait/stare.jpg", motion: "/motion/stare-tall.mp4", audio: "/audio/scenes/stare.mp3" },
  { id: "reign", title: "red reign.", note: "same place. another feeling.", src: "/portrait/rain.jpg", motion: "/motion/rain-tall.mp4", audio: "/audio/scenes/weather.mp3" },
];

export const Route = createFileRoute("/ball")({
  validateSearch: (search: Record<string, unknown>) => ({
    stay: search.stay === 1 || search.stay === "1" ? 1 : undefined,
  }),
  component: Ball,
});

export function Ball() {
  const stay = Route.useSearch().stay === 1;
  const navigate = useNavigate();
  const root = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);
  const [rate, setRate] = useState(2);
  const [hear, setHear] = useState(false);
  const hearRef = useRef(false);
  const rateRef = useRef(2);
  const installRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [at, setAt] = useState(0);
  const atRef = useRef(0);
  const [head, setHead] = useState<{ n: number; src: string; top: number; left: number } | null>(null);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      installRef.current = e;
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  useEffect(() => {
    if (!stay) navigate({ to: "/" });
  }, [stay, navigate]);

  const install = () => {
    const prompt = installRef.current;
    if (prompt?.prompt) {
      prompt.prompt();
      installRef.current = null;
      return;
    }
    window.location.assign("/?install=1&platform=ios");
  };

  const go = (n: number) => {
    const next = (n + SCENES.length) % SCENES.length;
    atRef.current = next;
    setAt(next);
    root.current?.querySelectorAll(".ball-scene")[next]?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const clip = audioRef.current;
    if (!clip) return;
    if (!hear) {
      clip.muted = true;
      clip.pause();
      return;
    }
    const src = SCENES[at]?.audio;
    if (!src) return;
    if (!clip.src.endsWith(src)) {
      clip.src = src;
      clip.loop = true;
    }
    clip.muted = false;
    clip.volume = 0.4;
    clip.play().catch(() => {});
  }, [hear, at]);

  useEffect(() => {
    rateRef.current = rate;
    root.current?.querySelectorAll("video").forEach((v) => {
      v.playbackRate = rate;
    });
  }, [rate]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => go(atRef.current + 1), 5000);
    return () => window.clearInterval(id);
  }, [playing]);

  useEffect(() => {
    const tick = window.setInterval(() => {
      const pool = SCENES.map((s, n) => ({ s, n })).filter((x) => x.n !== atRef.current);
      const pick = pool[Math.floor(Math.random() * pool.length)];
      if (!pick) return;
      const next = { n: pick.n, src: pick.s.src, top: 22 + Math.random() * 46, left: 10 + Math.random() * 64 };
      setHead(next);
      window.setTimeout(() => setHead((h) => (h?.n === next.n ? null : h)), 3000);
    }, 7000);
    return () => window.clearInterval(tick);
  }, []);

  if (!stay) return null;

  return (
    <div
      className="ball"
      ref={root}
      onWheel={() => setPlaying(false)}
      onTouchStart={() => setPlaying(false)}
    >
      <header className="player-chrome">
        <Link to="/" className="nav-link">
          back
        </Link>
        <p className="brand">peach ball</p>
        <div className="right">
          <button
            type="button"
            className="nav-link"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => {
              const next = !hearRef.current;
              hearRef.current = next;
              setHear(next);
              const clip = audioRef.current;
              if (!clip) return;
              if (!next) {
                clip.muted = true;
                clip.pause();
              }
            }}
          >
            {hear ? "quiet" : "hear"}
          </button>
          <button type="button" className="nav-link" onClick={() => setRate((r) => (r === 2 ? 1 : 2))}>
            {rate === 2 ? "2×" : "1×"}
          </button>
          <button type="button" className="nav-link" onClick={() => setPlaying((p) => !p)}>
            {playing ? "pause" : "play"}
          </button>
          <button type="button" className="nav-link" onClick={() => go(Math.floor(Math.random() * SCENES.length))}>
            spin
          </button>
          <button type="button" className="nav-link" onClick={install}>
            install
          </button>
          <Link to="/her" className="nav-link">
            her
          </Link>
        </div>
      </header>
      <audio ref={audioRef} preload="none" />
      <nav className="ball-dots" aria-label="scenes">
        {SCENES.map((s, n) => (
          <button key={s.id} type="button" className={n === at ? "on" : ""} aria-label={s.note} onClick={() => go(n)} />
        ))}
      </nav>
      {head ? (
        <button
          type="button"
          className="chat-head"
          style={{ top: `${head.top}%`, left: `${head.left}%` }}
          aria-label={SCENES[head.n]?.note}
          onClick={() => go(head.n)}
        >
          <img alt="" src={head.src} />
        </button>
      ) : null}
      {SCENES.map((s) => (
        <section key={s.id} className="ball-scene" onClick={() => setPlaying((p) => !p)}>
          <img alt="" src={s.src} />
          {s.motion ? (
            <video
              src={s.motion}
              muted
              loop
              playsInline
              autoPlay
              onLoadedData={(e) => {
                e.currentTarget.playbackRate = rateRef.current;
              }}
            />
          ) : null}
          <div className="ball-cap">
            <p className="line">{s.title}</p>
            <p className="tag">{s.note}</p>
          </div>
        </section>
      ))}
    </div>
  );
}
