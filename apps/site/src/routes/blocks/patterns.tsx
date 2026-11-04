/**
 * /blocks/patterns — moved to `domains/blocks/patterns.tsx`. Thin route:
 * the Blocks domain owns the page, this file owns the URL (same split as
 * `domains/components/reference.tsx` + `routes/reference.tsx`).
 * /patterns 301s here (canonical-tier move).
 */
import { createFileRoute } from "@tanstack/react-router";
import { PatternsHub } from "../../domains/blocks/patterns";
import { routeHead } from "../../domains/shared/systems/seo";

export const Route = createFileRoute("/blocks/patterns")({
  head: () =>
    routeHead(
      "Patterns",
      "Recurring product shapes composed from shipped components — app shell, forms, dialogs, search, settings, empty states.",
    ),
  component: PatternsHub,
});
