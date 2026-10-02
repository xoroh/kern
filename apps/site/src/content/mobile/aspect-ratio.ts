import type { ComponentDoc } from "../types";

export const aspectRatio: ComponentDoc = {
  slug: "aspect-ratio",
  name: "Aspect ratio",
  oneLiner:
    "Aspect ratio boxes keep a fixed width-to-height ratio, whatever width they are given.",
  features:
    "Reach for an aspect ratio box when something must not jump as it loads or resize: an image, a video, a map, a thumbnail. The `ratio` is width divided by height — `16/9` for widescreen, `4/3` for the older frame, `1` for a square — so the number means what it says rather than being a named format you have to remember. The box reserves its space up front, which is what stops the layout shifting when the content arrives. That is the whole reason to reach for it rather than setting a height: the height is derived, so it stays right at every width.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Native-only. The web gets this from CSS `aspect-ratio`, so there is no
    // kern web export to name as a counterpart.
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: ["AspectRatio"],
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
