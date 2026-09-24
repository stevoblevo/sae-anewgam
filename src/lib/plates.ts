export type Plate = {
  id: string;
  title: string;
  note: string;
  src: string;
  motion?: string;
  shelf?: "world" | "study" | "later";
  choose?: boolean;
};

/** Stills stay. Motion is a loop on top of the same plate. */
export const PLATES: Plate[] = [
  { id: "remember", title: "the water remembers.", note: "well", src: "/beat01.jpg", motion: "/motion/well.mp4" },
  { id: "approach", title: "she comes to the water.", note: "same well", src: "/approach.jpg", motion: "/motion/approach.mp4", shelf: "later" },
  { id: "trace", title: "a trace, not a trophy.", note: "marks", src: "/beat02.jpg" },
  { id: "notice", title: "she notices.", note: "gaze", src: "/beat03.jpg", motion: "/motion/gaze.mp4", choose: true },
  { id: "beside", title: "beside, not ahead.", note: "path", src: "/beat04.jpg" },
  { id: "crown", title: "a living crown.", note: "kept", src: "/beat05.jpg", motion: "/motion/crown.mp4", shelf: "later" },
  { id: "farther", title: "a little farther.", note: "reach", src: "/beat06.jpg", motion: "/motion/reach.mp4" },
  { id: "porch", title: "porch at dusk.", note: "lantern", src: "/porch.jpg", motion: "/motion/porch.mp4" },
  { id: "lift", title: "the lantern finds her.", note: "porch, closer", src: "/porch-lift.jpg" },
  { id: "wait", title: "she waits.", note: "between rooms", src: "/wait.jpg" },
  { id: "stare", title: "pf stare.", note: "porch fight · face lock", src: "/stare.png", motion: "/motion/stare.mp4" },
  { id: "weather", title: "red rain.", note: "same well, other weather", src: "/weather.jpg", motion: "/motion/rain.mp4" },
  { id: "reach", title: "the way home stays open.", note: "sae reach", src: "/sae-reach.jpg" },
  { id: "delve", title: "everdelve.", note: "weee · different stories, same world", src: "/everdelve.jpg", motion: "/motion/delve.mp4", shelf: "later" },
  { id: "study", title: "chrome study.", note: "kept · study", src: "/scene.jpg", shelf: "study" },
  { id: "ring", title: "porch ring.", note: "porch fight · ring", src: "/ring.png" },
  { id: "blossom", title: "a ring of blossoms.", note: "the ring, in the well’s paint", src: "/garden-ring.jpg", motion: "/motion/garden-ring.mp4" },
  { id: "painted-porch", title: "the porch, painted.", note: "same dusk, garden", src: "/garden-porch.jpg" },
  { id: "painted-stare", title: "the stare, painted.", note: "same face, garden", src: "/garden-stare.jpg" },
  { id: "anna", title: "her, in pink.", note: "anna · peach fall", src: "/anna.jpg" },
  { id: "bambi", title: "peach fall.", note: "bambi · the stare, recast", src: "/bambi.jpg", motion: "/motion/peach.mp4" },
];