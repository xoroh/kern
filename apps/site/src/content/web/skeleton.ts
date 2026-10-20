import type { ComponentDoc } from "../types";

export const skeleton: ComponentDoc = {
  slug: "skeleton",
  name: "Skeleton",
  oneLiner:
    "Skeletons stand in for content that is still loading, in the shape it will have.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Skeleton",
    variants: [],
    elevation: "surface",
  },
  parts: ["Skeleton"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  // M2: a skeleton takes no focus and exposes no ARIA state — an empty
  // accessibility section is a FACT here, not a gap.
  nonInteractive: true,
  customization: {
    supported: [
      "`className` is passed through and merged after the skeleton's own classes, which is how its size and shape are chosen.",
      "It is a plain placeholder block, so several of them compose into the shape of the content they stand in for.",
    ],
    notSupported: [
      "There is no `width`/`height`/`lines` prop. The shape is `className`'s job, because only the caller knows what is coming.",
      "There is no `animate` prop. Whether it shimmers is the caller's CSS.",
      "There is no `variant` for text versus circle versus rectangle. All three are the same block at different `className`.",
    ],
  },
  api: [
    {
      name: "className",
      type: "string",
      note: "Merged after the skeleton's own classes. This is where the shape comes from — a skeleton has no intrinsic dimensions.",
    },
    {
      name: "ref",
      type: "React.Ref<HTMLDivElement>",
      note: "Forwarded to the underlying `<div>`.",
    },
    {
      name: "aria-hidden",
      type: "boolean",
      note: "Set it. A skeleton is a placeholder and means nothing to anyone who cannot see it, so it should not be announced.",
    },
  ],
  aria: [
    "A skeleton carries no information, so it should be hidden from assistive tech — `aria-hidden` is the default expectation rather than an optional nicety.",
    "The state it stands in for is what needs announcing: mark the region busy rather than describing the grey boxes.",
    "Because the shape is the caller's, the skeleton has no accessible name and needs none.",
  ],
};
