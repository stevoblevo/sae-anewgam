import { createFileRoute, Link } from "@tanstack/react-router";

const HER = [
  { id: "face", title: "purple.", src: "/cute.jpg", motion: "/motion/cute.mp4" },
  { id: "beside", title: "beside.", src: "/violet.jpg", motion: "/motion/violet.mp4" },
  { id: "full", title: "full.", src: "/violet-phone.jpg" },
];

export const Route = createFileRoute("/her")({
  component: Her,
});

function Her() {
  return (
    <div className="ball">
      <header className="player-chrome">
        <Link to="/" className="nav-link">
          back
        </Link>
        <p className="brand">her</p>
      </header>
      {HER.map((s) => (
        <section key={s.id} className="ball-scene">
          <img alt="" src={s.src} />
          {s.motion ? <video src={s.motion} muted loop playsInline autoPlay /> : null}
        </section>
      ))}
    </div>
  );
}
