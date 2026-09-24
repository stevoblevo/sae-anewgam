export type Dir = "north" | "south" | "east" | "west";

export type RoomId = "porch" | "ring" | "stairs" | "well" | "rain" | "path" | "forest" | "white" | "loom";

export type TaleState = {
  room: RoomId;
  inv: string[];
  rain: boolean;
  deer: boolean;
  ring: boolean;
  it: string | null;
};

type Room = {
  name: string;
  text: string;
  art: string;
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
    art: "/garden-porch.jpg",
    exits: { east: "ring", north: "stairs", west: "loom" },
    items: ["lantern"],
  },
  ring: {
    name: "the red ring",
    text: "A ring of boards under red lantern light. She is still on her feet. This is the minute before, not the minute after. Nobody else has stepped in.",
    art: "/ring.png",
    exits: { west: "porch" },
    items: [],
  },
  stairs: {
    name: "the painted stairs",
    text: "The stairs are painted like a garden. A single leaf has settled on a step. Up is the well. Down is the porch.",
    art: "/garden-stare.jpg",
    exits: { north: "well", south: "porch" },
    items: ["leaf"],
  },
  well: {
    name: "the well",
    text: "The water remembers. It does not speak. West is other weather. East is a white mark on the ground.",
    art: "/beat01.jpg",
    exits: { south: "stairs", west: "rain", east: "white" },
    items: [],
  },
  rain: {
    name: "red rain",
    text: "The same well, other weather. She stands in the red rain. The red is the weather, not a fall. North, something is waiting beside the path.",
    art: "/weather.jpg",
    exits: { east: "well", north: "path" },
    items: [],
  },
  path: {
    name: "beside",
    text: "A deer stands beside you, not ahead. It is not a mascot. The way goes north, but only if the rain has already touched you.",
    art: "/farther-well.jpg",
    exits: { south: "rain", north: "forest" },
    items: [],
  },
  forest: {
    name: "pink forest",
    text: "Pink is for rest. The path is gold at the edges and quiet in the middle. You can stay.",
    art: "/pink-forest.jpg",
    exits: { south: "path" },
    items: [],
  },
  white: {
    name: "the white ring",
    text: "One pale circle on the ground. No flowers. No words. The well is west.",
    art: "/blossom-mark.jpg",
    exits: { west: "well" },
    items: [],
  },
  loom: {
    name: "the loom room",
    text: "Skins on the wall. A small guardian at the work. The doorway here does not lead back into the rain. It leads out.",
    art: "/loom.png",
    exits: { east: "porch" },
    items: [],
  },
};

export const START: TaleState = { room: "porch", inv: [], rain: false, deer: false, ring: false, it: null };

function roomOf(state: TaleState): Room {
  return ROOMS[state.room];
}

function enter(state: TaleState, id: RoomId): { state: TaleState; lines: string[] } {
  const next = { ...state, room: id };
  if (id === "rain") next.rain = true;
  if (id === "path") next.deer = true;
  if (id === "ring") next.ring = true;
  return { state: next, lines: blurb(next) };
}

function blurb(state: TaleState): string[] {
  const room = ROOMS[state.room];
  if (state.room === "well" && state.ring) {
    return ["the well", "She followed the fight here, and the anger did not. She is crying into the well. The water takes it."];
  }
  return [room.name, room.text];
}

