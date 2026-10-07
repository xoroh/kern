/**
 * /theme — moved to /foundations/theme. Redirect stub, not a page: kept so
 * bookmarks and external links land on the theme page instead of a 404.
 * check-nav reads the `throw redirect` below and treats this file as an
 * alias rather than an orphan route.
 */
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/theme/")({
  beforeLoad: () => {
    throw redirect({ to: "/foundations/theme" });
  },
});
