import { createFileRoute } from "@tanstack/react-router";
import { Night } from "@/components/night";

export const Route = createFileRoute("/night")({
  component: () => <Night onDay={() => { window.location.href = "/"; }} />,
});