const SCENERY: { names: string[]; rooms: RoomId[]; look: string }[] = [
  { names: ["she", "her", "girl"], rooms: ["well"], look: "She is crying into the well. She is not angry. The fight stayed on the porch." },
  { names: ["she", "her", "girl"], rooms: ["porch", "ring", "rain"], look: "She notices you. She does not perform. On the porch she is still. In the ring she is getting ready. In the rain the red is the weather." },
  { names: ["door", "doorway"], rooms: ["porch", "loom"], look: "A door. On the porch it stays shut. In the loom room it leads out of this story." },
  { names: ["boards", "floor"], rooms: ["porch", "ring"], look: "The boards are dry. Nobody has been put down on them." },
  { names: ["water", "well"], rooms: ["well"], look: "The water remembers. It does not give the memory back in words." },
  { names: ["deer"], rooms: ["path"], look: "Beside you, not ahead. Not a mascot." },
  { names: ["rain", "weather", "coat"], rooms: ["rain"], look: "Red rain. The same place, other weather." },
  { names: ["mark", "circle"], rooms: ["white"], look: "One pale circle. It is a way of saying the ring without painting the flowers." },
  { names: ["guardian", "loom"], rooms: ["loom"], look: "The guardian keeps at the work. The work is the welcome." },
  { names: ["stairs", "step", "garden"], rooms: ["stairs"], look: "Painted stairs. The garden is the paint, not a second world." },
];

function bare(noun: string): string {
  return noun.replace(/^(at|to|the|a|an|my)\s+/, "").replace(/^(at|to|the|a|an)\s+/, "").trim();
}

function ways(state: TaleState): string[] {
  const list = exits(state);
  if (!list.length) return ["No way on from here."];
  return [`The ways are ${list.join(", ")}.`];
}

function named(noun: string): { kind: "item" | "scenery"; id: string; look: string } | null {
  const item = Object.keys(ITEMS).find((id) => ITEMS[id].name === noun || id === noun);
  if (item) return { kind: "item", id: item, look: ITEMS[item].look };
  return null;
}

function see(state: TaleState, noun: string): { look: string; it: string } | null {
  const word = bare(noun);
  if (!word || word === "it") {
    if (!state.it) return null;
    return see(state, state.it);
  }
  const item = named(word);
  if (item && (state.inv.includes(item.id) || (roomOf(state).items.includes(item.id) && !state.inv.includes(item.id)))) {
    return { look: item.look, it: item.id };
  }
  const scene = SCENERY.find((entry) => entry.names.includes(word) && entry.rooms.includes(state.room));
  if (scene) return { look: scene.look, it: word };
  return null;
}

export function roomArt(state: TaleState): string {
  if (state.room === "well" && state.ring) return "/well-cry.jpg";
  return ROOMS[state.room].art;
}

export function look(state: TaleState): string[] {
  const room = roomOf(state);
  const here = room.items.filter((id) => !state.inv.includes(id));
  const lines = blurb(state);
  if (here.length) lines.push(`You could take the ${here.map((id) => ITEMS[id].name).join(", ")}.`);
  lines.push(...ways(state));
  return lines;
}

