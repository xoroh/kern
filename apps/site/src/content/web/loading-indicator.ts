import type { ComponentDoc } from "../types";

export const loadingIndicator: ComponentDoc = {
  slug: "loading-indicator",
  name: "Loading indicator",
  oneLiner:
    "Loading indicators are the labelled spinner — a wait with its name attached.",
  meta: {
    // Canonical M3 spec page — title identity-verified live; gate re-checks.
    specUrl: "https://m3.material.io/components/loading-indicator",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "LoadingIndicator",
    variants: ["size · tone · shapes · loaderStyle"],
    elevation: "surface",
  },
  parts: ["LoadingIndicator"],
  // A loading indicator is a STATUS, not a control: it is a polite live
  // region that takes no focus and answers no key, so there is no keyboard
  // contract to write. What it announces is the aria contract below.
  nonInteractive: true,
  customization: {
    supported: [
      "`size` and `tone` come from the feedback scale, so the indicator matches the rest of the family.",
      "`shapes` and `loaderStyle` pick the heritage shape set and the indicator — the brand is data, not a hard-coded illustration.",
      "`showLabel` renders the label as visible text beside the indicator, so one component covers the labelled and the announced cases.",
    ],
    notSupported: [
      "There is no `progress` or `value` prop. This is an indeterminate wait; a measured one is `Progress`.",
      "There is no `inline` versus `block` prop. Placement is the caller's layout.",
    ],
  },
  api: [
    {
      name: "label",
      type: "string",
      note: "The accessible name, AND the visible text when `showLabel` is set. One string serves both, so the two cannot disagree.",
    },
    {
      name: "showLabel",
      type: "boolean",
      note: "Renders `label` as visible text beside the indicator rather than only announcing it.",
    },
    {
      name: "size",
      type: "FeedbackSize",
      note: "From the feedback scale.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the indicator's own classes.",
    },
  ],
  aria: [
    "`label` is the accessible name, so the wait is announced as what it is rather than as an unnamed spinner.",
    "The same string is the visible text when `showLabel` is set, so what a sighted reader reads and what a screen reader announces cannot drift apart.",
    "It takes no focus and does not announce itself on arrival — a wait is a state, not an event.",
  ],
};
