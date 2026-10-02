import type { ComponentDoc } from "../types";

export const sheet: ComponentDoc = {
  slug: "sheet",
  name: "Sheet",
  oneLiner:
    "The native sheet is a titled panel over the current screen, with a body and a dismissal path.",
  features:
    "Reach for the sheet when a titled surface should come up over what someone is doing and be leavable: a short form, a set of details, a confirmation. It is the plain member of the family — no snap points, no fixed action row, no picker semantics. Note the prop name before you start: this one takes `visible`, while every other sheet in the family takes `open`. It is an inconsistency in the surface, not in your reading, and the page says so rather than leaving you to wonder.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // The web counterpart IS `Sheet` on `@xoroh/kern` — same name, different
    // renderer and different shape (the web one slides from a side and is
    // composed of parts; this one is a single panel).
    nativePeer: "Sheet",
    variants: [],
    elevation: "surface",
  },
  parts: ["Sheet"],
  customization: {
    supported: [
      "`children` is the body, so what goes in the panel is entirely the caller's.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no `size`, `side` or `snapPoints` prop. Those are the other members of the family — `BottomSheet`, `SnapSheet` — and this is the plain one.",
      "There is no `actions` prop. An action row is `BottomSheet` or `ActionSheet`.",
      "There is no `dismissible` prop here. The dismissal contract is the shell's, and `SheetSurface` is where that knob lives.",
    ],
  },
  api: [
    {
      name: "visible",
      type: "boolean",
      note: "Controlled visibility. Required — and note the name: this is `visible`, while `BottomSheet`, `ActionSheet`, `SnapSheet`, `DockSheet`, `EntitySheet` and `BottomSheetPicker` all take `open`. The inconsistency is in the surface, not in your code.",
    },
    {
      name: "title",
      type: "string",
      note: "Required. Names the panel.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "The body.",
    },
    {
      name: "onDismiss",
      type: "() => void",
      note: "Fires when the panel goes away.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
    {
      name: "testID",
      type: "string",
      note: "Test hook, as elsewhere on the native surface.",
    },
  ],
  aria: [
    "The panel is named by `title`, so what has come up is announced rather than only that something did.",
    "It dismisses through `onDismiss`, which is where the host wires scrim press and hardware back.",
    "The `visible` naming is a real inconsistency across the family and is documented here rather than left for someone to discover in the type.",
  ],
};
