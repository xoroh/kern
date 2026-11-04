/**
 * /showcase — moved to /blocks. Redirect stub, not a page: the canonical
 * tier home for blocks is /blocks (D1003/D1004), and one family/page gets
 * one URL. check-nav reads the `throw redirect` below and treats this file
 * as an alias rather than an orphan route.
 */
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/showcase/")({
  beforeLoad: () => {
    throw redirect({ to: "/blocks" });
  },
});
