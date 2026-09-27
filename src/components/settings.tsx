import { useEffect, useState } from "react";
import { OCCULT_OFF, applyOccult, readOccult, writeOccult, type Occult } from "@/lib/occult";

const ROWS: { key: keyof Occult; name: string; note: string }[] = [
  { key: "wink", name: "wink", note: "the eye in the corner" },
  { key: "blink", name: "blink", note: "the lid, when you scroll" },
  { key: "capture", name: "picture", note: "the camera, before and after" },
  { key: "faces", name: "faces", note: "the small portraits" },
];

/** A closed mark. The wink, the blink, and the camera stay inside it. */
export function Settings() {
  const [open, setOpen] = useState(false);
  const [occult, setOccult] = useState<Occult>(OCCULT_OFF);

  useEffect(() => {
    applyOccult();
    setOccult(readOccult());
  }, []);

  const set = (key: keyof Occult, on: boolean) => {
    const next = { ...occult, [key]: on };
    setOccult(next);
    writeOccult(next);
  };

  return (
    <div className="occult">
      <button
        type="button"
        className={open ? "occult-mark on" : "occult-mark"}
        aria-expanded={open}
        aria-controls="occult-panel"
        aria-label="settings"
        onClick={() => setOpen((on) => !on)}
      />
      {open ? (
        <div id="occult-panel" className="occult-panel" role="dialog" aria-label="settings">
          <p className="occult-title">kept dark</p>
          {ROWS.map((row) => (
            <label key={row.key} className="occult-row">
              <span>
                {row.name}
                <small>{row.note}</small>
              </span>
              <input
                type="checkbox"
                checked={occult[row.key]}
                onChange={(event) => set(row.key, event.target.checked)}
              />
            </label>
          ))}
          <button type="button" className="occult-close" onClick={() => setOpen(false)}>
            close
          </button>
        </div>
      ) : null}
    </div>
  );
}
