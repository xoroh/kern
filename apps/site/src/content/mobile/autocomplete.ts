import type { ComponentDoc } from "../types";

export const autocomplete: ComponentDoc = {
  slug: "autocomplete",
  name: "Autocomplete",
  oneLiner:
    "Autocomplete suggests completions as you type, with a filter you can replace and a message for when nothing matches.",
  features:
    "Reach for autocomplete when typing is faster than choosing and the set is large enough to need narrowing: an address, a name, a tag. It reports three different things and keeping them apart is the whole wiring — `onValueChange` as the text changes, `onSelect` when a suggestion is COMMITTED, and `onExpandedChange` when the popup opens or closes including dismissal by blur. That last one matters more than it looks: blur is a dismissal like any other, and a popup state that ignores it leaves the interface thinking it is open. The `filter` is replaceable and its default is honest about being local — case-insensitive substring matching, which a host with server-side or fuzzy matching swaps out.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Autocomplete",
    variants: [],
    elevation: 2,
  },
  parts: ["Autocomplete"],
  deviations: [
    {
      id: "K6",
      spec: "M3's component elevation table names no autocomplete. It tabulates \"menu\" at level 2 and search at level 3; neither describes a completion list attached to a text field.",
      kern: "The suggestion list rests at elevation level 2.",
      why: "The suggestions float above the page beside the field, so they need the same lift as the other anchored overlays. Borrowing a neighbouring row would assert M3 described this surface. Registered as K6 in the elevation inventory so the level is a recorded decision.",
    },
  ],
  customization: {
    supported: [
      "`suggestions` are data and `filter` replaces the matching rule entirely.",
      "`accessory` renders inside the field row after the input.",
      "`emptyMessage` is announced when nothing matches.",
    ],
    notSupported: [
      "There is no `loading` prop. A remote lookup is the host's, wired through `filter`.",
      "There is no `renderSuggestion`. Rows are uniform so the list stays scannable.",
      "There is no `multiple`. It completes one value; a set of chosen values is `CheckboxGroup` or a chip row.",
    ],
  },
  api: [
    {
      name: "suggestions",
      type: "readonly AutocompleteSuggestion[]",
      note: "The candidates. Data in, so the list is a declaration.",
    },
    {
      name: "filter",
      type: "(suggestion, query) => boolean",
      note: "REPLACEABLE. The default is a case-insensitive SUBSTRING match and the source says so plainly — a host with server-side or fuzzy matching overrides it. The default is the honest local behaviour, not a claim to be a search engine.",
    },
    {
      name: "onValueChange",
      type: "(value: string) => void",
      note: "As the TEXT changes.",
    },
    {
      name: "onSelect",
      type: "(suggestion) => void",
      note: "When a suggestion is COMMITTED. Different from typing — choosing is not editing.",
    },
    {
      name: "onExpandedChange",
      type: "(expanded: boolean) => void",
      note: "When the popup opens or closes, INCLUDING DISMISSAL BY BLUR. Blur is a dismissal like any other, and an interface that ignores it thinks the popup is still open.",
    },
    {
      name: "emptyMessage",
      type: "string",
      note: "Announced when nothing matches. Omit it to stay silent — and silence is a real choice, not a default to forget.",
    },
    {
      name: "accessory",
      type: "ReactNode",
      note: "Rendered inside the field row, after the input.",
    },
  ],
  aria: [
    "Three callbacks for three different acts — typing, choosing, opening — and keeping them apart is what makes the control predictable.",
    "`emptyMessage` is where a dead end is SAID rather than shown: without it, no matches looks the same as no answer.",
    "`onExpandedChange` firing on blur means the announced state matches the visible one even when someone taps away.",
    "The filter being replaceable is also an honesty matter: the default does substring matching and says so, rather than implying a relevance model it does not have.",
  ],
};