export function act(state: TaleState, raw: string): { state: TaleState; lines: string[] } {
  const input = raw.trim().toLowerCase().replace(/[.!?]/g, "").replace(/\s+/g, " ");
  if (!input) return { state, lines: [] };

  if (/^(what|where|which)( is| are|'s|s)?( the)? (way|ways|exit|exits|direction)/.test(input) || input === "where" || input === "ways" || input === "way") {
    return { state, lines: ways(state) };
  }
  if (/^who\b/.test(input)) {
    const seen = see(state, "she");
    return { state: seen ? { ...state, it: seen.it } : state, lines: seen ? [seen.look] : ["No one else is here."] };
  }

  const [verb, ...rest] = input.split(" ");
  const noun = bare(rest.join(" "));

  if (["help", "?"].includes(verb)) {
    return { state, lines: ["Ask where. Look at what is named. Go by the ways. Take what is offered. Talk."] };
  }
  if (["look", "l", "examine", "x", "read", "inspect"].includes(verb)) {
    if (!noun || noun === "around" || noun === "room") return { state, lines: look(state) };
    const seen = see(state, noun);
    if (!seen) return { state, lines: [`You don't see ${noun} from here. ${ways(state)[0]}`] };
    return { state: { ...state, it: seen.it }, lines: [seen.look] };
  }
  if (["inventory", "i", "inv", "carry"].includes(verb)) {
    return { state, lines: [state.inv.length ? `You carry the ${state.inv.map((id) => ITEMS[id].name).join(" and the ")}.` : "Your hands are empty."] };
  }
  if (["talk", "speak", "ask", "greet"].includes(verb)) {
    if (state.room === "well" && state.ring) return { state, lines: ["She doesn't answer. The tears do. The fight stayed on the porch."] };
    if (state.room === "porch") return { state, lines: ["She does not answer. She notices you. That is the greeting."] };
    if (state.room === "path") return { state, lines: ["The deer stays beside you. It does not lead."] };
    if (state.room === "ring") return { state, lines: ["She is getting ready. If she loses, the story changes. It has not changed yet."] };
    if (state.room === "forest") return { state, lines: ["Nothing here needs a name. Rest is the whole sentence."] };
    if (state.room === "loom") return { state, lines: ["The guardian does not look up. The work is the welcome."] };
    if (state.room === "rain") return { state, lines: ["She doesn't turn. The rain is doing the talking."] };
    return { state, lines: ["No one answers."] };
  }
  if (["take", "get", "pick"].includes(verb)) {
    const word = bare(noun.replace(/^up\s+/, ""));
    if (!word) return { state, lines: ["Take what?"] };
    const item = named(word);
    const room = roomOf(state);
    if (!item || !room.items.includes(item.id) || state.inv.includes(item.id)) {
      const scene = SCENERY.find((entry) => entry.names.includes(word) && entry.rooms.includes(state.room));
      if (scene) return { state, lines: [`The ${word} stays. It is part of the place.`] };
      return { state, lines: [`There is no ${word} here to take.`] };
    }
    return { state: { ...state, inv: [...state.inv, item.id], it: item.id }, lines: [`You take the ${ITEMS[item.id].name}.`] };
  }
  if (verb === "drop") {
    if (!noun) return { state, lines: ["Drop what?"] };
    const item = named(bare(noun));
    if (!item || !state.inv.includes(item.id)) return { state, lines: [`You are not carrying ${noun}.`] };
    return { state: { ...state, inv: state.inv.filter((key) => key !== item.id) }, lines: [`You set the ${ITEMS[item.id].name} down.`] };
  }
  if (verb === "wait" || verb === "z") return { state, lines: ["You wait. The place does not hurry."] };

  const dirWord = ["north", "south", "east", "west", "n", "s", "e", "w", "up", "down"].includes(verb)
    ? verb
    : ["go", "walk", "head", "enter"].includes(verb)
      ? noun.split(" ")[0]
      : "";
  const full: Dir | "up" | "down" | null =
    dirWord === "n" || dirWord === "north" || dirWord === "up"
      ? dirWord === "up"
        ? "up"
        : "north"
      : dirWord === "s" || dirWord === "south" || dirWord === "down"
        ? dirWord === "down"
          ? "down"
          : "south"
        : dirWord === "e" || dirWord === "east"
          ? "east"
          : dirWord === "w" || dirWord === "west"
            ? "west"
            : null;
  if (full) {
    const mapped: Dir | null = full === "up" ? (state.room === "stairs" ? "north" : null) : full === "down" ? (state.room === "stairs" ? "south" : null) : full;
    if (!mapped) return { state, lines: [`No way ${full}. ${ways(state)[0]}`] };
    const next = roomOf(state).exits[mapped];
    if (!next) return { state, lines: [`No way ${mapped}. ${ways(state)[0]}`] };
    if (next === "forest" && !(state.rain && state.deer)) {
      return { state, lines: ["The pink forest is there, and it does not open. The rain has to touch you, and the deer has to stand beside you."] };
    }
    const moved = enter(state, next);
    if (next === "forest") moved.lines.push("You may rest.");
    return moved;
  }

  return { state, lines: [`That isn't a way. ${ways(state)[0]}`] };
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
