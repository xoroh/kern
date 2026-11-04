import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DashboardPage } from "./dashboard-page";
import { StatusPill } from "./status-pill";

const stats = [
  {
    id: "active",
    label: "Active trips",
    value: "128",
    delta: <StatusPill tone="success">+12%</StatusPill>,
    tone: "success" as const,
  },
  {
    id: "queue",
    label: "Waiting",
    value: "6",
    href: "/queue",
  },
];

describe("DashboardPage", () => {
  it("renders stats, activity and the queue table", () => {
    render(
      <DashboardPage
        title="Overview"
        description="Today at a glance."
        stats={stats}
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
      />,
    );
    expect(screen.getByRole("heading", { name: "Overview" })).toBeTruthy();
    expect(screen.getByText("128")).toBeTruthy();
    expect(screen.getByText("+12%")).toBeTruthy();
    expect(screen.getByText("Trip 12 completed")).toBeTruthy();
    expect(screen.getByText("t-1")).toBeTruthy();
  });

  it("links stat cards with href and reports activity row presses", async () => {
    const user = userEvent.setup();
    const onRowPress = vi.fn();
    render(
      <DashboardPage
        title="Overview"
        stats={stats}
        activityRows={[{ id: "a", headline: "Trip 12 completed" }]}
        onRowPress={onRowPress}
      />,
    );
    expect(screen.getByRole("link", { name: /Waiting/ })).toHaveAttribute(
      "href",
      "/queue",
    );
    await user.click(screen.getByText("Trip 12 completed"));
    expect(onRowPress).toHaveBeenCalledWith("a");
  });

  it("shows skeletons while loading and the empty state with no data", () => {
    const { container, rerender } = render(
      <DashboardPage title="Overview" loading />,
    );
    expect(container.querySelector('[data-slot="kern-loading"]')).toBeTruthy();
    rerender(<DashboardPage title="Overview" />);
    expect(screen.getByText("Nothing here yet")).toBeTruthy();
  });
});
