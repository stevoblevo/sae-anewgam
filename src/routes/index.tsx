import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Player } from "@/components/player";
import { Rite } from "@/components/rite";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [rite, setRite] = useState(true);
  return rite ? <Rite onWalk={() => setRite(false)} /> : <Player key="ring" />;
}

