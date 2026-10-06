import type { ComponentDoc } from "../types";

export const carousel: ComponentDoc = {
  slug: "carousel",
  name: "Carousel",
  oneLiner:
    "Carousels show one slide at a time from a set, moved through with controls or by gesture.",
  features:
    "Reach for a carousel when the content is a small set of comparable things and showing one at a time is worth the cost of hiding the rest: a gallery of photos, a rotating set of featured items. Show the controls and the position, because content nobody can reach is content nobody sees. Be honest about the trade — anything past the first slide is seen by fewer people, so put the thing that matters first. If all the content matters equally, show it all; a carousel is a way to fit more in less space, not a way to present more.",
  meta: {
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
      name: "index",
      type: "number",
      note: "Controlled active slide. Omit for uncontrolled.",
    },
    {
      name: "defaultIndex",
      type: "number",
      note: "Initial slide when uncontrolled. Slide zero is what everyone sees first.",
    },
    {
      name: "onIndexChange",
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
  ],
  aria: [
    "The carousel is a named region, so it appears in the landmark list and can be jumped to.",
    "Each slide has an accessible name — `itemLabels` where given, otherwise `Slide n of total`.",
    "The controls are real buttons and the position is stated, so moving through the slides is possible without a pointer.",
    "Autoplay is deliberately absent. A carousel that advances on its own takes the decision from the reader and is hostile to anyone reading slowly.",
  ],
};
