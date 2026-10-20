import type { ComponentDoc } from "../types";

export const progress: ComponentDoc = {
  slug: "progress",
  name: "Progress",
  oneLiner:
    "Progress indicators show how much of something is done while it is still running.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Progress",
    // No variant axis. Determinate and indeterminate are states of the same
    // control, not treatments.
    variants: [],
    elevation: "surface",
  },
  parts: ["Progress", "ProgressRoot", "ProgressLabel", "ProgressValue"],
  // M2: a progress indicator REPORTS on work happening elsewhere. It is a
  // progressbar, it takes no focus and it answers no key — so there is no
  // keyboard contract to write, and the ARIA contract below is the whole
  // story.
  nonInteractive: true,
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
      for: ["ProgressRoot"],
      type: "number | null",
      note: "How much is done on `ProgressRoot`. A number is determinate; leaving it unset is the indeterminate state — there is no separate `indeterminate` prop.",
    },
    {
      name: "max",
      for: ["ProgressRoot"],
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
    {
      name: "style",
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `ProgressRootState` on the bar, `ProgressLabelState` on the label.",
    },
    {
      name: "aria-valuetext",
      for: ["ProgressRoot"],
      type: "string | undefined",
      note: "Spoken value for assistive tech, in place of the raw `aria-valuenow`. A description, not a name.",
    },
    {
      name: "render",
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag or composes it with another component — the render function receives the part's props and state.",
    },
    {
      name: "locale",
      for: ["ProgressRoot"],
      type: "LocalesArgument",
      note: "Locale for `Intl.NumberFormat` when rendering the value. Defaults to the runtime locale.",
    },
    {
      name: "min",
      for: ["ProgressRoot"],
      type: "number | undefined",
      note: "Bottom of the range. Defaults to 0 with `max` at 100.",
    },
    {
      name: "format",
      for: ["ProgressRoot"],
      type: "NumberFormatOptions | undefined",
      note: "Options to format the value.",
    },
    {
      name: "getAriaValueText",
      for: ["ProgressRoot"],
      type: "((formattedValue: string, value: number | null) => string) | undefined",
      note: "Computes the spoken value for `aria-valuenow` — what screen reader users hear instead of the bare number.",
    },
  ],
  aria: [
    "The gauge is a progressbar with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`, so the amount done is announced as a number rather than as a bar width.",
    "Indeterminate progress omits `aria-valuenow`, which is how a screen reader says it cannot state how much is left — rather than announcing a percentage that is not true.",
    "`ProgressLabel` names it, so the announcement says what is running before it says how far along.",
    "It is read-only and takes no focus. The work is elsewhere; the indicator only reports on it.",
  ],
};
