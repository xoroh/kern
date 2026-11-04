/**
 * /blocks — the Blocks domain index (D1003/D1004). The catalog owns the
 * page (`domains/blocks/blocks-index.tsx`); this file owns the URL.
 * /showcase 301s here (canonical-tier move, not a duplicate gallery).
 */
import { createFileRoute } from "@tanstack/react-router";
import { BlocksIndex } from "../../domains/blocks/blocks-index";
import { routeHead } from "../../domains/shared/systems/seo";

export const Route = createFileRoute("/blocks/")({
  head: () =>
    routeHead(
      "Blocks",
      "Composed sections built from kern components — preview live, install as a unit.",
    ),
  component: BlocksIndex,
});
