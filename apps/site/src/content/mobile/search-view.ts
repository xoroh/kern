import type { ComponentDoc } from "../types";

export const searchView: ComponentDoc = {
  slug: "search-view",
  name: "Search view",
  oneLiner:
    "Search view is the inline or sheet search surface over suggestions.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
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
      key: "Inline / sheet",
      action:
        "Inline renders the results in place; sheet renders them in a bottom sheet — the palette is a placement, not a dialog.",
    },
    {
      key: "Press",
      action:
        "Chooses a suggestion through `onSelect`; the explicit submit stays `onSearch`, separate from typing.",
    },
  ],
  customization: {
    supported: [
      "`suggestions` are data — `id`, `title`, optional description and leading node — filtered live as the query changes.",
      "`presentation` picks `inline` or `sheet`; `open`/`defaultOpen`/`onOpenChange` make it controlled or uncontrolled either way.",
      "`query`/`defaultQuery`/`onQueryChange` make the text controlled or uncontrolled; `onSearch` is the explicit submit, separate from typing.",
    ],
    notSupported: [
      "There is no global hotkey. Window-level keybindings are a desktop affordance; the surface opens from the host's own control.",
      "There is no results fetching. The host owns the suggestion list; the view filters what it is given.",
      "There is no voice input. A voice affordance is future work — no voice prop exists to switch on.",
    ],
  },
  api: [
    {
      name: "suggestions",
      type: "NativeSearchSuggestion[]",
      required: true,
    },
    {
      name: "presentation",
      type: '"inline" | "sheet"',
      note: "Inline (default) or bottom-sheet presentation.",
    },
    {
      name: "open",
      type: "boolean",
    },
    {
      name: "defaultOpen",
      type: "boolean",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
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
      type: "(suggestion: NativeSearchSuggestion) => void",
    },
    {
      name: "onSearch",
      type: "(query: string) => void",
    },
    {
      name: "label",
      type: "string",
    },
    {
      name: "placeholder",
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
    "Suggestions render in the labelled suggestions view; choosing one reports it and closes the surface.",
    "The query field keeps the search contract — live change plus explicit submit — with `label` naming it.",
    "Empty results render the `EmptySearch` recovery block, so no-results is a named state rather than silence.",
  ],
};
