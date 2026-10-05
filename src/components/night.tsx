import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useAxis } from "@/components/glue";
import { PICTURES } from "@/lib/pictures";
import { markSeen, readSeen } from "@/lib/seen";

function buildReel(): string[] {
  const known = PICTURES as readonly string[];
  const seen = Object.keys(readSeen()).filter((src) => known.includes(src));
  const rest = known.filter((src) => !seen.includes(src));
  return [...seen, ...rest];
}

export function Night({ onDay }: { onDay: () => void }) {
  const [reel, setReel] = useState<string[]>(["/night-porch.jpg"]);
  const [at, setAt] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [trail, setTrail] = useState<number[]>([0]);
  const last = useRef(0);
  const src = reel[at] ?? reel[0];

  useEffect(() => {
    setReel(buildReel());
  }, []);

  useEffect(() => {
    if (src) markSeen(src);
  }, [src]);

  useEffect(() => {
    if (!playing || reel.length < 2) return;
    const id = window.setInterval(() => setAt((n) => (n + 1) % reel.length), 4200);
    return () => window.clearInterval(id);
  }, [playing, reel.length]);

  useEffect(() => {
    document.querySelector(".occult-galley .on")?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [at]);

  const step = (dir: number) => setAt((n) => (n + dir + reel.length) % reel.length);

  useEffect(() => {
    setTrail((prev) => [...prev.filter((n) => n !== at), at].slice(-5));
  }, [at]);

  const onStage = (event: ReactPointerEvent) => {
    if ((event.target as HTMLElement).closest("button, a, .occult-galley, .player-chrome")) return;
    const startX = event.clientX;
    const startY = event.clientY;
    let moved = false;
    const move = (ev: PointerEvent) => {
      if (Math.hypot(ev.clientX - startX, ev.clientY - startY) > 12) moved = true;
    };
    const up = (ev: PointerEvent) => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      const now = performance.now();
      if (now - last.current < 380) return;
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if (Math.abs(dx) < 28 && Math.abs(dy) < 28) {
        if (!moved) {
          last.current = now;
          step(1);
        }
        return;
      }
      last.current = now;
      if (Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
      else setPlaying((on) => !on);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  useAxis(step, () => setPlaying((on) => !on));

  return (
    <div className="night" onPointerDown={onStage}>
      <div className="night-stage">
      {src === "/night-porch.jpg" && playing ? (
        <video key={src} src="/motion/night-porch.mp4" poster={src} autoPlay muted loop playsInline />
      ) : (
        <img key={src} src={src} alt="" />
      )}
      </div>
      <header className="player-chrome">
        <button type="button" className="nav-link" onClick={onDay}>
          home
        </button>
        <p className="brand">seen</p>
        <div className="right">
          <button type="button" className="nav-link" onClick={() => setPlaying((on) => !on)}>
            {playing ? "hold" : "play"}
          </button>
        </div>
      </header>
      <nav className="trail" aria-label="trail">
        {trail.map((n) => (
          <button key={n} type="button" className={n === at ? "on" : ""} onClick={() => setAt(n)} aria-label="back along the trail">
            👣
          </button>
        ))}
      </nav>
      <div className="occult-galley">
        {reel.map((item, n) => (
          <button key={item} type="button" className={n === at ? "on" : ""} onClick={() => setAt(n)}>
            <img src={item} alt="" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}
