import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PICTURES } from "@/lib/pictures";
import { useAxis } from "@/components/glue";

const ORDER = [
  { z: 0, name: "picture", note: "The painting, and the motion on it. It fills the screen and never takes a tap." },
  { z: 2, name: "words", note: "The line. It may fade. It must not sit on the controls." },
  { z: 4, name: "walk", note: "The thumbnails, the side list, next, play, and home." },
  { z: 8, name: "face", note: "A bubble. It floats above the walk, and it can be put aside." },
  { z: 20, name: "sheet", note: "The gallery. It covers the picture. It does not cover the way out." },
  { z: 40, name: "leave", note: "Always the top. Always the way back." },
];

const PLAY = ["/peachfall-walk.jpg", "/porchfight-gal.jpg", "/anna-hearth.jpg", "/depth-thea.jpg", "/reign-well.jpg", "/sisters-well.jpg", "/beat02.jpg"];

export const Route = createFileRoute("/layers")({
  validateSearch: (search: Record<string, unknown>) => ({
    img: typeof search.img === "string" && search.img.startsWith("/") ? search.img : "/peachfall-walk.jpg",
  }),
  component: Layers,
});

function Layers() {
  const { img } = Route.useSearch();
  const ground = (PICTURES as readonly string[]).includes(img) ? img : "/peachfall-walk.jpg";
  const [words, setWords] = useState(true);
  const [face, setFace] = useState(true);
  const [sheet, setSheet] = useState(true);
  const [playing, setPlaying] = useState(true);
  const navigate = useNavigate();
  const at = Math.max(0, (PICTURES as readonly string[]).indexOf(ground));
  const playAt = Math.max(0, PLAY.indexOf(ground));

  useEffect(() => {
    document.documentElement.dataset.layers = "1";
    window.dispatchEvent(new Event("sae-layers"));
    return () => {
      delete document.documentElement.dataset.layers;
      window.dispatchEvent(new Event("sae-layers"));
    };
  }, []);

  useEffect(() => {
    const onTune = (event: Event) => {
      const next = (event as CustomEvent<{ img?: string }>).detail?.img;
      if (next && (PICTURES as readonly string[]).includes(next)) navigate({ to: "/layers", search: { img: next } });
    };
    window.addEventListener("sae-tune", onTune);
    return () => window.removeEventListener("sae-tune", onTune);
  }, [navigate]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      const next = PLAY[(playAt + 1) % PLAY.length];
      navigate({ to: "/layers", search: { img: next } });
    }, 4200);
    return () => window.clearInterval(id);
  }, [playing, playAt, navigate]);

  useAxis(
    (dir) => {
      const next = PICTURES[(at + dir + PICTURES.length) % PICTURES.length];
      navigate({ to: "/layers", search: { img: next } });
    },
    () => setWords((v) => !v),
  );

  return (
    <div className="layers">
      <img className="layers-ground" src={ground} alt="" />
      {words && ground === "/peachfall-walk.jpg" ? <p className="layers-words">She looks down. Pink and purple stay beside her.</p> : null}
      <div className="layers-walk">
        {PICTURES.map((src) => (
          <Link key={src} to="/layers" search={{ img: src }} className={src === ground ? "on" : ""}>
            <img src={src} alt="" />
          </Link>
        ))}
      </div>
      {face ? <img className="layers-face" src="/stare.png" alt="" /> : null}
      {sheet ? (
        <aside className="layers-sheet">
          <p>The order, from the ground up.</p>
          {ORDER.map((layer) => (
            <p key={layer.z}>
              <b>{layer.z}</b> {layer.name}. {layer.note}
            </p>
          ))}
          <button type="button" onClick={() => setPlaying((v) => !v)}>
            {playing ? "hold" : "play"}
          </button>
          <button type="button" onClick={() => setWords((v) => !v)}>
            {words ? "hide words" : "words"}
          </button>
          <button type="button" onClick={() => setFace((v) => !v)}>
            {face ? "hide face" : "face"}
          </button>
          <button type="button" onClick={() => setSheet(false)}>close this</button>
        </aside>
      ) : (
        <button type="button" className="layers-order" onClick={() => setSheet(true)}>
          order
        </button>
      )}
      <Link to="/" className="layers-leave">
        leave
      </Link>
    </div>
  );
}