import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Player } from "@/components/player";
import { Ball } from "@/routes/ball";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [player, setPlayer] = useState(false);
  useEffect(() => {
    setPlayer(new URLSearchParams(window.location.search).get("home") === "1");
  }, []);
  if (player) return <Player key="red-raindear" />;
  return <Ball />;
}
