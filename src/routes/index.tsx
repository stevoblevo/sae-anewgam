import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Player } from "@/components/player";
import { Rite } from "@/components/rite";
import { InGam } from "@/components/ingam";
import { Night } from "@/components/night";
import { Anne } from "@/components/anne";
import { Dev } from "@/components/dev";
import { Show } from "@/components/show";
import { Immerse } from "@/components/immerse";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [view, setView] = useState<"home" | "play" | "night" | "in" | "rite" | "dev" | "anne" | "garden">("home");
  if (view === "play") {
    return (
      <>
        <Player key="ring" />
        <button type="button" className="immerse-back" onClick={() => setView("home")}>
          home
        </button>
      </>
    );
  }
  if (view === "garden") return <Show onDoor={() => setView("home")} />;
  if (view === "dev") return <Dev onHome={() => setView("home")} onAnne={() => setView("anne")} onGarden={() => setView("garden")} />;
  if (view === "anne") return <Anne onNight={() => setView("night")} />;
  if (view === "night") return <Night onDay={() => setView("home")} />;
  if (view === "in") return <InGam onWalk={() => setView("play")} onRite={() => setView("rite")} />;
  if (view === "rite") return <Rite onWalk={() => setView("play")} onDoor={() => setView("home")} />;
  return <Immerse onPlay={() => setView("play")} onFurther={() => setView("dev")} />;
}
