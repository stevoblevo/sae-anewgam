import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { BPEACE, peaceMark, peaceWord } from "@/lib/bpeace";
import { LAWS, PATH, readPath, type PathId } from "@/lib/goal";
import { PeaceIcon } from "@/components/peace-mark";

const EMPTY = PATH.map(() => "");

function readSave(): { order: string[]; look: number } {
  try {
    const raw = JSON.parse(localStorage.getItem(BPEACE.saved) || "");
    const order = raw?.order;
    if (Array.isArray(order) && order.length === PATH.length && order.every((id) => id === "" || PATH.some((step) => step.id === id))) {
      return { order, look: Math.min(PATH.length - 1, Number(raw.look) || 0) };
    }
  } catch {
    /* a new sitting */
  }
  return { order: EMPTY, look: 0 };
}

export function GoalPlay() {
  const saved = readSave();
  const [order, setOrder] = useState<string[]>(saved.order);
  const [held, setHeld] = useState<PathId | "">("");
  const [look, setLook] = useState(saved.look);
  const { done, fault } = readPath(order);
  const picture = done ? PATH[PATH.length - 1] : PATH[look] ?? PATH[0];

  useEffect(() => {
    try {
      localStorage.setItem(BPEACE.saved, JSON.stringify({ id: BPEACE.id, order, look }));
    } catch {
      /* the page still holds it */
    }
  }, [order, look]);

  const place = (id: PathId, slot: number) => {
    setOrder((prev) => {
      const next = [...prev];
      const from = next.indexOf(id);
      if (from >= 0) next[from] = "";
      next[slot] = id;
      return next;
    });
    setHeld("");
    setLook(slot);
  };

  const dropAt = (id: PathId, event: React.PointerEvent) => {
    const hit = document.elementFromPoint(event.clientX, event.clientY);
    const slot = hit?.closest("[data-slot]");
    if (!slot) return;
    place(id, Number(slot.getAttribute("data-slot")));
  };

  return (
    <section className="goal">
      <img className="goal-world" src={picture.src} alt="" />
      <p className="goal-line">{BPEACE.story}</p>
      <ol className="goal-checks">
        {PATH.map((step, n) => (
          <li key={step.id} className={done ? "done" : look === n ? "on" : order[n] ? "set" : ""}>
            <button type="button" onClick={() => setLook(n)}>
              <img src={step.src} alt="" />
              <PeaceIcon mark={peaceMark(step.id)} />
              <span>{step.name}</span>
            </button>
          </li>
        ))}
        <li className={done ? "done" : ""}>
          <span className="goal-glow">
            <PeaceIcon mark="spark" /> Glow
          </span>
        </li>
      </ol>
      <div className="goal-laws">
        {LAWS.map((law, n) => (
          <p key={law} className={fault === n ? "fault" : done ? "done" : ""}>
            {law}
          </p>
        ))}
      </div>
      <div className="goal-path">
        {PATH.map((step, n) => {
          const id = order[n];
          const placed = PATH.find((item) => item.id === id);
          return (
            <button key={step.id} type="button" data-slot={n} className={held && !id ? "open" : ""} onClick={() => held && place(held, n)}>
              {placed ? <img src={placed.src} alt="" /> : <i>{peaceWord(step.id)}</i>}
            </button>
          );
        })}
      </div>
      <div className="goal-tray">
        {PATH.map((step) => (
          <button
            key={step.id}
            type="button"
            className={held === step.id ? "held" : order.includes(step.id) ? "used" : ""}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              setHeld(step.id);
            }}
            onPointerUp={(event) => dropAt(step.id, event)}
            onClick={() => setHeld((now) => (now === step.id ? "" : step.id))}
          >
            <PeaceIcon mark={peaceMark(step.id)} />
            {peaceWord(step.id)}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            setOrder(EMPTY);
            setHeld("");
            setLook(0);
            try {
              localStorage.removeItem(BPEACE.saved);
            } catch {
              /* cleared on the page */
            }
          }}
        >
          clear
        </button>
        <Link to="/">back</Link>
      </div>
    </section>
  );
}
