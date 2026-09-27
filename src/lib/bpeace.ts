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
    { id: "beauty", word: "light", mark: "sun" },
    { id: "sun", word: "sun", mark: "sun" },
    { id: "light", word: "pale", mark: "feather" },
    { id: "dawn", word: "dawn", mark: "moon" },
    { id: "red", word: "red", mark: "heart" },
    { id: "black", word: "black", mark: "circle" },
    { id: "whole", word: "whole", mark: "sun" },
    { id: "obsidian", word: "way", mark: "feather" },
    { id: "reign", word: "reign", mark: "heart" },
    { id: "knight", word: "beside", mark: "feather" },
    { id: "glow", word: "glow", mark: "spark" },
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

export function peaceWord(id: string) {
  return BPEACE.film.find((beat) => beat.id === id)?.word ?? BPEACE.path.find((step) => step.id === id)?.word ?? "";
}

export function peaceMark(id: string): PeaceMark {
  return (BPEACE.film.find((beat) => beat.id === id)?.mark ??
    BPEACE.path.find((step) => step.id === id)?.mark ??
    "circle") as PeaceMark;
}
