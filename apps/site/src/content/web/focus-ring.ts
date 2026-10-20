import type { ComponentDoc } from "../types";

export const focusRing: ComponentDoc = {
  slug: "focus-ring",
  name: "Focus ring",
  oneLiner:
    "Focus rings paint the visible keyboard-focus treatment on host content.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern",
    // A web-only styling wrapper — there is no focus ring on touch surfaces,
    // so there is no native counterpart to name.
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: ["FocusRing"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["focus-visible"],
  customization: {
    supported: [
      "`className` is merged after the ring utilities, so host styling composes without hiding the treatment.",
      "`children` is the host content — the wrapper renders a `span` around whatever you give it.",
    ],
    notSupported: [
      "There is no `width`, `color` or `offset` prop. The ring is `3px` secondary with no offset per the M3 focus spec — recorded in `FOCUS_RING_WIDTH_PX`, `FOCUS_RING_COLOR_ROLE` and `FOCUS_RING_OFFSET_PX`.",
      "There is no tab-stop ownership. The host gives the focus; the wrapper never takes it.",
    ],
  },
  api: [
    {
      name: "children",
      type: "ReactNode",
      note: "The host content the ring paints around.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the ring utilities.",
    },
  ],
  aria: [
    "The wrapper is a plain `span` with no role — it paints, it does not announce.",
    "Keyboard order belongs to the host: whatever takes focus inside keeps its own tab stop and its own name.",
  ],
};
