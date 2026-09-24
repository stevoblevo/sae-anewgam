export type Weather = "fallen" | "delve";

export type Beat = {
  key: string;
  line: string;
  delve: string;
  fallen: string;
  img: string;
  choose?: boolean;
};

export const BEATS: Beat[] = [
  {
    key: "remember",
    line: "the water remembers.",
    delve: "the well is awake.",
    fallen: "red rain on the same well.",
    img: "/beat01.jpg",
  },
  {
    key: "trace",
    line: "a trace, not a trophy.",
    delve: "peaches rise. not scored.",
    fallen: "two marks in the ripple.",
    img: "/beat02.jpg",
  },
  {
    key: "notice",
    line: "she notices.",
    delve: "Steven? a little farther?",
    fallen: "gaze before greeting.",
    img: "/beat03.jpg",
    choose: true,
  },
  {
    key: "beside",
    line: "beside, not ahead.",
    delve: "together. always.",
    fallen: "knight beside, not leading.",
    img: "/beat04.jpg",
  },
  {
    key: "crown",
    line: "a living crown.",
    delve: "living garden. no deer mascot.",
    fallen: "dear deer in the arch.",
    img: "/beat05.jpg",
    choose: true,
  },
  {
    key: "farther",
    line: "a little farther.",
    delve: "into it. #alittlefar",
    fallen: "home stays open.",
    img: "/beat06.jpg",
  },
];

export const CARDS: Record<string, [string, string][]> = {
  notice: [
    ["notice", "she sees. nothing is demanded."],
    ["care", "stay at the well a breath longer."],
    ["choose", "a little farther?"],
  ],
  crown: [
    ["notice", "the arch is occupied."],
    ["care", "a crown that grows. not taken."],
    ["choose", "walk the path through."],
  ],
};

export const BEAT_MS = 4000;
