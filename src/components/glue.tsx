import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { pushSign, rollFlow, colonize, readFlow, type Thread } from "@/lib/flow";

const FACES = [
  { src: "/stare.png", label: "porch", to: "/" as const },
  { src: "/portrait/pink.jpg", label: "pink", to: "/ball" as const, stay: 1 as const },
  { src: "/portrait/purple.jpg", label: "her", to: "/her" as const },
];

export function useAxis(onSide: (dir: number) => void, onRise: (dir: number) => void) {
  const side = useRef(onSide);
  const rise = useRef(onRise);
  side.current = onSide;
  rise.current = onRise;
  useEffect(() => {
    const onAxis = (event: Event) => {
      const detail = (event as CustomEvent<{ axis: "side" | "rise"; dir: number }>).detail;
      if (detail.axis === "side") side.current(detail.dir);
      else rise.current(detail.dir);
    };
    window.addEventListener("sae-axis", onAxis);
    return () => window.removeEventListener("sae-axis", onAxis);
  }, []);
}

const FOLLOW = [
  {
    id: "anna",
    frames: [
      { src: "/portrait/pink.jpg", room: "/anna.jpg" },
      { src: "/anna-hearth.jpg", room: "/anna-hearth.jpg" },
      { src: "/portrait/peach.jpg", room: "/peachfall-walk.jpg" },
    ],
  },
  {
    id: "lock",
    frames: [
      { src: "/face-lock.jpg", room: "/porchfight-gal.jpg" },
      { src: "/garden-stare.jpg", room: "/garden-stare.jpg" },
      { src: "/portrait/stare.jpg", room: "/reign-well.jpg" },
    ],
  },
  {
    id: "sister",
    frames: [
      { src: "/blink-sister.jpg", room: "/sisters-well.jpg" },
      { src: "/portrait/sisters.jpg", room: "/sisters.jpg" },
      { src: "/portrait/purple.jpg", room: "/violet.jpg" },
    ],
  },
  {
    id: "hearth",
    frames: [
      { src: "/anna-hearth.jpg", room: "/anna-hearth.jpg" },
      { src: "/depth-thea.jpg", room: "/depth-thea.jpg" },
      { src: "/red-horizon.jpg", room: "/red-horizon.jpg" },
    ],
  },
];

/** Same numbers on the server and the first client paint. Viewport comes later. */
function defaultSpot(n: number, width: number) {
  return {
    x: width - 120 - Math.floor(n / 2) * 80,
    y: 80 + (n % 2) * 90,
  };
}

const SERVER_WIDTH = 900;

