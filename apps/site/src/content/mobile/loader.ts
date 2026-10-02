import type { ComponentDoc } from "../types";

export const loader: ComponentDoc = {
  slug: "loader",
  name: "Loader",
  oneLiner:
    "Loaders are the small spinner for a wait that needs no explanation.",
  features:
    "Reach for a loader when something is in progress and the shape of the wait does not matter: a button submitting, a row refreshing, a region filling. It is the simplest member of the feedback family — a spinner in the primary colour, two sizes, an optional label. The label is worth setting even when nothing is visibly shown, because a spinner with no name is announced as nothing at all. When the wait has a measurable amount, that is `Progress`; when it lives inside a button, that is `LoadingButton`; when it needs to say what it is doing, that is `LoadingIndicator` with its label shown.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Loader",
    variants: [],
    elevation: "surface",
  },
  parts: ["Loader"],
  customization: {
    supported: [
      "`size` is the two Material 3 loader sizes, `small` and `large`.",
      "`label` names the wait. It is not rendered as visible text — that is `LoadingIndicator`'s `showLabel`.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no `color` prop. The spinner is the primary colour, resolved from the scheme.",
      "There is no `value` or `max`. A measurable amount is `Progress`; this is the unmeasured wait.",
      "There is no `showLabel`. Visible loading text is `LoadingIndicator`.",
    ],
  },
  api: [
    {
      name: "size",
      type: '"small" | "large"',
      default: '"large"',
      note: "The two Material 3 loader sizes. No custom value — the sizes are the spec's.",
    },
    {
      name: "label",
      type: "string",
      note: "The wait's accessible name. Not shown on screen. Set it anyway: a spinner with no name is announced as nothing.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
    {
      name: "loaderColor",
      type: "(scheme) => string",
      note: "The colour helper, exported. It returns the scheme's `primary` — the spinner is not coloured by a prop.",
    },
  ],
  aria: [
    "`label` is the accessible name and it is not rendered visually, so it is easy to omit and easy to regret omitting.",
    'A spinner alone conveys "working" to someone who can see it and nothing to anyone else.',
    "It reports no progress amount, so it should be used for waits whose length is genuinely unknown — a measured wait is `Progress`.",
  ],
};
