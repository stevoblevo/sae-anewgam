import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Player } from "@/components/player";
import { Rite } from "@/components/rite";
import { InGam } from "@/components/ingam";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [view, setView] = useState<"in" | "rite" | "walk">("in");
  if (view === "rite") return <Rite onWalk={() => setView("walk")} />;
  if (view === "walk") return <Player key="ring" />;
  return <InGam onWalk={() => setView("walk")} onRite={() => setView("rite")} />;
}
