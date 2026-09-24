import { createFileRoute } from "@tanstack/react-router";
import { Fight } from "@/routes/fight";

export const Route = createFileRoute("/")({
  component: Fight,
});
