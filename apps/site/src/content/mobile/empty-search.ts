import type { ComponentDoc } from "../types";

export const emptySearch: ComponentDoc = {
  slug: "empty-search",
  name: "Empty search",
  oneLiner:
    "Empty search is the no-results recovery block that echoes the query and offers to clear it.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    // Recorded as having no Material 3 source — a kern extension.
    specUrl: "none",
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "EmptySearch",
    variants: [],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["EmptySearch"],
  keyboard: [
    {
      key: "Press",
      action:
        "Clears the search and follows suggestions — the recovery and every follow-up are real buttons, so activation is the platform's own.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Reads the no-results title with the echoed query first, then the recovery action.",
    },
  ],
  customization: {
    supported: [
      "`query` is required — the block always says what found nothing.",
      "`title`, `description` and `clearLabel` override the default English strings.",
      "`suggestions` slots follow-up content beneath the recovery action.",
    ],
    notSupported: [
      "There is no `ReactNode` title. `title` is typed `string` because the empty state's props intersect the div title attribute — only strings satisfy it today.",
      "There is no results list. This is the recovery for one; the search above owns the results.",
    ],
  },
  api: [
    {
      name: "query",
      type: "string",
      required: true,
    },
    {
      name: "onClear",
      type: "() => void",
      required: true,
    },
    {
      name: "title",
      type: "string",
    },
    {
      name: "description",
      type: "string",
    },
    {
      name: "clearLabel",
      type: "string",
    },
    {
      name: "suggestions",
      type: "ReactNode",
    },
    {
      name: "testID",
      type: "string",
    },
  ],
  aria: [
    "The title defaults to naming the query that found nothing, so the state is announced, not silent.",
    "`onClear` is the recovery: clearing returns to browsing everything.",
    "The `suggestions` slot carries follow-up content like recent searches beneath the recovery.",
  ],
};
