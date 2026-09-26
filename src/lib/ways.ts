import type { Cast } from "@/lib/plates";

/** Saved ways to play. Each one starts at a plate we already made. */
export const WAYS: { id: string; name: string; cast: Cast; start: string; color: string }[] = [
  { id: "porch", name: "porch", cast: "porch", start: "savannah", color: "#c9a0c0" },
  { id: "peach", name: "peach", cast: "peach", start: "anna", color: "#f3b183" },
  { id: "well", name: "well", cast: "well", start: "remember", color: "#9ecfb8" },
  { id: "rain", name: "rain", cast: "rain", start: "weather", color: "#e25b4a" },
  { id: "kirby", name: "kirby", cast: "kirby", start: "loom", color: "#2a2418" },
  { id: "white", name: "white", cast: "white", start: "blossom-white", color: "#f7f4ee" },
];
