import type { ComponentDoc } from "../types";

export const loadingIndicator: ComponentDoc = {
  slug: "loading-indicator",
  name: "Loading indicator",
  oneLiner:
    "Loading indicators are the labelled spinner — a wait with its name attached.",
  features:
    "Reach for a loading indicator when the wait needs to say what it is for: a region fetching its content, a step in a wizard, a background sync. The label is the difference between this and a bare `Loader` — it names the wait instead of leaving someone to guess. Whether the label is visible or only announced is a prop, so the same component serves the inline and the announced cases. If the wait has a knowable length, that is progress rather than a spinner.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "LoadingIndicator",
    variants: ["size · tone · shapes · loaderStyle"],
    elevation: "surface",
  },
  parts: ["LoadingIndicator"],
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
      name: "tone",
      type: "FeedbackTone",
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
