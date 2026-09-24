import { createFileRoute } from "@tanstack/react-router";
import { Tale } from "@/routes/tale";

export const Route = createFileRoute("/")({
  component: Tale,
});
