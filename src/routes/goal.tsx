import { createFileRoute } from "@tanstack/react-router";
import { GoalPlay } from "@/components/goal-play";

export const Route = createFileRoute("/goal")({
  component: GoalPlay,
});
