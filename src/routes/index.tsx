import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Player } from "@/components/player";
import { Rite } from "@/components/rite";
import { InGam } from "@/components/ingam";
import { KnightPlay } from "@/components/knight-play";
import { Immerse } from "@/components/immerse";
import { Wall } from "@/components/wall";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [view, setView] = useState<"in" | "rite" | "walk" | "knight" | "immerse" | "wall">("immerse");
  if (view === "wall") return <Wall onFilm={() => setView("immerse")} />;
  if (view === "immerse") return <Immerse onWalk={() => setView("walk")} />;
  if (view === "rite") return <Rite onWalk={() => setView("walk")} />;
  if (view === "walk") return <Player key="ring" />;
  if (view === "knight") return <KnightPlay onWalk={() => setView("walk")} />;
  return <InGam onWalk={() => setView("walk")} onRite={() => setView("rite")} />;
}
