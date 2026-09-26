export type Sign = { axis: "side" | "rise"; dir: 1 | -1; t: number };

const KEY = "sae-flow";
const MAX = 24;

function read(): Sign[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]") as Sign[];
    return Array.isArray(raw) ? raw.filter((sign) => sign && (sign.axis === "side" || sign.axis === "rise")) : [];
  } catch {
    return [];
  }
}

function write(signs: Sign[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(signs));
  } catch {
    /* the line can be forgotten; the page still moves */
  }
  window.dispatchEvent(new CustomEvent("sae-flow"));
}

export function readFlow(): Sign[] {
  return read();
}

export function pushSign(axis: Sign["axis"], dir: 1 | -1): Sign[] {
  const next = [...read(), { axis, dir, t: Date.now() }].slice(-MAX);
  write(next);
  return next;
}

export function rollFlow(): Sign[] {
  const next = read().slice(0, -1);
  write(next);
  return next;
}

export type Thread = { id: number; from: number; axis: Sign["axis"] };

export function colonize(signs: Sign[]): Thread[] {
  return signs.map((sign, i) => ({ id: i, from: Math.max(0, i - 1), axis: sign.axis }));
}
