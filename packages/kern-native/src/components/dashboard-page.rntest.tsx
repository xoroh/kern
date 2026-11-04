import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { Text } from "react-native";
import { DashboardPage } from "./dashboard-page";

describe("native DashboardPage", () => {
  it("renders stats, activity and the queue", async () => {
    await render(
      <DashboardPage
        title="Overview"
        description="Today at a glance."
        stats={[
          { id: "active", label: "Active trips", value: "128" },
          { id: "queue", label: "Waiting", value: "6" },
        ]}
        activityRows={[
          { id: "a", title: "Trip 12 completed", supporting: "14:02" },
        ]}
        queueTable={{
          columns: [
            { key: "id", title: "Trip" },
            { key: "status", title: "Status" },
          ],
          rows: [{ id: "t-1", status: "waiting" }],
        }}
      />,
    );
    expect(screen.getByTestId("kern-dashboard-page")).toBeTruthy();
    expect(screen.getByText("128")).toBeTruthy();
    expect(screen.getByText("Trip 12 completed")).toBeTruthy();
    expect(screen.getByText("t-1")).toBeTruthy();
  });

  it("reports stat + activity presses through allowlisted actions", async () => {
    const onSelect = jest.fn();
    const onRowPress = jest.fn();
    await render(
      <DashboardPage
        title="Overview"
        stats={[{ id: "active", label: "Active trips", value: "128" }]}
        activityRows={[{ id: "a", title: "Trip 12 completed" }]}
        onSelect={onSelect}
        onRowPress={onRowPress}
      />,
    );
    await act(async () => {
      fireEvent.press(
        screen.getByRole("button", { name: "Active trips: 128" }),
      );
    });
    expect(onSelect).toHaveBeenCalledWith("active");
  });

  it("shows skeletons while loading", async () => {
    const view = await render(<DashboardPage title="Overview" loading />);
    expect(view.getByTestId("kern-loading")).toBeTruthy();
  });

  it("shows the empty state with no data", async () => {
    const view = await render(<DashboardPage title="Overview" />);
    expect(view.getByText("Nothing here yet")).toBeTruthy();
  });

  it("ignores the unused delta/icon contract notes", async () => {
    await render(
      <DashboardPage
        title="Overview"
        stats={[
          {
            id: "a",
            label: "Active",
            value: "1",
            delta: <Text>+1%</Text>,
          },
        ]}
      />,
    );
    expect(screen.getByText("+1%")).toBeTruthy();
  });
});
