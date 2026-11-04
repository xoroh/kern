import type { ComponentDoc } from "../types";

export const featureGrid: ComponentDoc = {
  slug: "feature-grid",
  name: "Feature grid",
  oneLiner: "Feature grid is the card grid of product features.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    // Recorded as having no Material 3 source — a kern extension.
    specUrl: "none",
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "FeatureGrid",
    variants: [],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["FeatureGrid"],
  customization: {
    supported: [
      "`items` are data — id, title, description, icon — rendered as cards.",
      "`title` and `description` head the section; without items there is no section.",
    ],
    notSupported: [
      "There are no links inside. Feature cards describe; navigation is the host's.",
      "There is no icon set inside. Icons arrive as nodes; the grid never picks glyphs.",
    ],
  },
  api: [
    {
      name: "title",
      type: "string",
    },
    {
      name: "description",
      type: "string",
    },
    {
      name: "items",
      type: "MarketingFeature[]",
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
    "The grid is a labelled features region, so the cards announce as a set under the section heading.",
    "`description` carries the section's supporting line beneath the title.",
  ],
};
