import type { ComponentDoc } from "../types";

export const linearProgress: ComponentDoc = {
  slug: "linear-progress",
  name: "Linear progress",
  oneLiner:
    "Linear progress shows how much of a task is done, as a bar across a width.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "LinearProgress",
    variants: [],
    elevation: "surface",
  },
  parts: ["LinearProgress"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  // A progressbar is a STATUS, not a control: it is not a slider, so it
  // takes no focus and handles no key. What it reports is its value, and
  // that is the ARIA contract below — not a keyboard one. So there is no
  // keyboard contract to write, and saying so is a fact rather than a gap.
  nonInteractive: true,
  customization: {
    supported: [
      "`className` is passed through and merged after the bar's own classes, which is how its height and colour are set.",
      "Determinate and indeterminate are both supported — a value fills the bar, `null` gives the travelling loop.",
    ],
    notSupported: [
      "There is no `size` or `thickness` prop. The height is `className`.",
      "There is no `indeterminate` boolean. Passing `value={null}` is that state, matching `Progress` and `CircularProgress` — one convention across all three.",
      "There is no `label` prop. What is running is the surrounding content's to say.",
    ],
  },
  api: [
    {
      name: "value",
      type: "number | null",
      note: "How much is done. A number fills the bar; `null` gives the indeterminate loop. There is no separate `indeterminate` prop — the three progress components share one convention.",
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
    {
      name: "fourColor",
      type: "boolean | undefined",
      note: "Cycles the indeterminate bars through primary, primary-container, tertiary and tertiary-container instead of holding primary.",
    },
    {
      name: "buffer",
      type: "number | undefined",
      note: "Buffer level from 0 to 1, rendered as dots behind the bar: known progress in the bar, unknown progress in the buffer.",
    },
    {
      name: "stop",
      type: "boolean | undefined",
      note: "M3 stop indicator: a primary circle marking the end of the track. Determinate only.",
    },
    {
      name: "wavy",
      type: "boolean | undefined",
      note: "M3 expressive wavy indicator (determinate only) at the platform wave geometry. Indeterminate ignores it; the loops have no wave phase. Web-only: native has no SVG engine to draw the wave with.",
    },
    {
      name: "label",
      type: "string | undefined",
      note: "Accessible label for the bar.",
    },
  ],
  aria: [
    "It is a progressbar with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`, so the amount done is announced as a number rather than as a width.",
    "Indeterminate omits `aria-valuenow`, so the remainder is reported as unknown rather than as a figure that is not true.",
    "Where the bar spans a region that already says what is loading, the bar can be `aria-hidden` and the state left to the container.",
  ],
};
