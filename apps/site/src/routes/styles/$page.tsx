/**
 * /styles/$page — moved to /foundations/$page. Redirect stub preserving the
 * slug, so a bookmarked token page lands on its new home. check-nav reads
 * the `throw redirect` below and treats this file as an alias rather than
 * an orphan route.
 */
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/styles/$page")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/foundations/$page", params: { page: params.page } });
  },
});
