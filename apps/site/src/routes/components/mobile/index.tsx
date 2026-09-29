import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/components/mobile/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/components/mobile/"!</div>;
}
