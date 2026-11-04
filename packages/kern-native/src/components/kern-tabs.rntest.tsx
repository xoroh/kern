import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { Text } from "react-native";
import { KernTabs, kernTabsStyles } from "./kern-tabs";
import { SecondaryTabs } from "./layouts";

const ITEMS = [
  {
    value: "overview",
    label: "Overview",
    content: <Text>Overview panel</Text>,
  },
  {
    value: "activity",
    label: "Activity",
    content: <Text>Activity panel</Text>,
  },
];

describe("KernTabs", () => {
  it("renders the tablist with the default tab selected", async () => {
    await render(<KernTabs items={ITEMS} />);
    expect(
      screen.getByRole("tab", { name: "Overview", selected: true }),
    ).toBeTruthy();
    expect(screen.getByText("Overview panel")).toBeTruthy();
    expect(screen.queryByText("Activity panel")).toBeNull();
  });

  it("switches panels on press and reports the change", async () => {
    const onValueChange = jest.fn();
    await render(<KernTabs items={ITEMS} onValueChange={onValueChange} />);
    await act(async () => {
      fireEvent.press(screen.getByRole("tab", { name: "Activity" }));
    });
    expect(onValueChange).toHaveBeenCalledWith("activity");
    expect(screen.getByText("Activity panel")).toBeTruthy();
  });

  it("honours a controlled value", async () => {
    await render(<KernTabs items={ITEMS} value="activity" />);
    expect(
      screen.getByRole("tab", { name: "Activity", selected: true }),
    ).toBeTruthy();
  });

  it("disables disabled tabs (parity with web traversal-skip)", async () => {
    const onValueChange = jest.fn();
    await render(
      <KernTabs
        items={[
          { value: "a", label: "A", content: <Text>A</Text> },
          { value: "b", label: "B", content: <Text>B</Text>, disabled: true },
        ]}
        onValueChange={onValueChange}
      />,
    );
    const disabled = screen.getByRole("tab", { name: "B" });
    // RN maps `aria-disabled` onto `accessibilityState.disabled`.
    expect(disabled.props.accessibilityState).toMatchObject({
      disabled: true,
    });
    await act(async () => {
      fireEvent.press(disabled);
    });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("renders nothing for an empty set", async () => {
    const { toJSON } = await render(<KernTabs items={[]} testID="empty" />);
    expect(screen.queryByRole("tablist")).toBeNull();
    expect(toJSON()).toBeNull();
  });

  it("renders leading-icon and badge slots", async () => {
    await render(
      <KernTabs
        items={[
          {
            value: "inbox",
            label: "Inbox",
            leadingIcon: <Text testID="tab-icon">i</Text>,
            badge: <Text testID="tab-badge">3</Text>,
          },
        ]}
      />,
    );
    expect(screen.getByTestId("tab-icon")).toBeTruthy();
    expect(screen.getByTestId("tab-badge")).toBeTruthy();
  });
});

describe("KernTabs styles", () => {
  it("uses a 3dp indicator for primary and 2dp for secondary", () => {
    expect(
      kernTabsStyles("primary", "horizontal", "medium").indicatorHeight,
    ).toBe(3);
    expect(
      kernTabsStyles("secondary", "horizontal", "medium").indicatorHeight,
    ).toBe(2);
  });

  it("scales the row with density (40/48/56)", () => {
    expect(
      kernTabsStyles("primary", "horizontal", "compact").tab.minHeight,
    ).toBe(40);
    expect(
      kernTabsStyles("primary", "horizontal", "medium").tab.minHeight,
    ).toBe(48);
    expect(
      kernTabsStyles("primary", "horizontal", "expanded").tab.minHeight,
    ).toBe(56);
  });

  it("stacks vertical orientation as a column", () => {
    expect(
      kernTabsStyles("secondary", "vertical", "medium").row.flexDirection,
    ).toBe("column");
  });
});

describe("SecondaryTabs merge", () => {
  it("delegates to KernTabs secondary and switches panels", async () => {
    await render(
      <SecondaryTabs
        tabs={[
          { value: "a", label: "A", content: <Text>Panel A</Text> },
          { value: "b", label: "B", content: <Text>Panel B</Text> },
        ]}
      />,
    );
    expect(screen.getByText("Panel A")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByRole("tab", { name: "B" }));
    });
    expect(screen.getByText("Panel B")).toBeTruthy();
  });
});
