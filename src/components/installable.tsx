import { useEffect } from "react";

export function Installable() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (import.meta.env.DEV) {
      navigator.serviceWorker.getRegistrations().then(async (regs) => {
        await Promise.all(regs.map((reg) => reg.unregister()));
        if ("caches" in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((key) => caches.delete(key)));
        }
        if (navigator.serviceWorker.controller && sessionStorage.getItem("sw-drop") !== "1") {
          sessionStorage.setItem("sw-drop", "1");
          window.location.reload();
        }
      });
      return;
    }

    navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" }).then((reg) => {
      reg.addEventListener("updatefound", () => {
        const next = reg.installing;
        next?.addEventListener("statechange", () => {
          if (next.state === "installed" && navigator.serviceWorker.controller) {
            next.postMessage("skip-waiting");
          }
        });
      });
    }).catch(() => {});
  }, []);
  return null;
}
