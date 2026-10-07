import { useEffect, useState, type MouseEvent } from "react";

const WAYS = [
  { k: "sae", href: "/", label: "sae", hint: "the porch" },
  { k: "now", href: "/and-now/index.html", label: "now", hint: "the light" },
  { k: "fall", href: "/everfallen/index.html", label: "fall", hint: "the garden" },
  { k: "further", href: "/?to=further", label: "further", hint: "the story" },
] as const;

export function LedRail() {
  const [here, setHere] = useState("sae");

  useEffect(() => {
    const read = () => {
      const path = window.location.pathname;
      if (path.includes("and-now")) setHere("now");
      else if (path.includes("everfallen")) setHere("fall");
      else setHere(document.documentElement.dataset.room || "sae");
    };
    read();
    window.addEventListener("sae-room", read);
    return () => window.removeEventListener("sae-room", read);
  }, []);

  const go = (event: MouseEvent<HTMLAnchorElement>, key: string) => {
    if (key !== "sae" && key !== "further") return;
    if (window.location.pathname !== "/") return;
    event.preventDefault();
    window.dispatchEvent(new CustomEvent("sae-go", { detail: key }));
  };

  return (
    <nav className="led-rail" aria-label="ways">
      {WAYS.map((way) => (
        <a
          key={way.k}
          href={way.href}
          data-k={way.k}
          aria-current={here === way.k ? "page" : undefined}
          aria-label={`${way.label}, ${way.hint}`}
          onClick={(event) => go(event, way.k)}
        >
          <i />
          <span>{way.label}</span>
        </a>
      ))}
    </nav>
  );
}
