import type { ComponentDoc } from "../types";

export const entitySheet: ComponentDoc = {
  slug: "entity-sheet",
  name: "Entity sheet",
  oneLiner:
    "Entity sheets show the detail of one record — label, value pairs — in a bottom sheet.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // The web counterpart of the pattern is the entity PANE in
    // `@xoroh/kern/start`, a composition rather than an export. No name to
    // point at, so `none` with that stated.
    nativePeer: "none",
    variants: [],
    // Level 0: the native modal sheets carry no elevation token (flat;
    // web rests at level 1). Whether flat-native is deliberate or missing
    // elevation is an open owner question — this claims the shipped value.
    elevation: 0,
  },
  parts: ["EntitySheet"],
  // The native entity sheet is a MODAL sheet: it is hosted in the shared
  // sheet shell, so the accessibility focus moves inside it when it opens and
  // both scrim press and the hardware back button dismiss it.
  keyboard: [
    {
      key: "Android back button",
      action:
        "Dismisses the sheet — the shell's request-close path fires `onDismiss` and reports `onOpenChange(false)`.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "The title announces the record when the sheet opens, the field values read in order beneath it, and the action row reads as buttons that double-tap runs.",
    },
  ],
  customization: {
    supported: [
      "`fields` are data — `label`, `value`, optional `data` — so the detail is a declaration rather than markup.",
      "`data` renders the value in the monospaced/tonal treatment, which is how an identifier reads as an identifier rather than as prose.",
      "`supporting` adds a line under the title, and `actions` is the action row under the fields.",
    ],
    notSupported: [
      "There is no `editable` mode. This is the read surface; editing is a different one and mixing the two makes a viewer that looks like a form.",
      "There is no `columns` prop. The fields are a vertical list, which is what makes label-value pairing readable on a narrow screen.",
      "There is no `renderField` prop. Rows look the same; `data` is the one treatment offered.",
    ],
  },
  api: [
    {
      name: "open",
      type: "boolean",
      note: "Controlled visibility. Required.",
    },
    {
      name: "title",
      type: "string",
      note: "Names the record being shown.",
    },
    {
      name: "fields",
      type: "EntityField[]",
      note: "The detail, as data: `label`, `value`, optional `data`. Values sit on the highest surface container so the eye lands on the value rather than the label.",
    },
    {
      name: "data",
      type: "boolean",
      note: "On a field: renders the value in the monospaced/tonal data treatment, so an identifier reads as an identifier rather than as prose.",
    },
    {
      name: "supporting",
      type: "string",
      note: "A line under the title.",
    },
    {
      name: "actions",
      type: "ReactNode",
      note: "The action row under the fields. Material 3 caps sheet actions at two.",
    },
    {
      name: "onDismiss",
      type: "() => void",
      note: "Fires when the sheet goes away.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
  ],
  aria: [
    "The sheet is named by `title`, so the detail announces what record it is.",
    "Each field is a label-value pair read in order, so the values are announced with what they describe rather than as a column of bare text.",
    "`data` is a visual treatment; it does not change how the value is announced.",
    "It is read-mostly. The action row is where anything reversible happens.",
  ],
};
