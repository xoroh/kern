import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { Text } from "react-native";
import { Tabs, TabsList, TabsPanel, TabsRoot, TabsTrigger } from "./tabs";

describe("Tabs on Axis", () => {
  const sampleTabs = [
    {
      value: "tab1",
      label: "Overview",
      content: <Text>Overview Content</Text>,
    },
    { value: "tab2", label: "Details", content: <Text>Details Content</Text> },
  ];

  it("renders tablist and default active tab content", async () => {
    await render(<Tabs tabs={sampleTabs} testID="tabs-container" />);

    expect(screen.getByRole("tablist")).toBeTruthy();
    expect(
      screen.getByRole("tab", { name: "Overview", selected: true }),
    ).toBeTruthy();
    expect(
      screen.getByRole("tab", { name: "Details", selected: false }),
    ).toBeTruthy();
    expect(screen.getByText("Overview Content")).toBeTruthy();
    expect(screen.queryByText("Details Content")).toBeNull();
  });

  it("switches tabs when another tab is pressed", async () => {
    const onValueChange = jest.fn();
    await render(<Tabs tabs={sampleTabs} onValueChange={onValueChange} />);

    await act(async () => {
      fireEvent.press(screen.getByRole("tab", { name: "Details" }));
    });

    expect(onValueChange).toHaveBeenCalledWith("tab2");
    expect(
      screen.getByRole("tab", { name: "Details", selected: true }),
    ).toBeTruthy();
    expect(
      screen.getByRole("tab", { name: "Overview", selected: false }),
    ).toBeTruthy();
    expect(screen.getByText("Details Content")).toBeTruthy();
    expect(screen.queryByText("Overview Content")).toBeNull();
  });

  it("exposes compound parts Tabs.Root, Tabs.List, Tabs.Trigger, Tabs.Panel", () => {
    expect(Tabs.Root).toBeDefined();
    expect(Tabs.List).toBeDefined();
    expect(Tabs.Trigger).toBeDefined();
    expect(Tabs.Panel).toBeDefined();
    expect(TabsRoot).toBe(Tabs.Root);
    expect(TabsList).toBe(Tabs.List);
    expect(TabsTrigger).toBe(Tabs.Trigger);
    expect(TabsPanel).toBe(Tabs.Panel);
  });
});
