import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Player } from "@/components/player";
import { Rite } from "@/components/rite";
import { InGam } from "@/components/ingam";
import { Night } from "@/components/night";
import { Anne } from "@/components/anne";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [view, setView] = useState<"anne" | "night" | "in" | "rite" | "walk">("anne");
  if (view === "night") return <Night onDay={() => setView("in")} />;
  if (view === "in") return <InGam onWalk={() => setView("walk")} onRite={() => setView("rite")} />;
  if (view === "rite") return <Rite onWalk={() => setView("walk")} />;
  if (view === "walk") return <Player key="ring" />;
  return <Anne onNight={() => setView("night")} />;
}
