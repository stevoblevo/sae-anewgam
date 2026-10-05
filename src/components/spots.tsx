import { useRef, useState, type ReactNode } from "react";

function Spot({
  label,
  x,
  y,
  on,
  children,
  onFire,
}: {
  label: string;
  x: number;
  y: number;
  on?: boolean;
  children: ReactNode;
  onFire: () => void;
}) {
  const [n, setN] = useState({ x: 0, y: 0 });
  const [wink, setWink] = useState(false);
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const moved = useRef(false);

  return (
    <button
      type="button"
      className={`spot${on ? " on" : ""}${wink ? " wink" : ""}`}
      style={{ left: `calc(${x}% + ${n.x}px)`, top: `calc(${y}% + ${n.y}px)` }}
      aria-label={label}
      onPointerDown={(e) => {
        moved.current = false;
        drag.current = { x: e.clientX, y: e.clientY, px: n.x, py: n.y };
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d) return;
        const dx = e.clientX - d.x;
        const dy = e.clientY - d.y;
        if (Math.abs(dx) + Math.abs(dy) > 8) moved.current = true;
        setN({ x: d.px + dx, y: d.py + dy });
      }}
      onPointerUp={() => {
        drag.current = null;
        if (!moved.current) return;
        setWink(true);
        window.setTimeout(() => setWink(false), 420);
      }}
      onClick={() => {
        if (moved.current) {
          moved.current = false;
          return;
        }
        onFire();
      }}
    >
      {children}
      <em>{label}</em>
    </button>
  );
}

export function Spots({
  walk,
  rover,
  drive,
  wall,
  room,
  invert,
  onWalk,
  onReel,
  onRover,
  onDrive,
  onRoom,
  onWall,
  onInvert,
  onGuide,
  onRandom,
  onGames,
}: {
  walk: boolean;
  rover: boolean;
  drive: boolean;
  wall: boolean;
  room: boolean;
  invert: boolean;
  onWalk: () => void;
  onReel: () => void;
  onRover: () => void;
  onDrive: () => void;
  onRoom: () => void;
  onWall: () => void;
  onInvert: () => void;
  onGuide: () => void;
  onRandom: () => void;
  onGames: () => void;
}) {
  return (
    <div className="spots">
      <Spot label="the guide" x={8} y={18} onFire={onGuide}>
        <i />
      </Spot>
      <Spot label="somewhere new" x={46} y={14} onFire={onRandom}>
        <i />
      </Spot>
      <Spot label={invert ? "the night, back" : "invert the night"} x={86} y={16} on={invert} onFire={onInvert}>
        <i />
      </Spot>
      <Spot label="the drive" x={18} y={46} on={drive} onFire={onDrive}>
        <i />
      </Spot>
      <Spot label="Sae’s room" x={72} y={58} on={room} onFire={onRoom}>
        <i />
      </Spot>
      <Spot label="the rover" x={84} y={74} on={rover} onFire={onRover}>
        <i />
      </Spot>
      <Spot label={walk ? "pause the walk" : "the garden walks"} x={14} y={80} on={walk} onFire={onWalk}>
        <i />
      </Spot>
      <Spot label="the wall" x={48} y={86} on={wall} onFire={onWall}>
        <i />
      </Spot>
      <Spot label="the games" x={36} y={62} onFire={onGames}>
        <i />
      </Spot>
      <Spot label="the reel" x={78} y={30} onFire={onReel}>
        <i />
      </Spot>
    </div>
  );
}
