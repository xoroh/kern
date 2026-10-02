import type { ComponentDoc } from "../types";

export const linearProgress: ComponentDoc = {
  slug: "linear-progress",
  name: "Linear progress",
  oneLiner:
    "Linear progress is the measured bar — determinate only, with no looping mode.",
  features:
    'Reach for linear progress when the wait has a known amount and a horizontal bar is the right shape: an upload, a build step, a fill. `value` is required and the component is determinate only — there is no indeterminate mode and no way to ask for one. That is a real limitation and not an oversight: Material 3 has the role, but the engine for its loop is not shipped yet, so it is tracked as an open item rather than faked. If the length is genuinely unknown, use `CircularProgress` without a value or a `Loader`, which say "working" without implying a quantity.',
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "LinearProgress",
    variants: [],
    elevation: "surface",
  },
  parts: ["LinearProgress"],
  customization: {
    supported: [
      "`value` in 0–1 sets the fill. Values outside the range are clamped rather than overflowing.",
      "`label` names the bar.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no indeterminate mode. `value` is REQUIRED — see the note below. It is a tracked open item, not a design decision.",
      "There is no `max`. The value is a 0–1 proportion.",
      "There is no `loaderStyle` or `shapes`. Those belong to `CircularProgress`, whose indeterminate mode can use them.",
    ],
  },
  api: [
    {
      name: "value",
      type: "number",
      note: "REQUIRED, and 0–1. Determinate only. Out-of-range values are clamped to 0–1 rather than drawing a bar past its ends.",
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
    {
      name: "indeterminate",
      type: "—",
      note: "Does not exist. Material 3 has the role; the engine for its loop is not shipped yet. It is tracked as an OPEN ITEM rather than approximated, so nothing here renders a fake one.",
    },
  ],
  aria: [
    "`label` names the bar so it is announced with what it measures.",
    "It is always determinate, so what is announced is a real proportion rather than a claim of motion.",
    'The absence of an indeterminate mode is stated rather than hidden: an unknown-length wait should use a component that says "working" honestly instead of one that would have to invent a quantity.',
  ],
};
