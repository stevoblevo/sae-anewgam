import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Player } from "@/components/player";
import { Rite } from "@/components/rite";
import { InGam } from "@/components/ingam";
import { Night } from "@/components/night";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [view, setView] = useState<"night" | "in" | "rite" | "walk">("night");
  if (view === "in") return <InGam onWalk={() => setView("walk")} onRite={() => setView("rite")} />;
  if (view === "rite") return <Rite onWalk={() => setView("walk")} />;
  if (view === "walk") return <Player key="ring" />;
  return <Night onDay={() => setView("in")} />;
}
