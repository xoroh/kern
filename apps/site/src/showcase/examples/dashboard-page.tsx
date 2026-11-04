import { DashboardPage, StatusPill } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * DashboardPage examples — stat-card grid + activity + queues.
 *
 * The template owns layout, landmarks and loading/empty states; stats,
 * activity rows and queue columns arrive as data from the host.
 */
export const DASHBOARD_PAGE_EXAMPLES: ExampleSpec[] = [
  {
    id: "dashboard-page",
    title: "Stats, activity and queue — wired",
    description:
      "Stat cards (links navigate, deltas are StatusPills), a two-line activity feed and a bookings queue table in one page pattern.",
    render: () => (
      <DashboardPage
        title="Overview"
        description="Today at a glance."
        stats={[
          {
            id: "active",
            label: "Active trips",
            value: "128",
            delta: <StatusPill tone="success">+12%</StatusPill>,
            tone: "success",
          },
          { id: "queue", label: "Waiting", value: "6", href: "#queue" },
        ]}
        activityRows={[
          { id: "a", headline: "Trip 12 completed", supporting: "14:02" },
          { id: "b", headline: "Driver went online", supporting: "13:58" },
        ]}
        queueTable={{
          columns: [
            { key: "id", title: "Trip" },
            { key: "status", title: "Status", kind: "status" },
          ],
          rows: [
            { id: "t-1", status: "waiting" },
            { id: "t-2", status: "live" },
          ],
        }}
      />
    ),
    code: `<DashboardPage
  title="Overview"
  stats={[{ id: "active", label: "Active trips", value: "128" }]}
  activityRows={[{ id: "a", headline: "Trip 12 completed" }]}
  queueTable={{ columns, rows }}
/>`,
  },
  {
    id: "dashboard-page-loading",
    title: "Loading and empty states",
    description:
      "Skeleton list while loading; the page empty state when every section has no data.",
    render: () => <DashboardPage title="Overview" loading />,
    code: `<DashboardPage title="Overview" loading />`,
  },
];
