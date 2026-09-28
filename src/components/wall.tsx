import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { WALL } from "@/lib/wall";
import { FRIEND_FILM, PEACH_FILM, PRESENT, SHOW_FILM } from "@/lib/present";

function nameOf(src: string) {
  const file = src.split("/").pop() ?? src;
  return file.replace(/\.[a-z0-9]+$/i, "").replaceAll("-", " ");
}

const SHELVES = ["peach", "show", "friend", "dawn", "later", "all"] as const;
type Shelf = (typeof SHELVES)[number];

const LATER = ["/gen2.jpg", "/gen4.jpg", "/gen22.jpg", "/motion/gen2.mp4", "/motion/gen4.mp4", "/motion/gen22.mp4"];

function piecesFor(shelf: Shelf) {
  if (shelf === "peach") return PEACH_FILM.map((beat) => beat.src);
  if (shelf === "show") return SHOW_FILM.map((beat) => beat.src);
  if (shelf === "friend") return FRIEND_FILM.map((beat) => beat.src);
  if (shelf === "dawn") return PRESENT.map((beat) => beat.src);
  if (shelf === "later") return LATER;
  return [...WALL];
}

export function Wall({ onFilm }: { onFilm?: () => void }) {
  const [shelf, setShelf] = useState<Shelf>("peach");
  const [more, setMore] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const pieces = piecesFor(shelf);
  const piece = open == null ? null : pieces[open];
  const friendAt = piece ? FRIEND_FILM.findIndex((beat) => beat.src === piece) : -1;
  const dawnAt = piece ? PRESENT.findIndex((beat) => beat.src === piece) : -1;

  const step = (dir: number) => {
    setOpen((now) => {
      if (now == null) return 0;
      return (now + dir + pieces.length) % pieces.length;
    });
  };

  return (
    <section className="wall">
      <header className="wall-bar">
        {onFilm ? (
          <button type="button" onClick={onFilm}>
            film
          </button>
        ) : (
          <Link to="/">film</Link>
        )}
        <Link to="/story" search={{ at: 0 }}>
          story
        </Link>
        <span>{pieces.length}</span>
      </header>
      <nav className="wall-shelves">
        <button type="button" className={shelf === "peach" ? "on" : ""} onClick={() => { setShelf("peach"); setOpen(null); }}>
          peach
        </button>
        <button type="button" className={more ? "on" : ""} onClick={() => setMore((on) => !on)}>
          more
        </button>
        {more
          ? SHELVES.filter((name) => name !== "peach").map((name) => (
              <button
                key={name}
                type="button"
                className={shelf === name ? "on" : ""}
                onClick={() => {
                  setShelf(name);
                  setOpen(null);
                }}
              >
                {name}
              </button>
            ))
          : null}
      </nav>
      {shelf === "friend" ? <p className="wall-line">The fawn looked back. That is how a we began.</p> : null}
      <div className="wall-grid">
        {pieces.map((src, i) => (
          <button key={`${shelf}-${src}-${i}`} type="button" onClick={() => setOpen(i)}>
            {src.endsWith(".mp4") ? <span className="wall-tile">{nameOf(src)}</span> : <img src={src} alt="" loading="lazy" />}
          </button>
        ))}
      </div>
      {piece ? (
        <div className="wall-open" onClick={() => setOpen(null)}>
          <button type="button" className="wall-step" onClick={(event) => { event.stopPropagation(); step(-1); }}>
            back
          </button>
          {piece.endsWith(".mp4") ? (
            <video src={piece} controls playsInline onClick={(event) => event.stopPropagation()} />
          ) : (
            <img src={piece} alt="" onClick={(event) => event.stopPropagation()} />
          )}
          <button type="button" className="wall-step" onClick={(event) => { event.stopPropagation(); step(1); }}>
            next
          </button>
          <p>
            {nameOf(piece)}
            {friendAt >= 0 ? (
              <Link to="/story" search={{ at: friendAt }} onClick={(event) => event.stopPropagation()}>
                walk
              </Link>
            ) : null}
            {dawnAt >= 0 && friendAt < 0 ? (
              <Link to="/" onClick={(event) => event.stopPropagation()}>
                dawn
              </Link>
            ) : null}
          </p>
        </div>
      ) : null}
    </section>
  );
}
