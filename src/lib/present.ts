import type { PeaceMark } from "@/lib/bpeace";

/**
 * Still plates. The fade is the only motion.
 * beauty, sun, light, dark dawn, red, black,
 * the whole sun, obsidian, red reign, the knight, glow.
 * Do not replace this reel.
 */
export const PRESENT = [
  { id: "door", src: "/sae-do.jpg", color: "#e7c27a", high: "/pillow-fight.jpg", low: "/beauty-sun.jpg" },
  { id: "beauty", src: "/enlight-way.jpg", color: "#f3d7c4", high: "/beauty-mid.jpg", low: "/beauty-end.jpg", motion: "/beauty-play.mp4" },
  { id: "sun", src: "/beauty-sun.jpg", color: "#e7c27a", high: "/whole-sun.jpg", low: "/pale-light.jpg" },
  { id: "light", src: "/pale-light.jpg", color: "#f6efe2", high: "/beauty-sun.jpg", low: "/moonrise.jpg" },
  { id: "dawn", src: "/moonrise.jpg", color: "#2c3344", high: "/dawn-mid.jpg", low: "/dawn-end.jpg", motion: "/dawn-play.mp4" },
  { id: "spectral", src: "/sae-spectral.jpg", color: "#e7b15a", high: "/reign-well.jpg", low: "/obsidian-way.jpg" },
  { id: "red", src: "/red-horizon.jpg", color: "#8a3a32", high: "/reign-well.jpg", low: "/black-field.jpg" },
  { id: "black", src: "/black-field.jpg", color: "#141210", high: "/red-horizon.jpg", low: "/obsidian-way.jpg" },
  { id: "whole", src: "/whole-sun.jpg", color: "#f0d48a", high: "/beauty-sun.jpg", low: "/glow.jpg" },
  { id: "obsidian", src: "/obsidian-way.jpg", color: "#8fd0c8", high: "/whole-sun.jpg", low: "/black-field.jpg" },
  { id: "reign", src: "/reign-well.jpg", color: "#6e2a28", high: "/red-horizon.jpg", low: "/knight-beside.jpg" },
  { id: "knight", src: "/knight-beside.jpg", color: "#c4a07a", high: "/glow.jpg", low: "/reign-well.jpg" },
  { id: "glow", src: "/glow.jpg", color: "#f3d7a1", high: "/whole-sun.jpg", low: "/knight-beside.jpg" },
] as const;

export const PRESENT_SRC = PRESENT.map((beat) => beat.src);

export type ReelId = "present" | "friend" | "peach" | "show";

export type FriendSlice = {
  id: string;
  src: string;
  color: string;
  high: string;
  low: string;
  word: string;
  line: string;
  mark: PeaceMark;
  motion?: string;
};

/**
 * Second potato reel. Child + fawn family.
 * gen2 / gen4 / gen22 stay later cousins and are not faces here.
 * The carrot stays whole. Meet, do not collect.
 */
export const FRIEND_FILM: readonly FriendSlice[] = [
  {
    id: "found",
    src: "/farther-well.jpg",
    color: "#e7c4b0",
    high: "/pink-forest.jpg",
    low: "/leaf-deer.jpg",
    motion: "/motion/farther-well.mp4",
    word: "begin",
    line: "The fawn looked back.",
    mark: "feather",
  },
  {
    id: "notice",
    src: "/pink-forest.jpg",
    color: "#e7c27a",
    high: "/farther-well.jpg",
    low: "/leaf-deer.jpg",
    motion: "/motion/pink-forest.mp4",
    word: "notice",
    line: "That is how a we began.",
    mark: "feather",
  },
  {
    id: "well",
    src: "/leaf-deer.jpg",
    color: "#9ecfb8",
    high: "/farther-well.jpg",
    low: "/depth-well.jpg",
    word: "rest",
    line: "Stop, because the guide stopped.",
    mark: "circle",
  },
  {
    id: "meet",
    src: "/scroll-meet.jpg",
    color: "#e39b5a",
    high: "/mark-orange.jpg",
    low: "/weather.jpg",
    word: "like",
    line: "Orange sits beside mint and peach.",
    mark: "door",
  },
  {
    id: "rain",
    src: "/weather.jpg",
    color: "#e25b4a",
    high: "/red-horizon.jpg",
    low: "/farther-well.jpg",
    motion: "/motion/rain.mp4",
    word: "weather",
    line: "The red is weather. Not a fall.",
    mark: "heart",
  },
  {
    id: "offer",
    src: "/mark-orange.jpg",
    color: "#e39b5a",
    high: "/leaf-deer.jpg",
    low: "/scroll-meet.jpg",
    word: "offer",
    line: "The carrot stays whole.",
    mark: "spark",
  },
  {
    id: "weee",
    src: "/peachfall-walk.jpg",
    color: "#f3b183",
    high: "/pink-forest.jpg",
    low: "/weather.jpg",
    word: "weee",
    line: "They run because the fawn ran first.",
    mark: "spark",
  },
  {
    id: "rest",
    src: "/sisters-well.jpg",
    color: "#9ecfb8",
    high: "/leaf-deer.jpg",
    low: "/pink-forest.jpg",
    word: "beside",
    line: "Rest beside. Pink inside mint.",
    mark: "feather",
  },
  {
    id: "further",
    src: "/scroll-doors.jpg",
    color: "#c9b7e6",
    high: "/pink-forest.jpg",
    low: "/scroll-meet.jpg",
    word: "further",
    line: "Together, further. The guide stands on neither path.",
    mark: "moon",
  },
];

