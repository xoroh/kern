import type { ComponentDoc } from "../types";

export const pricingTable: ComponentDoc = {
  slug: "pricing-table",
  name: "Pricing table",
  oneLiner:
    "Pricing table compares plans with an outlined highlight and per-plan selection.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    // Recorded as having no Material 3 source — a kern extension.
    specUrl: "none",
    status: "real",
    package: "@xoroh/kern",
    // Native twin, checked in the native inventory.
    nativePeer: "PricingTable",
    variants: [],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["PricingTable"],
  keyboard: [
    {
      key: "Enter / Space",
      action:
        "Selects the plan through its own select control — a real button, so the press is the browser's own.",
    },
  ],
  customization: {
    supported: [
      "`plans` are data — id, name, price, blurb, features, highlighted, badge — so the comparison is one declaration.",
      "`onSelect` receives the chosen plan id; `selectLabel` overrides the button text.",
      "The highlight is an outlined card plus badge pill — emphasis without reordering the plans.",
    ],
    notSupported: [
      "There is no payment capture. `onSelect` reports the plan; checkout stays host-owned.",
      "There is no currency formatting. Prices arrive as localised nodes; the table never computes.",
    ],
  },
  api: [
    {
      name: "title",
      type: "ReactNode",
    },
    {
      name: "description",
      type: "ReactNode",
    },
    {
      name: "plans",
      type: "MarketingPlan[]",
      required: true,
    },
    {
      name: "onSelect",
      type: "((plan: string) => void) | undefined",
      note: "Plan pick notification (R2 lexicon: allowlisted DOMAIN action).",
    },
    {
      name: "selectLabel",
      type: "string | undefined",
    },
  ],
  aria: [
    "The table is a labelled pricing region with one card per plan.",
    "The highlighted plan carries the badge pill, so the recommended option announces as marked, not just painted.",
    "`selectLabel` names every plan's select control the same way.",
  ],
};
