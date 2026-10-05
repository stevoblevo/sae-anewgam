import { useEffect, useRef, useState } from "react";

const FACES = [
  { id: "wink", src: "/nightshade/wink.jpg", line: "Why aren’t you going first?" },
  { id: "curious", src: "/nightshade/sheet.png", line: "Curious. Come look with me." },
  { id: "happy", src: "/nightshade/wink.jpg", line: "Berry-small things, brighter together." },
  { id: "nom", src: "/nightshade/pair.jpg", line: "The raspberry goes first. The blackberry stays." },
  { id: "dream", src: "/nightshade/sheet.png", line: "Bigger adventures wait. I’m not in a hurry." },
  { id: "rest", src: "/nightshade/pair.jpg", line: "Different, together. That’s enough for tonight." },
] as const;

export function Nightshade({ onGo, onHinge, live }: { onGo: () => void; onHinge: () => void; live?: boolean }) {
  const [i, setI] = useState(0);
  const [prev, setPrev] = useState(0);
  const face = FACES[i];
  const under = FACES[prev];
  const pick = (n: number) => {
    if (n === i) return;
    setPrev(i);
    setI(n);
  };
  const iRef = useRef(0);
  iRef.current = i;

  useEffect(() => {
    const t = window.setInterval(() => {
      const back = iRef.current;
      if (back === 0) return;
      setPrev(back);
      setI(0);
      window.setTimeout(() => {
        setPrev(0);
        setI(back);
      }, 680);
    }, 12000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <section className={`chapter night shade${live ? " live" : ""}`} data-shade="1">
      <img className="shade-under" src={under.src} alt="" />
      <img key={i} className="shade-over" src={face.src} alt="" />
      <div className="shade-voice">
        <p>{face.line}</p>
        <div className="shade-faces">
          {FACES.map((f, n) => (
            <button key={f.id} type="button" className={n === i ? "on" : ""} aria-label={f.id} onClick={() => pick(n)}>
              {f.id}
            </button>
          ))}
        </div>
        <button type="button" className="shade-go" onClick={onGo}>
          the garden
        </button>
        <button type="button" className="shade-go hinge" onClick={onHinge}>
          the hinge
        </button>
      </div>
    </section>
  );
}
