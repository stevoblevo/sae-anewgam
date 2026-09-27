import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { pushSign, rollFlow, colonize, readFlow, type Thread } from "@/lib/flow";
import { OCCULT_OFF, readOccult, type Occult } from "@/lib/occult";

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
  { id: "anna", src: "/portrait/pink.jpg" },
  { id: "lock", src: "/face-lock.jpg" },
  { id: "sister", src: "/blink-sister.jpg" },
  { id: "hearth", src: "/anna-hearth.jpg" },
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
  const [note, setNote] = useState("");
  const [flash, setFlash] = useState(0);
  const [awake, setAwake] = useState(0);
  const [places, setPlaces] = useState<Record<string, { x: number; y: number }>>({});
  const [threads, setThreads] = useState<Thread[]>([]);
  const [occult, setOccult] = useState<Occult>(OCCULT_OFF);
  const last = useRef(0);
  const occultRef = useRef(occult);
  occultRef.current = occult;

  useEffect(() => {
    const sync = () => setOccult(readOccult());
    sync();
    window.addEventListener("sae-occult", sync);
    return () => window.removeEventListener("sae-occult", sync);
  }, []);

  useEffect(() => {
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
    if (!occult.faces) return;
    const tick = () => {
      setAwake(Math.floor(Math.random() * FOLLOW.length));
      window.setTimeout(() => setAwake(-1), 1600);
    };
    const id = window.setInterval(tick, 7000);
    return () => window.clearInterval(id);
  }, [occult.faces]);

  useEffect(() => {
    const grow = () => setThreads(colonize(readFlow()).slice(-6));
    grow();
    window.addEventListener("sae-flow", grow);
    return () => window.removeEventListener("sae-flow", grow);
  }, []);

  useEffect(() => {
    const gesture = (side: boolean, dir: 1 | -1, target: Element) => {
      const now = performance.now();
      if (now - last.current < 380) return;
      last.current = now;
      const held = occultRef.current;
      if (held.blink) {
        setNote(side ? "she looks aside." : "she blinks.");
        setFlash((n) => n + 1);
        const picture = document.querySelector(".you-scene, .rite img, .player-stage img, .ball-scene img, .leaf img, .layers-ground, .ci img, .tale-world, .fight img, .cinema video, .world");
        picture?.classList.remove("sae-she");
        void (picture as HTMLElement | null)?.offsetWidth;
        picture?.classList.add("sae-she");
      }
      if (held.wink) window.dispatchEvent(new CustomEvent("sae-wink"));
      if (target.closest(".ci") && side) rollFlow();
      else pushSign(side ? "side" : "rise", dir);
      if (!target.closest(".player-shell, .tableau")) {
        window.dispatchEvent(new CustomEvent("sae-axis", { detail: { axis: side ? "side" : "rise", dir } }));
      }
    };

    const onWheel = (event: WheelEvent) => {
      const t = event.target instanceof Element ? event.target : document.body;
      if (t?.closest("input, textarea, .film, .layers-walk, .gallery, .immerse, .potato, .silent-all")) return;
      const ax = Math.abs(event.deltaX);
      const ay = Math.abs(event.deltaY);
      if (ax < 1 && ay < 1) return;
      event.preventDefault();
      const side = event.shiftKey || ax > ay;
      const dir = ((side ? event.deltaX : event.deltaY) || event.deltaY || event.deltaX) > 0 ? 1 : -1;
      gesture(side, dir, t);
    };

    let x0 = 0;
    let y0 = 0;
    let armed = false;
    const onStart = (event: TouchEvent) => {
      const t = event.target instanceof Element ? event.target : document.body;
      if (t.closest("input, textarea, button, a, .film, .layers-walk, .gallery, .see-all, .occult, .skein-rail, .ask, .immerse, .potato")) return;
      const point = event.changedTouches[0];
      if (!point) return;
      x0 = point.clientX;
      y0 = point.clientY;
      armed = true;
    };
    const onEnd = (event: TouchEvent) => {
      if (!armed) return;
      armed = false;
      const t = event.target instanceof Element ? event.target : document.body;
      const point = event.changedTouches[0];
      if (!point) return;
      const dx = point.clientX - x0;
      const dy = point.clientY - y0;
      if (Math.hypot(dx, dy) < 48) return;
      const side = Math.abs(dx) > Math.abs(dy);
      const dir = side ? (dx < 0 ? 1 : -1) : dy < 0 ? 1 : -1;
      gesture(side, dir, t);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, []);

  return (
    <>
      <div key={flash} className={occult.blink && flash ? "glue-blink on" : "glue-blink"} hidden={!occult.blink} />
      <p key={`n${flash}`} className={note && occult.blink ? "glue-note on" : "glue-note"} hidden={!occult.blink}>
        {note}
      </p>
      <div className="fungi" aria-hidden="true">
        {threads.map((thread) => (
          <i key={thread.id} className={thread.axis} />
        ))}
      </div>
        {occult.faces
          ? FOLLOW.map((item, n) => {
          const place = places[item.id] ?? defaultSpot(n, SERVER_WIDTH);
          return (
            <Link
              key={item.id}
              to="/layers"
              search={{ img: item.src }}
              className={awake === n ? "follow awake" : "follow"}
              style={{ left: place.x, top: place.y, right: "auto" }}
              aria-label={item.id}
              onPointerDown={(event) => {
                event.preventDefault();
                const startX = event.clientX;
                const startY = event.clientY;
                const origin = place;
                let moved = false;
                const move = (ev: PointerEvent) => {
                  if (Math.hypot(ev.clientX - startX, ev.clientY - startY) > 6) moved = true;
                  const next = { x: origin.x + ev.clientX - startX, y: origin.y + ev.clientY - startY };
                  setPlaces((all) => ({ ...all, [item.id]: next }));
                };
                const up = (ev: PointerEvent) => {
                  window.removeEventListener("pointermove", move);
                  window.removeEventListener("pointerup", up);
                  const next = { x: origin.x + ev.clientX - startX, y: origin.y + ev.clientY - startY };
                  setPlaces((all) => {
                    const saved = { ...all, [item.id]: next };
                    localStorage.setItem("sae-follow-spots", JSON.stringify(saved));
                    return saved;
                  });
                  if (!moved) {
                    window.location.href = `/layers?img=${encodeURIComponent(item.src)}`;
                  }
                };
                window.addEventListener("pointermove", move);
                window.addEventListener("pointerup", up);
              }}
              onClick={(event) => event.preventDefault()}
            >
              <img src={item.src} alt="" decoding="async" draggable={false} />
            </Link>
          );
        })
          : null}
      {occult.faces ? (
        <div className="glue-faces">
          {FACES.map((face) =>
            face.to === "/ball" ? (
              <Link key={face.label} to="/ball" search={{ stay: face.stay }} className="glue-face" aria-label={face.label}>
                <img src={face.src} alt="" />
              </Link>
            ) : (
              <Link key={face.label} to={face.to} className="glue-face" aria-label={face.label}>
                <img src={face.src} alt="" />
              </Link>
            ),
          )}
        </div>
      ) : null}
    </>
  );
}
