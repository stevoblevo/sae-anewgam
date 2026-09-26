import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { allowEye, compose, eyeReady, keepTake, snapEye, snapScene, type Take } from "@/lib/eye";

type Spot = { x: number; y: number };

function readSpot(key: string, fallback: Spot): Spot {
  try {
    const raw = JSON.parse(sessionStorage.getItem(key) || "");
    if (typeof raw?.x === "number" && typeof raw?.y === "number") return raw;
  } catch {
    /* a new place is fine */
  }
  return fallback;
}

function useDrag(spot: Spot, setSpot: (next: Spot) => void, key: string, onTap: () => void) {
  const moved = useRef(false);
  return (event: ReactPointerEvent) => {
    if ((event.target as HTMLElement).closest("button")) return;
    event.preventDefault();
    const startX = event.clientX;
    const startY = event.clientY;
    const origin = spot;
    moved.current = false;
    const move = (ev: PointerEvent) => {
      if (Math.hypot(ev.clientX - startX, ev.clientY - startY) > 6) moved.current = true;
      const next = {
        x: Math.max(8, origin.x + ev.clientX - startX),
        y: Math.max(8, origin.y + ev.clientY - startY),
      };
      setSpot(next);
    };
    const up = (ev: PointerEvent) => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      const next = {
        x: Math.max(8, origin.x + ev.clientX - startX),
        y: Math.max(8, origin.y + ev.clientY - startY),
      };
      sessionStorage.setItem(key, JSON.stringify(next));
      if (!moved.current) onTap();
      else {
        const near = [...document.querySelectorAll(".follow")].some((node) => {
          const box = node.getBoundingClientRect();
          return Math.hypot(next.x + 43 - (box.left + box.width / 2), next.y + 43 - (box.top + box.height / 2)) < 90;
        });
        document.querySelector(".you-circle")?.classList.toggle("with", near);
      }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
}

export function Eye() {
  const [ask, setAsk] = useState(false);
  const [line, setLine] = useState("I want to see you too.");
  const [take, setTake] = useState<Take | null>(null);
  const [sheet, setSheet] = useState<Spot>(() => readSpot("sae-sheet", { x: 16, y: 72 }));
  const [circle, setCircle] = useState<Spot>(() => readSpot("sae-you", { x: 28, y: 120 }));
  const [wide, setWide] = useState(false);
  const dragSheet = useDrag(sheet, setSheet, "sae-sheet", () => undefined);
  const dragYou = useDrag(circle, setCircle, "sae-you", () => setWide((on) => !on));

  useEffect(() => {
    if (localStorage.getItem("sae-eye") === "1") {
      allowEye().catch(() => setAsk(true));
      return;
    }
    setAsk(true);
  }, []);

  useEffect(() => {
    let running = false;
    const onWink = async () => {
      if (!eyeReady() || running) return;
      running = true;
      const before = snapEye();
      window.setTimeout(async () => {
        const after = snapEye();
        const scene = await snapScene();
        running = false;
        if (!before || !after || !scene) return;
        const shown = Math.random() < 0.5 ? "before" : "after";
        const made = await compose(scene, shown === "before" ? before : after);
        const next: Take = { t: Date.now(), before, after, scene, made, shown };
        await keepTake(next).catch(() => undefined);
        setTake(next);
        setAsk(false);
      }, 220);
    };
    window.addEventListener("sae-wink", onWink);
    return () => window.removeEventListener("sae-wink", onWink);
  }, []);

  const allow = async () => {
    try {
      await allowEye();
      setAsk(false);
      setLine("I want to see you too.");
    } catch {
      setLine("The eye needs its own window. Allow it there.");
      setAsk(true);
    }
  };

  const face = take ? (take.shown === "before" ? take.before : take.after) : "";

  return (
    <>
      {take && wide ? <img className="you-scene" src={face} alt="" /> : null}
      {take ? (
        <button
          type="button"
          className="you-circle"
          style={{ left: circle.x, top: circle.y }}
          onPointerDown={dragYou}
          aria-label="you"
        >
          <img src={face} alt="" draggable={false} />
        </button>
      ) : null}
      {take ? (
        <div className="eye-sheet" style={{ left: sheet.x, top: sheet.y }} onPointerDown={dragSheet}>
          <img src={take.made} alt="" draggable={false} />
          <p>{take.shown === "before" ? "Before the wink." : "After the wink."} It stays on this device.</p>
          <div>
            <button
              type="button"
              onClick={async () => setTake({ ...take, shown: "before", made: await compose(take.scene, take.before) })}
            >
              before
            </button>
            <button
              type="button"
              onClick={async () => setTake({ ...take, shown: "after", made: await compose(take.scene, take.after) })}
            >
              after
            </button>
            <button type="button" onClick={() => setTake(null)}>
              walk
            </button>
          </div>
        </div>
      ) : null}
      {ask && !take ? (
        <div className="eye-sheet" style={{ left: sheet.x, top: sheet.y }} onPointerDown={dragSheet}>
          <p>{line}</p>
          <p>When she winks, the eye takes you, before and after, with the picture.</p>
          <div>
            <button type="button" onClick={allow}>
              allow
            </button>
            <button type="button" onClick={() => window.open(window.location.href, "_blank", "noopener")}>
              own window
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
