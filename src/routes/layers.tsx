import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
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
  const navigate = useNavigate();
  const at = Math.max(0, (PICTURES as readonly string[]).indexOf(ground));
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
      {words ? <p className="layers-words">She looks down. Pink and purple stay beside her.</p> : null}
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
