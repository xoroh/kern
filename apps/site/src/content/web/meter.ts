import type { ComponentDoc } from "../types";

export const meter: ComponentDoc = {
  slug: "meter",
  name: "Meter",
  oneLiner:
    "Meters show a value against a range, so a quantity can be read at a glance.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Meter",
    // No variant axis. One treatment.
    variants: [],
    elevation: "surface",
  },
  parts: ["Meter", "MeterRoot", "MeterLabel", "MeterValue"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  // M2: a meter REPORTS a reading; it does not collect one. It is a
  // meter-role element that takes no focus and answers no key, so the ARIA
  // contract below is the whole story.
  nonInteractive: true,
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "The track and fill use the system roles, so a theme moves every meter at once.",
      "`MeterValue` is its own part, so the number can sit where the layout wants it or be left off entirely.",
    ],
    notSupported: [
      "There is no `variant` or `tone` prop. A meter does not carry a good/bad judgement — colouring a value as success or error is the caller's call and the caller's meaning.",
      "There is no `size` or `thickness` prop. One height.",
      "There is no `showValue` boolean. Render `MeterValue` where you want the number and omit it where you do not.",
    ],
  },
  api: [
    {
      name: "value",
      for: ["MeterRoot"],
      type: "number",
      note: "The current reading on `MeterRoot`.",
    },
    {
      name: "min",
      for: ["MeterRoot"],
      type: "number",
      note: "Bottom of the range.",
    },
    {
      name: "max",
      for: ["MeterRoot"],
      type: "number",
      note: "Top of the range.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "On `MeterValue`: how the reading is rendered. Supply it when a raw number needs units or formatting.",
    },
    {
      name: "style",
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `MeterRootState` on the meter, `MeterLabelState` on the label.",
    },
    {
      name: "aria-valuetext",
      for: ["MeterRoot"],
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
      for: ["MeterRoot"],
      type: "LocalesArgument",
      note: "Locale for `Intl.NumberFormat` when rendering the value. Defaults to the runtime locale.",
    },
    {
      name: "format",
      for: ["MeterRoot"],
      type: "NumberFormatOptions | undefined",
      note: "Options to format the value.",
    },
    {
      name: "getAriaValueText",
      for: ["MeterRoot"],
      type: "((formattedValue: string, value: number) => string) | undefined",
      note: "Computes the spoken value for `aria-valuenow` — what screen reader users hear instead of the bare number.",
    },
  ],
  aria: [
    "The gauge is a meter-role element with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`, so the reading is announced as a number rather than as a bar width.",
    "`MeterLabel` names it, so a screen reader says what is being measured before it says how much.",
    "It is read-only and takes no focus — a meter reports a value and does not collect one.",
    "Because the range is meaningful at rest, do not use a meter for something still in progress; use a progress indicator.",
  ],
};
