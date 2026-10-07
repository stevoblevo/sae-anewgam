import { useEffect, useRef, useState } from "react";
import { TIM } from "@/lib/tim";
import { usePlateTouch } from "@/components/use-plate-touch";

/** Story and plates already in the project. Fallen beats, plus the course rooms they skip. */
const STORY = [
  {
    src: "/peachfall-walk.jpg",
    title: "Peach fall",
    line: "The red-haired one looks down. Pink and purple walk beside her, on the golden path.",
    over: "Rise and the blossoms are the weather.",
  },
  {
    src: "/porchfight-gal.jpg",
    title: "She is ready",
    line: "The fight has not started. She is still, and the leaf is by her shoe.",
    over: "The lantern is close enough to warm her face.",
  },
  {
    src: "/peachfall-all.jpg",
    title: "All of peach fall",
    line: "Pink, red, and purple. None of them has gone ahead.",
    over: "The path is gold under all three.",
  },
  {
    src: "/red-horizon.jpg",
    title: "Red horizon",
    line: "The red is the sky. The deer stands beside her, not ahead.",
    over: "The path meets the weather and does not end.",
  },
  {
    src: "/reign-well.jpg",
    title: "Into the well",
    line: "The reign comes down to the water. She is not angry here.",
    over: "The delve is quiet. The well keeps what it is given.",
  },
  {
    src: "/depth-thea.jpg",
    title: "Thea",
    line: "under us, Thea.",
    over: "",
  },
  {
    src: "/scroll-doors.jpg",
    title: "The corridor",
    line: "Each doorway is a chapter. Down the hall is the scroll. Sideways still walks.",
    over: "Delve and the floor remembers every step.",
  },
  {
    src: "/scroll-dear.jpg",
    title: "Dear",
    line: "She is at the well. The deer stands beside her, not ahead.",
    over: "Delve and the well keeps what it was given.",
  },
  {
    src: "/scroll-meet.jpg",
    title: "Orange, and red",
    line: "The door is light. The circle takes the weather and stays whole.",
    over: "Delve and the water holds both.",
  },
  {
    src: "/scroll-leaf.jpg",
    title: "The leaf, again",
    line: "One leaf, where the orange path meets the rain. It is not a trophy.",
    over: "Delve and the path does not ask you to take it.",
  },
  {
    src: "/porch-face.jpg",
    title: "The picture",
    line: "The picture is the screen. The dark only shows where it ends.",
    over: "Look up. The lantern is close enough to warm her face.",
  },
  {
    src: "/small-one.jpg",
    title: "The words",
    line: "Peach and red, on the same step. The sentence sits on them and does not hide them.",
    over: "Delve and the step is what they share.",
  },
  {
    src: "/garden-porch.jpg",
    title: "Ever fallen",
    line: "She notices you. The lantern is already lit.",
    over: "Look down. The boards are warm, and they remember shoes.",
  },
  {
    src: "/stare.png",
    title: "The minute before",
    line: "She holds your eyes. The fight has not started.",
    over: "Her shoes stay on the porch. That is the whole stance.",
  },
  {
    src: "/ring.png",
    title: "The ring",
    line: "The boards are still dry. Nobody has been put down.",
    over: "Delve and you find the second pair of shoes, still missing.",
  },
  {
    src: "/weather.jpg",
    title: "Red rain",
    line: "The red is the weather. It is not a fall.",
    over: "Under the rain the well is the same well.",
  },
  {
    src: "/farther-well.jpg",
    title: "Beside",
    line: "The deer stands behind her shoulder, not ahead.",
    over: "Delve and the deer stays. It does not become a path.",
  },
  {
    src: "/beat05.jpg",
    title: "The arch",
    line: "The deer becomes a door of blossoms.",
    over: "Step under the arch. It is a door, not a trophy.",
  },
  {
    src: "/well-cry.jpg",
    title: "The well",
    line: "The anger stayed in the ring. Here she only cries.",
    over: "Delve and the water keeps what she gives it.",
  },
  {
    src: "/beat01.jpg",
    title: "It remembers",
    line: "The well was already awake.",
    over: "Under that, two marks. Not a score.",
  },
  {
    src: "/pink-forest.jpg",
    title: "Pink, for rest",
    line: "She went down into the weather and came up still herself.",
    over: "Delve. The path is gold at the edges and quiet in the middle.",
  },
  {
    src: "/loom.png",
    title: "The door",
    line: "This is the only layer that can cover the picture. The other plays are through it.",
    over: "Under the loom, the floor is the way out.",
  },
  {
    src: "/everdelve.jpg",
    title: "Ever delve",
    line: "Walk sideways. Rise and delve are the other wheel.",
    over: "You delved. Same pictures. The underneath was always there.",
  },
  {
    src: "/beat06.jpg",
    title: "The way home",
    line: "a little farther. the way home stays open.",
    over: "Home stays open.",
  },
] as const;

const MARKS = [
  { id: "peach", verb: "grow", src: "/peachfall-walk.jpg" },
  { id: "reign", verb: "gather", src: "/weather.jpg" },
  { id: "thea", verb: "dream", src: "/depth-thea.jpg" },
  { id: "dora", verb: "map", src: "/beat01.jpg" },
  { id: "kk", verb: "gen", src: "/loom.png" },
  { id: "saelion", verb: "sync", src: "/beat06.jpg" },
] as const;

