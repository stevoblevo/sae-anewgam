import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PLATES } from "@/lib/plates";

const FILMS = PLATES.filter((p) => p.motion);
const HOLD = 6000;

export const Route = createFileRoute("/farther")({
  component: Farther,
});

function Farther() {
  const [i, setI] = useState(0);
  const film = FILMS[i] ?? FILMS[0];

  useEffect(() => {
    let raf = 0;
    let acc = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100);
      last = now;
      acc += dt;
      if (acc >= HOLD) {
        acc = 0;
        setI((n) => (n + 1) % FILMS.length);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!film?.motion) return null;

  return (
    <div className="cinema">
      <video key={film.motion} src={film.motion} poster={film.src} autoPlay muted loop playsInline />
      <div className="cinema-cap">
        <p className="line">{film.title}</p>
        <p className="tag">
          {i + 1} / {FILMS.length} · the others
        </p>
      </div>
      <Link to="/" className="cinema-back">
        the way home
      </Link>
    </div>
  );
}
