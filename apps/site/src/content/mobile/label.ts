import type { ComponentDoc } from "../types";

export const label: ComponentDoc = {
  slug: "label",
  name: "Label",
  oneLiner:
    "Labels are text rendered in the label style — the typographic role, not the wiring.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Label",
    variants: [],
    elevation: "surface",
  },
  parts: ["Label"],
  // A label is TEXT in the label type role: it takes no focus and handles no
  // keys. Naming a control is `Field.Root`'s `label`, and that is where the
  // keyboard behaviour lives.
  nonInteractive: true,
  customization: {
    supported: [
      "It is `TextProps`, so everything `Text` takes — `style`, `numberOfLines`, `onPress` and the rest.",
      "`style` is a React Native `TextStyle` and merges with the label role's own style.",
    ],
    notSupported: [
      "There is no `htmlFor` or `for` prop. Naming a control is `Field.Root`'s `label`, which does it through context.",
      "There is no `required` or `optional` prop, and no marker.",
      'There is no `variant` prop — it is already `variant="label"`. That is the entire component.',
    ],
  },
  api: [
    {
      name: "props",
      type: "TextProps",
      note: 'Exactly `TextProps`. The implementation is `<Text variant="label" {...props} />` — the type role and nothing more.',
    },
  ],
  aria: [
    "IMPORTANT: this does NOT name a control. It renders text; the accessible name of an input comes from `Field.Root`'s `label`, which publishes through context, or from `accessibilityLabel` set directly.",
    "Using this to label an input produces text that looks correct and is not associated with anything — the failure is invisible unless you check with a screen reader.",
    "When you do want the styling only, it is a `Text`, so it reads as ordinary text in the order it appears.",
  ],
};
