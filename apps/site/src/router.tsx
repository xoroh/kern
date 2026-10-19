// Registers M3 before routeTree.gen: route modules resolve M3 themes at
// module scope, and ESM evaluates imports in declaration order (see
// register-m3.ts). Biome's import sort keeps "./register-m3" first.
import "./register-m3";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
