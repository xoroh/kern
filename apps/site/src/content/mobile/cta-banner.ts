import type { ComponentDoc } from "../types";

export const ctaBanner: ComponentDoc = {
  slug: "cta-banner",
  name: "Call to action banner",
  oneLiner:
    "Call to action banner is the primary-container closing section with title and actions.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    // Recorded as having no Material 3 source — a kern extension.
    specUrl: "none",
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "CtaBanner",
    variants: [],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["CtaBanner"],
  keyboard: [
    {
      key: "Enter / Space",
      action:
        "Operates the host's action buttons — each a real button, so the press is the browser's own. The banner itself adds no activation.",
    },
  ],
  customization: {
    supported: [
      "`title` and `description` carry the ask; `actions` slots the host's buttons.",
      "The primary container treatment marks it as the page's closing moment.",
    ],
    notSupported: [
      "There are no built-in actions. Buttons arrive host-owned; the banner never navigates by itself.",
      "There is no dismiss. A closing section that vanishes is a popover, not a banner.",
    ],
  },
  api: [
    {
      name: "title",
      type: "string",
      required: true,
    },
    {
      name: "description",
      type: "string",
    },
    {
      name: "actions",
      type: "ReactNode",
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
    "The banner is a labelled getting-started region, so the closing ask announces as its own section.",
    "`title` is required — a call to action with no ask is decoration.",
  ],
};
