import { useState } from "react";

/** Ctrl+Enter or ⌘+Enter sends. Enter alone stays a local draft. */
export function Ask() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [state, setState] = useState<"draft" | "sent" | "copied">("draft");

  const send = () => {
    const q = text.trim();
    if (!q) return;
    const url = `https://grok.com/?q=${encodeURIComponent(q)}`;
    const opened = window.open(url, "_blank", "noopener");
    if (opened) {
      setState("sent");
      return;
    }
    navigator.clipboard?.writeText(q).catch(() => undefined);
    setState("copied");
  };

  return (
    <div className="ask" onPointerDown={(event) => event.stopPropagation()}>
      {open ? (
        <form
          className="ask-panel"
          onSubmit={(event) => {
            event.preventDefault();
            send();
          }}
        >
          <textarea
            value={text}
            rows={3}
            placeholder="ask grok"
            aria-label="ask grok"
            onChange={(event) => {
              setText(event.target.value);
              setState("draft");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
                event.preventDefault();
                send();
              }
            }}
          />
          <p className="ask-note">
            {state === "sent" ? "sent" : state === "copied" ? "copied · allow the window to send" : "local draft · not sent"}
            <span>ctrl enter sends</span>
          </p>
          <button type="submit" className="nav-link">
            send
          </button>
        </form>
      ) : null}
      <button type="button" className="nav-link ask-open" aria-expanded={open} onClick={() => setOpen((on) => !on)}>
        {open ? "close" : "ask"}
      </button>
    </div>
  );
}
