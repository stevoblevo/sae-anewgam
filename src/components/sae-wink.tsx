import { useEffect } from "react";
import { readFlow } from "@/lib/flow";
import { readOccult } from "@/lib/occult";

/** The wink stays unmounted until settings opens it. No camera here. */
export function SaeWink() {
  useEffect(() => {
    let eye: HTMLElement | null = null;
    let place: (() => void) | null = null;
    let marks: (() => void) | null = null;

    const clear = () => {
      if (place) document.removeEventListener("fullscreenchange", place);
      if (marks) window.removeEventListener("sae-flow", marks);
      eye?.remove();
      document.querySelector("sae-wink[data-root]")?.remove();
      eye = null;
      place = null;
      marks = null;
    };

    const sync = () => {
      if (!readOccult().wink) {
        clear();
        return;
      }
      if (eye?.isConnected) return;
      eye = document.createElement("sae-wink");
      eye.setAttribute("data-root", "");
      eye.setAttribute("world", "anewgam");
      eye.style.setProperty("--sae-wink-bottom", "132px");
      eye.textContent = "Sae · loading";
      const node = eye;
      place = () => (document.fullscreenElement || document.body).appendChild(node);
      marks = () => node.setAttribute("mark-count", String(readFlow().length));
      marks();
      place();
      document.addEventListener("fullscreenchange", place);
      window.addEventListener("sae-flow", marks);
      if (!document.querySelector('script[data-sae-wink-module]')) {
        const script = document.createElement("script");
        script.type = "module";
        script.src = "/sae-wink/sae-wink.js";
        script.setAttribute("data-sae-wink-module", "");
        script.onerror = () => {
          node.textContent = "Sae · unavailable";
        };
        document.head.appendChild(script);
      }
    };

    sync();
    window.addEventListener("sae-occult", sync);
    return () => {
      window.removeEventListener("sae-occult", sync);
      clear();
    };
  }, []);
  return null;
}
