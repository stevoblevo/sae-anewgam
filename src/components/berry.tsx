import { useEffect, useRef, useState, type ReactNode } from "react";

type Mood = "rest" | "wink" | "left" | "right" | "jazz";

function Berry({ onPlay, notice, skip }: { onPlay: () => void; notice: boolean; skip: { current: boolean } }) {
  const [mood, setMood] = useState<Mood>("rest");

  useEffect(() => {
    if (mood === "rest") return;
    const t = window.setTimeout(() => setMood("rest"), mood === "jazz" ? 2200 : 1600);
    return () => window.clearTimeout(t);
  }, [mood]);

  const act = (next: Mood) => {
    if (skip.current) {
      skip.current = false;
      return;
    }
    setMood(next);
    onPlay();
  };

  return (
    <div className={`pet berry-slot berry ${mood}${notice ? " notice" : ""}`}>
      <svg viewBox="0 0 160 180" role="img" aria-label="berry">
        <ellipse cx="80" cy="168" rx="36" ry="8" fill="#14080c55" />
        <g className="arm arm-l">
          <path d="M46 96c-16 6-28 22-26 34 8-2 16-12 22-24z" fill="#c43b78" />
          <g className="hand">
            <circle cx="22" cy="132" r="5" fill="#e25b92" />
            <circle cx="14" cy="124" r="3.2" fill="#e25b92" />
            <circle cx="12" cy="134" r="3.2" fill="#e25b92" />
            <circle cx="20" cy="140" r="3.2" fill="#e25b92" />
          </g>
        </g>
        <g className="arm arm-r">
          <path d="M114 96c16 6 28 22 26 34-8-2-16-12-22-24z" fill="#c43b78" />
          <g className="hand">
            <circle cx="138" cy="132" r="5" fill="#e25b92" />
            <circle cx="146" cy="124" r="3.2" fill="#e25b92" />
            <circle cx="148" cy="134" r="3.2" fill="#e25b92" />
            <circle cx="140" cy="140" r="3.2" fill="#e25b92" />
          </g>
        </g>
        <g className="body">
          <ellipse cx="80" cy="108" rx="42" ry="46" fill="#9b245c" />
          <circle cx="62" cy="86" r="14" fill="#d63b78" />
          <circle cx="84" cy="78" r="15" fill="#e14a86" />
          <circle cx="100" cy="92" r="13" fill="#c43370" />
          <circle cx="70" cy="108" r="14" fill="#de457f" />
          <circle cx="92" cy="112" r="15" fill="#b82d66" />
          <circle cx="78" cy="128" r="13" fill="#c83674" />
          <ellipse cx="80" cy="100" rx="22" ry="18" fill="#f3b7cf" opacity="0.35" />
          <path d="M70 58c4-16 18-22 22-8 6-12 20-8 18 6" fill="#2f6b45" />
        </g>
        <g className="face">
          <g className="eye eye-l">
            <ellipse cx="66" cy="104" rx="7" ry="8" fill="#1a0c12" />
            <circle cx="68" cy="102" r="2.2" fill="#fff" />
          </g>
          <g className="eye eye-r">
            <ellipse cx="94" cy="104" rx="7" ry="8" fill="#1a0c12" />
            <circle cx="96" cy="102" r="2.2" fill="#fff" />
          </g>
          <path d="M74 118c4 4 10 4 14 0" fill="none" stroke="#4a1028" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
      <div className="berry-acts">
        <button type="button" aria-label="wave left" onClick={() => act("left")} />
        <button type="button" aria-label="wink" onClick={() => act("wink")} />
        <button type="button" aria-label="jazz hands" onClick={() => act("jazz")} />
        <button type="button" aria-label="wave right" onClick={() => act("right")} />
      </div>
    </div>
  );
}

function Pal({
  name,
  hot,
  onPlay,
  children,
  skip,
}: {
  name: string;
  hot: string | null;
  onPlay: () => void;
  children: ReactNode;
  skip: { current: boolean };
}) {
  const on = hot === name;
  const notice = Boolean(hot && hot !== name);
  return (
    <div className={`pet ${name}${on ? " on" : ""}${notice ? " notice" : ""}`}>
      {children}
      <button
        type="button"
        className="pet-hit"
        aria-label={name}
        onClick={() => {
          if (skip.current) {
            skip.current = false;
            return;
          }
          onPlay();
        }}
      />
    </div>
  );
}

