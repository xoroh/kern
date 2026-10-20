import type { ComponentDoc } from "../types";

export const aspectRatio: ComponentDoc = {
  slug: "aspect-ratio",
  name: "Aspect ratio",
  oneLiner:
    "Aspect ratio boxes keep a fixed width-to-height ratio, whatever width they are given.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // Native-only. The web gets this from CSS `aspect-ratio`, so there is no
    // kern web export to name as a counterpart.
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: ["AspectRatio"],
  // The box is LAYOUT: it keeps a ratio and takes no focus, so there is no
  // keyboard contract to write. The content inside it owns its own.
  nonInteractive: true,
  customization: {
    supported: [
      "`ratio` is width divided by height, so `16/9` is widescreen and `1` is square.",
      "`children` fills the box.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no named-format prop. `ratio` is a number, so there is no vocabulary to learn.",
      "There is no `fit` prop. The box holds the ratio; how the content fills it is the content's.",
    ],
  },
  api: [
    {
      name: "children",
      type: "ReactNode",
      note: "Required. What the box holds.",
    },
    {
      name: "ratio",
      type: "number",
      note: "Width DIVIDED BY height — `16/9` for widescreen. A plain number rather than a named format, so there is no vocabulary to learn.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
    {
      name: "…ViewProps",
      type: "Omit<ViewProps, 'children' | 'style'>",
      note: "Everything else `View` takes apart from the two this component owns.",
    },
  ],
  aria: [
    "It is a layout box and announces as nothing of its own — the content inside is what is read.",
    "Reserving the space up front is an accessibility matter as much as a visual one: a layout that shifts under a pointer or a focus ring moves the target.",
    "Because the height is derived from the width, the box is right at every screen size without the caller recalculating anything.",
  ],
};
