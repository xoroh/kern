/**
 * /patterns — moved to /blocks/patterns. Redirect stub, not a page: the
 * Blocks domain owns patterns (D1003/D1004), and one page gets one URL.
 * check-nav reads the `throw redirect` below and treats this file as an
 * alias rather than an orphan route.
 */
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/patterns/")({
  beforeLoad: () => {
    throw redirect({ to: "/blocks/patterns" });
  },
});
