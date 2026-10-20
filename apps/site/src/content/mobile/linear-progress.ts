import type { ComponentDoc } from "../types";

export const linearProgress: ComponentDoc = {
  slug: "linear-progress",
  name: "Linear progress",
  oneLiner:
    "Linear progress is the measured bar — determinate by value, looping on null.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "LinearProgress",
    variants: [],
    elevation: "surface",
  },
  parts: ["LinearProgress"],
  // A progressbar is a STATUS, not a control: it is not an adjustable, so it
  // takes no focus and handles no key. What it reports is its value, and
  // that is the ARIA contract below — not a keyboard one. So there is no
  // keyboard contract to write, and saying so is a fact rather than a gap.
  nonInteractive: true,
  customization: {
    supported: [
      "`value` in 0–1 sets the fill. Values outside the range are clamped rather than overflowing.",
      "`value={null}` runs the indeterminate 2s loop. There is no separate boolean — a value and a mode can never contradict each other.",
      "`label` names the bar.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no `max`. The value is a 0–1 proportion.",
      "There is no `loaderStyle` or `shapes`. Those belong to `CircularProgress`, whose indeterminate mode can use them.",
    ],
  },
  api: [
    {
      name: "value",
      type: "number | null",
      note: "0–1 fills the bar; `null` runs the indeterminate loop. Out-of-range values are clamped to 0–1 rather than drawing a bar past its ends. Defaults to 0.",
    },
    {
      name: "label",
      type: "string",
      note: "The bar's accessible name.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
  ],
  aria: [
    "`label` names the bar so it is announced with what it measures.",
    "Determinate announces a real proportion; `null` announces indeterminate motion with no reading.",
  ],
};
