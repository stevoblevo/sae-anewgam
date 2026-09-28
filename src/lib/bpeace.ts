/**
 * Checkpoint bpeace.
 * Riff from here. The pictures stay still until a hand moves them.
 * Few words. The marks are only for the way.
 */
export const BPEACE = {
  id: "bpeace",
  saved: "sae-bpeace",
  story: "A kinder way. The red sister is lively. The porch is a pillow fight.",
  film: [
    { id: "door", word: "door", mark: "door", line: "A door is a question. The face match comes later." },
    { id: "beauty", word: "light", mark: "sun", line: "She is the light." },
    { id: "sun", word: "sun", mark: "sun", line: "The sun is behind her." },
    { id: "light", word: "pale", mark: "feather", line: "She goes into the light." },
    { id: "dawn", word: "dawn", mark: "moon", line: "Dark dawn. The moon comes up." },
    { id: "spectral", word: "spectral", mark: "sun", line: "The red Sae, in spectral light." },
    { id: "red", word: "red", mark: "heart", line: "The red is hers." },
    { id: "black", word: "black", mark: "circle", line: "The black holds the way." },
    { id: "whole", word: "whole", mark: "sun", line: "All the sun, at once." },
    { id: "obsidian", word: "way", mark: "feather", line: "A way through the dark." },
    { id: "reign", word: "reign", mark: "heart", line: "The red stays. Not a reign." },
    { id: "knight", word: "beside", mark: "feather", line: "He stays beside her." },
    { id: "glow", word: "glow", mark: "spark", line: "The last light is a door." },
    { id: "pane", word: "sun", mark: "sun", line: "" },
  ],
  path: [
    { id: "door", word: "begin", mark: "door" },
    { id: "peachfall", word: "lively", mark: "heart" },
    { id: "forest", word: "trees", mark: "feather" },
    { id: "noctalia", word: "dreams", mark: "moon" },
    { id: "grotto", word: "depths", mark: "circle" },
    { id: "beyond", word: "light", mark: "sun" },
  ],
} as const;

export type PeaceMark = (typeof BPEACE.film)[number]["mark"] | (typeof BPEACE.path)[number]["mark"];

export function peaceLine(id: string) {
  return BPEACE.film.find((beat) => beat.id === id)?.line ?? BPEACE.story;
}

export function peaceWord(id: string) {
  return BPEACE.film.find((beat) => beat.id === id)?.word ?? BPEACE.path.find((step) => step.id === id)?.word ?? "";
}

export function peaceMark(id: string): PeaceMark {
  return (BPEACE.film.find((beat) => beat.id === id)?.mark ??
    BPEACE.path.find((step) => step.id === id)?.mark ??
    "circle") as PeaceMark;
}
