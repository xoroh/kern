import type { ComponentDoc } from "../types";

export const snapSheet: ComponentDoc = {
  slug: "snap-sheet",
  name: "Snap sheet",
  oneLiner:
    "Snap sheets settle at one of a few fixed heights, so a panel can be half open or fully open.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // No web counterpart: the web `Sheet` is a side panel at one size. There
    // is no export to name as a peer.
    nativePeer: "none",
    variants: [],
    // Level 0: the native modal sheets carry no elevation token (flat;
    // web rests at level 1). Whether flat-native is deliberate or missing
    // elevation is an open owner question — this claims the shipped value.
    elevation: 0,
  },
  parts: ["SnapSheet"],
  // The contract, read off the component: the handle is an adjustable that
  // advances the snap point, and the sheet is hosted in the shared modal.
  keyboard: [
    {
      key: "Double-tap (TalkBack / VoiceOver)",
      action:
        "Presses the handle, which advances to the next snap point. The handle is an adjustable that announces the current point by its label, so where the sheet is resting is spoken rather than shown.",
    },
    {
      key: "Android hardware back",
      action:
        "Closes the sheet, through the same dismissal a scrim press uses — the modal's request-close is wired to the sheet's own dismissal handler.",
    },
  ],
  customization: {
    supported: [
      "`snapPoints` declares the resting heights as viewport fractions with labels, so the set is a decision rather than a guess.",
      "`value`/`onValueChange` let the host own which point is showing — the sheet reports and the host decides.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no `defaultSnap` or `detent` prop. The resting heights are `snapPoints`, and the current one is `index`.",
      "There is no `gesture` or `draggable` prop. The component renders the requested point and lets the host drive the index; a gesture engine plugs in later without an API change.",
      "There is no `actions` prop. Actions belong to `BottomSheet`; this one is about height.",
    ],
  },
  api: [
    {
      name: "open",
      type: "boolean",
      note: "Controlled visibility. Required.",
    },
    {
      name: "title",
      type: "string",
      note: "Names the sheet.",
    },
    {
      name: "snapPoints",
      type: "SnapPoint[]",
      note: "The resting heights, each a fraction of the viewport (0–1) with a `label`. The labels are what make the set intelligible rather than a row of numbers.",
    },
    {
      name: "value",
      type: "number",
      note: "Which snap point is showing. Defaults to the FIRST. The sheet renders the highest requested point and the host drives this — so a gesture engine can take over later without changing the interface.",
    },
    {
      name: "defaultValue",
      type: "number",
      default: "0",
      note: "Uncontrolled starting point. Omit `value` to let the sheet own it.",
    },
    {
      name: "onValueChange",
      type: "(index: number) => void",
      note: "Fires when the active point changes.",
    },
    {
      name: "onDismiss",
      type: "() => void",
      note: "Fires when the sheet goes away.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
  ],
  aria: [
    "The sheet is named by `title`, and its snap points are labelled, so the heights are described rather than being bare numbers.",
    "The host owns the index, which means accessibility of the movement is the host's too — the sheet will not move itself.",
    "Because the index is reported rather than decided, a screen reader is told which point is active rather than watching a drag.",
  ],
};
