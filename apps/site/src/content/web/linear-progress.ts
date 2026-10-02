import type { ComponentDoc } from "../types";

export const linearProgress: ComponentDoc = {
  slug: "linear-progress",
  name: "Linear progress",
  oneLiner:
    "Linear progress shows how much of a task is done, as a bar across a width.",
  features:
    "Reach for linear progress when the wait should span the region it belongs to: loading a page's content, filling a quota over time, processing a file. It is the shape that reads as a measure along an axis, which is why it is what a full-width wait wants. Show the number beside it where the wait is long enough for the number to help. If the value is meaningful at rest, that is a meter; if the shape should sit inside a small control, that is a circular progress.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "LinearProgress",
    variants: [],
    elevation: "surface",
  },
  parts: ["LinearProgress"],
  customization: {
    supported: [
      "`className` is passed through and merged after the bar's own classes, which is how its height and colour are set.",
      "Determinate and indeterminate are both supported — a value fills the bar, no value gives the travelling loop.",
    ],
    notSupported: [
      "There is no `size` or `thickness` prop. The height is `className`.",
      "There is no `indeterminate` boolean. Leaving `value` unset is that state, matching `Progress` and `CircularProgress` — one convention across all three.",
      "There is no `label` prop. What is running is the surrounding content's to say.",
    ],
  },
  api: [
    {
      name: "value",
      type: "number | null",
      note: "How much is done. A number fills the bar; leaving it unset gives the indeterminate loop. There is no separate `indeterminate` prop — the three progress components share one convention.",
    },
    {
      name: "max",
      type: "number",
      note: "What the whole task is. The bar fills relative to this.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the bar's own classes. Height and colour come from here.",
    },
    {
      name: "aria-label",
      type: "string",
      note: "Names the bar when the surrounding content does not.",
    },
  ],
  aria: [
    "It is a progressbar with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`, so the amount done is announced as a number rather than as a width.",
    "Indeterminate omits `aria-valuenow`, so the remainder is reported as unknown rather than as a figure that is not true.",
    "Where the bar spans a region that already says what is loading, the bar can be `aria-hidden` and the state left to the container.",
  ],
};
