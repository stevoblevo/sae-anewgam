import { bsGamma } from "@/lib/blackscholes";

const SEEN = "sae-seen";
const FAVES = "sae-faves";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function readSeen(): Record<string, number> {
  return readJson(SEEN, {});
}

export function markSeen(src: string): Record<string, number> {
  const all = readSeen();
  all[src] = (all[src] || 0) + 1;
  try {
    localStorage.setItem(SEEN, JSON.stringify(all));
  } catch {
    /* ignore */
  }
  return all;
}

const GAMMA = "sae-gamma";
const DECIDED = "sae-decided";
export const SAY_DO_AT = 3;

export function readGamma(): Record<string, number> {
  return readJson(GAMMA, {});
}

export function markGamma(src: string): Record<string, number> {
  const all = readGamma();
  all[src] = (all[src] || 0) + 1;
  try {
    localStorage.setItem(GAMMA, JSON.stringify(all));
    if (all[src] >= SAY_DO_AT && bsGamma(all[src], SAY_DO_AT, 30 / 365, 0.01, 0.45) > 0) {
      const decided = readDecided();
      if (!decided.includes(src)) localStorage.setItem(DECIDED, JSON.stringify([src, ...decided]));
    }
  } catch {
    /* ignore */
  }
  return all;
}

export function readDecided(): string[] {
  const list = readJson<string[]>(DECIDED, []);
  return Array.isArray(list) ? list : [];
}

export function sayDo(gamma: Record<string, number> = readGamma()): string[] {
  return Object.entries(gamma)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([src]) => src);
}

export function readFaves(): string[] {
  const list = readJson<string[]>(FAVES, []);
  return Array.isArray(list) ? list : [];
}

export function toggleFave(src: string): string[] {
  const list = readFaves();
  const next = list.includes(src) ? list.filter((item) => item !== src) : [src, ...list];
  try {
    localStorage.setItem(FAVES, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}

export function encodeHeat(counts: Record<string, number>): string {
  return Object.entries(counts)
    .filter(([, n]) => n > 0)
    .map(([src, n]) => `${encodeURIComponent(src)}:${n}`)
    .join(",");
}

export function decodeHeat(raw: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const part of raw.split(",")) {
    const cut = part.lastIndexOf(":");
    if (cut < 1) continue;
    const src = decodeURIComponent(part.slice(0, cut));
    const n = Number(part.slice(cut + 1));
    if (src.startsWith("/") && Number.isFinite(n) && n > 0) counts[src] = Math.min(99, Math.floor(n));
  }
  return counts;
}

export function shareHeat(counts: Record<string, number>, gamma?: Record<string, number>) {
  const heat = encodeHeat(counts);
  const extra = gamma && Object.keys(gamma).length ? `&gamma=${encodeURIComponent(encodeHeat(gamma))}` : "";
  const url = `${location.origin}/?heat=${encodeURIComponent(heat)}${extra}`;
  const text = "what I saw · @stevoblevo";
  window.open(
    `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    "_blank",
    "noopener",
  );
}
