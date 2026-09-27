import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Immerse } from "@/components/immerse";
import { FRIEND_FILM } from "@/lib/present";

export const Route = createFileRoute("/story")({
  validateSearch: (search: Record<string, unknown>) => {
    const n = Number(search.at);
    const at = Number.isFinite(n) ? Math.max(0, Math.min(FRIEND_FILM.length - 1, Math.floor(n))) : 0;
    return { at };
  },
  component: Story,
});

function Story() {
  const { at } = Route.useSearch();
  const navigate = useNavigate();
  return <Immerse key={at} start="friend" startAt={at} tell onWalk={() => navigate({ to: "/" })} />;
}
