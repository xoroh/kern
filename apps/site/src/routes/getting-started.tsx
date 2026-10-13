/**
 * /getting-started — moved to /docs/getting-started. Redirect stub, not a
 * page: onboarding lives in the docs tree now, so the sidebar map covers it.
 * check-nav reads the `throw redirect` below and treats this file as an
 * alias rather than an orphan route.
 */
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/getting-started")({
  beforeLoad: () => {
    throw redirect({ to: "/docs/getting-started" });
  },
});
