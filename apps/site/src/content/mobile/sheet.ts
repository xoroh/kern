import type { ComponentDoc } from "../types";

export const sheet: ComponentDoc = {
  slug: "sheet",
  name: "Sheet",
  oneLiner:
    "The native sheet is a titled panel over the current screen, with a body and a dismissal path.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // The web counterpart IS `Sheet` on `@xoroh/kern` — same name, different
    // renderer and different shape (the web one slides from a side and is
    // composed of parts; this one is a single panel).
    nativePeer: "Sheet",
    variants: [],
    elevation: 0,
  },
  parts: ["Sheet"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  keyboard: [
    {
      key: "Android back button",
      action:
        "Dismisses through the shell — fires `onDismiss` and reports `onOpenChange(false)`.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "The `title` announces when the panel appears; the dismiss control reads as a button and double-tap leaves.",
    },
  ],
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
      name: "open",
      type: "boolean",
      default: "false",
      note: "Controlled visibility, like `BottomSheet`, `ActionSheet` and `SnapSheet`.",
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
      name: "onOpenChange",
      type: "(open: boolean) => void",
      note: "State report — fired with `false` alongside `onDismiss` on every dismissal path.",
    },
    {
      name: "onDismiss",
      type: "() => void",
      note: "Dismissal action — what happens when the panel goes away. State itself is `open`/`onOpenChange`.",
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
  ],
};
