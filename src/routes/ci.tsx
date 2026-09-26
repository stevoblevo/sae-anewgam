import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAxis } from "@/components/glue";
import { readFlow, type Sign } from "@/lib/flow";

export const Route = createFileRoute("/ci")({
  component: Love,
});

function Love() {
  const [signs, setSigns] = useState<Sign[]>([]);
  const [love, setLove] = useState(false);
  const [move, setMove] = useState(true);
  const [card, setCard] = useState({ light: "/porchlight.jpg", notice: "/pink-notice.jpg", motion: "/motion/pink-notice.mp4" });

  useEffect(() => {
    const sync = () => setSigns(readFlow());
    const onHash = () => setLove(location.hash === "#love");
    sync();
    onHash();
    window.addEventListener("sae-flow", sync);
    window.addEventListener("hashchange", onHash);
    fetch("/ic.lov")
      .then((res) => res.text())
      .then((text) => {
        const pick = (key: string) => text.match(new RegExp(`^${key}\\s+(\\S+)`, "m"))?.[1];
        setCard({
          light: pick("porchlight") || "/porchlight.jpg",
          notice: pick("notice") || "/pink-notice.jpg",
          motion: pick("motion") || "/motion/pink-notice.mp4",
        });
      })
      .catch(() => {});
    return () => {
      window.removeEventListener("sae-flow", sync);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  useAxis(
    () => {},
    () => setMove((on) => !on),
  );

  const notice = love || signs.at(-1)?.axis === "rise";

  return (
    <div className="ci">
      <img className="layers-ground" src={notice ? card.notice : card.light} alt="" />
      {notice && move ? <video className="ci-motion" src={card.motion} autoPlay muted loop playsInline /> : null}
      <header className="player-chrome">
        <Link to="/" className="nav-link">
          back
        </Link>
        <p className="brand">.c.i</p>
        <div className="right">
          <a className="nav-link" href="#love">
            love
          </a>
        </div>
      </header>
      <div className="ci-line">
        {signs.map((sign) => (
          <i key={sign.t} className={sign.axis} />
        ))}
      </div>
    </div>
  );
}
