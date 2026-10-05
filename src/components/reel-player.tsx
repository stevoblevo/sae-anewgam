import { useCallback, useEffect, useRef, useState } from "react";
import { Compass, LayoutGrid, Pause, Play, Radar, Volume2, VolumeX } from "lucide-react";
import { Drive } from "@/components/drive";
import { Rover } from "@/components/rover";
import { EVER, EVER_MS } from "@/lib/everfallen";
import { BEATS, LOOK, OPEN_CLIP, OPEN_STILL, PHOTOS } from "@/lib/garden-plates";
import { loadPosts, speakLine, talkFor, type PostsFile, POSTS_EMPTY } from "@/lib/posts";

export function Player() {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hear, setHear] = useState(false);
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [posts, setPosts] = useState<PostsFile>(POSTS_EMPTY);
  const [film, setFilm] = useState(false);
  const [wall, setWall] = useState(false);
  const [focus, setFocus] = useState<number | null>(null);
  const [drive, setDrive] = useState(false);
  const [rover, setRover] = useState(false);
  const booted = useRef(false);
  const [reel, setReel] = useState(OPEN_CLIP);
  const videoRef = useRef<HTMLVideoElement>(null);
  const phaseRef = useRef<"open" | "beat">("open");
  const iRef = useRef(0);
  const hearRef = useRef(true);
  const postsRef = useRef(posts);
  postsRef.current = posts;
  hearRef.current = hear;

  useEffect(() => {
    loadPosts().then(setPosts);
  }, []);

  const playSrc = (src: string) => {
    const clip = videoRef.current;
    if (!clip) return;
    const kick = () => {
      void clip.play().catch(() => {});
    };
    if (!clip.src.endsWith(src)) {
      clip.src = src;
      clip.addEventListener("loadeddata", kick, { once: true });
      return;
    }
    clip.currentTime = 0;
    kick();
  };

  const go = useCallback((n: number) => {
    const next = ((n % BEATS.length) + BEATS.length) % BEATS.length;
    const beat = BEATS[next];
    iRef.current = next;
    setI(next);
    setProgress(0);
    if (!beat) return;
    if (beat.clip) {
      phaseRef.current = "beat";
      setPlaying(false);
      setFilm(true);
      setReel(beat.clip);
      playSrc(beat.clip);
      return;
    }
    setFilm(false);
    videoRef.current?.pause();
    const line = EVER[beat.id];
    if (line && hearRef.current) speakLine(line);
  }, []);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let acc = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100);
      last = now;
      acc += dt;
      setProgress(Math.min(1, acc / EVER_MS));
      if (acc >= EVER_MS) {
        acc = 0;
        go(iRef.current + 1);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, go]);

  const beat = BEATS[i] ?? BEATS[0];
  const plateSrc = started && !film ? beat.src : OPEN_STILL;
  const prevPlate = useRef(plateSrc);
  const [under, setUnder] = useState(plateSrc);

  useEffect(() => {
    if (prevPlate.current === plateSrc) return;
    setUnder(prevPlate.current);
    prevPlate.current = plateSrc;
  }, [plateSrc]);
  const said = talkFor(beat.id, posts);
  const tale = EVER[beat.id] ?? said?.line ?? "";

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    const clip = videoRef.current;
    if (clip) clip.muted = true;
    setStarted(true);
    go(0);
  }, [go]);

  const begin = () => {
    if (started) return;
    setStarted(true);
    phaseRef.current = "open";
    setFilm(true);
    setReel(OPEN_CLIP);
    playSrc(OPEN_CLIP);
  };

  const finishFilm = () => {
    if (phaseRef.current === "open") {
      go(0);
      return;
    }
    go(iRef.current + 1);
    setPlaying(true);
  };

  return (
    <main className="stage" onClick={started ? undefined : begin}>
      <img className="plate" src={under} alt="" />
      <img key={plateSrc} className="plate fade" src={plateSrc} alt="" />
      <video
        ref={videoRef}
        className={film ? "film" : "film off"}
        src={reel}
        poster={OPEN_STILL}
        playsInline
        muted={!hear}
        preload="metadata"
        onTimeUpdate={() => {
          const clip = videoRef.current;
          if (!clip?.duration) return;
          setProgress(clip.currentTime / clip.duration);
        }}
        onEnded={finishFilm}
      />
      <p className="tale">{tale}</p>
      <div className="chrome">
        <div className="bar" aria-hidden>
          <i style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="foot">
          <button
            type="button"
            className="ctrl icon"
            aria-label={playing ? "pause" : "play"}
            onClick={(e) => {
              e.stopPropagation();
              if (film) {
                const clip = videoRef.current;
                if (!clip) return;
                if (clip.paused) void clip.play();
                else clip.pause();
                return;
              }
              setStarted(true);
              setPlaying((p) => !p);
            }}
          >
            {playing || film ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            type="button"
            className="ctrl icon"
            aria-label="rover"
            onClick={(e) => {
              e.stopPropagation();
              setRover((r) => !r);
            }}
          >
            <Radar size={18} />
          </button>
          <button
            type="button"
            className="ctrl icon"
            aria-label="drive"
            onClick={(e) => {
              e.stopPropagation();
              setWall(false);
              setFilm(false);
              setPlaying(false);
              setStarted(true);
              setDrive((d) => !d);
            }}
          >
            <Compass size={18} />
          </button>
          <button
            type="button"
            className="ctrl icon"
            aria-label="gallery"
            onClick={(e) => {
              e.stopPropagation();
              setDrive(false);
              setWall((w) => !w);
            }}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            type="button"
            className={hear ? "ctrl icon on" : "ctrl icon"}
            aria-label={hear ? "quiet" : "hear"}
            onClick={(e) => {
              e.stopPropagation();
              const next = !hear;
              setHear(next);
              if (!next) window.speechSynthesis?.cancel();
              else if (said) speakLine(said.line);
            }}
          >
            {hear ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
      </div>
      {drive ? (
        <Drive
          onClose={() => setDrive(false)}
          onGoal={() => {
            const n = BEATS.findIndex((b) => b.id === "europa");
            setStarted(true);
            setDrive(false);
            if (n >= 0) go(n);
          }}
        />
      ) : null}
      {wall ? (
        <div
          className="wall"
          onClick={() => {
            setFocus(null);
            setWall(false);
          }}
        >
          {focus === null ? (
            <div className="wall-grid" onClick={(e) => e.stopPropagation()}>
              {PHOTOS.map((b) => {
                const look = LOOK[b.id] ?? { aura: "night" as const };
                const n = BEATS.findIndex((x) => x.id === b.id);
                return (
                  <button
                    key={b.id}
                    type="button"
                    className={look.big ? `yarn ${look.aura}` : look.aura}
                    aria-label={b.id}
                    onClick={() => setFocus(n)}
                  >
                    <img src={b.src} alt="" loading="lazy" decoding="async" />
                  </button>
                );
              })}
              <button
                type="button"
                className="wall-nav"
                aria-label="pass"
                onClick={() => {
                  const n = BEATS.findIndex((b) => b.id === "pass");
                  setWall(false);
                  setStarted(true);
                  if (n >= 0) go(n);
                }}
              >
                pass
              </button>
            </div>
          ) : (
            <div className={`focus ${LOOK[BEATS[focus]?.id ?? ""]?.aura ?? "night"}`} onClick={(e) => e.stopPropagation()}>
              <img src={BEATS[focus]?.src} alt="" decoding="async" />
              <p>{EVER[BEATS[focus]?.id ?? ""]}</p>
              <div className="focus-nav">
                <button
                  type="button"
                  aria-label="prev"
                  onClick={() => {
                    const ids = PHOTOS.map((b) => BEATS.findIndex((x) => x.id === b.id));
                    const at = ids.indexOf(focus);
                    setFocus(ids[(at - 1 + ids.length) % ids.length]);
                  }}
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label="open plate"
                  onClick={() => {
                    const n = focus;
                    setFocus(null);
                    setWall(false);
                    setStarted(true);
                    go(n);
                    if (!BEATS[n]?.clip) setPlaying(true);
                  }}
                >
                  open
                </button>
                <button
                  type="button"
                  aria-label="next"
                  onClick={() => {
                    const ids = PHOTOS.map((b) => BEATS.findIndex((x) => x.id === b.id));
                    const at = ids.indexOf(focus);
                    setFocus(ids[(at + 1) % ids.length]);
                  }}
                >
                  ›
                </button>
              </div>
              <div className="focus-kin">
                {PHOTOS.filter((b) => LOOK[b.id]?.aura === LOOK[BEATS[focus]?.id ?? ""]?.aura && b.id !== BEATS[focus]?.id).map((b) => {
                  const n = BEATS.findIndex((x) => x.id === b.id);
                  return (
                    <button key={b.id} type="button" aria-label={b.id} onClick={() => setFocus(n)}>
                      <img src={b.src} alt="" loading="lazy" decoding="async" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : null}
      {rover ? <Rover onClose={() => setRover(false)} /> : null}
      {started ? null : (
        <button type="button" className="gate" aria-label="walk" onClick={begin}>
          <Play size={28} />
        </button>
      )}
    </main>
  );
}
