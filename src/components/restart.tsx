import { useRef, useState } from "react";

const PIECES = [
  { id: "door", src: "/sae-do.jpg" },
  { id: "light", src: "/pale-light.jpg" },
  { id: "moon", src: "/moonrise.jpg" },
  { id: "peach", src: "/peachfall-walk.jpg" },
  { id: "sun", src: "/scene-sun.jpg" },
  { id: "red", src: "/red-horizon.jpg" },
  { id: "well", src: "/farther-well.jpg" },
  { id: "knight", src: "/knight-beside.jpg" },
  { id: "gap", src: "" },
] as const;

const SOLVED = [0, 1, 2, 3, 4, 5, 6, 7, 8];

function neighbors(gap: number) {
  const row = Math.floor(gap / 3);
  return [gap - 1, gap + 1, gap - 3, gap + 3].filter((i) => {
    if (i < 0 || i > 8) return false;
    if (Math.abs(i - gap) === 1 && Math.floor(i / 3) !== row) return false;
    return true;
  });
}

function mix() {
  const tiles = [...SOLVED];
  let gap = 8;
  for (let n = 0; n < 48; n += 1) {
    const opts = neighbors(gap);
    const pick = opts[Math.floor(Math.random() * opts.length)] ?? gap;
    [tiles[gap], tiles[pick]] = [tiles[pick], tiles[gap]];
    gap = pick;
  }
  return tiles;
}

function clearReceipts() {
  try {
    ["sae-receipt", "sae-receipt-friend", "sae-receipt-peach", "sae-receipt-show"].forEach((key) => sessionStorage.removeItem(key));
  } catch {
    /* the next sitting still starts clean in the page */
  }
}

/** Restart landing, then a slide you can scroll across and down. The sun tile has no words. */
export function Restart({ onOpen }: { onOpen: () => void }) {
  const [tiles, setTiles] = useState(mix);
  const drag = useRef({ x: 0, y: 0 });
  const swiped = useRef(false);
  const solved = tiles.every((id, n) => id === SOLVED[n]);

  const slide = (at: number) => {
    const gap = tiles.indexOf(8);
    if (!neighbors(gap).includes(at)) return;
    setTiles((prev) => {
      const next = [...prev];
      [next[gap], next[at]] = [next[at], next[gap]];
      return next;
    });
  };

  const restart = () => {
    clearReceipts();
    setTiles(mix());
  };

  return (
    <div className="restart">
      <section className="restart-land">
        <img src="/ways-door.jpg" alt="" />
        <button type="button" onClick={restart}>
          restart
        </button>
      </section>
      <section className="restart-field" aria-label="puzzle">
        <div className="restart-board">
          {tiles.map((id, n) => {
            const piece = PIECES[id];
            return (
              <button
                key={piece.id}
                type="button"
                className={id === 8 ? "gap" : ""}
                onPointerDown={(event) => {
                  drag.current = { x: event.clientX, y: event.clientY };
                }}
                onPointerUp={(event) => {
                  const dx = event.clientX - drag.current.x;
                  const dy = event.clientY - drag.current.y;
                  if (Math.abs(dx) < 48 && Math.abs(dy) < 48) return;
                  swiped.current = true;
                  const gap = tiles.indexOf(8);
                  const row = Math.floor(n / 3);
                  if (Math.abs(dx) > Math.abs(dy)) {
                    if (dx > 0 && n + 1 === gap && Math.floor(gap / 3) === row) slide(n);
                    if (dx < 0 && n - 1 === gap && Math.floor(gap / 3) === row) slide(n);
                    return;
                  }
                  if (dy > 0 && n + 3 === gap) slide(n);
                  if (dy < 0 && n - 3 === gap) slide(n);
                }}
                onClick={() => {
                  if (swiped.current) {
                    swiped.current = false;
                    return;
                  }
                  slide(n);
                }}
              >
                {piece.src ? <img src={piece.src} alt="" /> : null}
              </button>
            );
          })}
        </div>
        {solved ? (
          <button type="button" className="restart-open" onClick={onOpen}>
            open
          </button>
        ) : null}
      </section>
    </div>
  );
}
