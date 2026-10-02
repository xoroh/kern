import type { ComponentDoc } from "../types";

export const label: ComponentDoc = {
  slug: "label",
  name: "Label",
  oneLiner:
    "Labels are text rendered in the label style — the typographic role, not the wiring.",
  features:
    "Reach for a label when you want text in Material 3's label typography. It is `Text` with `variant=\"label\"` and nothing else, which is worth being clear about: this is the type ROLE, and it does not by itself name a control. If you want a control to be named, that is `Field.Root`'s `label` — which publishes through context and becomes the control's accessible name automatically. Reaching for this component to label an input would give you text that looks right and names nothing. It is for the cases where the label style is what you want: a row header in a list, a small caption in a form you are laying out by hand.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Label",
    variants: [],
    elevation: "surface",
  },
  parts: ["Label"],
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
