import { useRef, useState } from "react";
import { Back } from "@/components/back";

const PROMPTS = [
  {
    k: "I geek out on",
    v: "art, games, and turning “wouldn’t it be cool if” into something real.",
  },
  {
    k: "Together we could",
    v: "find a good coffee spot, trade favorite stories, and see whether a quick hello turns into dinner.",
  },
  {
    k: "I’m looking for",
    v: "someone curious and kind, with a playful streak. Good company, and room for it to unfold.",
  },
];

const STILLS = ["/nightshade/wink.jpg", "/beats/dora.jpg", "/beats/garden.png", "/beats/sumer-bunbun.jpg"];

function Card({ k, v }: { k: string; v: string }) {
  const [p, setP] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  return (
    <article
      style={{ transform: `translate(${p.x}px, ${p.y}px)` }}
      onPointerDown={(e) => {
        drag.current = { x: e.clientX, y: e.clientY, px: p.x, py: p.y };
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d) return;
        setP({ x: d.px + e.clientX - d.x, y: d.py + e.clientY - d.y });
      }}
      onPointerUp={() => {
        drag.current = null;
      }}
    >
      <h2>{k}</h2>
      <p>{v}</p>
    </article>
  );
}

export function Room({ onClose }: { onClose: () => void }) {
  const [up, setUp] = useState<number | null>(null);
  return (
    <div className="room" role="dialog" aria-label="Sae, the room">
      <header className="room-bar">
        <p>Sae · the room</p>
        <Back stage label="back" onClick={onClose} />
      </header>
      <div className="room-stills">
        {STILLS.map((src, n) => (
          <img key={src} src={src} alt="" className={up === n ? "up" : ""} onClick={() => setUp(up === n ? null : n)} />
        ))}
        <div className="room-wait">a real picture of you, when you want one in the frame</div>
      </div>
      <div className="room-prompts">
        {PROMPTS.map((p) => (
          <Card key={p.k} k={p.k} v={p.v} />
        ))}
      </div>
      <p className="room-note">First name. A general place. No address, no workplace, no codes. The room stays here.</p>
    </div>
  );
}
