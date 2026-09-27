import { useEffect, useId, useRef, useState, type ReactNode } from "react";

/** Phone bar stays one line. The rest of the chrome opens under "ways". */
export function Fold({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      const node = event.target;
      if (!(node instanceof Node)) return;
      if (toggle.current?.contains(node) || panel.current?.contains(node)) return;
      setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <>
      <button
        ref={toggle}
        type="button"
        className="nav-link ways-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onPointerDown={(event) => event.stopPropagation()}
        onTouchStart={(event) => event.stopPropagation()}
        onClick={() => setOpen((on) => !on)}
      >
        {open ? "close" : "ways"}
      </button>
      <div
        ref={panel}
        id={panelId}
        className={open ? "right ways-open" : "right"}
        onPointerDown={(event) => event.stopPropagation()}
        onTouchStart={(event) => event.stopPropagation()}
        onClick={(event) => {
          const target = event.target;
          if (target instanceof Element && target.closest("a, button")) setOpen(false);
        }}
      >
        {children}
      </div>
    </>
  );
}
