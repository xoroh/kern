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
    package: "@xoroh/kern",
    // Native twin, checked in the native inventory.
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
      key: "Enter / Space",
      action:
        "Follows stat links, activates activity rows and works the queue grid — each keeps its own control's keyboard, composed rather than replaced.",
    },
  ],
  customization: {
    supported: [
      "`stats` are data — id, label, value, delta, tone, icon, description, link — rendered as a link-card grid.",
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
      type: "ReactNode",
      required: true,
      note: "Page heading.",
    },
    {
      name: "description",
      type: "ReactNode",
    },
    {
      name: "actions",
      type: "ReactNode",
      note: "Header-actions slot (date range, export, primary CTA from host).",
    },
    {
      name: "stats",
      type: "DashboardStat[] | undefined",
      note: "Stat cards. Empty array renders no grid.",
    },
    {
      name: "statsLabel",
      type: "string | undefined",
    },
    {
      name: "activityRows",
      type: "ListRow[] | undefined",
      note: "Activity feed rows (`List`, two-line).",
    },
    {
      name: "activityLabel",
      type: "string | undefined",
    },
    {
      name: "onRowPress",
      type: "((id: string) => void) | undefined",
      note: "Activity row activation — the `List` row-press channel (R2 lexicon: allowlisted DOMAIN action).",
    },
    {
      name: "queueTable",
      type: "DataTableProps | undefined",
      note: "Ops queue (`DataTable` — host owns columns/rows/sort/page/selection through this passthrough; the template adds no table state).",
    },
    {
      name: "queueLabel",
      type: "string | undefined",
    },
    {
      name: "loading",
      type: "boolean | undefined",
      note: "Loading state: stat + queue skeletons with a polite status.",
    },
    {
      name: "emptyState",
      type: "ReactNode",
      note: "Zero-data state node. Defaults to an `EmptyState`.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "Extra display sections slot (charts, secondary queues from host).",
    },
  ],
  aria: [
    "Stats, activity and queue render as three labelled sections, so the page announces as regions rather than one long run.",
    "`loading` renders the skeleton list; every section empty renders the page empty state.",
    "Stat deltas are host `StatusPill`s, so movement reads through the tone registry.",
  ],
};
