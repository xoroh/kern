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
    package: "@xoroh/kern",
    // Native twin, checked in the native inventory.
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
      key: "Enter / Space",
      action:
        "Selects the contact when `onSelect` is set — the row is then one real button, so the press is the browser's own.",
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
      type: "((contact: ContactAdapter) => void) | undefined",
      note: "Row activation (R2 lexicon: DOMAIN action, not state).",
    },
    {
      name: "trailing",
      type: "ReactNode",
      note: "Trailing slot: call/chat action, chevron, presence…",
    },
    {
      name: "selected",
      type: "boolean | undefined",
    },
    {
      name: "className",
      type: "string | undefined",
    },
    {
      name: "testID",
      type: "string | undefined",
    },
  ],
  aria: [
    "The row is named by the contact's name; the avatar photo or initials disc stays decorative.",
    "`trailing` defaults to a chevron, which marks the row as going somewhere without adding a second control.",
    "Without `onSelect` the row is a plain region — a row that does nothing must not present as a button.",
  ],
};