export function Glue() {
  const [faces, setFaces] = useState(false);
  const [note, setNote] = useState("");
  const [flash, setFlash] = useState(0);
  const [awake, setAwake] = useState(0);
  const [places, setPlaces] = useState<Record<string, { x: number; y: number }>>({});
  const [threads, setThreads] = useState<Thread[]>([]);
  const [tune, setTune] = useState<Record<string, number>>({});
  const [onLayers, setOnLayers] = useState(false);
  const last = useRef(0);

  useEffect(() => {
    const look = () => setOnLayers(document.documentElement.dataset.layers === "1" || location.pathname.includes("/layers"));
    look();
    window.addEventListener("sae-layers", look);
    window.addEventListener("popstate", look);
    return () => {
      window.removeEventListener("sae-layers", look);
      window.removeEventListener("popstate", look);
    };
  }, []);

  useEffect(() => {
    if (localStorage.getItem("sae-faces") === "1") setFaces(true);
    let saved: Record<string, { x: number; y: number }> = {};
    try {
      const raw = JSON.parse(localStorage.getItem("sae-follow-spots") || "{}");
      if (raw && typeof raw === "object") saved = raw;
    } catch {
      /* a new place is fine */
    }
    setPlaces(() => {
      const next = { ...saved };
      FOLLOW.forEach((item, n) => {
        const spot = next[item.id];
        if (!spot || typeof spot.x !== "number" || typeof spot.y !== "number") {
          next[item.id] = defaultSpot(n, window.innerWidth);
        }
      });
      return next;
    });
  }, []);

  useEffect(() => {
    const tick = () => {
      setAwake(Math.floor(Math.random() * FOLLOW.length));
      window.setTimeout(() => setAwake(-1), 1600);
    };
    const id = window.setInterval(tick, 7000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const grow = () => setThreads(colonize(readFlow()).slice(-6));
    grow();
    window.addEventListener("sae-flow", grow);
    return () => window.removeEventListener("sae-flow", grow);
  }, []);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      const t = event.target instanceof Element ? event.target : document.body;
      if (t?.closest("input, textarea, .film, .layers-walk, .gallery, .occult-galley, .trail")) return;
      const ax = Math.abs(event.deltaX);
      const ay = Math.abs(event.deltaY);
      if (ax < 1 && ay < 1) return;
      const now = performance.now();
      if (now - last.current < 380) return;
      last.current = now;
      event.preventDefault();
      const side = event.shiftKey || ax > ay;
      const dir = ((side ? event.deltaX : event.deltaY) || event.deltaY || event.deltaX) > 0 ? 1 : -1;
      setNote(side ? "she looks aside." : "she blinks.");
      setFlash((n) => n + 1);
      window.dispatchEvent(new CustomEvent("sae-wink"));
      const picture = document.querySelector(".you-scene, .rite img, .player-stage img, .ball-scene img, .leaf img, .layers-ground, .ci img, .tale-world, .fight img, .cinema video, .world");
      picture?.classList.remove("sae-she");
      void (picture as HTMLElement | null)?.offsetWidth;
      picture?.classList.add("sae-she");
      if (t.closest(".ci") && side) rollFlow();
      else pushSign(side ? "side" : "rise", dir);
      const owned = t?.closest(".player-shell, .tableau");
      if (!owned) {
        window.dispatchEvent(new CustomEvent("sae-axis", { detail: { axis: side ? "side" : "rise", dir } }));
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <>
      <div key={flash} className={flash ? "glue-blink on" : "glue-blink"} />
      <p key={`n${flash}`} className={note ? "glue-note on" : "glue-note"}>
        {note}
      </p>
      <div className="fungi" aria-hidden="true">
        {threads.map((thread) => (
          <i key={thread.id} className={thread.axis} />
        ))}
      </div>
        {FOLLOW.map((item, n) => {
          const frame = item.frames[tune[item.id] ?? 0] ?? item.frames[0];
          const width = typeof window === "undefined" ? SERVER_WIDTH : window.innerWidth;
          const place = onLayers ? { x: width - 62, y: 68 + n * 56 } : (places[item.id] ?? defaultSpot(n, width));
          return (
            <Link
              key={item.id}
              to="/layers"
              search={{ img: frame.room }}
              className={`${awake === n ? "follow awake" : "follow"}${onLayers ? " dock" : ""}`}
              style={{ left: place.x, top: place.y, right: "auto" }}
              aria-label={item.id}
              onPointerDown={(event) => {
                event.preventDefault();
                const startX = event.clientX;
                const startY = event.clientY;
                const origin = place;
                let moved = false;
                const move = (ev: PointerEvent) => {
                  if (onLayers) return;
                  if (Math.hypot(ev.clientX - startX, ev.clientY - startY) > 6) moved = true;
                  const next = { x: origin.x + ev.clientX - startX, y: origin.y + ev.clientY - startY };
                  setPlaces((all) => ({ ...all, [item.id]: next }));
                };
                const up = (ev: PointerEvent) => {
                  window.removeEventListener("pointermove", move);
                  window.removeEventListener("pointerup", up);
                  if (onLayers || !moved) {
                    const i = ((tune[item.id] ?? 0) + 1) % item.frames.length;
                    const nextFrame = item.frames[i];
                    setTune((all) => ({ ...all, [item.id]: i }));
                    window.dispatchEvent(new CustomEvent("sae-tune", { detail: { img: nextFrame.room } }));
                    if (!location.pathname.includes("/layers")) {
                      window.location.href = `/layers?img=${encodeURIComponent(nextFrame.room)}`;
                    }
                    return;
                  }
                  const next = { x: origin.x + ev.clientX - startX, y: origin.y + ev.clientY - startY };
                  setPlaces((all) => {
                    const saved = { ...all, [item.id]: next };
                    localStorage.setItem("sae-follow-spots", JSON.stringify(saved));
                    return saved;
                  });
                };
                window.addEventListener("pointermove", move);
                window.addEventListener("pointerup", up);
              }}
              onClick={(event) => event.preventDefault()}
            >
              <img src={frame.src} alt="" decoding="async" draggable={false} />
            </Link>
          );
        })}
      <div className="glue-faces">
        {faces
          ? FACES.map((face) =>
              face.to === "/ball" ? (
                <Link key={face.label} to="/ball" search={{ stay: face.stay }} className="glue-face" aria-label={face.label}>
                  <img src={face.src} alt="" />
                </Link>
              ) : (
                <Link key={face.label} to={face.to} className="glue-face" aria-label={face.label}>
                  <img src={face.src} alt="" />
                </Link>
              ),
            )
          : null}
        <button
          type="button"
          className="glue-toggle"
          onClick={() =>
            setFaces((on) => {
              localStorage.setItem("sae-faces", on ? "0" : "1");
              return !on;
            })
          }
        >
          {faces ? "faces away" : "faces"}
        </button>
      </div>
    </>
  );
}
