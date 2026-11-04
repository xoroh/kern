import type { ComponentDoc } from "../types";

export const contactDirectory: ComponentDoc = {
  slug: "contact-directory",
  name: "Contact directory",
  oneLiner:
    "Contact directory pairs inline search with grouped rows and empty recovery.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "ContactDirectory",
    variants: [],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["ContactDirectory"],
  keyboard: [
    {
      key: "Press",
      action:
        "Uses the inline search field and the contact rows — each keeps its own control's press behaviour, composed rather than replaced.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Moves through the search, the groups and the recovery as one labelled unit.",
    },
  ],
  customization: {
    supported: [
      "`contacts` plus the query trio is the whole contract; grouping and filtering run through the shared pure helpers.",
      "`searchLabel`, `searchPlaceholder`, `emptyTitle` and `emptyDescription` override the default strings without re-implementing.",
      "`onSelect` reports the chosen contact; selection state stays the host's.",
    ],
    notSupported: [
      "There is no command-palette search. The directory search is inline, never a modal palette.",
      "There is no directory-owned selection. Choosing is reported; keeping is the host's.",
    ],
  },
  api: [
    {
      name: "contacts",
      type: "readonly ContactAdapter[]",
      required: true,
    },
    {
      name: "query",
      type: "string",
    },
    {
      name: "defaultQuery",
      type: "string",
    },
    {
      name: "onQueryChange",
      type: "(query: string) => void",
    },
    {
      name: "onSelect",
      type: "(contact: ContactAdapter) => void",
      note: "Row activation (DOMAIN action, not state).",
    },
    {
      name: "searchLabel",
      type: "string",
    },
    {
      name: "searchPlaceholder",
      type: "string",
    },
    {
      name: "emptyTitle",
      type: "string",
    },
    {
      name: "emptyDescription",
      type: "string",
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
    "The directory pairs an inline search with grouped rows and an empty-state recovery, announced as one labelled unit.",
    "Filtering matches name and detail case-insensitively through the shared helper — what the eye filters is what the announcement filters.",
    "The default English strings — search label, placeholder, empty title and description — are all overridable props.",
  ],
};
