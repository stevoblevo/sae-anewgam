import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Drive } from "@/components/drive";
import { Player } from "@/components/reel-player";
import { Rover } from "@/components/rover";
import { Cast } from "@/components/berry";
import { Back } from "@/components/back";
import { Field } from "@/components/field";
import { Games } from "@/components/games";
import { Guide } from "@/components/guide";
import { Nightshade } from "@/components/nightshade";
import { Room } from "@/components/room";
import { Spots } from "@/components/spots";
import { EVER, EVER_MS } from "@/lib/everfallen";
import { BEATS, LOOK, PHOTOS } from "@/lib/garden-plates";
import type { ModuleId } from "@/lib/modules";

const ORDER = BEATS.map((b, n) => (b.id === "pass" ? -1 : n)).filter((n) => n >= 0);

function HourMark() {
  const h = new Date().getHours();
  const band = h < 5 ? "deep" : h < 11 ? "morning" : h < 17 ? "day" : h < 21 ? "evening" : "night";
  return (
    <div className="hour-accent" data-band={band}>
      <span>{String(h).padStart(2, "0")}</span>
      <i />
    </div>
  );
}

export function Show({ onDoor }: { onDoor?: () => void }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [walk, setWalk] = useState(false);
  const [reel, setReel] = useState(false);
  const [rover, setRover] = useState(false);
  const [drive, setDrive] = useState(false);
  const [wall, setWall] = useState(false);
  const [shade, setShade] = useState(true);
  const [hinge, setHinge] = useState(false);
  const [invert, setInvert] = useState(false);
  const [guide, setGuide] = useState(false);
  const [games, setGames] = useState(false);
  const [ever, setEver] = useState(false);
  const [focus, setFocus] = useState<number | null>(null);
  const activeRef = useRef(0);
  activeRef.current = active;

  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!hit) return;
        if ((hit.target as HTMLElement).dataset.shade) {
          setShade(true);
          return;
        }
        setShade(false);
        const n = Number((hit.target as HTMLElement).dataset.i);
        if (Number.isFinite(n)) setActive(n);
      },
      { root, threshold: [0.55, 0.75] },
    );
    root.querySelectorAll<HTMLElement>("[data-i], [data-shade]").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!walk || reel || drive) return;
    const t = window.setTimeout(() => {
      if (shade) {
        scroller.current?.querySelector<HTMLElement>('[data-i="-2"]')?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      const at = ORDER.indexOf(activeRef.current);
      const next = ORDER[(at + 1) % ORDER.length] ?? 0;
      scroller.current?.querySelector<HTMLElement>(`[data-i="${next}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, BEATS[active]?.clip && !shade ? 12000 : EVER_MS);
    return () => window.clearTimeout(t);
  }, [walk, active, reel, drive, shade]);

  useEffect(() => {
    if (!ever || !wall) return;
    const t = window.setInterval(() => {
      setFocus((f) => (f === null ? 0 : (f + 1) % BEATS.length));
    }, 2200);
    return () => window.clearInterval(t);
  }, [ever, wall]);

  return (
    <div className={`show-root${invert ? " night-invert" : ""}`}>
      <div
        className="show"
        ref={scroller}
        onWheel={() => setWalk(false)}
        onTouchStart={() => setWalk(false)}
      >
        <Nightshade
          live={shade}
          onGo={() => {
            setShade(false);
            scroller.current?.querySelector<HTMLElement>(`[data-i="${ORDER[0]}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          onHinge={() => {
            setHinge(true);
            setShade(false);
            const n = BEATS.findIndex((b) => b.id === "dora");
            scroller.current?.querySelector<HTMLElement>(`[data-i="${n}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        />
        <section className={`chapter night${active === -2 && !shade ? " live" : ""}`} data-i={-2}>
          <video className="chapter-film" src="/nightshade/moon.mp4" autoPlay muted loop playsInline preload="metadata" />
          <p>The moon is already up. The garden can wait a breath.</p>
        </section>
        {BEATS.map((b, n) =>
          b.id === "pass" ? null : (
            <section key={b.id} className={`chapter ${LOOK[b.id]?.aura ?? "night"}${active === n && !shade ? " live" : ""}`} data-i={n}>
              <img
                src={b.src}
                alt=""
                loading={n < 2 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={n === 0 ? "high" : "low"}
              />
              {b.clip && active === n && !reel ? (
                <video className="chapter-film" src={b.clip} poster={b.src} autoPlay muted playsInline preload="none" />
              ) : null}
              <p>{EVER[b.id]}</p>
            </section>
          ),
        )}
        <section className="chapter night end" data-i={BEATS.length}>
          <div className="end-card">
            <p>Same world. Nothing left behind.</p>
            <Link to="/reel">the reel</Link>
            <Link to="/gg">what gg means</Link>
            <button type="button" onClick={() => setWall(true)}>
              the wall
            </button>
            <img src="/beats/pass.png" alt="" loading="lazy" decoding="async" />
          </div>
        </section>
      </div>
      {!reel ? <Field aura={hinge ? "warm" : shade ? "rose" : (LOOK[BEATS[active]?.id ?? ""]?.aura ?? "night")} /> : null}
      {!wall && !reel ? <HourMark /> : null}
      {hinge ? <Room onClose={() => setHinge(false)} /> : null}
      {!shade && !hinge && !reel && !wall && !drive ? <Cast /> : null}
      {!reel && !wall && !drive ? (
        <Spots
          walk={walk}
          rover={rover}
          drive={drive}
          wall={wall}
          room={hinge}
          invert={invert}
          onWalk={() => setWalk((w) => !w)}
          onReel={() => setReel(true)}
          onRover={() => setRover((r) => !r)}
          onDrive={() => {
            setWall(false);
            setDrive((d) => !d);
          }}
          onRoom={() => setHinge((h) => !h)}
          onWall={() => {
            setDrive(false);
            setWall((w) => !w);
          }}
          onInvert={() => setInvert((v) => !v)}
          onGuide={() => setGuide(true)}
          onRandom={() => {
            const n = ORDER[Math.floor(Math.random() * ORDER.length)] ?? 0;
            setShade(false);
            scroller.current?.querySelector<HTMLElement>(`[data-i="${n}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
            window.dispatchEvent(new Event("sae-play"));
          }}
          onGames={() => setGames((g) => !g)}
        />
      ) : null}
      {guide && !reel ? <Guide onDone={() => setGuide(false)} /> : null}
      {games && !reel && !drive && !wall ? (
        <Games
          onClose={() => setGames(false)}
          onOpen={(id: ModuleId) => {
            setGames(false);
            if (id === "reel") {
              setReel(false);
              setEver(true);
              setWalk(true);
            }
            if (id === "drive") {
              setWall(false);
              setRover(false);
              setDrive(true);
            }
            if (id === "rover") setRover(true);
            if (id === "wall") {
              setDrive(false);
              setWall(true);
            }
          }}
        />
      ) : null}
      {drive ? (
        <Drive
          self={ever}
          onClose={() => setDrive(false)}
          onGoal={() => {
            setDrive(false);
            const n = BEATS.findIndex((b) => b.id === "europa");
            scroller.current?.querySelector<HTMLElement>(`[data-i="${n}"]`)?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      ) : null}
      {rover ? <Rover self={ever} onClose={() => setRover(false)} /> : null}
      {wall ? (
        <div
          className="wall"
          onClick={() => {
            setFocus(null);
            setWall(false);
          }}
        >
          <Back stage label="back" onClick={() => { setFocus(null); setWall(false); }} />
          {focus === null ? (
            <div className="wall-grid" onClick={(e) => e.stopPropagation()}>
              {PHOTOS.map((b) => {
                const look = LOOK[b.id] ?? { aura: "night" as const };
                const n = BEATS.findIndex((x) => x.id === b.id);
                return (
                  <button key={b.id} type="button" className={look.big ? `yarn ${look.aura}` : look.aura} aria-label={b.id} onClick={() => setFocus(n)}>
                    <img src={b.src} alt="" loading="lazy" decoding="async" />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className={`focus ${LOOK[BEATS[focus]?.id ?? ""]?.aura ?? "night"}`} onClick={(e) => e.stopPropagation()}>
              <img src={BEATS[focus]?.src} alt="" decoding="async" />
              <p>{EVER[BEATS[focus]?.id ?? ""]}</p>
              <button
                type="button"
                aria-label="open plate"
                onClick={() => {
                  const n = focus;
                  setFocus(null);
                  setWall(false);
                  scroller.current?.querySelector<HTMLElement>(`[data-i="${n}"]`)?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                open
              </button>
            </div>
          )}
        </div>
      ) : null}
      {ever && !reel ? (
        <button
          type="button"
          className="back-led ever"
          aria-label="stop everfallen"
          onClick={() => {
            setEver(false);
            setWalk(false);
          }}
        >
          <i />
          everfallen
        </button>
      ) : null}
      {reel ? (
        <div className="reel-fold">
          <Back stage label="back" onClick={() => setReel(false)} />
          <Player />
        </div>
      ) : null}
      {onDoor ? (
        <button type="button" className="back-led door-back" aria-label="back to the door" onClick={onDoor}>
          <i />
          door
        </button>
      ) : null}
    </div>
  );
}
