import type { ComponentDoc } from "../types";

export const sheet: ComponentDoc = {
  slug: "sheet",
  name: "Sheet",
  oneLiner:
    "The native sheet is a titled panel over the current screen, with a body and a dismissal path.",
  features:
    "Reach for the sheet when a titled surface should come up over what someone is doing and be leavable: a short form, a set of details, a confirmation. It is the plain member of the family — no snap points, no fixed action row, no picker semantics. Visibility is `open` with `onOpenChange` reporting state, like every other sheet in the family and like the dialog.",
  meta: {
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
  usage: {
    do: [
      "Name the panel with `title` — it is the accessible label.",
      "Drive `open` from state and mirror `onOpenChange` so dismiss paths (scrim, back, close control) stay in sync.",
      "Reach for `BottomSheet` or `SnapSheet` when the panel needs snap points or an action row — this one is the plain panel.",
    ],
    dont: [
      "Don't load a full task into a sheet — a route owns long work, a sheet owns a decision.",
      "Don't hide the only dismissal in a custom child — the close control must stay reachable.",
    ],
  },
  tokens: [
    {
      element: "Surface",
      state: "resting",
      token: "theme.color.surfaceContainerLow",
      value: "surfaceContainerLow",
    },
    {
      element: "Dismiss control",
      state: "resting",
      token: "theme.color.onSurfaceVariant",
      value: "onSurfaceVariant, minHeight 48, minWidth 48",
    },
  ],
  faq: [
    {
      q: "`open` or `onDismiss` — which owns the state?",
      a: "`open`/`onOpenChange` own the state. `onDismiss` is the dismissal action, fired alongside the `false` report on every dismissal path.",
    },
    {
      q: "Sheet, BottomSheet, or SnapSheet?",
      a: "Sheet is the plain titled panel. BottomSheet adds the action row; SnapSheet adds snap-point detents. Pick the smallest member that carries the content.",
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
