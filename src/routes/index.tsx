import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Player } from "@/components/player";
import { Rite } from "@/components/rite";
import { InGam } from "@/components/ingam";
import { Night } from "@/components/night";
import { Anne } from "@/components/anne";
import { Dev } from "@/components/dev";
import { Show } from "@/components/show";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [view, setView] = useState<"dev" | "anne" | "night" | "in" | "rite" | "walk" | "garden">("rite");
  if (view === "garden") return <Show onDoor={() => setView("rite")} />;
  if (view === "dev") return <Dev onAnne={() => setView("anne")} onGarden={() => setView("garden")} />;
  if (view === "night") return <Night onDay={() => setView("in")} />;
  if (view === "in") return <InGam onWalk={() => setView("walk")} onRite={() => setView("rite")} />;
  if (view === "rite") return <Rite onWalk={() => setView("walk")} onDoor={() => setView("dev")} />;
  if (view === "walk") return <Player key="ring" />;
  return <Anne onNight={() => setView("night")} />;
}
