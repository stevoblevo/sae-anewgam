import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Player } from "@/components/player";
import { Rite } from "@/components/rite";
import { InGam } from "@/components/ingam";
import { KnightPlay } from "@/components/knight-play";
import { Immerse } from "@/components/immerse";
import { Restart } from "@/components/restart";
import { Wall } from "@/components/wall";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [view, setView] = useState<"in" | "rite" | "walk" | "knight" | "immerse" | "wall" | "restart">(() =>
    typeof window !== "undefined" && window.location.hash === "#restart" ? "restart" : "immerse",
  );
  const openRestart = () => {
    window.history.replaceState(null, "", "/#restart");
    setView("restart");
  };
  const openPresent = () => {
    window.history.replaceState(null, "", "/");
    setView("immerse");
  };
  useEffect(() => {
    if (window.location.hash === "#restart") setView("restart");
  }, []);
  if (view === "restart") return <Restart onOpen={openPresent} />;
  if (view === "wall") return <Wall onFilm={() => setView("immerse")} />;
  if (view === "immerse") return <Immerse onWalk={() => setView("walk")} onRestart={openRestart} />;
  if (view === "rite") return <Rite onWalk={() => setView("walk")} />;
  if (view === "walk") return <Player key="ring" />;
  if (view === "knight") return <KnightPlay onWalk={() => setView("walk")} />;
  return <InGam onWalk={() => setView("walk")} onRite={() => setView("rite")} />;
}
