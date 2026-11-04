import type { ComponentDoc } from "../types";

export const contactDirectory: ComponentDoc = {
  slug: "contact-directory",
  name: "Contact directory",
  oneLiner:
    "Contact directory composes search with grouped rows and empty recovery.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    status: "real",
    package: "@xoroh/kern",
    // Native twin, checked in the native inventory.
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
      key: "Enter / Space",
      action:
        "Uses the docked search field and the contact rows — each keeps its own control's keyboard, composed rather than replaced.",
    },
  ],
  customization: {
    supported: [
      "`contacts` plus the query trio is the whole contract; grouping and filtering run through the shared pure helpers.",
      "`searchLabel`, `searchPlaceholder`, `emptyTitle` and `emptyDescription` override the default strings without re-implementing.",
      "`onSelect` reports the chosen contact; selection state stays the host's.",
    ],
    notSupported: [
      "There is no command-palette search. The directory search is docked, never Cmd-K.",
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
      type: "string | undefined",
    },
    {
      name: "defaultQuery",
      type: "string | undefined",
    },
    {
      name: "onQueryChange",
      type: "((query: string) => void) | undefined",
    },
    {
      name: "onSelect",
      type: "((contact: ContactAdapter) => void) | undefined",
      note: "Row activation (DOMAIN action, not state).",
    },
    {
      name: "searchLabel",
      type: "string | undefined",
    },
    {
      name: "searchPlaceholder",
      type: "string | undefined",
    },
    {
      name: "emptyTitle",
      type: "string | undefined",
    },
    {
      name: "emptyDescription",
      type: "string | undefined",
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
    "The directory pairs a docked search with grouped rows and an empty-state recovery, announced as one labelled unit.",
    "Filtering matches name and detail case-insensitively through the shared helper — what the eye filters is what the announcement filters.",
    "The default English strings — search label, placeholder, empty title and description — are all overridable props.",
  ],
};
