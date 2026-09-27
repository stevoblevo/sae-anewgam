import { useEffect, useRef, useState } from "react";
import { LANES, TALE, act, begin, type Move } from "@/lib/knight";

const MOVES: { id: Move; label: string }[] = [
  { id: "step", label: "she steps" },
  { id: "beside", label: "call him beside" },
  { id: "together", label: "together" },
];

type Bubble = { id: string; mean: string; color: string; x: number; y: number; s: number };

const SEED: Bubble[] = [
  { id: "pink", mean: "pink is her", color: "#f3b183", x: 16, y: 18, s: 76 },
  { id: "mint", mean: "mint is the well", color: "#9ecfb8", x: 58, y: 24, s: 96 },
  { id: "love", mean: "love stays beside", color: "#c4a07a", x: 36, y: 46, s: 68 },
];

export function KnightPlay({ onWalk }: { onWalk: () => void }) {
  const [board, setBoard] = useState(begin);
  const [look, setLook] = useState(0);
  const [open, setOpen] = useState(false);
  const [horizon, setHorizon] = useState(46);
  const [zoom, setZoom] = useState(1);
  const [bubbles, setBubbles] = useState<Bubble[]>(SEED);
  const stage = useRef<HTMLDivElement>(null);
  const fingers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef(0);
  const drag = useRef<{ id: string; x: number; y: number; bx: number; by: number } | null>(null);

  const tale = TALE[look] ?? TALE[0];

  useEffect(() => {
    setLook(board.she);
  }, [board.she]);

  const onHorizon = (clientY: number) => {
    const box = stage.current?.getBoundingClientRect();
    if (!box) return;
    const at = Math.min(78, Math.max(22, ((clientY - box.top) / box.height) * 100));
    setHorizon(at);
    setOpen(at > 56);
  };

  return (
    <div className={open ? "knight-play open" : "knight-play"} style={{ ["--zoom" as string]: zoom, ["--horizon" as string]: `${horizon}%` }}>
      <header className="player-chrome">
        <button type="button" className="nav-link" onClick={onWalk}>
          walk
        </button>
        <p className="brand">mint · the meaning</p>
        <button type="button" className="nav-link" onClick={() => setOpen((on) => !on)}>
          {open ? "contract" : "expand"}
        </button>
      </header>

      <div
        className="knight-stage"
        ref={stage}
        onWheel={(event) => {
          if (!event.ctrlKey && !event.metaKey) return;
          event.preventDefault();
          setZoom((z) => Math.min(2.4, Math.max(1, z + (event.deltaY < 0 ? 0.08 : -0.08))));
        }}
        onPointerDown={(event) => {
          if ((event.target as HTMLElement).closest(".horizon, .float-bubble, button")) return;
          fingers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
        }}
        onPointerMove={(event) => {
          if (fingers.current.has(event.pointerId)) {
            fingers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
            if (fingers.current.size >= 2) {
              const [a, b] = [...fingers.current.values()];
              const dist = Math.hypot(a.x - b.x, a.y - b.y);
              if (pinch.current) setZoom((z) => Math.min(2.4, Math.max(1, z * (dist / pinch.current))));
              pinch.current = dist;
            }
          }
          const held = drag.current;
          const box = stage.current?.getBoundingClientRect();
          if (!held || !box) return;
          setBubbles((all) =>
            all.map((bubble) =>
              bubble.id === held.id
                ? {
                    ...bubble,
                    x: Math.min(86, Math.max(4, held.bx + ((event.clientX - held.x) / box.width) * 100)),
                    y: Math.min(78, Math.max(6, held.by + ((event.clientY - held.y) / box.height) * 100)),
                  }
                : bubble,
            ),
          );
        }}
        onPointerUp={(event) => {
          fingers.current.delete(event.pointerId);
          if (fingers.current.size < 2) pinch.current = 0;
          drag.current = null;
        }}
      >
        <img className="knight-world" src="/pink-in-mint.jpg" alt="" />
        <button
          type="button"
          className="horizon"
          style={{ top: `${horizon}%` }}
          aria-label={`horizon at ${tale.mean}`}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            onHorizon(event.clientY);
          }}
          onPointerMove={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) onHorizon(event.clientY);
          }}
        >
          horizon at {tale.mean}
        </button>
        {bubbles.map((bubble) => (
          <button
            key={bubble.id}
            type="button"
            className="float-bubble"
            style={{ left: `${bubble.x}%`, top: `${bubble.y}%`, width: bubble.s, height: bubble.s, background: bubble.color }}
            onPointerDown={(event) => {
              event.stopPropagation();
              event.currentTarget.setPointerCapture(event.pointerId);
              drag.current = { id: bubble.id, x: event.clientX, y: event.clientY, bx: bubble.x, by: bubble.y };
            }}
          >
            <span>{bubble.mean}</span>
            <i
              aria-label={`grow ${bubble.mean}`}
              onPointerDown={(event) => {
                event.stopPropagation();
                setBubbles((all) => all.map((item) => (item.id === bubble.id ? { ...item, s: Math.min(168, item.s + 18) } : item)));
              }}
            >
              grow
            </i>
          </button>
        ))}
        <div className="knight-lane" aria-label="side view">
          {LANES.map((name, n) => (
            <div key={name} className={n === board.she ? "stone on" : "stone"} style={{ borderBottomColor: TALE[n]?.color }}>
              <span>{name}</span>
              <div className="stone-stand">
                {board.he === n ? <i className="token he" aria-label="knight" /> : null}
                {board.she === n ? <i className="token she" aria-label="her" /> : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ol className="compare">
        {TALE.map((beat, n) => (
          <li key={beat.mean}>
            <button type="button" className={n === look ? "on" : ""} onClick={() => setLook(n)}>
              <i style={{ background: beat.color }} />
              <strong>{beat.mean}</strong>
              <span>{beat.say}</span>
            </button>
          </li>
        ))}
      </ol>

      <p className="knight-line">{board.line}</p>
      <p className="knight-tale">{tale.say}</p>
      <div className="knight-moves">
        {board.won ? (
          <button type="button" onClick={() => setBoard(begin())}>
            again
          </button>
        ) : (
          MOVES.map((move) => (
            <button key={move.id} type="button" onClick={() => setBoard((now) => act(now, move.id))}>
              {move.label}
            </button>
          ))
        )}
        <button
          type="button"
          onClick={() =>
            setBubbles((all) => [
              ...all,
              { id: `own-${all.length}`, mean: "own", color: "#9ecfb8", x: 24 + (all.length % 4) * 14, y: 36, s: 52 },
            ])
          }
        >
          grow own
        </button>
      </div>
    </div>
  );
}
