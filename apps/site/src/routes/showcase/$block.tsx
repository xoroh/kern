/**
 * /showcase/$block — moved to /blocks/$block. Redirect stub, not a page:
 * the slug travels with the redirect so per-block links keep working.
 * check-nav reads the `throw redirect` below and treats this file as an
 * alias rather than an orphan route.
 */
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/showcase/$block")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/blocks/$block",
      params: { block: params.block },
    });
  },
});
