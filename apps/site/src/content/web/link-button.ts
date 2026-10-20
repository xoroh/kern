import type { ComponentDoc } from "../types";

export const linkButton: ComponentDoc = {
  slug: "link-button",
  name: "Link button",
  oneLiner:
    "Link buttons wear the button treatment on a navigation control — an anchor, not an action.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern",
    // The native renderer ships the same bridge under the same name.
    nativePeer: "LinkButton",
    variants: [],
    // kern's own decision. M3's elevation table names no link-button row —
    // the treatment is the button's, and the base treatments rest flat. See
    // Deviations.
    elevation: 0,
  },
  parts: ["LinkButton"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  keyboard: [
    {
      key: "Enter",
      action:
        "Follows the link to its destination — the anchor's own behaviour, not a click handler's.",
    },
    {
      key: "Tab",
      action:
        "Moves focus to the link and on. A blocked link is taken out of the tab order rather than left as a dead stop.",
    },
  ],
  customization: {
    supported: [
      "Every `Button` axis (variant, color, size, shape, block, loading, icon) plus the anchor attributes (`target`, `rel`, `download`) — it is Button's `href` branch.",
      "`onClick` still fires — navigation and a side effect are not mutually exclusive.",
    ],
    notSupported: [
      "There is no `type`, `value` or form participation. A link submits nothing.",
      "There is no `asChild` prop. Compose by URL.",
      '`iconPosition="end"` is ignored with a dev warning — M3 link buttons cannot carry trailing icons.',
    ],
  },
  api: [
    {
      name: "href",
      type: "string",
      required: true,
      note: "The destination. Required — a link without an `href` is a button wearing link paint.",
    },
    {
      name: "onClick",
      type: "(event) => void",
      note: "Fires before navigation. For the side effect, not the navigation itself.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "The label. Keep it short — a link button is a signpost, not a sentence.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the button treatment's own classes.",
    },
  ],
  aria: [
    "It renders an anchor, so it announces as a link and lives in the links list — never mistaken for an action.",
    "Keep the label naming the destination; the treatment says how it looks, the label says where it goes.",
  ],
};
