export const MOTION_MODES = ["full", "reduced", "still"] as const;

export type MotionMode = (typeof MOTION_MODES)[number];

export type MotionEnvironment = {
  prefersReducedMotion: boolean;
  saveData: boolean;
};

const STORAGE_KEY = "sae.motion-mode";

export function isMotionMode(value: unknown): value is MotionMode {
  return typeof value === "string" && (MOTION_MODES as readonly string[]).includes(value);
}

export function readMotionEnvironment(): MotionEnvironment {
  if (typeof window === "undefined") {
    return { prefersReducedMotion: false, saveData: false };
  }

  const connection = navigator as Navigator & { connection?: { saveData?: boolean } };
  return {
    prefersReducedMotion: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    saveData: Boolean(connection.connection?.saveData),
  };
}

export function conservativeDefaultMode({
  prefersReducedMotion,
  saveData,
}: MotionEnvironment): MotionMode {
  if (saveData) return "still";
  if (prefersReducedMotion) return "reduced";
  return "full";
}

export function loadMotionMode(): MotionMode | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return isMotionMode(value) ? value : null;
  } catch {
    return null;
  }
}

export function storeMotionMode(mode: MotionMode): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Storage can be unavailable (for example in a private context). Motion
    // remains usable for this visit without surfacing an avoidable error.
  }
}

export function initialMotionMode(): MotionMode {
  return loadMotionMode() ?? conservativeDefaultMode(readMotionEnvironment());
}
