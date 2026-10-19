import type { SearchEntry } from "./index";

/** Suggestions for the empty/no-results states — popular, stable targets. */
export const SEARCH_SUGGESTIONS: SearchEntry[] = [
  {
    group: "Components",
    title: "Button",
    hint: "Start with the most-used family",
    href: "/components/m3/button",
  },
  {
    group: "Components",
    title: "Dialog",
    hint: "Modal tasks and decisions",
    href: "/components/m3/dialog",
  },
  {
    group: "Tokens",
    title: "primary",
    hint: "Color role · see it on the M3 Color page",
    href: "/foundations/m3/color",
  },
  {
    group: "Guides",
    title: "Get started",
    hint: "From install to a themed component",
    href: "/docs/getting-started",
  },
];
