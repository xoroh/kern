import type { ComponentDoc } from "../types";

export const iconButtonTarget: ComponentDoc = {
  slug: "icon-button-target",
  name: "Icon button target",
  oneLiner:
    "Icon button targets are the touch-target wrapper that brings a small button up to the platform minimum.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // Native-only utility wrapper. Web sizes its hit area with CSS padding and
    // has no separate export for it.
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: ["IconButtonTarget"],
  // M2: the wrapper is a LAYOUT box, not a control. It takes no focus and
  // answers no key — it enlarges the AREA, and the control inside keeps its
  // own name, role and keyboard behaviour.
  nonInteractive: true,
  customization: {
    supported: [
      "`children` is the control being given a full target.",
      "`style` extends the wrapper, and the platform minimum touch target is the base.",
    ],
    notSupported: [
      "There is no `size` prop. The wrapper is the minimum touch target and that is the floor — making it smaller would defeat it.",
      "It is not pressable itself. It is a target AREA; the control inside responds.",
    ],
  },
  api: [
    {
      name: "children",
      type: "ReactNode",
      note: "The control being given a full target — typically an `IconButton`.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles, applied over the platform minimum touch target.",
    },
    {
      name: "minimum box",
      type: "the platform minimum touch target",
      note: "The wrapper is at least the platform minimum touch target on both axes. The icon button's own box is smaller; this guarantees the rest of the target.",
    },
  ],
  aria: [
    "This is an accessibility component before it is a layout one: a control smaller than the platform minimum is one that misses taps, and motor-impaired users feel it first.",
    "It is not itself focusable or pressable — it enlarges the AREA, and the control inside keeps its own name and role.",
    "The default `testID` is `kern-icon-button-target`, so the wrapper can be found in tests without being named at every call site.",
  ],
};
