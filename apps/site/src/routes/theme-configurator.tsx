/**
 * /theme-configurator — absorbed into the Playground's theme studio.
 * Redirect stub, not a page: one customizer app lives at /playground now.
 * check-nav reads the `throw redirect` below and treats this file as an
 * alias rather than an orphan route.
 */
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/theme-configurator")({
  beforeLoad: () => {
    throw redirect({ to: "/playground", search: {} });
  },
});
