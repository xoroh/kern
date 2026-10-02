import type { ComponentDoc } from "../types";

export const snapSheet: ComponentDoc = {
  slug: "snap-sheet",
  name: "Snap sheet",
  oneLiner:
    "Snap sheets settle at one of a few fixed heights, so a panel can be half open or fully open.",
  features:
    "Reach for a snap sheet when the content wants two or three resting heights rather than one: a map's list that grows, a player that expands, a filter that opens wider. The snap points are declared as fractions of the viewport with their own labels, so the heights are a decision made once rather than a drag gesture discovered by accident. The host drives which point is showing, which keeps the sheet honest about what it can and cannot do — and leaves room for a gesture engine later without changing the interface.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // No web counterpart: the web `Sheet` is a side panel at one size. There
    // is no export to name as a peer.
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: ["SnapSheet"],
  customization: {
    supported: [
      "`snapPoints` declares the resting heights as viewport fractions with labels, so the set is a decision rather than a guess.",
      "`index`/`onIndexChange` let the host own which point is showing — the sheet reports and the host decides.",
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
      name: "index",
      type: "number",
      note: "Which snap point is showing. Defaults to the FIRST. The sheet renders the highest requested point and the host drives this — so a gesture engine can take over later without changing the interface.",
    },
    {
      name: "onIndexChange",
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
