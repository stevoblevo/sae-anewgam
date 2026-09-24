import { createFileRoute } from "@tanstack/react-router";
import { Player } from "@/components/player";

export const Route = createFileRoute("/walk")({
  component: () => <Player key="porch" />,
});
