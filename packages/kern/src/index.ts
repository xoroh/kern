// "@xoroh/kern" — web components (React, Base UI behaviors, Kern tokens).

// Registers NOTHING with the theme resolver (decision 010): a renderer must
// not choose a design system for the app that imports it. Apps that want M3
// call `registerM3()` from `@xoroh/kern-m3` once at entry; an unregistered
// theme id fails loud at resolve time.

export * from "./components/index";
export * from "./tokens";
export { cn } from "./utils/cn";
export type { StateClassName } from "./utils/cnState";
export { cnState } from "./utils/cnState";
export * from "./web-theme";
