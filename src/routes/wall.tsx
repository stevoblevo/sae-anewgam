import { createFileRoute } from "@tanstack/react-router";
import { Wall } from "@/components/wall";

export const Route = createFileRoute("/wall")({
  component: Wall,
});
