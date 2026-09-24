import { useEffect, useRef, useState } from "react";
import {
  type MotionMode,
  initialMotionMode,
  readMotionEnvironment,
  storeMotionMode,
} from "@/lib/motion-mode";

export type MotionModeControlProps = {
  posterSrc: string;
  motionSrc?: string;
  posterAlt?: string;
};

const CONTROL_STYLE = {
  position: "absolute",
  right: 16,
  bottom: 118,
  zIndex: 3,
  display: "flex",
  gap: 3,
  padding: 4,
  border: "1px solid rgb(255 248 242 / 0.42)",
  borderRadius: 999,
  background: "rgb(20 12 16 / 0.45)",
  boxShadow: "0 8px 24px rgb(0 0 0 / 0.2)",
  backdropFilter: "blur(10px)",
} as const;

function modeLabel(mode: MotionMode): string {
  return mode[0].toUpperCase() + mode.slice(1);
}

/**
 * Still-first scene media with an explicit, persisted Full / Reduced / Still
 * choice. It accepts only caller-provided scene URLs; it does not fetch or
 * mutate media sources itself.
 */
export function MotionModeControl({
  posterSrc,
  motionSrc,
  posterAlt = "",
}: MotionModeControlProps) {
  // Keep SSR and the first client render identical. The stored/default choice
  // is applied only after hydration, before a video source can be attached.
  const [mode, setMode] = useState<MotionMode>("still");
  const [hydrated, setHydrated] = useState(false);
  const [loadedPosterSrc, setLoadedPosterSrc] = useState<string | null>(null);
  const [playingMotionSrc, setPlayingMotionSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const inViewRef = useRef(true);
  const loadTimeoutRef = useRef<number | null>(null);

  const posterLoaded = loadedPosterSrc === posterSrc;
  const canLoadMotion =
    hydrated && mode === "full" && Boolean(motionSrc) && posterLoaded && !failed;
  const motionVisible = canLoadMotion && playingMotionSrc === motionSrc;

  useEffect(() => {
    setMode(initialMotionMode());
    setHydrated(true);
  }, []);

  useEffect(() => {
    setPlayingMotionSrc(null);
    setFailed(false);
    if (mode !== "full") videoRef.current?.pause();
  }, [mode, motionSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !canLoadMotion || !motionSrc) return;

    let active = true;
    const fallback = () => {
      if (!active) return;
      setPlayingMotionSrc(null);
      setFailed(true);
      setStatus("Motion could not load. The scene is staying on its still image.");
      video.pause();
    };
    const timeout = window.setTimeout(fallback, 8000);
    loadTimeoutRef.current = timeout;
    const start = () => {
      if (!active || document.hidden || !inViewRef.current) return;
      // `load()` plus `play()` is intentional: preload=none alone may never
      // produce canplay, leaving a Full selection permanently static.
      video.load();
      void video.play().catch(() => undefined);
    };

    start();
    return () => {
      active = false;
      window.clearTimeout(timeout);
      if (loadTimeoutRef.current === timeout) loadTimeoutRef.current = null;
      video.pause();
    };
  }, [attempt, canLoadMotion, motionSrc]);

  useEffect(() => {
    const onVisibilityChange = () => {
      const video = videoRef.current;
      if (!video) return;
      if (document.hidden) video.pause();
      else if (canLoadMotion && inViewRef.current) void video.play().catch(() => undefined);
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [canLoadMotion]);

  useEffect(() => {
    const element = videoRef.current;
    if (!element || !motionSrc || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      inViewRef.current = Boolean(entry?.isIntersecting);
      if (!inViewRef.current) element.pause();
      else if (canLoadMotion && !document.hidden) void element.play().catch(() => undefined);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [canLoadMotion, motionSrc]);

  const choose = (next: MotionMode) => {
    const environment = readMotionEnvironment();
    const retryingFailedFull = next === "full" && mode === "full" && failed;
    storeMotionMode(next);

    if (next !== mode || retryingFailedFull) {
      setPlayingMotionSrc(null);
      setFailed(false);
      setMode(next);
      if (retryingFailedFull) setAttempt((value) => value + 1);
    }

    const overridesDefault =
      next === "full" && (environment.prefersReducedMotion || environment.saveData);
    setStatus(
      overridesDefault
        ? "Full motion selected. This overrides the device’s conservative motion or data-saving default."
        : `${modeLabel(next)} motion selected.`,
    );
  };

  return (
    <>
      <img
        key={posterSrc}
        className="world"
        src={posterSrc}
        alt={posterAlt}
        onLoad={() => setLoadedPosterSrc(posterSrc)}
        style={{ opacity: motionVisible ? 0 : 1, transition: "opacity 240ms ease" }}
      />
      {motionSrc ? (
        <video
          key={`${posterSrc}:${motionSrc}:${mode}:${attempt}`}
          ref={videoRef}
          className="world"
          src={canLoadMotion ? motionSrc : undefined}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          style={{ opacity: motionVisible ? 1 : 0, transition: "opacity 240ms ease" }}
          onPlaying={() => {
            if (canLoadMotion) {
              if (loadTimeoutRef.current !== null) {
                window.clearTimeout(loadTimeoutRef.current);
                loadTimeoutRef.current = null;
              }
              setPlayingMotionSrc(motionSrc);
              setStatus("Full motion playing.");
            }
          }}
          onError={() => {
            if (loadTimeoutRef.current !== null) {
              window.clearTimeout(loadTimeoutRef.current);
              loadTimeoutRef.current = null;
            }
            setPlayingMotionSrc(null);
            setFailed(true);
            setStatus("Motion could not load. The scene is staying on its still image.");
          }}
        />
      ) : null}
      {motionSrc ? (
        <div style={CONTROL_STYLE} role="group" aria-label="Scene motion">
          {(["full", "reduced", "still"] as const).map((choice) => {
            const selected = mode === choice;
            return (
              <button
                key={choice}
                type="button"
                aria-pressed={selected}
                onClick={() => choose(choice)}
                style={{
                  border: 0,
                  borderRadius: 999,
                  padding: "5px 8px",
                  color: "#fff8f2",
                  background: selected ? "rgb(244 236 227 / 0.28)" : "transparent",
                  font: "12px/1 ui-sans-serif, system-ui, sans-serif",
                }}
              >
                {modeLabel(choice)}
              </button>
            );
          })}
          <span
            role="status"
            aria-live="polite"
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              overflow: "hidden",
              clipPath: "inset(50%)",
            }}
          >
            {status}
          </span>
        </div>
      ) : null}
    </>
  );
}
