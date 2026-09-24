export type Cast = "porch" | "peach" | "rain" | "well" | "kirby";

export type Plate = {
  id: string;
  title: string;
  note: string;
  src: string;
  srcPhone?: string;
  motion?: string;
  shelf?: "world" | "study" | "later";
  choose?: boolean;
  cast?: Cast;
  seq?: number;
  href?: string;
  gate?: "deer-reign";
};

/** Stills stay. Motion is a loop on top of the same plate. */
export const PLATES: Plate[] = [
  { id: "remember", title: "the water remembers.", note: "well", src: "/beat01.jpg", motion: "/motion/well.mp4", cast: "well", seq: 1 },
  { id: "approach", title: "she comes to the water.", note: "same well", src: "/approach.jpg", motion: "/motion/approach.mp4", shelf: "later", cast: "well" },
  { id: "trace", title: "a trace, not a trophy.", note: "marks", src: "/beat02.jpg", motion: "/motion/trace.mp4", cast: "well", seq: 2 },
  { id: "notice", title: "she notices.", note: "gaze", src: "/beat03.jpg", motion: "/motion/gaze.mp4", choose: true, cast: "well", seq: 3 },
  { id: "beside", title: "beside, not ahead.", note: "path", src: "/beat04.jpg", motion: "/motion/beside.mp4", cast: "well", seq: 4 },
  { id: "crown", title: "a living crown.", note: "kept", src: "/beat05.jpg", motion: "/motion/crown.mp4", shelf: "later", cast: "well" },
  { id: "farther", title: "a little farther.", note: "reach", src: "/beat06.jpg", motion: "/motion/reach.mp4", cast: "well", seq: 5 },
  { id: "porch", title: "porch at dusk.", note: "lantern", src: "/porch.jpg", motion: "/motion/porch.mp4", cast: "porch", seq: 4 },
  { id: "lift", title: "the lantern finds her.", note: "porch, closer", src: "/porch-lift.jpg", motion: "/motion/lift.mp4", cast: "porch", seq: 5 },
  { id: "wait", title: "she waits.", note: "between rooms", src: "/wait.jpg", motion: "/motion/wait.mp4", cast: "porch", seq: 6 },
  { id: "stare", title: "pf stare.", note: "porch fight · face lock", src: "/stare.png", motion: "/motion/stare-wink.mp4", cast: "porch", seq: 4 },
  { id: "weather", title: "red rain.", note: "same well, other weather", src: "/weather.jpg", motion: "/motion/rain.mp4", cast: "rain" },
  { id: "reach", title: "a little farther.", note: "the well", src: "/farther-well.jpg", motion: "/motion/farther-well.mp4", cast: "well", seq: 6 },
  { id: "pink-forest", title: "pink forest.", note: "after the deer and the red reign", src: "/pink-forest.jpg", motion: "/motion/pink-forest.mp4", cast: "well", seq: 7, gate: "deer-reign" },
  { id: "reach-kept", title: "sae reach.", note: "kept · the words", src: "/sae-reach.jpg", motion: "/motion/wayhome.mp4", shelf: "later", cast: "well" },
  { id: "delve", title: "everdelve.", note: "weee · different stories, same world", src: "/everdelve.jpg", motion: "/motion/delve.mp4", shelf: "later" },
  { id: "study", title: "chrome study.", note: "kept · study", src: "/scene.jpg", shelf: "study" },
  { id: "ring", title: "porch ring.", note: "porch fight · ring", src: "/ring.png", motion: "/motion/ring.mp4", cast: "porch", seq: 7 },
  { id: "blossom", title: "a ring of blossoms.", note: "the ring, in the well’s paint", src: "/garden-ring.jpg", motion: "/motion/garden-ring.mp4", cast: "peach" },
  { id: "painted-porch", title: "she notices you.", note: "painted porch", src: "/garden-porch.jpg", motion: "/motion/porch-face.mp4", cast: "porch", seq: 2 },
  { id: "savannah", title: "purple.", note: "the cute stare", src: "/cute.jpg", motion: "/motion/cute.mp4", cast: "porch", seq: 1 },
  { id: "savannah-kept", title: "a painted savannah.", note: "kept", src: "/savannah.jpg", motion: "/motion/savannah.mp4", shelf: "later", cast: "porch" },
  { id: "violet", title: "purple, beside.", note: "the other stare", src: "/violet.jpg", srcPhone: "/violet-phone.jpg", motion: "/motion/violet.mp4", cast: "porch", seq: 3 },
  { id: "painted-stare", title: "the stare, painted.", note: "same face, garden", src: "/garden-stare.jpg", motion: "/motion/painted-stare.mp4", cast: "peach" },
  { id: "anna", title: "her, in pink.", note: "anna · peach fall", src: "/anna.jpg", motion: "/motion/anna.mp4", cast: "peach" },
  { id: "bambi", title: "peach fall.", note: "bambi · the stare, recast", src: "/bambi.jpg", motion: "/motion/wink.mp4", cast: "peach" },
  { id: "sisters", title: "say who. say hi.", note: "peach and red reign", src: "/sisters.jpg", motion: "/motion/sisters.mp4", cast: "peach" },
  { id: "recognition", title: "you came.", note: "gen 2", src: "/gen2.jpg", motion: "/motion/gen2.mp4", cast: "peach" },
  { id: "crossing", title: "another path.", note: "gen 4", src: "/gen4.jpg", motion: "/motion/gen4.mp4", cast: "peach" },
  { id: "further", title: "together, further.", note: "gen 22", src: "/gen22.jpg", motion: "/motion/gen22.mp4", cast: "peach" },
  { id: "kirby", title: "say kirby.", note: "saelion · anewgam", src: "/kirby.png", motion: "/motion/kirby.mp4", cast: "kirby", seq: 2, href: "https://anewgam-liqc.vercel.app" },
  { id: "loom", title: "the loom room.", note: "skins · the guardian · the door", src: "/loom.png", motion: "/motion/loom.mp4", cast: "kirby", seq: 1 },
];

export function platesIn(cast: Cast, pink = false) {
  return PLATES.flatMap((p, n) =>
    p.cast === cast && p.shelf !== "study" && p.shelf !== "later" && (!p.gate || pink) ? [{ n, seq: p.seq ?? 99 }] : [],
  )
    .sort((a, b) => a.seq - b.seq || a.n - b.n)
    .map((x) => x.n);
}
