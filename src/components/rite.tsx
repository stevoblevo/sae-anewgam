import { useEffect, useState } from "react";
import { useAxis } from "@/components/glue";
import { useAskInstall } from "@/components/install-sheet";

const MOVES = [
  { id: "reign", src: "/depth-thea.jpg" },
  { id: "well", src: "/reign-well.jpg" },
  { id: "horizon", src: "/red-horizon.jpg" },
  { id: "mint", src: "/peachfall-walk.jpg" },
  { id: "pass", src: "/depth-grotto.jpg" },
];

export function Rite({ onWalk, onDoor }: { onWalk: () => void; onDoor?: () => void }) {
  const [at, setAt] = useState(0);
  const [playing, setPlaying] = useState(true);
  const { ask, sheet } = useAskInstall();
  const move = MOVES[at] ?? MOVES[0];

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setAt((n) => (n + 1) % MOVES.length), 5200);
    return () => window.clearInterval(id);
  }, [playing]);

  useAxis(
    () => setAt((n) => (n + 1) % MOVES.length),
    () => setAt((n) => (n + 1) % MOVES.length),
  );

  return (
    <div className="rite shine">
      <style>{".rite.shine{background:#140e0c;min-height:100dvh}.rite.shine img{position:fixed;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 28%;filter:saturate(1.06) contrast(1.05);animation:shine-in .9s ease both}@keyframes shine-in{from{opacity:0;transform:scale(1.03)}to{opacity:1;transform:none}}.rite.shine .player-chrome{opacity:0;transition:opacity .5s ease}.rite.shine:hover .player-chrome,.rite.shine:focus-within .player-chrome{opacity:1}.rite.shine .rite-marks{opacity:.55}.rite.shine .rite-marks button{box-shadow:0 0 12px rgba(255,220,180,.35)}"}</style>
      {sheet}
      <img key={move.src} src={move.src} alt="" decoding="async" fetchPriority="high" />
      <header className="player-chrome">
        <button type="button" className="nav-link" onClick={onWalk}>
          walk
        </button>
        <p className="brand">
          {onDoor ? (
            <button type="button" className="nav-link" onClick={onDoor}>
              {move.id}
            </button>
          ) : (
            move.id
          )}
        </p>
        <div className="right">
          <button type="button" className="nav-link" onClick={ask}>
            install
          </button>
          <button type="button" className="nav-link" onClick={() => setPlaying((on) => !on)}>
            {playing ? "hold" : "play"}
          </button>
        </div>
      </header>
      <div className="rite-marks">
        {MOVES.map((item, n) => (
          <button key={item.id} type="button" className={n === at ? "on" : ""} onClick={() => setAt(n)} aria-label={item.id} />
        ))}
      </div>
    </div>
  );
}
