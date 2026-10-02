import type { ComponentDoc } from "../types";

export const meter: ComponentDoc = {
  slug: "meter",
  name: "Meter",
  oneLiner:
    "Meters show a value against a range, so a quantity can be read at a glance.",
  features:
    "Reach for a meter when the number has a meaning that depends on where it sits: a quota filling up, a score against a maximum, a level running low. Unlike a slider it is read-only — a meter reports, it does not collect. Show the number as well as the bar, because the bar says roughly and the number says what. If the value is a progress through something still running, that is a progress indicator, not a meter: a meter's range is meaningful at rest.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Meter",
    // No variant axis. One treatment.
    variants: [],
    elevation: "surface",
  },
  parts: ["Meter", "MeterRoot", "MeterLabel", "MeterValue"],
  anatomy: [
    {
      name: "MeterRoot",
      role: "The gauge. Owns the value and the range, and renders the track.",
    },
    { name: "MeterLabel", role: "Names what is being measured." },
    {
      name: "MeterValue",
      role: "Renders the number beside the track, so the reading is a value and not only a length.",
    },
    { name: "Meter", role: "The namespace object: Root, Label and Value." },
  ],
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
      type: "number",
      note: "The current reading on `MeterRoot`.",
    },
    {
      name: "min",
      type: "number",
      note: "Bottom of the range.",
    },
    {
      name: "max",
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
  ],
  aria: [
    "The gauge is a meter-role element with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`, so the reading is announced as a number rather than as a bar width.",
    "`MeterLabel` names it, so a screen reader says what is being measured before it says how much.",
    "It is read-only and takes no focus — a meter reports a value and does not collect one.",
    "Because the range is meaningful at rest, do not use a meter for something still in progress; use a progress indicator.",
  ],
};
