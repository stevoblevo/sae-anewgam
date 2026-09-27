/** 4gg.tim is the shared clock. still / side / rise / group / pass. */
export const TIM_LINES = ["still", "side", "rise", "group", "pass"] as const;
export type TimLine = (typeof TIM_LINES)[number];

export const TIM = {
  version: "4gg.tim",
  seconds: 4.2,
  ms: 4200,
  still: 4.2,
  side: 4.2,
  rise: 4.2,
  group: 4.2,
  pass: 4.2,
} as const;

export function parseTim(text: string) {
  const next = { ...TIM, seconds: TIM.seconds, ms: TIM.ms };
  for (const raw of String(text || "").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const [name, value] = line.split(/\s+/);
    const key = name as TimLine;
    const n = Number(value);
    if (TIM_LINES.includes(key) && Number.isFinite(n) && n > 0) {
      (next as { [k in TimLine]: number })[key] = n;
    }
  }
  next.seconds = next.still;
  next.ms = Math.round(next.still * 1000);
  return next;
}

export async function loadTim(url = "/4gg.tim") {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return TIM;
    return parseTim(await res.text());
  } catch {
    return TIM;
  }
}
