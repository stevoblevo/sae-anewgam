const NEAR: Record<string, string[]> = {
  anna: ["anna", "pink", "hearth"],
  stare: ["stare", "face-lock", "face", "lock"],
  sister: ["sister", "blink"],
  well: ["well", "reign", "thea", "grotto", "depth"],
  peach: ["peach", "bambi", "peachfall"],
  porch: ["porch", "savannah"],
  deer: ["deer", "dear", "leaf-deer"],
  path: ["trace", "beat02", "path"],
  rain: ["rain", "horizon", "weather", "red"],
};

export function matchPicture(src: string, q: string): boolean {
  const query = q.trim().toLowerCase();
  if (!query) return true;
  const hay = src.toLowerCase();
  if (hay.includes(query)) return true;
  return Object.entries(NEAR).some(([key, tags]) => {
    const hit = query.includes(key) || tags.some((tag) => query.includes(tag));
    const there = hay.includes(key) || tags.some((tag) => hay.includes(tag));
    return hit && there;
  });
}
