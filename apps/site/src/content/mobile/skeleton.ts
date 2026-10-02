import type { ComponentDoc } from "../types";

export const skeleton: ComponentDoc = {
  slug: "skeleton",
  name: "Skeleton",
  oneLiner: "Skeletons are the placeholder shape shown while content loads.",
  features:
    "Reach for a skeleton when the layout is known before the content is: a list of rows, a card, a profile. It reserves the space and hints the shape, so the page does not jump when the real thing arrives. It is deliberately the smallest component in the family — a styled view, no content, no animation prop — because the shape is yours: you compose skeletons to match what is coming. Keep them honest about the shape, and do not use them for waits whose length is unknown; that is a loader or a progress indicator, which say something rather than showing a shape that never fills.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Skeleton",
    variants: [],
    elevation: "surface",
  },
  parts: ["Skeleton"],
  customization: {
    supported: [
      "`style` is the whole customisation — size it, round it, place it.",
      "`ViewProps` are available minus `children` and `style`, so test ids and accessibility props pass through.",
    ],
    notSupported: [
      "There are no `variant` or `lines` props. A skeleton is a shape you build, not a preset of one.",
      "There is no animation prop. The placeholder is static; motion is not this component's to decide.",
      "There is no `children`. It holds no content by construction — it stands in for content that is not there yet.",
    ],
  },
  api: [
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "The entire customisation. Size it, round it and place it to match the content it stands in for.",
    },
    {
      name: "…ViewProps",
      type: "Omit<ViewProps, 'children' | 'style'>",
      note: "Whatever `View` takes apart from children and style. `testID` and accessibility props pass through.",
    },
    {
      name: "children",
      type: "—",
      note: "Deliberately absent. A skeleton holds no content — it is a stand-in for content that has not arrived.",
    },
  ],
  aria: [
    "A skeleton is a placeholder and should be hidden from assistive tech — announcing an empty shape tells a reader nothing about what is coming.",
    "It is also not a loading STATUS. If the wait needs saying, say it with `LoadingIndicator`; the skeleton only reserves space.",
    "Keeping the shape honest matters for everyone: a skeleton that does not match the content produces the same layout jump it was meant to prevent.",
  ],
};
