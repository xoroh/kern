import type { ComponentDoc } from "../types";

export const composerCannedPicker: ComponentDoc = {
  slug: "composer-canned-picker",
  name: "Composer canned picker",
  oneLiner:
    "Composer canned picker inserts canned responses through the picker.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    // Recorded as having no Material 3 source — a kern extension.
    specUrl: "none",
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "ComposerCannedPicker",
    variants: [],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["ComposerCannedPicker"],
  keyboard: [
    {
      key: "Press",
      action:
        "Picks the focused insert — the rows are the picker option pressables, so activation is the platform's own.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Moves through the inserts; each announces its title, and double-tap picks it.",
    },
  ],
  customization: {
    supported: [
      "`inserts` are data — id, title, body — so the canned library is one declaration.",
      "`onCannedSelect` receives the insert; insertion into the draft is the host's.",
    ],
    notSupported: [
      "There is no second option list. The picker composes `KernPicker` option-list — inline popover on web, owned-trigger sheet on native.",
      "There is no insert editing. Library curation lives wherever the inserts come from, not in the picker.",
    ],
  },
  api: [
    {
      name: "inserts",
      type: "readonly CannedInsert[]",
      required: true,
    },
    {
      name: "onCannedSelect",
      type: "(insert: CannedInsert) => void",
      note: "Insert pick (DOMAIN action; insertion into the draft is host-owned).",
    },
    {
      name: "label",
      type: "string",
    },
  ],
  aria: [
    "Inserts render through the picker option contract, named by title with the body as supporting text.",
    "Picking reports the insert; writing it into the draft stays host-owned, so the announcement and the draft agree.",
  ],
};
