import type { ComponentDoc } from "../types";

export const skeleton: ComponentDoc = {
  slug: "skeleton",
  name: "Skeleton",
  oneLiner: "Skeletons are the placeholder shape shown while content loads.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Skeleton",
    variants: [],
    elevation: "surface",
  },
  parts: ["Skeleton"],
  // M2: a skeleton takes no focus and exposes no ARIA state — an empty
  // accessibility section is a FACT here, not a gap.
  nonInteractive: true,
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
