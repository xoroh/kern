import type { ComponentDoc } from "../types";

export const testimonialList: ComponentDoc = {
  slug: "testimonial-list",
  name: "Testimonial list",
  oneLiner: "Testimonial list renders figure cards of customer quotes.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    // Recorded as having no Material 3 source — a kern extension.
    specUrl: "none",
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "TestimonialList",
    variants: [],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["TestimonialList"],
  // M2: this export renders no focusable element of its own — it takes
  // no focus and answers no key — so an empty keyboard contract
  // is a fact, not a gap.
  nonInteractive: true,
  customization: {
    supported: [
      "`items` are data — id, quote, author, role — rendered as figure cards.",
      "`title` heads the section; without items there is no section.",
    ],
    notSupported: [
      "There is no carousel behaviour. Quotes render as a list; rotation is the host's.",
      "There is no avatar handling. Attribution is text; photos are a different card.",
    ],
  },
  api: [
    {
      name: "title",
      type: "string",
    },
    {
      name: "items",
      type: "MarketingTestimonial[]",
      required: true,
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
    "The list is a labelled testimonials region, so quotes announce as a set under the section heading.",
    "Each figure pairs the quote with author and role — the attribution is part of the card, not decoration.",
  ],
};
