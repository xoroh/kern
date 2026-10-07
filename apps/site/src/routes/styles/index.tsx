/**
 * /styles — moved to /foundations. Redirect stub, not a page: kept so
 * bookmarks and external links land on the hub instead of a 404.
 * check-nav reads the `throw redirect` below and treats this file as an
 * alias rather than an orphan route.
 */
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/styles/")({
  beforeLoad: () => {
    throw redirect({ to: "/foundations" });
  },
});
