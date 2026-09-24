import { createFileRoute } from "@tanstack/react-router";
import { Fallen } from "@/routes/fallen";

export const Route = createFileRoute("/")({
  component: Fallen,
});
