/**
 * Dashboard block — stat-card grid + activity feed + ops queue, wired with
 * mock data.
 *
 * A block is a real source file composed ONLY from shipped packages
 * (`@xoroh/kern`, `react`). It renders the shipped `DashboardPage` with
 * two stat cards, two activity rows and a two-row bookings queue — copy
 * it, then replace the mock stats/activity/queue with host data.
 */
import { DashboardPage, StatusPill } from "@xoroh/kern";

export function DashboardPageBlock() {
  return (
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
  );
}
