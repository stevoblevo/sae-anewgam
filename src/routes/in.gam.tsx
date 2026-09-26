import { createFileRoute } from "@tanstack/react-router";
import { InGam } from "@/components/ingam";

export const Route = createFileRoute("/in/gam")({
  component: () => <InGam onWalk={() => { window.location.href = "/walk"; }} onRite={() => { window.location.href = "/"; }} />,
});
