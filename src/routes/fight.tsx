import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { mountStare } from "@/lib/stare";

export const Route = createFileRoute("/fight")({
  component: Fight,
});

export function Fight() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
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
      setLine("The picture stays. The stare could not start.");
    }
  }, []);

  return (
    <div className="fight">
      <img src="/stare.png" alt="" />
      <canvas ref={canvas} />
      <header className="player-chrome">
        <button type="button" className="nav-link" onClick={() => router.history.back()}>
          back
        </button>
        <p className="brand">porch fight</p>
        <div className="right">
          <Link to="/walk" className="nav-link">
            porch
          </Link>
        </div>
      </header>
      <p className="fight-line">{line}</p>
    </div>
  );
}