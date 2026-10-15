/**
 * /foundations/$page — moved to /foundations/m3/$page. Redirect stub, not a
 * page: the seven token topics belong to the Material 3 system now, and the
 * next system nests beside them. check-nav reads the `throw redirect` below
 * and treats this file as an alias rather than an orphan route.
 */
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/foundations/$page")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/foundations/m3/$page",
      params: { page: params.page },
    });
  },
});
