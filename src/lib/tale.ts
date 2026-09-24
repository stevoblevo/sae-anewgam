export type Dir = "north" | "south" | "east" | "west";

export type RoomId = "porch" | "ring" | "stairs" | "well" | "rain" | "path" | "forest" | "white" | "loom";

export type TaleState = {
  room: RoomId;
  inv: string[];
  rain: boolean;
  deer: boolean;
};

type Room = {
  name: string;
  text: string;
  exits: Partial<Record<Dir, RoomId>>;
  items: string[];
};

const OPPOSITE: Record<Dir, Dir> = {
  north: "south",
  south: "north",
  east: "west",
  west: "east",
};

export const DIRS: Dir[] = ["north", "south", "east", "west"];

const ITEMS: Record<string, { name: string; look: string }> = {
  lantern: { name: "lantern", look: "It is already lit. The light is the same red as the porch." },
  leaf: { name: "leaf", look: "One pale leaf. Not a trophy." },
};

const ROOMS: Record<RoomId, Room> = {
  porch: {
    name: "the painted porch",
    text: "Dusk. She is on the porch, and she notices you. A lantern hangs by the door. The boards are warm.",
    exits: { east: "ring", north: "stairs", west: "loom" },
    items: ["lantern"],
  },
  ring: {
    name: "the red ring",
    text: "A ring of boards under red lantern light. She is still on her feet. This is the minute before, not the minute after. Nobody else has stepped in.",
    exits: { west: "porch" },
    items: [],
  },
  stairs: {
    name: "the painted stairs",
    text: "The stairs are painted like a garden. A single leaf has settled on a step. Up is the well. Down is the porch.",
    exits: { north: "well", south: "porch" },
    items: ["leaf"],
  },
  well: {
    name: "the well",
    text: "The water remembers. It does not speak. West is other weather. East is a white mark on the ground.",
    exits: { south: "stairs", west: "rain", east: "white" },
    items: [],
  },
  rain: {
    name: "red rain",
    text: "The same well, other weather. She stands in the red rain. The red is the weather, not a fall. North, something is waiting beside the path.",
    exits: { east: "well", north: "path" },
    items: [],
  },
  path: {
    name: "beside",
    text: "A deer stands beside you, not ahead. It is not a mascot. The way goes north, but only if the rain has already touched you.",
    exits: { south: "rain", north: "forest" },
    items: [],
  },
  forest: {
    name: "pink forest",
    text: "Pink is for rest. The path is gold at the edges and quiet in the middle. You can stay.",
    exits: { south: "path" },
    items: [],
  },
  white: {
    name: "the white ring",
    text: "One pale circle on the ground. No flowers. No words. The well is west.",
    exits: { west: "well" },
    items: [],
  },
  loom: {
    name: "the loom room",
    text: "Skins on the wall. A small guardian at the work. The doorway here does not lead back into the rain. It leads out.",
    exits: { east: "porch" },
    items: [],
  },
};

export const START: TaleState = { room: "porch", inv: [], rain: false, deer: false };

function roomOf(state: TaleState): Room {
  return ROOMS[state.room];
}

function enter(state: TaleState, id: RoomId): { state: TaleState; lines: string[] } {
  const next = { ...state, room: id };
  if (id === "rain") next.rain = true;
  if (id === "path") next.deer = true;
  const room = ROOMS[id];
  return { state: next, lines: [room.name, room.text] };
}

export function look(state: TaleState): string[] {
  const room = roomOf(state);
  const here = room.items.filter((id) => !state.inv.includes(id));
  const exits = Object.keys(room.exits);
  const lines = [room.name, room.text];
  if (here.length) lines.push(`Here: ${here.map((id) => ITEMS[id].name).join(", ")}.`);
  lines.push(exits.length ? `Ways: ${exits.join(", ")}.` : "No way on.");
  return lines;
}

