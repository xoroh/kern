import type { ComponentDoc } from "../types";

export const badge: ComponentDoc = {
  slug: "badge",
  name: "Badge",
  oneLiner:
    "Badges flag a small, countable change on something that already has a label.",
  features:
    "Reach for a badge when an item has news and the item already has a name people read: three unread messages on an inbox, a dot on a settings entry. A dot says something changed without saying how much, which is right when the count is meaningless or huge. A count is right when the number is the point. Never let a badge be the only way to learn the information — put the same fact in the label or the accessible name, because a badge is decoration on top of meaning, not meaning itself.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Badge",
    variants: ["variant: dot · count"],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["Badge"],
  customization: {
    supported: [
      "`className` is passed through and merged after the variant classes.",
      "The colours are the error roles, so a theme retints every badge at once.",
      "`variant` switches between the dot and the count forms.",
    ],
    notSupported: [
      "There is no `color` or `tone` prop. A badge is the error roles by construction; a different meaning needs a different component.",
      "There is no `max` or `overflow` prop. If the count can get large, cap it in your own code before rendering.",
      "There is no `placement` prop. A badge is inline content, so where it sits relative to its label is the layout's job.",
    ],
  },
  api: [
    {
      name: "variant",
      type: '"dot" | "count"',
      default: '"count"',
      note: "Dot announces that something changed; count says how much.",
    },
    {
      name: "aria-label",
      type: "string",
      note: "The accessible name. A dot with no label is hidden from assistive tech entirely, since it conveys nothing on its own.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the variant classes.",
    },
  ],
  aria: [
    'The badge is `role="img"`, so a label on it is announced as a single unit rather than as loose text.',
    "A dot variant with no `aria-label` is marked `aria-hidden` — it is treated as decoration and dropped from the accessibility tree, which is the honest outcome for a shape with no name.",
    "Because of that, a dot badge is never the only carrier of the information. Put the fact in the thing the badge sits on.",
  ],
};
