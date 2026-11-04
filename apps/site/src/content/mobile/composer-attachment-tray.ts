import type { ComponentDoc } from "../types";

export const composerAttachmentTray: ComponentDoc = {
  slug: "composer-attachment-tray",
  name: "Composer attachment tray",
  oneLiner: "Composer attachment tray lists draft attachments with removal.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    // Recorded as having no Material 3 source — a kern extension.
    specUrl: "none",
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "ComposerAttachmentTray",
    variants: [],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["ComposerAttachmentTray"],
  keyboard: [
    {
      key: "Press",
      action:
        "Removes the attachment — each chip carries a labelled remove control, so activation is the platform's own.",
    },
  ],
  customization: {
    supported: [
      "`attachments` are data — id plus label — rendered as chips above the input.",
      "`onRemoveAttachment` is the domain action: the host drops the file, the tray only asks.",
    ],
    notSupported: [
      "There is no upload. Files arrive host-owned; the tray lists and removes, never picks.",
      "There is no preview. Chips name the file; rendering it is the message list's job.",
    ],
  },
  api: [
    {
      name: "attachments",
      type: "readonly ComposerAttachment[]",
      required: true,
    },
    {
      name: "onRemoveAttachment",
      type: "(id: string) => void",
      note: "Attachment removal (DOMAIN action).",
    },
    {
      name: "removeLabel",
      type: "(label: string) => string",
    },
  ],
  aria: [
    "The tray is a labelled attachments region, so its chips announce as a set rather than stray buttons.",
    "Each remove control is named by its attachment's label, so removing reads as removing that file.",
  ],
};
