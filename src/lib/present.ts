/**
 * Still plates. The fade is the only motion.
 * beauty, sun, light, dark dawn, red, black,
 * the whole sun, obsidian, red reign, the knight, glow.
 */
export const PRESENT = [
  { id: "beauty", src: "/enlight-way.jpg", color: "#f3d7c4", high: "/beauty-sun.jpg", low: "/pale-light.jpg" },
  { id: "sun", src: "/beauty-sun.jpg", color: "#e7c27a", high: "/whole-sun.jpg", low: "/pale-light.jpg" },
  { id: "light", src: "/pale-light.jpg", color: "#f6efe2", high: "/beauty-sun.jpg", low: "/moonrise.jpg" },
  { id: "dawn", src: "/moonrise.jpg", color: "#2c3344", high: "/pale-light.jpg", low: "/black-field.jpg" },
  { id: "red", src: "/red-horizon.jpg", color: "#8a3a32", high: "/reign-well.jpg", low: "/black-field.jpg" },
  { id: "black", src: "/black-field.jpg", color: "#141210", high: "/red-horizon.jpg", low: "/obsidian-way.jpg" },
  { id: "whole", src: "/whole-sun.jpg", color: "#f0d48a", high: "/beauty-sun.jpg", low: "/glow.jpg" },
  { id: "obsidian", src: "/obsidian-way.jpg", color: "#8fd0c8", high: "/whole-sun.jpg", low: "/black-field.jpg" },
  { id: "reign", src: "/reign-well.jpg", color: "#6e2a28", high: "/red-horizon.jpg", low: "/knight-beside.jpg" },
  { id: "knight", src: "/knight-beside.jpg", color: "#c4a07a", high: "/glow.jpg", low: "/reign-well.jpg" },
  { id: "glow", src: "/glow.jpg", color: "#f3d7a1", high: "/whole-sun.jpg", low: "/knight-beside.jpg" },
] as const;

export const PRESENT_SRC = PRESENT.map((beat) => beat.src);
