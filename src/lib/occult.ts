export type Occult = {
  wink: boolean;
  blink: boolean;
  capture: boolean;
  faces: boolean;
};

export const OCCULT_OFF: Occult = { wink: false, blink: false, capture: false, faces: false };

const KEY = "sae-occult";

export function readOccult(): Occult {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "");
    return {
      wink: raw?.wink === true,
      blink: raw?.blink === true,
      capture: raw?.capture === true,
      faces: raw?.faces === true,
    };
  } catch {
    return { ...OCCULT_OFF };
  }
}

function paint(next: Occult) {
  const root = document.documentElement;
  root.dataset.wink = next.wink ? "1" : "0";
  root.dataset.blink = next.blink ? "1" : "0";
  root.dataset.capture = next.capture ? "1" : "0";
  root.dataset.faces = next.faces ? "1" : "0";
}

export function writeOccult(next: Occult) {
  localStorage.setItem(KEY, JSON.stringify(next));
  paint(next);
  window.dispatchEvent(new CustomEvent("sae-occult"));
}

export function applyOccult() {
  paint(readOccult());
}
