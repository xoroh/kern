import type { ComponentDoc } from "../types";

export const iconButtonTarget: ComponentDoc = {
  slug: "icon-button-target",
  name: "Icon button target",
  oneLiner:
    "Icon button targets are the touch-target wrapper that brings a small button up to the platform minimum.",
  features:
    "Reach for an icon button target wherever an icon button sits in a toolbar or a tight row and needs its full touch area. It exists for one reason and the source states it: the platform minimum touch target is larger than the icon button's own box, so a toolbar needs this to guarantee the rest of the target. That gap is exactly the kind of failure nobody notices until they try to tap it — the button looks right, and the part of it that responds is smaller than the part that looks tappable. Wrapping is cheap and the alternative is a control that misses one tap in several.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Native-only utility wrapper. Web sizes its hit area with CSS padding and
    // has no separate export for it.
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: ["IconButtonTarget"],
  customization: {
    supported: [
      "`children` is the control being given a full target.",
      "`style` extends the wrapper, and the 48x48 minimum is the base.",
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
      note: "React Native styles, applied over the 48x48 minimum.",
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