export function Dev({
  onAnne,
  onGarden,
  onHome,
}: {
  onAnne: () => void;
  onGarden?: () => void;
  onHome?: () => void;
}) {
  const len = STORY.length;
  const stage = useRef<HTMLDivElement>(null);
  const pending = useRef<number | null>(null);
  const commitRef = useRef<(dir: 1 | -1) => void>(() => {});
  const [at, setAt] = useState(0);
  const [shift, setShift] = useState(0);
  const [glide, setGlide] = useState(true);
  const [hint, setHint] = useState(true);

  const prev = (at - 1 + len) % len;
  const next = (at + 1) % len;
  const beat = STORY[at] ?? STORY[0];

  const width = () => stage.current?.clientWidth || window.innerWidth;

  const settle = (to: number) => {
    pending.current = null;
    setGlide(false);
    setAt(to);
    setShift(0);
  };

  const slideTo = (px: number, to: number | null) => {
    pending.current = to;
    setGlide(true);
    requestAnimationFrame(() => setShift(px));
  };

  const commit = (dir: 1 | -1) => {
    if (pending.current !== null) return;
    setHint(false);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShift(0);
      setAt((n) => (n + dir + len) % len);
      return;
    }
    slideTo(dir === 1 ? -width() : width(), (at + dir + len) % len);
  };
  commitRef.current = commit;

  const plate = usePlateTouch({
    canStart: () => pending.current === null,
    onPull: (dx) => {
      setGlide(false);
      setShift(dx);
    },
    onSwipe: (dir) => commit(dir),
    onCancel: () => slideTo(0, null),
    onTap: () => commit(1),
  });

  const jump = (src: string) => {
    const i = STORY.findIndex((item) => item.src === src);
    if (i < 0 || i === at) return;
    setHint(false);
    settle(i);
  };

  useEffect(() => {
    if (glide) return;
    const id = requestAnimationFrame(() => setGlide(true));
    return () => cancelAnimationFrame(id);
  }, [glide, at]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (plate.blocked.current) return;
      commitRef.current(1);
    }, TIM.ms);
    return () => window.clearInterval(id);
  }, [at]);

  useEffect(() => {
    plate.reset();
  }, [at]);

  const onTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || event.propertyName !== "transform") return;
    const to = pending.current;
    if (to === null) return;
    settle(to);
  };

  const frames = [STORY[prev], STORY[at], STORY[next]];
  const zoomed = plate.frame.z > 1;

  return (
    <div className="dev-door">
      <div className="dev-viewport" ref={stage} {...plate.handlers}>
        <div
          className="dev-reel"
          onTransitionEnd={onTransitionEnd}
          style={{
            transform: `translate3d(calc(-33.333% + ${shift}px), 0, 0)`,
            transition: glide ? "transform 520ms cubic-bezier(.22,.7,.2,1)" : "none",
          }}
        >
          {frames.map((item, n) => (
            <div className="dev-slide" key={`${item.src}-${n}`}>
              <img
                src={item.src}
                alt=""
                draggable={false}
                className={n === 1 && zoomed ? "zoomed" : ""}
                style={
                  n === 1 && zoomed
                    ? { transform: `translate3d(${plate.frame.x}px, ${plate.frame.y}px, 0) scale(${plate.frame.z})` }
                    : undefined
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div className="dev-progress" style={{ width: `${((at + 1) / len) * 100}%` }} />
      {onHome ? (
        <button type="button" className="nav-link dev-tag" onClick={onHome}>
          home
        </button>
      ) : (
        <p className="dev-tag">dev</p>
      )}

      <button type="button" className="dev-arrow prev" aria-label={`previous, ${STORY[prev].title}`} onClick={() => commit(-1)}>
        <b>‹</b>
        <small>{STORY[prev].title}</small>
      </button>
      <button type="button" className="dev-arrow next" aria-label={`next, ${STORY[next].title}`} onClick={() => commit(1)}>
        <b>›</b>
        <small>{STORY[next].title}</small>
      </button>

      {hint ? <p className="dev-hint">swipe · pinch</p> : null}

      <div className="dev-story">
        <p className="dev-kicker">
          {beat.title}
          <span>
            {at + 1} / {len}
          </span>
        </p>
        <p className="dev-line">{beat.line}</p>
        {beat.over ? <p className="dev-more">{beat.over}</p> : null}
      </div>

      <nav className="anne-marks dev-marks" aria-label="course">
        {MARKS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={beat.src === item.src ? "on" : ""}
            aria-label={item.id}
            onClick={() => jump(item.src)}
          >
            <i />
            {beat.src === item.src ? <span>{item.verb}</span> : null}
          </button>
        ))}
      </nav>
      <button type="button" className="nav-link anne-night" onClick={onAnne}>
        anne
      </button>
      {onGarden ? (
        <button type="button" className="nav-link garden-fold" onClick={onGarden}>
          garden
        </button>
      ) : null}
    </div>
  );
}
