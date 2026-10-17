// "@xoroh/kern" — web components (React, Base UI behaviors, Kern tokens).

// Registers the material-3 preset tables, policy and overrides with the
// universal resolver (side effect). Default consumers resolve M3 without
// further setup; custom systems register their own preset instead.
import "@xoroh/kern-m3";

export * from "./components/index";
export * from "./tokens";
export { cn } from "./utils/cn";
export type { StateClassName } from "./utils/cnState";
export { cnState } from "./utils/cnState";
export * from "./web-theme";
