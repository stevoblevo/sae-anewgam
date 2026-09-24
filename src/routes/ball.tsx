import { createFileRoute, Link } from "@tanstack/react-router";

const SCENES = [
  { id: "savannah", title: "purple.", note: "the cute stare.", src: "/cute.jpg", motion: "/motion/cute.mp4" },
  { id: "peach", title: "peach fall.", note: "she winks.", src: "/bambi.jpg", motion: "/motion/wink.mp4" },
  { id: "pink", title: "her, in pink.", note: "anna.", src: "/anna.jpg", motion: "/motion/anna.mp4" },
  { id: "sisters", title: "say who. say hi.", note: "peach, and her red sister.", src: "/sisters.jpg", motion: "/motion/sisters.mp4" },
  { id: "stare", title: "pf stare.", note: "she winks too.", src: "/stare.png", motion: "/motion/stare-wink.mp4" },
  { id: "reign", title: "red reign.", note: "same place. another feeling.", src: "/weather.jpg", motion: "/motion/rain.mp4" },
];

export const Route = createFileRoute("/ball")({
  component: Ball,
});

function Ball() {
  return (
    <div className="ball">
      <header className="player-chrome">
        <Link to="/" className="nav-link">
          back
        </Link>
        <p className="brand">peach ball</p>
        <a className="nav-link" href="/?install=1">
          install
        </a>
      </header>
      {SCENES.map((s) => (
        <section key={s.id} className="ball-scene">
          <img alt="" src={s.src} />
          {s.motion ? <video src={s.motion} muted loop playsInline autoPlay /> : null}
          <div className="ball-cap">
            <p className="line">{s.title}</p>
            <p className="tag">{s.note} · scroll</p>
          </div>
        </section>
      ))}
    </div>
  );
}
