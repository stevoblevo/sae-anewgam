import type { Cast } from "@/lib/plates";

/** Saved ways to play. Each one starts at a plate we already made. */
export const WAYS: { id: string; name: string; cast: Cast; start: string }[] = [
  { id: "porch", name: "porch", cast: "porch", start: "savannah" },
  { id: "peach", name: "peach", cast: "peach", start: "anna" },
  { id: "well", name: "well", cast: "well", start: "remember" },
  { id: "rain", name: "rain", cast: "rain", start: "weather" },
  { id: "kirby", name: "kirby", cast: "kirby", start: "loom" },
];
