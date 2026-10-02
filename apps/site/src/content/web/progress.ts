import type { ComponentDoc } from "../types";

export const progress: ComponentDoc = {
  slug: "progress",
  name: "Progress",
  oneLiner:
    "Progress indicators show how much of something is done while it is still running.",
  features:
    "Reach for progress when work is happening and the person is waiting: a file uploading, a build running, a form submitting. Show the number as well as the bar wherever you can, because a bar alone says roughly and waiting is easier when roughly becomes a figure. Indeterminate progress is the honest state when you genuinely do not know how much is left — a fake percentage is worse than admitting it. If the value is complete and meaningful at rest, that is a meter, not progress: progress is only meaningful while it moves.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Progress",
    // No variant axis. Determinate and indeterminate are states of the same
    // control, not treatments.
    variants: [],
    elevation: "surface",
  },
  parts: ["Progress", "ProgressRoot", "ProgressLabel", "ProgressValue"],
  anatomy: [
    {
      name: "ProgressRoot",
      role: "The gauge. Owns the value and the range, and renders the track.",
    },
    { name: "ProgressLabel", role: "Names what is being done." },
    {
      name: "ProgressValue",
      role: "Renders the figure beside the track, so waiting is easier with a number than with a length.",
    },
    { name: "Progress", role: "The namespace object: Root, Label and Value." },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "The track and fill use the system roles, so a theme moves every indicator at once.",
      "`ProgressValue` is its own part, so the figure can sit where the layout wants it or be left off.",
    ],
    notSupported: [
      "There is no `variant` or `tone` prop. A progress indicator does not judge the work — whether it is going well is the caller's meaning.",
      "There is no `indeterminate` prop. Leaving the value unset is how the indeterminate state is expressed; a separate boolean would be two ways to say one thing.",
      "There is no `size` or `thickness` prop. One height.",
    ],
  },
  api: [
    {
      name: "value",
      type: "number | null",
      note: "How much is done on `ProgressRoot`. A number is determinate; leaving it unset is the indeterminate state — there is no separate `indeterminate` prop.",
    },
    {
      name: "max",
      type: "number",
      note: "What the whole job is. The bar is filled relative to this.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "On `ProgressValue`: how the figure is rendered. Supply it when a bare number needs units or a percentage format.",
    },
  ],
  aria: [
    "The gauge is a progressbar with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`, so the amount done is announced as a number rather than as a bar width.",
    "Indeterminate progress omits `aria-valuenow`, which is how a screen reader says it cannot state how much is left — rather than announcing a percentage that is not true.",
    "`ProgressLabel` names it, so the announcement says what is running before it says how far along.",
    "It is read-only and takes no focus. The work is elsewhere; the indicator only reports on it.",
  ],
};
