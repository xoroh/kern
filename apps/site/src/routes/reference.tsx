/**
 * /reference — route registration for the API index. The page implementation
 * lives in the components domain (`domains/components/reference.tsx`); this
 * file holds the URL so the domain layout never leaks into routing.
 */
import { createFileRoute } from "@tanstack/react-router";
import { ApiIndex } from "../domains/components/reference";
import { routeHead } from "../domains/shared/systems/seo";

export const Route = createFileRoute("/reference")({
  head: () =>
    routeHead("API reference", "Every export in the generated manifest, one row each."),
  component: ApiIndex,
});
