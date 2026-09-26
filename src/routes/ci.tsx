import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAxis } from "@/components/glue";
import { readFlow, type Sign } from "@/lib/flow";
import { PICTURES } from "@/lib/pictures";

const FLOATS = [
  { axis: "side", top: "16%", left: "14%" },
  { axis: "rise", top: "24%", left: "76%" },
  { axis: "side", top: "64%", left: "20%" },
  { axis: "rise", top: "52%", left: "84%" },
];

const FACES = [
  { src: "/portrait/pink.jpg", top: "58%", left: "8%" },
  { src: "/stare.png", top: "14%", left: "64%" },
];

const DEPTHS = ["/depth-well.jpg", "/depth-fall.jpg", "/depth-grotto.jpg", "/depth-thea.jpg"];
const REEL = [...DEPTHS, ...PICTURES.filter((src) => !DEPTHS.includes(src))];

export const Route = createFileRoute("/ci")({
  component: Love,
});

function Love() {
  const [signs, setSigns] = useState<Sign[]>([]);
  const [love, setLove] = useState(false);
  const [under, setUnder] = useState(false);
  const [move, setMove] = useState(true);
  const [at, setAt] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [falling, setFalling] = useState(true);
  const [card, setCard] = useState({
    light: "/porchlight.jpg",
    notice: "/pink-notice.jpg",
    motion: "/motion/pink-notice.mp4",
    under: "/sky-under.jpg",
    sky: "/sky-ski.jpg",
    skyMotion: "/motion/sky-ski.mp4",
  });

  useEffect(() => {
    const sync = () => setSigns(readFlow());
    const onHash = () => {
      setLove(location.hash === "#love");
      setUnder(location.hash === "#under");
    };
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
          under: pick("under") || "/sky-under.jpg",
          sky: pick("sky") || "/sky-ski.jpg",
          skyMotion: pick("sky-motion") || "/motion/sky-ski.mp4",
        });
      })
      .catch(() => {});
    return () => {
      window.removeEventListener("sae-flow", sync);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  useEffect(() => {
    if (!love || !playing) return;
    const id = window.setInterval(() => {
      setFalling(true);
      setAt((n) => (n + 1) % REEL.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [love, playing]);

  useEffect(() => {
    if (!love) return;
    document.querySelector(".delve-film .on")?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [love, at]);

  useAxis(
    (dir) => {
      if (location.hash !== "#love") return;
      setFalling(false);
      setPlaying(false);
      setAt((n) => (n + dir + REEL.length) % REEL.length);
    },
    (dir) => {
      if (location.hash === "#love") {
        setFalling(true);
        setAt((n) => (n + dir + REEL.length) % REEL.length);
        return;
      }
      setMove((on) => !on);
    },
  );

  const bare = signs.length === 0;
  const underside = under || (!love && bare);
  const notice = !love && !underside && (love || signs.at(-1)?.axis === "rise");
  const ground = underside ? card.under : notice ? card.notice : card.light;
  const motionSrc = underside ? card.skyMotion : card.motion;
  const picture = REEL[at] ?? REEL[0];
  const inShaft = falling && at < DEPTHS.length;

  if (love) {
    return (
      <div className={`delve${at >= 2 ? " deep" : ""}`}>
        {inShaft ? (
          <div className="fall-stack" style={{ transform: `translateY(-${at * 100}%)` }}>
            {DEPTHS.map((src, i) =>
              i === 1 ? (
                <video key={src} src="/motion/depth-fall.mp4" poster={src} autoPlay muted loop playsInline style={{ top: `${i * 100}%` }} />
              ) : (
                <img key={src} src={src} alt="" style={{ top: `${i * 100}%` }} />
              ),
            )}
          </div>
        ) : (
          <img key={picture} className="delve-ground" src={picture} alt="" />
        )}
        <header className="player-chrome">
          <Link to="/" className="nav-link">
            back
          </Link>
          <p className="brand">{picture === "/depth-thea.jpg" ? "red reign" : "ever delve"}</p>
          <div className="right">
            <button type="button" className="nav-link" onClick={() => setPlaying((on) => !on)}>
              {playing ? "hold" : "play"}
            </button>
            <a className="nav-link" href="#under">
              under
            </a>
          </div>
        </header>
        {picture === "/depth-thea.jpg" ? <p className="ci-fold">Under us, red reign. Thea.</p> : null}
        {FLOATS.map((mark, n) => (
          <i key={n} className={`float-mark ${mark.axis}`} style={{ top: mark.top, left: mark.left, animationDelay: `${n * 0.6}s` }} />
        ))}
        {FACES.map((face) => (
          <img key={face.src} className="float-face" src={face.src} alt="" style={{ top: face.top, left: face.left }} />
        ))}
        <div className="delve-film">
          {REEL.map((src, n) => (
            <button
              key={src}
              type="button"
              className={n === at ? "on" : ""}
              onClick={() => {
                setPlaying(false);
                setFalling(n < DEPTHS.length);
                setAt(n);
              }}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="ci">
      <img className="layers-ground" src={ground} alt="" />
      {(underside || notice) && move ? <video className="ci-motion" src={motionSrc} poster={underside ? card.sky : card.notice} autoPlay muted loop playsInline /> : null}
      <header className="player-chrome">
        <Link to="/" className="nav-link">
          back
        </Link>
        <p className="brand">.c.i</p>
        <div className="right">
          <a className="nav-link" href="#love">
            love
          </a>
          <a className="nav-link" href="#under">
            under
          </a>
        </div>
      </header>
      {underside ? <p className="ci-fold">Gavin is already on the slope. The sky is open. The peaches are only the weather.</p> : null}
      {!underside ? <img className="ci-under" src={card.under} alt="" /> : null}
      <div className="ci-line">
        {signs.map((sign) => (
          <i key={sign.t} className={sign.axis} />
        ))}
      </div>
    </div>
  );
}
