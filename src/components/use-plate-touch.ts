import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

type Point = { x: number; y: number };
type Frame = { z: number; x: number; y: number };

const MIN = 1;
const MAX = 3.4;

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function pairDist(points: Map<number, Point>) {
  const [a, b] = [...points.values()];
  return { a, b, d: Math.hypot(a.x - b.x, a.y - b.y) };
}

export function usePlateTouch({
  canStart,
  onPull,
  onSwipe,
  onCancel,
  onTap,
}: {
  canStart?: () => boolean;
  onPull?: (dx: number) => void;
  onSwipe?: (dir: 1 | -1) => void;
  onCancel?: () => void;
  onTap?: () => void;
}) {
  const [frame, setFrame] = useState<Frame>({ z: 1, x: 0, y: 0 });
  const frameRef = useRef(frame);
  const points = useRef(new Map<number, Point>());
  const pinch = useRef<{ dist: number; z: number; x: number; y: number; mx: number; my: number } | null>(null);
  const drag = useRef<{ x: number; y: number; t: number; pulled: boolean } | null>(null);
  const lastTap = useRef({ t: 0, x: 0, y: 0 });
  const box = useRef({ w: 1, h: 1 });
  const coarse = useRef(false);
  const blocked = useRef(false);
  frameRef.current = frame;

  useEffect(() => {
    coarse.current = window.matchMedia("(pointer: coarse)").matches;
  }, []);

  const fit = (next: Frame, el?: HTMLElement | null) => {
    const w = el?.clientWidth || box.current.w;
    const h = el?.clientHeight || box.current.h;
    box.current = { w, h };
    const z = next.z <= 1.02 ? 1 : clamp(next.z, MIN, MAX);
    if (z === 1) return { z: 1, x: 0, y: 0 };
    const maxX = (w * (z - 1)) / 2;
    const maxY = (h * (z - 1)) / 2;
    return { z, x: clamp(next.x, -maxX, maxX), y: clamp(next.y, -maxY, maxY) };
  };

  const apply = (next: Frame, el?: HTMLElement | null) => {
    const fitted = fit(next, el);
    frameRef.current = fitted;
    blocked.current = fitted.z > 1 || points.current.size > 0;
    setFrame(fitted);
  };

  const reset = () => {
    pinch.current = null;
    drag.current = null;
    blocked.current = false;
    apply({ z: 1, x: 0, y: 0 });
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("button, a")) return;
    if (canStart && !canStart()) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (points.current.size === 0 && (event.clientX < rect.left + 32 || event.clientX > rect.right - 32)) return;
    points.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    event.currentTarget.setPointerCapture(event.pointerId);
    blocked.current = true;
    box.current = { w: event.currentTarget.clientWidth, h: event.currentTarget.clientHeight };
    if (points.current.size >= 2) {
      const { a, b, d } = pairDist(points.current);
      const now = frameRef.current;
      pinch.current = { dist: Math.max(28, d), z: now.z, x: now.x, y: now.y, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 };
      drag.current = null;
      onPull?.(0);
      return;
    }
    drag.current = { x: event.clientX, y: event.clientY, t: performance.now(), pulled: false };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const point = points.current.get(event.pointerId);
    if (!point) return;
    point.x = event.clientX;
    point.y = event.clientY;
    if (points.current.size >= 2 && pinch.current) {
      const { a, b, d } = pairDist(points.current);
      const start = pinch.current;
      const z = clamp(start.z * (d / start.dist), MIN, MAX);
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      apply({ z, x: start.x + (mx - start.mx), y: start.y + (my - start.my) }, event.currentTarget);
      return;
    }
    const start = drag.current;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (!start.pulled && Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
    if (Math.abs(dy) > Math.abs(dx) && !start.pulled) return;
    start.pulled = true;
    onPull?.(dx);
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    const start = drag.current;
    const had = points.current.has(event.pointerId);
    points.current.delete(event.pointerId);
    if (!had) return;
    if (points.current.size >= 1) {
      pinch.current = null;
      if (points.current.size === 1) {
        const only = [...points.current.values()][0];
        drag.current = { x: only.x, y: only.y, t: performance.now(), pulled: false };
      }
      blocked.current = frameRef.current.z > 1 || points.current.size > 0;
      return;
    }
    pinch.current = null;
    drag.current = null;
    blocked.current = frameRef.current.z > 1;
    if (frameRef.current.z > 1) {
      const now = performance.now();
      const dt = now - lastTap.current.t;
      const moved = start ? Math.hypot(event.clientX - start.x, event.clientY - start.y) : 99;
      if (moved < 16 && dt < 300 && Math.hypot(event.clientX - lastTap.current.x, event.clientY - lastTap.current.y) < 40) {
        apply({ z: 1, x: 0, y: 0 }, event.currentTarget);
        blocked.current = false;
        lastTap.current = { t: 0, x: 0, y: 0 };
      } else if (moved < 16) {
        lastTap.current = { t: now, x: event.clientX, y: event.clientY };
      }
      return;
    }
    const dx = start ? event.clientX - start.x : 0;
    const dy = start ? event.clientY - start.y : 0;
    const dt = start ? performance.now() - start.t : 999;
    const flick = Math.abs(dx) / Math.max(dt, 1) > 0.45;
    if (Math.abs(dx) < 16 && Math.abs(dy) < 16) {
      const now = performance.now();
      const gap = now - lastTap.current.t;
      if (gap < 300 && Math.hypot(event.clientX - lastTap.current.x, event.clientY - lastTap.current.y) < 40) {
        const rect = event.currentTarget.getBoundingClientRect();
        const z = 2.2;
        apply(
          {
            z,
            x: (rect.left + rect.width / 2 - event.clientX) * (z - 1),
            y: (rect.top + rect.height / 2 - event.clientY) * (z - 1),
          },
          event.currentTarget,
        );
        lastTap.current = { t: 0, x: 0, y: 0 };
        return;
      }
      lastTap.current = { t: now, x: event.clientX, y: event.clientY };
      if (coarse.current) {
        window.setTimeout(() => {
          if (lastTap.current.t === now) onTap?.();
        }, 280);
      } else {
        onTap?.();
      }
      return;
    }
    if (start?.pulled && Math.abs(dx) > 32 && Math.abs(dx) > Math.abs(dy) && (Math.abs(dx) > 56 || flick)) {
      onSwipe?.(dx < 0 ? 1 : -1);
      return;
    }
    if (start?.pulled) onCancel?.();
  };

  // Panning a zoomed plate: the stored point is updated before the delta, so
  // read the previous position first.
  const onPointerMoveFixed = (event: ReactPointerEvent<HTMLElement>) => {
    const prev = points.current.get(event.pointerId);
    if (!prev) return;
    if (points.current.size === 1 && frameRef.current.z > 1 && drag.current) {
      const dx = event.clientX - prev.x;
      const dy = event.clientY - prev.y;
      prev.x = event.clientX;
      prev.y = event.clientY;
      drag.current.pulled = true;
      apply({ z: frameRef.current.z, x: frameRef.current.x + dx, y: frameRef.current.y + dy }, event.currentTarget);
      return;
    }
    onPointerMove(event);
  };

  return {
    frame,
    blocked,
    reset,
    live: frame.z > 1,
    handlers: {
      onPointerDown,
      onPointerMove: onPointerMoveFixed,
      onPointerUp,
      onPointerCancel: onPointerUp,
    },
  };
}
