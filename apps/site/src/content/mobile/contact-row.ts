import type { ComponentDoc } from "../types";

export const contactRow: ComponentDoc = {
  slug: "contact-row",
  name: "Contact row",
  oneLiner:
    "Contact row is the avatar-plus-meta row that becomes one button when selectable.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "ContactRow",
    variants: [],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["ContactRow"],
  keyboard: [
    {
      key: "Press",
      action:
        "Selects the contact when `onSelect` is set — the row is then one pressable, so activation is the platform's own.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Reads the contact name with its detail and selected state; double-tap selects it.",
    },
  ],
  customization: {
    supported: [
      "`contact` is the `ContactAdapter` shape — id, name, optional detail, photo and tone — so user, driver and group records map to one row.",
      "`trailing` replaces the default chevron with host content; `selected` paints the selected state.",
      "The disc tone is picked deterministically from the name, so both renderers agree with no scheme object.",
    ],
    notSupported: [
      "There is no `KernList` under the trio. Contact rows carry avatar-plus-action affordances the generic row does not model — the trio owns its markup.",
      "There are never nested controls. One row, one activation; actions belong on the card, not in the row.",
    ],
  },
  api: [
    {
      name: "contact",
      type: "ContactAdapter",
      required: true,
    },
    {
      name: "onSelect",
      type: "(contact: ContactAdapter) => void",
      note: "Row activation (DOMAIN action, not state).",
    },
    {
      name: "trailing",
      type: "ReactNode",
    },
    {
      name: "selected",
      type: "boolean",
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
    "The row is named by the contact's name with selected state; the avatar photo or initials disc stays decorative.",
    "`trailing` defaults to a chevron, which marks the row as going somewhere without adding a second control.",
    "Without `onSelect` the row is a plain region — a row that does nothing must not present as a button.",
  ],
};
