const NEAR: Record<string, string[]> = {
  anna: ["anna", "pink", "hearth"],
  stare: ["stare", "face-lock", "face", "lock"],
  sister: ["sister", "blink"],
  well: ["well", "reign", "thea", "grotto", "depth", "water"],
  peach: ["peach", "bambi", "peachfall"],
  porch: ["porch", "savannah", "lantern", "fight"],
  deer: ["deer", "dear", "leaf-deer"],
  path: ["trace", "beat02", "path", "corridor", "door"],
  rain: ["rain", "horizon", "weather", "red"],
  mint: ["mint", "well", "grotto", "leaf", "garden", "green", "path"],
  copper: ["copper", "hearth", "porch", "lantern", "orange", "red", "reign"],
  winter: ["winter", "snow", "ice", "white", "night", "sky"],
  christmas: ["christmas", "winter", "snow", "porch", "hearth", "lantern", "red", "white", "green"],
  moscow: ["moscow", "winter", "snow", "night", "red", "white", "ice"],
  bliss: ["bliss", "sky", "field", "green", "garden", "home", "porchlight", "wayhome"],
  night: ["night", "violet", "purple", "sky", "grotto"],
  garden: ["garden", "leaf", "blossom", "pink-forest", "porch"],
  home: ["home", "hearth", "porch", "room", "wayhome"],
  house: ["house", "home", "hearth", "porch", "room", "well"],
  memory: ["memory", "remember", "well", "trace", "reign", "hearth"],
  door: ["door", "corridor", "porch", "threshold", "meet"],
  together: ["together", "sister", "peachfall-all", "meet", "beside"],
};

function clean(value: string): string {
  return value
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function conceptHit(value: string, key: string, tags: string[]): boolean {
  const hay = clean(value);
  return hay.includes(key) || tags.some((tag) => hay.includes(clean(tag)));
}

function conceptsFor(value: string): string[] {
  return Object.entries(NEAR)
    .filter(([key, tags]) => conceptHit(value, key, tags))
    .map(([key]) => key);
}

function words(value: string): string[] {
  return [...new Set(clean(value).split(/\s+/).filter((word) => word.length > 1))];
}

export function pictureScore(src: string, q: string): number {
  const query = clean(q);
  if (!query) return 1;

  const hay = clean(src);
  let score = 0;

  if (hay.includes(query)) score += 24;

  for (const word of words(query)) {
    if (hay.includes(word)) score += 7;
  }

  const queryConcepts = conceptsFor(query);
  const pictureConcepts = new Set(conceptsFor(hay));
  for (const concept of queryConcepts) {
    if (pictureConcepts.has(concept)) score += 5;
  }

  return score;
}

export function matchPicture(src: string, q: string): boolean {
  return pictureScore(src, q) > 0;
}

export function rankPictures<T extends string>(pictures: readonly T[], q: string): T[] {
  if (!q.trim()) return [...pictures];

  return pictures
    .map((src, index) => ({ src, index, score: pictureScore(src, q) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((item) => item.src);
}

export function relatedPictures<T extends string>(pictures: readonly T[], src: string, limit = 24): T[] {
  const seed = [...conceptsFor(src), ...words(src)].join(" ");
  const ranked = pictures
    .filter((candidate) => candidate !== src)
    .map((candidate, index) => ({ candidate, index, score: pictureScore(candidate, seed) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((item) => item.candidate);

  return ranked.slice(0, limit);
}

function hash(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mixPictures<T extends string>(pictures: readonly T[], q: string, seed = 0): T[] {
  const relevant = q.trim() ? rankPictures(pictures, q) : [...pictures];
  const pool = relevant.length ? relevant : [...pictures];

  return pool
    .map((src, index) => ({
      src,
      index,
      key: hash(`${src}:${q}:${seed}`),
    }))
    .sort((a, b) => a.key - b.key || a.index - b.index)
    .map((item) => item.src);
}
