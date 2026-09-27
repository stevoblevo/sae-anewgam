/** One doll, many ways to hold her. Daylight is the fallback. */
export const FORMS = [
  { id: "daylight", name: "daylight", falls: "daylight" },
  { id: "laptop43", name: "4:3", falls: "daylight" },
  { id: "netbook", name: "netbook", falls: "laptop43" },
  { id: "pi", name: "pi", falls: "netbook" },
  { id: "android", name: "android", falls: "daylight" },
  { id: "chromebook", name: "chrome", falls: "laptop43" },
  { id: "tablet", name: "tablet", falls: "daylight" },
  { id: "high", name: "high", falls: "daylight" },
  { id: "vr", name: "glasses", falls: "high" },
] as const;

export type FormId = (typeof FORMS)[number]["id"];

const KEY = "sae-form";

export function isForm(id: string | null | undefined): id is FormId {
  return FORMS.some((form) => form.id === id);
}

export function detectForm(): FormId {
  if (typeof window === "undefined") return "daylight";
  const width = window.innerWidth;
  const height = window.innerHeight;
  const ratio = width / Math.max(height, 1);
  const touch = window.matchMedia("(pointer: coarse)").matches;
  if (width >= 1800 && window.devicePixelRatio >= 2) return "high";
  if (width <= 1024 && height <= 640) return "netbook";
  if (!touch && ratio > 1.2 && ratio < 1.45 && width <= 1280) return "laptop43";
  if (touch && width < 840) return "android";
  if (touch && width >= 840) return "tablet";
  return "daylight";
}

export function readForm(): FormId {
  if (typeof window === "undefined") return "daylight";
  const query = new URLSearchParams(window.location.search).get("form");
  if (isForm(query)) return query;
  const baked = import.meta.env.VITE_SAE_FORM;
  if (isForm(baked)) return baked;
  try {
    const saved = localStorage.getItem(KEY);
    if (isForm(saved)) return saved;
  } catch {
    /* daylight is the doll */
  }
  return detectForm();
}

export function chooseForm(id: FormId) {
  try {
    localStorage.setItem(KEY, id);
  } catch {
    /* the page still wears it */
  }
  document.documentElement.dataset.form = id;
  window.dispatchEvent(new CustomEvent("sae-form", { detail: id }));
}
