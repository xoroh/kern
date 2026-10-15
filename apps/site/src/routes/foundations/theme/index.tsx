/**
 * /foundations/theme — moved to /foundations/m3/theme. Redirect stub, not a
 * page: the theme reference belongs to the Material 3 system now. check-nav
 * reads the `throw redirect` below and treats this file as an alias rather
 * than an orphan route.
 */
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/foundations/theme/")({
  beforeLoad: () => {
    throw redirect({ to: "/foundations/m3/theme" });
  },
});
