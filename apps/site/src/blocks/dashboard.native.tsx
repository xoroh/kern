/**
 * Dashboard block, native variant — stat cards + activity feed + ops
 * queue, wired with mock data.
 *
 * Same contract as `dashboard.tsx`: real source composed ONLY from shipped
 * packages (`@xoroh/kern-native`, `react`), installed by
 * `kern add dashboard --platform native`.
 */
import { DashboardPage, StatusPill } from "@xoroh/kern-native";

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
        { id: "queue", label: "Waiting", value: "6" },
      ]}
      activityRows={[
        { id: "a", title: "Trip 12 completed", supporting: "14:02" },
        { id: "b", title: "Driver went online", supporting: "13:58" },
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
