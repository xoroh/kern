import type { ComponentDoc } from "../types";

export const dashboardPage: ComponentDoc = {
  slug: "dashboard-page",
  name: "Dashboard page",
  oneLiner:
    "Dashboard page composes stat cards, activity rows and an ops queue into one page.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    // Recorded as having no Material 3 source — a kern extension.
    specUrl: "none",
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "DashboardPage",
    variants: [],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["DashboardPage"],
  keyboard: [
    {
      key: "Press",
      action:
        "Activates stats, activity rows and the queue — each keeps its own control's press behaviour, composed rather than replaced.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Moves through the three labelled regions in order: stats, activity, queue.",
    },
  ],
  customization: {
    supported: [
      "`stats` are data — id, label, value, delta, tone, icon and description — rendered as cards activating through `onSelect`.",
      "`activityRows` ride the two-line list with `onRowPress`; `queueTable` passes straight through to the data table.",
      "`statsLabel`, `activityLabel` and `queueLabel` name the three regions; `children` slots extra display content.",
    ],
    notSupported: [
      "There is no queue state inside. Columns, rows, sort, page and selection stay host-owned through the table passthrough — the template adds no table state.",
      "There is no charting. Stats are cards with values and deltas; visualisation is the host's.",
      "There is no fetching. Title, stats, rows and queue arrive as props; `loading` only paints the skeleton.",
    ],
  },
  api: [
    {
      name: "title",
      type: "string",
      required: true,
    },
    {
      name: "description",
      type: "string",
    },
    {
      name: "actions",
      type: "ReactNode",
    },
    {
      name: "stats",
      type: "DashboardStat[]",
    },
    {
      name: "statsLabel",
      type: "string",
    },
    {
      name: "activityRows",
      type: "NativeListRow[]",
    },
    {
      name: "activityLabel",
      type: "string",
    },
    {
      name: "onRowPress",
      type: "(id: string) => void",
      note: "Activity row activation — the `List` row-press channel (allowlisted DOMAIN action).",
    },
    {
      name: "onSelect",
      type: "(id: string) => void",
      note: "Stat activation (allowlisted DOMAIN action, stat id).",
    },
    {
      name: "queueTable",
      type: "NativeDataTableProps",
    },
    {
      name: "queueLabel",
      type: "string",
    },
    {
      name: "loading",
      type: "boolean",
    },
    {
      name: "emptyState",
      type: "ReactNode",
    },
    {
      name: "children",
      type: "ReactNode",
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
    "Stats, activity and queue render as three labelled regions, so the page announces as regions rather than one long run.",
    "`loading` renders the skeleton list; every section empty renders the page empty state.",
    "Stats activate through `onSelect` with the stat id — there are no link rows on this renderer — and deltas are host `StatusPill`s.",
  ],
};
