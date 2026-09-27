import { useEffect, useState } from "react";
import { useAxis } from "@/components/glue";
import { PICTURES } from "@/lib/pictures";
import { markSeen, readSeen } from "@/lib/seen";

const HEARTS = ["❤️", "💙", "💜", "💖", "💗", "💘", "❤️"];

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

  useAxis(step, () => setPlaying((on) => !on));

  return (
    <div className="night">
      {src === "/night-porch.jpg" && playing ? (
        <video key={src} src="/motion/night-porch.mp4" poster={src} autoPlay muted loop playsInline />
      ) : (
        <img key={src} src={src} alt="" />
      )}
      <header className="player-chrome">
        <button type="button" className="nav-link" onClick={onDay}>
          day
        </button>
        <p className="brand">seen</p>
        <div className="right">
          <button type="button" className="nav-link" onClick={() => setPlaying((on) => !on)}>
            {playing ? "hold" : "play"}
          </button>
        </div>
      </header>
      <nav className="hearts" aria-label="next">
        {HEARTS.map((heart, n) => (
          <button key={n} type="button" onClick={() => step(1)} aria-label="next">
            {heart}
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
