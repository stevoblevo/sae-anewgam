import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useAxis } from "@/components/glue";

const HER = [
  { id: "face", title: "purple.", src: "/cute.jpg", motion: "/motion/cute.mp4" },
  { id: "beside", title: "beside.", src: "/violet.jpg", motion: "/motion/violet.mp4" },
  { id: "full", title: "full.", src: "/violet-phone.jpg" },
];

export const Route = createFileRoute("/her")({
  component: Her,
});

function Her() {
  const [at, setAt] = useState(0);
  const [still, setStill] = useState(false);
  const scene = HER[at] ?? HER[0];
  useAxis(
    (dir) => {
      setStill(false);
      setAt((n) => (n + dir + HER.length) % HER.length);
    },
    () => setStill((v) => !v),
  );

  return (
    <div className="ball">
      <header className="player-chrome">
        <Link to="/" className="nav-link">
          back
        </Link>
        <p className="brand">her</p>
      </header>
      <section className="ball-scene">
        <img alt="" src={scene.src} />
        {!still && scene.motion ? <video src={scene.motion} muted loop playsInline autoPlay /> : null}
      </section>
    </div>
  );
}
