export type Aura = "rose" | "sol" | "mint" | "yarn" | "ice" | "night";

export type Beat = { id: string; src: string; clip?: string };

export const BEATS: Beat[] = [
  { id: "open", src: "/open.jpg", clip: "/open.mp4" },
  { id: "thea", src: "/beats/table.png", clip: "/table.mp4" },
  { id: "peachfall", src: "/beats/peachfall.jpg" },
  { id: "ember", src: "/beats/ember.jpg" },
  { id: "weather", src: "/beats/weather.jpg" },
  { id: "remember", src: "/beats/remember.jpg" },
  { id: "skein", src: "/beats/skein.png" },
  { id: "dora", src: "/beats/dora.jpg" },
  { id: "light", src: "/beats/light.png" },
  { id: "loom", src: "/beats/loom.jpg" },
  { id: "farther", src: "/beats/farther.jpg" },
  { id: "crossing", src: "/beats/crossing.jpg" },
  { id: "garden", src: "/beats/garden.png" },
  { id: "sanctuary", src: "/beats/sanctuary.png" },
  { id: "peach2", src: "/beats/peach2.webp" },
  { id: "mint", src: "/beats/mint.jpg" },
  { id: "blue", src: "/beats/blue.jpg" },
  { id: "green", src: "/beats/green.jpg" },
  { id: "obsidian", src: "/beats/obsidian.jpg" },
  { id: "dawn", src: "/beats/dawn.jpg" },
  { id: "redsun", src: "/beats/redsun.jpg" },
  { id: "bunbun", src: "/beats/sumer-bunbun.jpg" },
  { id: "hold", src: "/beats/hold.png" },
  { id: "mercury", src: "/beats/mercury.jpg" },
  { id: "moon", src: "/beats/moon.jpg" },
  { id: "europa", src: "/beats/europa.jpg", clip: "/europa.mp4" },
  { id: "pass", src: "/beats/pass.png" },
];

export const LOOK: Record<string, { aura: Aura; big?: boolean }> = {
  open: { aura: "night", big: true },
  thea: { aura: "night" },
  peachfall: { aura: "rose" },
  ember: { aura: "rose" },
  weather: { aura: "sol" },
  remember: { aura: "night" },
  skein: { aura: "yarn", big: true },
  dora: { aura: "rose", big: true },
  light: { aura: "rose", big: true },
  loom: { aura: "yarn", big: true },
  farther: { aura: "night" },
  crossing: { aura: "night" },
  garden: { aura: "rose" },
  sanctuary: { aura: "mint" },
  peach2: { aura: "rose" },
  mint: { aura: "mint" },
  blue: { aura: "mint" },
  green: { aura: "mint" },
  obsidian: { aura: "night" },
  dawn: { aura: "sol", big: true },
  redsun: { aura: "sol" },
  bunbun: { aura: "sol", big: true },
  hold: { aura: "rose", big: true },
  mercury: { aura: "ice" },
  moon: { aura: "ice" },
  europa: { aura: "ice", big: true },
};

export const PHOTOS = BEATS.filter((b) => b.id !== "pass");
export const OPEN_STILL = "/open.jpg";
export const OPEN_CLIP = "/open.mp4";
