export type Frame = "stage" | "float";

export type ModuleId = "reel" | "drive" | "rover" | "wall";

export type Module = {
  id: ModuleId;
  name: string;
  frame: Frame;
  line: string;
};

/** Claude frame. Stage owns the picture. Float never stops the walk. */
export const MODULES: Module[] = [
  { id: "reel", name: "Everfallen", frame: "stage", line: "The site plays itself. Or the game does." },
  { id: "drive", name: "The drive", frame: "stage", line: "Nine rooms. The peach dot is Europa." },
  { id: "rover", name: "The rover", frame: "float", line: "A sim. The garden keeps walking." },
  { id: "wall", name: "The wall", frame: "stage", line: "Every plate, up close." },
];
