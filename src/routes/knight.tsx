import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { KnightPlay } from "@/components/knight-play";

export const Route = createFileRoute("/knight")({
  component: KnightRoute,
});

function KnightRoute() {
  const navigate = useNavigate();
  return <KnightPlay onWalk={() => navigate({ to: "/" })} />;
}
