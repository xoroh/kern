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
    package: "@xoroh/kern",
    // Native twin, checked in the native inventory.
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
      key: "Enter / Space",
      action:
        "Activates the clear control and any follow-up suggestion — both real buttons, so the press is the browser's own.",
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
      note: "The query that yielded nothing. Echoed in the title.",
    },
    {
      name: "onClear",
      type: "() => void",
      required: true,
      note: "Recovery: clear the search and browse everything.",
    },
    {
      name: "title",
      type: "string | undefined",
      note: "Custom title. Typed `string` (not `ReactNode`): `EmptyState`'s props intersect the div `title` attribute, so only strings satisfy it today (WP1b owns that type; not widened here).",
    },
    {
      name: "description",
      type: "ReactNode",
    },
    {
      name: "clearLabel",
      type: "string | undefined",
    },
    {
      name: "suggestions",
      type: "ReactNode",
      note: "Follow-up content: recent searches, popular destinations, …",
    },
    {
      name: "className",
      type: "string | undefined",
    },
  ],
  aria: [
    "The title echoes the query that yielded nothing, so the state is named rather than silent.",
    "`onClear` is the recovery: clearing returns to browsing everything.",
    "The `suggestions` slot carries follow-up content like recent searches beneath the recovery.",
  ],
};
