/* Static-host adapter. Same eye as sae-wink.js. Never emits sae-wink.
   Readers only: they do not write saves, open cameras, or accept work.
   Polylite's counter is for a local reading. Do not mount this eye on that
   cockpit — Lumi is the companion, and that world stays local-only. */
const COUNTERS = {
  "peachfall-playable-v1"(data) {
    const gifts = data && data.gifts && typeof data.gifts === "object" ? data.gifts : null;
    if (!gifts) return 0;
    return Object.values(gifts).filter(Boolean).length;
  },
  "polylite-save-v0"(data) {
    if (!data || typeof data !== "object") return 0;
    const goals = Number(data.goals);
    const dreams = Number(data.dreams);
    const n = (Number.isFinite(goals) ? goals : 0) + (Number.isFinite(dreams) ? dreams : 0);
    return n > 0 ? n : 0;
  },
  // Steven cockpit app.js keeps threads whose source is a string. Blooms and receipts are not marks.
  "anewgam.steven.cockpit.v2"(data) {
    const threads = data && Array.isArray(data.threads) ? data.threads : null;
    if (!threads) return 0;
    return threads.filter((thread) => thread && typeof thread.source === "string").length;
  },
};

function clamp(count) {
  return Number.isSafeInteger(count) && count > 0 ? Math.min(count, 24) : 0;
}

export function countMarks(saveKey, data) {
  const count = COUNTERS[saveKey];
  if (!count) return 0;
  try {
    return clamp(count(data));
  } catch {
    return 0;
  }
}

export function mountSaeWink({ world = "peachfall", saveKey = "", bottom = "132px", composer = "" } = {}) {
  if (document.querySelector("sae-wink[data-root]")) return;
  const eye = document.createElement("sae-wink");
  eye.setAttribute("data-root", "");
  eye.setAttribute("world", world);
  if (bottom) eye.style.setProperty("--sae-wink-bottom", bottom);
  const marks = () => {
    if (!saveKey || !COUNTERS[saveKey]) {
      eye.setAttribute("mark-count", "0");
      return;
    }
    try {
      const raw = localStorage.getItem(saveKey);
      const data = raw ? JSON.parse(raw) : null;
      eye.setAttribute("mark-count", String(countMarks(saveKey, data)));
    } catch {
      eye.setAttribute("mark-count", "0");
    }
  };
  marks();
  window.addEventListener("storage", (event) => {
    if (event.key === saveKey) marks();
  });
  // Steven's cockpit already emits this after a local hold. It is not a receipt.
  if (saveKey === "anewgam.steven.cockpit.v2") {
    window.addEventListener("anewgam:state", marks);
  }
  const place = () => (document.fullscreenElement || document.body).appendChild(eye);
  place();
  document.addEventListener("fullscreenchange", place);
  if (composer) {
    eye.addEventListener("sae:chat-request", (event) => {
      const node = document.querySelector(composer);
      if (!(node instanceof HTMLElement)) return;
      event.preventDefault();
      if ("hidden" in node) node.hidden = false;
      node.focus();
    });
  }
}
