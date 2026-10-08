/**
 * /docs/reference — moved to /reference. Redirect stub, not a page: the API
 * index is a component-domain index, not main docs. check-nav reads the
 * `throw redirect` below and treats this file as an alias rather than an
 * orphan route.
 */
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/docs/reference")({
  beforeLoad: () => {
    throw redirect({ to: "/reference" });
  },
});
