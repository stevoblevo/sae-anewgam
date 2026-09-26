import { useEffect, useState } from "react";
import { allowEye, compose, eyeReady, keepTake, snapEye, snapScene, type Take } from "@/lib/eye";

export function Eye() {
  const [ask, setAsk] = useState(false);
  const [line, setLine] = useState("I want to see you too.");
  const [take, setTake] = useState<Take | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("sae-eye") === "1") {
      allowEye().catch(() => setAsk(true));
      return;
    }
    setAsk(true);
  }, []);

  useEffect(() => {
    let running = false;
    const onWink = async () => {
      if (!eyeReady() || running) return;
      running = true;
      const before = snapEye();
      window.setTimeout(async () => {
        const after = snapEye();
        const scene = await snapScene();
        running = false;
        if (!before || !after || !scene) return;
        const shown = Math.random() < 0.5 ? "before" : "after";
        const made = await compose(scene, shown === "before" ? before : after);
        const next: Take = { t: Date.now(), before, after, scene, made, shown };
        await keepTake(next).catch(() => undefined);
        setTake(next);
        setAsk(false);
      }, 220);
    };
    window.addEventListener("sae-wink", onWink);
    return () => window.removeEventListener("sae-wink", onWink);
  }, []);

  const allow = async () => {
    try {
      await allowEye();
      setAsk(false);
      setLine("I want to see you too.");
    } catch {
      setLine("The eye needs its own window. Allow it there.");
      setAsk(true);
    }
  };

  if (take) {
    return (
      <div className="eye-sheet">
        <img src={take.made} alt="" />
        <p>{take.shown === "before" ? "Before the wink." : "After the wink."} It stays on this device.</p>
        <div>
          <button
            type="button"
            onClick={async () => setTake({ ...take, shown: "before", made: await compose(take.scene, take.before) })}
          >
            before
          </button>
          <button
            type="button"
            onClick={async () => setTake({ ...take, shown: "after", made: await compose(take.scene, take.after) })}
          >
            after
          </button>
          <button type="button" onClick={() => setTake(null)}>
            walk
          </button>
        </div>
      </div>
    );
  }

  if (!ask) return null;

  return (
    <div className="eye-sheet">
      <p>{line}</p>
      <p>When she winks, the eye takes you, before and after, with the picture.</p>
      <div>
        <button type="button" onClick={allow}>
          allow
        </button>
        <button type="button" onClick={() => window.open(window.location.href, "_blank", "noopener")}>
          own window
        </button>
      </div>
    </div>
  );
}
