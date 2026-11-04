import type { ComponentDoc } from "../types";

export const marketingSections: ComponentDoc = {
  slug: "marketing-sections",
  name: "Marketing sections",
  oneLiner:
    "Marketing sections composes hero, features, pricing, testimonials and call-to-action slots.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    // Recorded as having no Material 3 source — a kern extension.
    specUrl: "none",
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "MarketingSections",
    variants: [],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["MarketingSections"],
  keyboard: [
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Reaches the plan selects, CTA actions, and hero-slot controls — each keeps its own control's press behavior, composed rather than replaced.",
    },
  ],
  customization: {
    supported: [
      "`hero` slots the start Hero — composed, never re-implemented.",
      "`features`, `plans` and `testimonials` feed the grid, the pricing table and the quote list with per-region titles.",
      "`cta` slots the closing banner; `onSelect` carries plan selection out.",
    ],
    notSupported: [
      "There is no hero rebuild. The hero slot takes the start Hero; marketing never owns hero markup.",
      "There is no M3 source. Marketing sections are page patterns on M3 type, shape and colour roles — a kern composition, not a spec component.",
      "Sections never render empty chrome. No data means no region, so partial libraries degrade to shorter pages.",
    ],
  },
  api: [
    {
      name: "hero",
      type: "ReactNode",
    },
    {
      name: "features",
      type: "MarketingFeature[]",
    },
    {
      name: "featuresTitle",
      type: "string",
    },
    {
      name: "plans",
      type: "MarketingPlan[]",
    },
    {
      name: "pricingTitle",
      type: "string",
    },
    {
      name: "onSelect",
      type: "(plan: string) => void",
    },
    {
      name: "testimonials",
      type: "MarketingTestimonial[]",
    },
    {
      name: "testimonialsTitle",
      type: "string",
    },
    {
      name: "cta",
      type: "NativeCtaBannerProps",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
    },
    {
      name: "testID",
      type: "string",
    },
  ],
  aria: [
    "Features, pricing, testimonials and the call-to-action render as labelled regions, so the page announces section by section.",
    "Each region renders only when given data — an empty library is no section at all, not an empty one.",
    "Plan selection and calls to action keep their own controls' keyboard inside the regions.",
  ],
};
