/** The kinder path. One order satisfies every law. Nothing here moves by itself. */
export const PATH = [
  { id: "door", name: "Door", src: "/sae-do.jpg", color: "#e7c27a" },
  { id: "peachfall", name: "Sister", src: "/pillow-fight.jpg", color: "#e25b4a" },
  { id: "forest", name: "Forest", src: "/pink-forest.jpg", color: "#2f6b45" },
  { id: "noctalia", name: "Noctalia", src: "/moonrise.jpg", color: "#2c3344" },
  { id: "grotto", name: "Grotto", src: "/depth-grotto.jpg", color: "#16332e" },
  { id: "beyond", name: "Beyond", src: "/glow.jpg", color: "#f3d7a1" },
] as const;

export const LAWS = [
  "The door is first.",
  "The red sister is before the trees.",
  "Dreams are the next step after the trees.",
  "Dreams do not touch the last light.",
  "The depths are the step before the last light.",
  "The last light is last.",
] as const;

export type PathId = (typeof PATH)[number]["id"];

export function readPath(order: readonly string[]): { done: boolean; fault: number | null } {
  if (order.length !== PATH.length || order.some((id) => !id)) return { done: false, fault: null };
  const at = (id: string) => order.indexOf(id);
  const laws = [
    order[0] === "door",
    at("peachfall") < at("forest"),
    at("noctalia") === at("forest") + 1,
    at("noctalia") + 1 !== at("beyond"),
    at("grotto") === at("beyond") - 1,
    order[order.length - 1] === "beyond",
  ];
  const fault = laws.findIndex((ok) => !ok);
  return { done: fault < 0, fault: fault < 0 ? null : fault };
}
