/**
 * /accessibility — moved to /foundations/accessibility. Redirect stub, not
 * a page: kept so bookmarks and external links land on the statement
 * instead of a 404. check-nav reads the `throw redirect` below and treats
 * this file as an alias rather than an orphan route.
 */
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/accessibility")({
  beforeLoad: () => {
    throw redirect({ to: "/foundations/accessibility" });
  },
});
