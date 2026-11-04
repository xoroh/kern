import type { ComponentDoc } from "../types";

export const contactCard: ComponentDoc = {
  slug: "contact-card",
  name: "Contact card",
  oneLiner:
    "Contact card is the identity card with status pill and action slots.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "ContactCard",
    variants: [],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["ContactCard"],
  keyboard: [
    {
      key: "Press",
      action:
        "Operates the host's action buttons — call, chat, email — each a pressable, so activation is the platform's own. The card itself adds no activation.",
    },
  ],
  customization: {
    supported: [
      "`contact` is the same adapter the row takes, so a row promotes to a card without remapping.",
      "`actions` slots host-owned call, chat and email buttons; `status` slots the pill.",
      "The large disc and the row disc resolve tones the same way, so the two never disagree.",
    ],
    notSupported: [
      "There are no built-in actions. The card renders slots; dialing, messaging and mailing stay host-owned.",
      "There is no card-wide `onSelect`. A card that navigates wraps in the host's own link; the card never nests a button inside a button.",
    ],
  },
  api: [
    {
      name: "contact",
      type: "ContactAdapter",
      required: true,
    },
    {
      name: "actions",
      type: "ReactNode",
    },
    {
      name: "status",
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
    "The card reads as the contact's identity: large disc, name, detail, with the initials fallback keeping it complete before any photo loads.",
    "`status` slots the `StatusPill`, so presence reads through the tone registry rather than a custom badge.",
    "Actions stay separate controls after the identity — never nested inside a card-wide activation.",
  ],
};
