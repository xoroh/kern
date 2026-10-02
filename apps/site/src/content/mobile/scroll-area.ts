import type { ComponentDoc } from "../types";

export const scrollArea: ComponentDoc = {
  slug: "scroll-area",
  name: "Scroll area",
  oneLiner:
    "Scroll areas are a scroll view with the axis chosen for you, so a horizontal scroll cannot happen by accident.",
  features:
    "Reach for a scroll area when content overflows and you want a definite axis: a column of results, a long panel, a row of chips. It is React Native's `ScrollView` with the `horizontal` prop taken OUT of the inherited type and re-declared, which is the whole point — the axis is an explicit decision rather than something you inherit by spreading props. Passing `horizontal` turns it into the sideways case deliberately. Use it wherever an uncontrolled `ScrollView` would otherwise sprawl.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "ScrollArea",
    variants: ["axis: vertical · horizontal"],
    elevation: "surface",
  },
  parts: ["ScrollArea"],
  customization: {
    supported: [
      "`horizontal` is re-declared, so the axis is an explicit choice.",
      "`ScrollViewProps` pass through otherwise, so `contentContainerStyle`, `onScroll` and the rest are available.",
      "`children` is the scrolling content.",
    ],
    notSupported: [
      "There is no `scrollbar` or `overlay` styling. The scroll indicator is the platform's.",
      "There is no `type` or `scrollbar-visible` prop. Those are web scrollbar concepts with no native equivalent here.",
    ],
  },
  api: [
    {
      name: "horizontal",
      type: "boolean",
      note: "Re-declared rather than inherited — deliberately removed from `ScrollViewProps` and added back. The axis becomes an explicit decision instead of something you get by spreading props.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "The content that scrolls.",
    },
    {
      name: "…ScrollViewProps",
      type: "Omit<ScrollViewProps, 'horizontal'> & { horizontal? }",
      note: "Everything else `ScrollView` takes. Only `horizontal` is handled specially, and that is on purpose.",
    },
  ],
  aria: [
    "It is a scroll view, so it scrolls and announces as the scrollable region it is.",
    "The axis being explicit matters for anyone navigating by gesture or by keyboard, where a surprise second axis is a trap rather than a convenience.",
    "There is no custom scrollbar here — the indicator is the platform's own.",
  ],
};
