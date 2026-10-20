import type { ComponentDoc } from "../types";

export const carousel: ComponentDoc = {
  slug: "carousel",
  name: "Carousel",
  oneLiner:
    "Carousels show one slide at a time from a set, moved through with controls or by gesture.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    // Canonical M3 spec page — title identity-verified live; gate re-checks.
    specUrl: "https://m3.material.io/components/carousel",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Carousel",
    // No variant axis. Which slide is showing is state.
    variants: [],
    // Material 3's "carousel" row rests at level 0, and level 0 is
    // `shadow: none`. kern ships no elevation token here, which is the
    // conformant state.
    elevation: 0,
  },
  parts: ["Carousel"],
  // The keyboard contract, read off the region and the controls group: the
  // arrow keys move the slide, and the controls are real buttons.
  keyboard: [
    {
      key: "ArrowLeft / ArrowRight",
      action:
        "Moves to the previous or the next slide. The handler sits on the carousel region, so the key travels up from whichever control inside it has focus. At the ends a clamped carousel stays put — the Previous control is disabled there rather than silently wrapping.",
    },
    {
      key: "Enter / Space",
      action:
        "Activates the focused control. The Previous and Next buttons and the dot indicators are real buttons, so the slide changes without a pointer.",
    },
    {
      key: "Tab",
      action:
        "Reaches the controls group as one stop and then the controls inside it. The slide wrappers are not tab stops, and an inactive slide is inert, so a long set is not walked end to end.",
    },
  ],
  customization: {
    supported: [
      "`className` on the carousel, merged after its own classes.",
      "`itemLabels` gives each slide its own accessible name, so a screen reader says what the slide is rather than only where it sits.",
      "`showIndicators` renders the dot row when the position should be visible.",
    ],
    notSupported: [
      "There is no `autoplay` prop. A carousel that moves on its own takes the decision away from the reader and is hostile to anyone reading slowly; if you need it, drive `index` yourself.",
      "There is no `orientation` prop. This is a horizontal carousel.",
      "There is no `variant` or `size` prop. The slide's layout is the caller's content.",
    ],
  },
  api: [
    {
      name: "items",
      type: "ReactNode[]",
      note: "The slides, in order. Exactly one shows at a time, so the first entry is the one everybody sees.",
    },
    {
      name: "itemKeys",
      type: "string[]",
      note: "Stable identity per slide, for React's reconciliation. Falls back to the array index, which is correct for a static set and WRONG for a reordered one — a carousel whose slides change order must pass these, or React will reuse the wrong slide's state.",
    },
    {
      name: "value",
      type: "number",
      note: "Controlled active slide. Omit for uncontrolled.",
    },
    {
      name: "defaultValue",
      type: "number",
      note: "Initial slide when uncontrolled. Slide zero is what everyone sees first.",
    },
    {
      name: "onValueChange",
      type: "(index: number) => void",
      note: "Fires when the visible slide changes, from any control or gesture.",
    },
    {
      name: "wrap",
      type: "boolean",
      default: "false",
      note: "Continue past the ends instead of disabling the control there. Material 3's default is `false`, so the ends are the ends unless you say otherwise.",
    },
    {
      name: "itemLabels",
      type: "string[]",
      note: "Per-slide accessible names. Defaults to `Slide n of total`, which is honest but says nothing about what the slide contains.",
    },
    {
      name: "label",
      type: "string",
      note: "The accessible name of the carousel region, so two carousels on a page are distinguishable.",
    },
    {
      name: "showIndicators",
      type: "boolean",
      note: "Renders the dot indicator row.",
    },
    {
      name: "disabled",
      type: "boolean | undefined",
      note: "Blocks interaction with the carousel controls.",
    },
    {
      name: "className",
      type: "string | undefined",
      note: "Merged after the carousel's own classes.",
    },
    {
      name: "testID",
      type: "string | undefined",
      note: "Test selector, rendered as `data-testid` on the region. Opt-in only — no default.",
    },
  ],
  aria: [
    "The carousel is a named region, so it appears in the landmark list and can be jumped to.",
    "Each slide has an accessible name — `itemLabels` where given, otherwise `Slide n of total`.",
    "The controls are real buttons and the position is stated, so moving through the slides is possible without a pointer.",
    "Autoplay is deliberately absent. A carousel that advances on its own takes the decision from the reader and is hostile to anyone reading slowly.",
  ],
};
