import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/components/web/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/components/web/"!</div>;
}
