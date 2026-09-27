/** sae://on#kk — Sae on. Fragment is a room, not a coin. */
export type SaeRoom =
  | "on"
  | "kk"
  | "kirby"
  | "loom"
  | "thea"
  | "dora"
  | "peach"
  | "reign"
  | "well"
  | "white"
  | "polylite";

export type SaeOn = {
  scheme: "sae";
  path: "on";
  room: SaeRoom;
  plate: string;
  way: string;
  live: boolean;
};

const ROOMS: Record<string, Omit<SaeOn, "scheme" | "path">> = {
  on: { room: "on", plate: "loom", way: "kirby", live: true },
  kk: { room: "kk", plate: "loom", way: "kirby", live: true },
  knight: { room: "kk", plate: "loom", way: "kirby", live: true },
  kirby: { room: "kirby", plate: "kirby", way: "kirby", live: true },
  loom: { room: "loom", plate: "loom", way: "kirby", live: true },
  thea: { room: "thea", plate: "depth-thea", way: "well", live: true },
  dora: { room: "dora", plate: "remember", way: "well", live: true },
  peach: { room: "peach", plate: "peachfall", way: "peach", live: true },
  reign: { room: "reign", plate: "weather", way: "rain", live: true },
  rain: { room: "reign", plate: "weather", way: "rain", live: true },
  well: { room: "well", plate: "remember", way: "well", live: true },
  white: { room: "white", plate: "blossom-white", way: "white", live: true },
  polylite: { room: "polylite", plate: "loom", way: "kirby", live: false },
};

export function parseSaeOn(raw: string): SaeOn {
  const src = String(raw || "").trim();
  const hash = src.includes("#") ? src.split("#").pop() || "on" : src;
  const key = hash.replace(/^\$/, "").toLowerCase();
  const hit = ROOMS[key] || ROOMS.on;
  return { scheme: "sae", path: "on", ...hit };
}

export function saeHref(room: SaeRoom = "kk") {
  return `sae://on#${room}`;
}
