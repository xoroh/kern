import type { ComponentDoc } from "../types";

export const searchView: ComponentDoc = {
  slug: "search-view",
  name: "Search view",
  oneLiner:
    "Search view is the command-palette dialog over suggestions with an optional global hotkey.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    status: "real",
    package: "@xoroh/kern",
    // Native twin, checked in the native inventory.
    nativePeer: "SearchView",
    variants: [],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["SearchView"],
  keyboard: [
    {
      key: "Ctrl/⌘ + K",
      action:
        "Opens the palette when `hotkey` is on (the default). The listener is window-level, so it works from anywhere on the page.",
    },
    {
      key: "Escape",
      action:
        "Dismisses the dialog — the standard dialog dismissal, owned by the dialog root rather than the view.",
    },
  ],
  customization: {
    supported: [
      "`suggestions` are data — `id`, `title`, optional description, keywords and leading node — filtered live as the query changes.",
      "`query`/`defaultQuery`/`onQueryChange` make it controlled or uncontrolled; `onSearch` is the explicit submit, separate from typing.",
      "`hotkey` opts out of the global keybinding; `label` and `placeholder` name the field.",
    ],
    notSupported: [
      "There is no results fetching. The host owns the suggestion list; the view filters what it is given.",
      "There is no voice input. A voice affordance is future work — no voice prop exists to switch on.",
      "There is no `emptyState` prop. Empty results always render `EmptySearch`, which carries the clear recovery.",
    ],
  },
  api: [
    {
      name: "suggestions",
      type: "SearchSuggestion[]",
      required: true,
    },
    {
      name: "open",
      type: "boolean | undefined",
    },
    {
      name: "defaultOpen",
      type: "boolean | undefined",
    },
    {
      name: "onOpenChange",
      type: "((open: boolean) => void) | undefined",
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
      type: "((suggestion: SearchSuggestion) => void) | undefined",
    },
    {
      name: "onSearch",
      type: "((query: string) => void) | undefined",
    },
    {
      name: "hotkey",
      type: "boolean | undefined",
      note: "⌘K / Ctrl-K opens the palette. Defaults to true.",
    },
    {
      name: "label",
      type: "string | undefined",
    },
    {
      name: "placeholder",
      type: "string | undefined",
    },
    {
      name: "className",
      type: "string | undefined",
    },
  ],
  aria: [
    "The palette is a labelled dialog, so opening it moves the announcement into the search context.",
    "Suggestions render as a labelled list; choosing one reports it through `onSelect` and closes the palette.",
    "Empty results render the `EmptySearch` recovery block, so no-results is a named state rather than silence.",
  ],
};
