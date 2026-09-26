import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";

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

export function Glue() {
  const [faces, setFaces] = useState(true);
  const [note, setNote] = useState("");
  const [flash, setFlash] = useState(0);
  const last = useRef(0);

  useEffect(() => {
    if (localStorage.getItem("sae-faces") === "0") setFaces(false);
  }, []);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      const t = event.target instanceof Element ? event.target : document.body;
      if (t?.closest("input, textarea, .film, .layers-walk, .gallery")) return;
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
      const picture = document.querySelector(".player-stage img, .ball-scene img, .leaf img, .layers-ground, .tale-world, .fight img, .cinema video");
      picture?.classList.remove("sae-she");
      void (picture as HTMLElement | null)?.offsetWidth;
      picture?.classList.add("sae-she");
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
