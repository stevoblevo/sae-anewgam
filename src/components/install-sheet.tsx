import { useEffect, useRef, useState } from "react";

export function useAskInstall() {
  const prompt = useRef<{ prompt: () => Promise<void> } | null>(null);
  const [open, setOpen] = useState(false);
  const [line, setLine] = useState("");

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      prompt.current = event as Event & { prompt: () => Promise<void> };
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const ask = () => {
    const deferred = prompt.current;
    if (deferred?.prompt) {
      deferred.prompt();
      prompt.current = null;
      return;
    }
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
    if (standalone) setLine("This is already the installed app.");
    else if (window.self !== window.top)
      setLine("This preview sits inside another window, so the browser will not install it from here. Open it in its own tab, then use the browser menu.");
    else setLine("The browser did not offer a prompt. Use the browser menu and choose Install. On a phone: Share, then Add to Home Screen.");
    setOpen(true);
  };

  const sheet = open ? (
    <div className="install-sheet" role="dialog" aria-label="install">
      <p>{line}</p>
      <div>
        <button type="button" onClick={() => window.open(window.location.href, "_blank", "noopener")}>
          open in a tab
        </button>
        <a href="https://github.com/stevoblevo/sae-anewgam" target="_blank" rel="noreferrer">
          github
        </a>
        <button type="button" onClick={() => setOpen(false)}>
          close
        </button>
      </div>
    </div>
  ) : null;

  return { ask, sheet };
}
