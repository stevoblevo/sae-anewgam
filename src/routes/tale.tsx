import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { act, exits, look, roomArt, START, type TaleState } from "@/lib/tale";

export const Route = createFileRoute("/tale")({
  component: Tale,
});

export function Tale() {
  const [state, setState] = useState<TaleState>(START);
  const [lines, setLines] = useState<string[]>(() => look(START));
  const [draft, setDraft] = useState("");
  const end = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLInputElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const say = (input: string) => {
    const result = act(state, input);
    setState(result.state);
    if (result.lines.length) setLines((log) => [...log, `> ${input}`, ...result.lines]);
    setDraft("");
    box.current?.focus();
  };

  return (
    <div className="tale">
      <img className="tale-world" alt="" src={roomArt(state)} />
      <header className="player-chrome">
        <Link to="/walk" className="nav-link">
          porch
        </Link>
        <p className="brand">a little farther</p>
        <div className="right">
          <Link to="/ball" search={{ stay: 1 }} className="nav-link">
            ball
          </Link>
        </div>
      </header>
      <div className="tale-log">
        {lines.map((line, n) => (
          <p key={`${n}-${line.slice(0, 12)}`} className={line.startsWith(">") ? "tale-you" : undefined}>
            {line}
          </p>
        ))}
        <div ref={end} />
      </div>
      <form
        className="tale-bar"
        onSubmit={(e) => {
          e.preventDefault();
          say(draft);
        }}
      >
        <div className="tale-ways">
          <button type="button" onClick={() => say("look")}>
            look
          </button>
          {exits(state).map((dir) => (
            <button key={dir} type="button" onClick={() => say(dir)}>
              {dir}
            </button>
          ))}
          <button type="button" onClick={() => say("talk")}>
            talk
          </button>
          <button type="button" onClick={() => say("inventory")}>
            carry
          </button>
        </div>
        <input
          ref={box}
          value={draft}
          autoFocus
          aria-label="command"
          placeholder="type a way"
          onChange={(e) => setDraft(e.target.value)}
        />
      </form>
    </div>
  );
}
