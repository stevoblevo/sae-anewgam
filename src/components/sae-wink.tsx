import { useEffect } from "react";
import { readFlow } from "@/lib/flow";

/** One shared surface over all existing routes. No camera or work transport. */
export function SaeWink() {
  useEffect(() => {
    if (document.querySelector("sae-wink[data-root]")) return;
    const eye = document.createElement("sae-wink");
    eye.setAttribute("data-root", "");
    eye.setAttribute("world", "anewgam");
    eye.style.setProperty("--sae-wink-bottom", "132px");
    eye.textContent = "Sae · loading";
    const place = () => (document.fullscreenElement || document.body).appendChild(eye);
    const marks = () => eye.setAttribute("mark-count", String(readFlow().length));
    marks();
    place();
    document.addEventListener("fullscreenchange", place);
    window.addEventListener("sae-flow", marks);
    if (!document.querySelector('script[data-sae-wink-module]')) {
      const script = document.createElement("script");
      script.type = "module";
      script.src = "/sae-wink/sae-wink.js";
      script.setAttribute("data-sae-wink-module", "");
      script.onerror = () => { eye.textContent = "Sae · unavailable"; };
      document.head.appendChild(script);
    }
    return () => {
      document.removeEventListener("fullscreenchange", place);
      window.removeEventListener("sae-flow", marks);
      eye.remove();
    };
  }, []);
  return null;
}