export function act(state: TaleState, raw: string): { state: TaleState; lines: string[] } {
  const input = raw.trim().toLowerCase().replace(/[.!?]/g, "");
  if (!input) return { state, lines: [] };
  const [verb, ...rest] = input.split(/\s+/);
  const noun = rest.join(" ");

  if (verb === "help" || verb === "?") {
    return {
      state,
      lines: ["look. go north, south, east, west. take. drop. talk. inventory. The short words n s e w work too."],
    };
  }
  if (verb === "look" || verb === "l") {
    if (!noun) return { state, lines: look(state) };
    const held = state.inv.find((id) => ITEMS[id].name === noun);
    if (held) return { state, lines: [ITEMS[held].look] };
    const room = roomOf(state);
    if (room.items.includes(noun) && ITEMS[noun]) return { state, lines: [ITEMS[noun].look] };
    return { state, lines: [`You do not see ${noun}.`] };
  }
  if (verb === "inventory" || verb === "i" || verb === "inv") {
    return { state, lines: [state.inv.length ? `You carry ${state.inv.map((id) => ITEMS[id].name).join(", ")}.` : "You carry nothing."] };
  }
  if (verb === "talk" || verb === "speak") {
    if (state.room === "porch") return { state, lines: ["She does not answer. She notices you. That is the greeting."] };
    if (state.room === "path") return { state, lines: ["The deer stays beside you. It does not lead."] };
    if (state.room === "ring") return { state, lines: ["She is getting ready. If she loses, the story changes. It has not changed yet."] };
    if (state.room === "forest") return { state, lines: ["Nothing here needs a name. Rest is the whole sentence."] };
    if (state.room === "loom") return { state, lines: ["The guardian does not look up. The work is the welcome."] };
    return { state, lines: ["No one answers."] };
  }
  if (verb === "take" || verb === "get") {
    if (!noun) return { state, lines: ["Take what?"] };
    const room = roomOf(state);
    const id = Object.keys(ITEMS).find((key) => ITEMS[key].name === noun);
    if (!id || !room.items.includes(id) || state.inv.includes(id)) return { state, lines: [`There is no ${noun} to take.`] };
    return { state: { ...state, inv: [...state.inv, id] }, lines: [`You take the ${ITEMS[id].name}.`] };
  }
  if (verb === "drop") {
    if (!noun) return { state, lines: ["Drop what?"] };
    const id = state.inv.find((key) => ITEMS[key].name === noun);
    if (!id) return { state, lines: [`You are not carrying ${noun}.`] };
    return { state: { ...state, inv: state.inv.filter((key) => key !== id) }, lines: [`You set the ${ITEMS[id].name} down.`] };
  }
  if (verb === "wait" || verb === "z") {
    return { state, lines: ["You wait. The place does not hurry."] };
  }

  const dir = (["north", "south", "east", "west", "n", "s", "e", "w"].includes(verb) ? verb : verb === "go" ? noun : "") as string;
  const full: Dir | null =
    dir === "n" || dir === "north" ? "north" : dir === "s" || dir === "south" ? "south" : dir === "e" || dir === "east" ? "east" : dir === "w" || dir === "west" ? "west" : null;
  if (full) {
    const room = roomOf(state);
    const next = room.exits[full];
    if (!next) return { state, lines: [`No way ${full}.`] };
    if (next === "forest" && !(state.rain && state.deer)) {
      return { state, lines: ["The pink forest is there, and it does not open. The rain has to touch you, and the deer has to stand beside you."] };
    }
    const moved = enter(state, next);
    if (next === "forest") moved.lines.push("You may rest.");
    return moved;
  }

  if (verb === "out" && state.room === "loom") {
    return { state, lines: ["The door is real, and it leaves this page. The porch is east if you would rather stay."] };
  }

  return { state, lines: ["That does nothing. Try help."] };
}

export function roomName(state: TaleState): string {
  return ROOMS[state.room].name;
}

export function exits(state: TaleState): Dir[] {
  return DIRS.filter((dir) => {
    const next = ROOMS[state.room].exits[dir];
    return Boolean(next);
  });
}

export { OPPOSITE };
