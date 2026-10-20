import type { ComponentDoc } from "../types";

export const circularProgress: ComponentDoc = {
  slug: "circular-progress",
  name: "Circular progress",
  oneLiner: "Circular progress shows how much of a task is done, as a ring.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "CircularProgress",
    variants: [],
    elevation: "surface",
  },
  parts: ["CircularProgress"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  // A progress ring is a STATUS, not a control: it takes no focus and
  // handles no keys, so there is no keyboard contract to write. What it
  // announces is the aria contract below.
  nonInteractive: true,
  customization: {
    supported: [
      "`className` is passed through and merged after the indicator's own classes, which is how its size and colour are set.",
      "Determinate and indeterminate are both supported — a value makes it a measured ring, and no value gives the loop.",
    ],
    notSupported: [
      "There is no `size` prop. The diameter is `className`, because the right size depends on where the ring sits.",
      "There is no `thickness` prop for the ring's stroke.",
      "There is no `label` prop. What is running is the surrounding content's to say.",
    ],
  },
  api: [
    {
      name: "value",
      type: "number | null",
      note: "How much is done. A number is determinate; leaving it unset gives the indeterminate loop — the same convention `Progress` uses, with no separate boolean.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the indicator's own classes. Size and colour come from here.",
    },
    {
      name: "aria-label",
      type: "string",
      note: "Names the indicator when the surrounding content does not.",
    },
    {
      name: "loaderStyle",
      type: "LoadingIndicatorStyle | undefined",
      note: "Loading-indicator style for indeterminate waits. Determinate renders the M3 circular arc regardless of style — known progress means determinate.",
    },
    {
      name: "size",
      type: '"sm" | "lg" | "md" | undefined',
      note: "Density size. Defaults to `md`.",
    },
    {
      name: "shapes",
      type: "readonly FeedbackShapeKind[] | undefined",
      note: "Shapes for the `shapes` style. Defaults to the brand trio.",
    },
    {
      name: "tenantId",
      type: "string | undefined",
      note: "Tenant variant override; unknown ids fail loud.",
    },
    {
      name: "label",
      type: "string | undefined",
      note: "Accessible label for the indicator.",
    },
    {
      name: "fourColor",
      type: "boolean | undefined",
      note: "Cycles the indeterminate arc through primary, primary-container, tertiary and tertiary-container instead of holding the current color.",
    },
  ],
  aria: [
    "It is a progressbar with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`, so the amount done is announced as a number.",
    "Indeterminate omits `aria-valuenow`, which is how a screen reader says the remainder is unknown rather than announcing a figure that is not true.",
    "Where the ring sits inside something that already says what is happening, the ring itself can be `aria-hidden` and the state left to the container.",
  ],
};
