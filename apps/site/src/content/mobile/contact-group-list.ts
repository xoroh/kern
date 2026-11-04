import type { ComponentDoc } from "../types";

export const contactGroupList: ComponentDoc = {
  slug: "contact-group-list",
  name: "Contact group list",
  oneLiner:
    "Contact group list is the selectable grouped list over contact groups.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "ContactGroupList",
    variants: [],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["ContactGroupList"],
  keyboard: [
    {
      key: "Press",
      action:
        "Selects the focused contact — rows are pressables, so activation is the platform's own.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Moves group by group; each contact reads with its name and selected state, and double-tap selects it.",
    },
  ],
  customization: {
    supported: [
      "`groups` are data with the shared adapter rows, so pickers and directories share the shape.",
      "Selection is controlled or uncontrolled; grouping is order-preserving with ungrouped contacts under their own heading.",
      "`onSelect` and `onValueChange` stay separate callbacks — selecting and acting are different intents.",
    ],
    notSupported: [
      "There is no search inside. Filtering is the directory's job; the group list renders the groups it is given.",
      "There is no multi-select. One contact is current; choosing several is a different component.",
    ],
  },
  api: [
    {
      name: "groups",
      type: "readonly ContactGroup[]",
      required: true,
    },
    {
      name: "value",
      type: "string",
    },
    {
      name: "defaultValue",
      type: "string",
    },
    {
      name: "onValueChange",
      type: "(id: string) => void",
    },
    {
      name: "onSelect",
      type: "(contact: ContactAdapter) => void",
      note: "Row activation (DOMAIN action; fires beside selection).",
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
    "Groups render under labelled headings, so each contact announces inside its named group.",
    "`value`/`defaultValue`/`onValueChange` carry the canonical selected contact id — one selection, reported one way.",
    "`onSelect` fires beside selection for hosts that navigate on top of selecting.",
  ],
};
