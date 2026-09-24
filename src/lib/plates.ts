export type Cast = "porch" | "peach" | "rain" | "well";

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
};

/** Stills stay. Motion is a loop on top of the same plate. */
export const PLATES: Plate[] = [
  { id: "remember", title: "the water remembers.", note: "well", src: "/beat01.jpg", motion: "/motion/well.mp4", cast: "well" },
  { id: "approach", title: "she comes to the water.", note: "same well", src: "/approach.jpg", motion: "/motion/approach.mp4", shelf: "later", cast: "well" },
  { id: "trace", title: "a trace, not a trophy.", note: "marks", src: "/beat02.jpg", cast: "well" },
  { id: "notice", title: "she notices.", note: "gaze", src: "/beat03.jpg", motion: "/motion/gaze.mp4", choose: true, cast: "well" },
  { id: "beside", title: "beside, not ahead.", note: "path", src: "/beat04.jpg", cast: "well" },
  { id: "crown", title: "a living crown.", note: "kept", src: "/beat05.jpg", motion: "/motion/crown.mp4", shelf: "later", cast: "well" },
  { id: "farther", title: "a little farther.", note: "reach", src: "/beat06.jpg", motion: "/motion/reach.mp4", cast: "well" },
  { id: "porch", title: "porch at dusk.", note: "lantern", src: "/porch.jpg", motion: "/motion/porch.mp4", cast: "porch" },
  { id: "lift", title: "the lantern finds her.", note: "porch, closer", src: "/porch-lift.jpg", cast: "porch" },
  { id: "wait", title: "she waits.", note: "between rooms", src: "/wait.jpg", cast: "porch" },
  { id: "stare", title: "pf stare.", note: "porch fight · face lock", src: "/stare.png", motion: "/motion/stare-wink.mp4", cast: "porch" },
  { id: "weather", title: "red rain.", note: "same well, other weather", src: "/weather.jpg", motion: "/motion/rain.mp4", cast: "rain" },
  { id: "reach", title: "the way home stays open.", note: "sae reach", src: "/sae-reach.jpg", cast: "well" },
  { id: "delve", title: "everdelve.", note: "weee · different stories, same world", src: "/everdelve.jpg", motion: "/motion/delve.mp4", shelf: "later" },
  { id: "study", title: "chrome study.", note: "kept · study", src: "/scene.jpg", shelf: "study" },
  { id: "ring", title: "porch ring.", note: "porch fight · ring", src: "/ring.png", cast: "porch" },
  { id: "blossom", title: "a ring of blossoms.", note: "the ring, in the well’s paint", src: "/garden-ring.jpg", motion: "/motion/garden-ring.mp4", cast: "peach" },
  { id: "painted-porch", title: "she notices you.", note: "painted porch", src: "/garden-porch.jpg", motion: "/motion/porch-face.mp4", cast: "porch" },
  { id: "violet", title: "purple, beside.", note: "the other stare", src: "/violet.jpg", srcPhone: "/violet-phone.jpg", motion: "/motion/violet.mp4", cast: "porch" },
  { id: "painted-stare", title: "the stare, painted.", note: "same face, garden", src: "/garden-stare.jpg", cast: "peach" },
  { id: "anna", title: "her, in pink.", note: "anna · peach fall", src: "/anna.jpg", cast: "peach" },
  { id: "bambi", title: "peach fall.", note: "bambi · the stare, recast", src: "/bambi.jpg", motion: "/motion/wink.mp4", cast: "peach" },
  { id: "sisters", title: "say who. say hi.", note: "peach and red reign", src: "/sisters.jpg", cast: "peach" },
  { id: "recognition", title: "you came.", note: "gen 2", src: "/gen2.jpg", cast: "peach" },
  { id: "crossing", title: "another path.", note: "gen 4", src: "/gen4.jpg", cast: "peach" },
  { id: "further", title: "together, further.", note: "gen 22", src: "/gen22.jpg", cast: "peach" },
];

export function platesIn(cast: Cast) {
  return PLATES.flatMap((p, n) => (p.cast === cast && p.shelf !== "study" && p.shelf !== "later" ? [n] : []));
}
