import type { ComponentDoc } from "../types";

export const progress: ComponentDoc = {
  slug: "progress",
  name: "Progress",
  oneLiner:
    "Progress reports how far along something is, as an amount out of a maximum.",
  features:
    "Reach for progress when the wait has a measurable amount and showing it helps: an upload, a build, a multi-step task. It takes a value and a maximum and reports the proportion, which is the whole difference between it and the loaders — those describe a wait, this measures one. Prefer it over a spinner whenever the number is genuinely known, because an unmeasured wait shown as unmeasured makes people wait worse than they need to. Note it names its accessible name `accessibilityLabel`, where `LoadingIndicator` calls the same thing `label` — the two do not share a prop name despite doing the same job.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Progress",
    variants: [],
    elevation: "surface",
  },
  parts: ["Progress"],
  customization: {
    supported: [
      "`value` and `max` set the amount, so the proportion is derived rather than passed in as a percentage.",
      "`accessibilityLabel` names the progress.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no `size` or `variant` prop. The shape is the shape; `CircularProgress` and `LinearProgress` are the specific forms.",
      "There is no `label` prop — the name is `accessibilityLabel` here, unlike `LoadingIndicator`.",
      "There is no `indeterminate` prop. An unmeasured wait is a loader, not a progress bar.",
    ],
  },
  api: [
    {
      name: "value",
      type: "number",
      note: "The amount done. Combined with `max` to derive the proportion — you do not pass a percentage.",
    },
    {
      name: "max",
      type: "number",
      note: "The amount at completion.",
    },
    {
      name: "accessibilityLabel",
      type: "string",
      note: "The progress's accessible name. Note the prop is named `accessibilityLabel` here and `label` on `LoadingIndicator` — same job, different name, so copying a call across needs renaming.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
  ],
  aria: [
    '`accessibilityLabel` names it, so the announcement is "<name>" rather than an anonymous bar.',
    "It measures rather than describes, so it is the right form whenever the amount is genuinely known.",
    'There is no indeterminate mode. An unknown-length wait should use `Loader` or `LoadingIndicator`, which say "working" without implying a quantity they cannot show.',
  ],
};
