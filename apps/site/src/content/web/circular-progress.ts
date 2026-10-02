import type { ComponentDoc } from "../types";

export const circularProgress: ComponentDoc = {
  slug: "circular-progress",
  name: "Circular progress",
  oneLiner: "Circular progress shows how much of a task is done, as a ring.",
  features:
    "Reach for a circular progress when the wait is short and the ring should sit in the thing it reports on: a button's leading slot, a card's centre, a list row. It is the shape that fits a square hole, which is why it is what `LoadingButton` embeds. Show the number where the wait is long enough for the number to help. If the value is meaningful at rest, that is a meter; if the shape should span the width of a region, that is linear progress.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "CircularProgress",
    variants: [],
    elevation: "surface",
  },
  parts: ["CircularProgress"],
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
      name: "max",
      type: "number",
      note: "What the whole task is. The ring is drawn relative to this.",
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
  ],
  aria: [
    "It is a progressbar with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`, so the amount done is announced as a number.",
    "Indeterminate omits `aria-valuenow`, which is how a screen reader says the remainder is unknown rather than announcing a figure that is not true.",
    "Where the ring sits inside something that already says what is happening, the ring itself can be `aria-hidden` and the state left to the container.",
  ],
};