export const FRIEND_LINE = "The fawn looked back. That is how a we began.";

/** Peach only. Existing stills. Words live on the fold, not on the picture. */
export const PEACH_FILM: readonly FriendSlice[] = [
  {
    id: "walk",
    src: "/peachfall-walk.jpg",
    color: "#f3b183",
    high: "/her-pink.jpg",
    low: "/peachfall-on.jpg",
    word: "walk",
    line: "She looks down. They stay beside her.",
    mark: "heart",
  },
  {
    id: "pink",
    src: "/her-pink.jpg",
    color: "#f3c6c0",
    high: "/anna.jpg",
    low: "/peachfall-walk.jpg",
    word: "pink",
    line: "Pink is her.",
    mark: "heart",
  },
  {
    id: "together",
    src: "/peachfall-all.jpg",
    color: "#e7b7c8",
    high: "/sisters-well.jpg",
    low: "/peachfall-walk.jpg",
    word: "together",
    line: "Pink, red, and purple, together.",
    mark: "circle",
  },
  {
    id: "smile",
    src: "/sisters-well.jpg",
    color: "#f0c9b0",
    high: "/blink-sister.jpg",
    low: "/her-pink.jpg",
    word: "smile",
    line: "They smile. The well is ahead.",
    mark: "feather",
  },
  {
    id: "ring",
    src: "/garden-ring.jpg",
    color: "#f3d0b0",
    high: "/love-arch.jpg",
    low: "/garden-stare.jpg",
    word: "ring",
    line: "A ring of blossoms.",
    mark: "circle",
  },
  {
    id: "arch",
    src: "/love-arch.jpg",
    color: "#e8b898",
    high: "/knight-beside.jpg",
    low: "/garden-ring.jpg",
    word: "arch",
    line: "Love in the arch.",
    mark: "door",
  },
  {
    id: "beside",
    src: "/knight-beside.jpg",
    color: "#c4a07a",
    high: "/glow.jpg",
    low: "/love-arch.jpg",
    word: "beside",
    line: "Love stays beside.",
    mark: "feather",
  },
];

export function filmFor(reel: ReelId) {
  if (reel === "friend") return FRIEND_FILM;
  if (reel === "peach") return PEACH_FILM;
  if (reel === "show") return SHOW_FILM;
  return PRESENT;
}

/** Held for her. Golden buns, sunshine, strawberry, the speckled tomboy, then peach ball. */
export const SHOW_FILM: readonly FriendSlice[] = [
  {
    id: "hold",
    src: "/her-pink.jpg",
    color: "#f3c6c0",
    high: "/peachfall-walk.jpg",
    low: "/show-golden.jpg",
    word: "her",
    line: "Held for her. The show does not take her place.",
    mark: "heart",
  },
  {
    id: "golden",
    src: "/show-golden.jpg",
    color: "#e7c27a",
    high: "/show-sunbun.jpg",
    low: "/her-pink.jpg",
    word: "golden",
    line: "Golden buns. Sunshine on the silk.",
    mark: "sun",
  },
  {
    id: "sun",
    src: "/show-sunbun.jpg",
    color: "#f0d48a",
    high: "/show-golden.jpg",
    low: "/show-berry.jpg",
    word: "bun",
    line: "A small sunshine, sitting still.",
    mark: "sun",
  },
  {
    id: "berry",
    src: "/show-berry.jpg",
    color: "#e25b4a",
    high: "/show-speckle.jpg",
    low: "/show-sunbun.jpg",
    word: "berry",
    line: "Strawberry, and the peach light over the field.",
    mark: "heart",
  },
  {
    id: "tomboy",
    src: "/show-speckle.jpg",
    color: "#9ecfc4",
    high: "/show-berry.jpg",
    low: "/portrait/peach.jpg",
    word: "speckle",
    line: "Speckled tomboy. Cute, and ready to play.",
    mark: "spark",
  },
  {
    id: "party",
    src: "/show-party.jpg",
    color: "#e7b7a8",
    high: "/show-golden.jpg",
    low: "/portrait/rain.jpg",
    word: "party",
    line: "Spekl at the party. Behind the scenes. Not a portrait.",
    mark: "heart",
  },
  {
    id: "ball",
    src: "/portrait/peach.jpg",
    color: "#f3b183",
    high: "/show-speckle.jpg",
    low: "/peachfall-walk.jpg",
    word: "ball",
    line: "Peach ball. Tap the picture.",
    mark: "circle",
  },
];
