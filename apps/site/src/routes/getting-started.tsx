import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/getting-started")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/getting-started"!</div>;
}
