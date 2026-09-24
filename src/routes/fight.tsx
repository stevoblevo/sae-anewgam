import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { mountStare } from "@/lib/stare";

export const Route = createFileRoute("/fight")({
  component: Fight,
});

export function Fight() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [line, setLine] = useState("Hold her eyes.");

  useEffect(() => {
    const node = canvas.current;
    if (!node) return;
    try {
      return mountStare(node, {
        ring: "/stare.png",
        face: "/stare.png",
        well: "/well-cry.jpg",
        onLine: setLine,
      });
    } catch {
      setLine("The stare couldn't start.");
    }
  }, []);

  return (
    <div className="fight">
      <canvas ref={canvas} />
      <header className="player-chrome">
        <Link to="/" className="nav-link">
          back
        </Link>
        <p className="brand">porch fight</p>
        <div className="right">
          <Link to="/tale" className="nav-link">
            words
          </Link>
        </div>
      </header>
      <p className="fight-line">{line}</p>
    </div>
  );
}
