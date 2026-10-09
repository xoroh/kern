/**
 * /patterns — moved to `domains/blocks/patterns.tsx`. Redirect-free thin
 * route: the Blocks domain owns the page, this file owns the URL (same
 * split as `domains/components/reference.tsx` + `routes/reference.tsx`).
 */
import { createFileRoute } from "@tanstack/react-router";
import { PatternsHub } from "../../domains/blocks/patterns";
import { routeHead } from "../../domains/shared/systems/seo";

export const Route = createFileRoute("/patterns/")({
  head: () =>
    routeHead(
      "Patterns",
      "Recurring product shapes composed from shipped components — app shell, forms, dialogs, search, settings, empty states.",
    ),
  component: PatternsHub,
});