export function Cast() {
  const [hot, setHot] = useState<string | null>(null);
  const [at, setAt] = useState({ x: 8, y: 78 });
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const skip = useRef(false);

  useEffect(() => {
    if (!hot) return;
    const t = window.setTimeout(() => setHot(null), 1600);
    return () => window.clearTimeout(t);
  }, [hot]);

  return (
    <div
      className="cast"
      style={{ left: at.x, bottom: at.y }}
      onPointerDown={(e) => {
        drag.current = { x: e.clientX, y: e.clientY, px: at.x, py: at.y };
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d) return;
        if (Math.abs(e.clientX - d.x) + Math.abs(e.clientY - d.y) > 8) skip.current = true;
        setAt({ x: d.px + e.clientX - d.x, y: d.py - (e.clientY - d.y) });
      }}
      onPointerUp={() => {
        drag.current = null;
      }}
    >
      <Berry onPlay={() => setHot("berry")} notice={Boolean(hot && hot !== "berry")} skip={skip} />
      <Pal name="skein" hot={hot} onPlay={() => setHot("skein")} skip={skip}>
        <svg viewBox="0 0 120 140" aria-hidden>
          <ellipse cx="60" cy="126" rx="28" ry="6" fill="#14080c44" />
          <g className="roll">
            <circle cx="60" cy="78" r="36" fill="#d7c4a2" />
            <circle cx="60" cy="78" r="26" fill="none" stroke="#8d6b45" strokeWidth="4" />
            <path d="M44 70c10 8 22 8 32 0M42 82c12 10 26 8 36-2" fill="none" stroke="#a7845c" strokeWidth="3" />
            <path className="strand" d="M86 96c16 8 18 22 8 30" fill="none" stroke="#e7d3b0" strokeWidth="3" strokeLinecap="round" />
            <g className="eye eye-l">
              <ellipse cx="50" cy="74" rx="4" ry="5" fill="#2a1c12" />
            </g>
            <g className="eye eye-r">
              <ellipse cx="70" cy="74" rx="4" ry="5" fill="#2a1c12" />
            </g>
            <path d="M54 86c4 3 8 3 12 0" fill="none" stroke="#6b4a2e" strokeWidth="1.6" strokeLinecap="round" />
          </g>
        </svg>
      </Pal>
      <Pal name="peach" hot={hot} onPlay={() => setHot("peach")} skip={skip}>
        <svg viewBox="0 0 120 140" aria-hidden>
          <ellipse cx="60" cy="126" rx="26" ry="6" fill="#14080c44" />
          <g className="hop">
            <path d="M58 36c2-14 16-16 16-2" fill="#3d8f55" />
            <ellipse cx="60" cy="82" rx="34" ry="32" fill="#f3a57a" />
            <ellipse cx="48" cy="78" rx="16" ry="22" fill="#f6b892" />
            <path d="M60 58c2 18 2 28 0 40" fill="none" stroke="#e08a62" strokeWidth="2" />
            <ellipse className="blush blush-l" cx="40" cy="88" rx="6" ry="3.5" fill="#e36b78" opacity="0.0" />
            <ellipse className="blush blush-r" cx="82" cy="88" rx="6" ry="3.5" fill="#e36b78" opacity="0.0" />
            <g className="eye eye-l">
              <ellipse cx="48" cy="78" rx="4.5" ry="6" fill="#3a1c14" />
              <circle cx="49.5" cy="76" r="1.6" fill="#fff" />
            </g>
            <g className="eye eye-r">
              <ellipse cx="74" cy="78" rx="4.5" ry="6" fill="#3a1c14" />
              <circle cx="75.5" cy="76" r="1.6" fill="#fff" />
            </g>
            <path d="M54 92c4 4 10 4 14 0" fill="none" stroke="#8a3d32" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        </svg>
      </Pal>
      <Pal name="moth" hot={hot} onPlay={() => setHot("moth")} skip={skip}>
        <svg viewBox="0 0 120 140" aria-hidden>
          <g className="flutter">
            <ellipse className="wing wing-l" cx="38" cy="70" rx="24" ry="32" fill="#f3cf8f" opacity="0.85" />
            <ellipse className="wing wing-r" cx="82" cy="70" rx="24" ry="32" fill="#f4c9a8" opacity="0.85" />
            <ellipse cx="60" cy="74" rx="8" ry="22" fill="#5c4630" />
            <circle cx="60" cy="52" r="8" fill="#6d5340" />
            <path d="M54 46c-6-14-2-20 2-16M66 46c6-14 2-20-2-16" fill="none" stroke="#3a2a1c" strokeWidth="1.4" />
            <g className="eye eye-l">
              <circle cx="57" cy="52" r="1.6" fill="#1a100c" />
            </g>
            <g className="eye eye-r">
              <circle cx="63" cy="52" r="1.6" fill="#1a100c" />
            </g>
          </g>
        </svg>
      </Pal>
    </div>
  );
}
