import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Badge } from "./badge";
import { KernTabs } from "./kern-tabs";
import { SecondaryTabs } from "./secondary-tabs";

const ITEMS = [
  { value: "overview", label: "Overview", content: "Overview panel" },
  { value: "activity", label: "Activity", content: "Activity panel" },
  { value: "settings", label: "Settings", content: "Settings panel" },
];

describe("KernTabs", () => {
  it("renders a tablist with one active tab and its panel", () => {
    render(<KernTabs items={ITEMS} defaultValue="overview" />);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Overview panel");
  });

  it("defaults to the first enabled tab", () => {
    render(<KernTabs items={ITEMS} />);
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("switches panels on click and reports the change", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<KernTabs items={ITEMS} onValueChange={onValueChange} />);
    await user.click(screen.getByRole("tab", { name: "Activity" }));
    expect(onValueChange).toHaveBeenCalledWith("activity");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Activity panel");
  });

  it("moves with arrow keys and jumps with Home/End (W keyboard nav)", async () => {
    const user = userEvent.setup();
    render(<KernTabs items={ITEMS} defaultValue="overview" />);
    const overview = screen.getByRole("tab", { name: "Overview" });
    overview.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Activity" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Settings" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("skips disabled tabs in traversal and never activates them", async () => {
    const user = userEvent.setup();
    render(
      <KernTabs
        items={[
          { value: "a", label: "A", content: "A" },
          { value: "b", label: "B", content: "B", disabled: true },
          { value: "c", label: "C", content: "C" },
        ]}
        defaultValue="a"
      />,
    );
    screen.getByRole("tab", { name: "A" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "C" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("renders nothing for an empty or all-disabled set", () => {
    const { container, unmount } = render(<KernTabs items={[]} />);
    expect(container.querySelector('[role="tablist"]')).toBeNull();
    unmount();
    const second = render(
      <KernTabs items={[{ value: "a", label: "A", disabled: true }]} />,
    );
    expect(second.container.querySelector('[role="tablist"]')).toBeNull();
  });

  it("paints primary with a 3px primary indicator and secondary with 2px on-surface", () => {
    const { unmount } = render(
      <KernTabs items={ITEMS} defaultValue="overview" variant="primary" />,
    );
    const primary = screen.getByRole("tab", { name: "Overview" });
    expect(primary.className).toContain("after:h-[3px]");
    expect(primary.className).toContain("text-(--sys-color-primary)");
    unmount();

    render(
      <KernTabs items={ITEMS} defaultValue="overview" variant="secondary" />,
    );
    const secondary = screen.getByRole("tab", { name: "Overview" });
    expect(secondary.className).toContain("after:h-[2px]");
    expect(secondary.className).toContain("text-(--sys-color-on-surface)");
    expect(secondary.className).not.toContain("after:h-[3px]");
  });

  it("fills the active tab as a pill in vertical orientation (settings)", () => {
    render(
      <KernTabs
        items={ITEMS}
        defaultValue="activity"
        orientation="vertical"
        label="Settings sections"
      />,
    );
    const tablist = screen.getByRole("tablist");
    expect(tablist).toHaveAttribute("aria-orientation", "vertical");
    expect(screen.getByRole("tab", { name: "Activity" }).className).toContain(
      "bg-(--sys-color-secondary-container)",
    );
  });

  it("scales the row with density", () => {
    const { unmount } = render(
      <KernTabs items={ITEMS} defaultValue="overview" density="compact" />,
    );
    expect(screen.getByRole("tab", { name: "Overview" }).className).toContain(
      "min-h-10",
    );
    unmount();
    render(
      <KernTabs items={ITEMS} defaultValue="overview" density="expanded" />,
    );
    expect(screen.getByRole("tab", { name: "Overview" }).className).toContain(
      "min-h-14",
    );
  });

  it("renders leading-icon and badge slots", () => {
    render(
      <KernTabs
        items={[
          {
            value: "inbox",
            label: "Inbox",
            leadingIcon: <span data-testid="tab-icon">i</span>,
            badge: <Badge>3</Badge>,
          },
        ]}
      />,
    );
    expect(screen.getByTestId("tab-icon")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders caller-composed children as the panel instead of item content", () => {
    render(
      <KernTabs items={ITEMS} defaultValue="overview">
        <p>Custom panel</p>
      </KernTabs>,
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Custom panel");
  });
});

describe("SecondaryTabs merge", () => {
  it("delegates to KernTabs secondary: same indicator, same active label", () => {
    render(
      <SecondaryTabs
        tabs={[
          { value: "a", label: "A", content: "Panel A" },
          { value: "b", label: "B", content: "Panel B" },
        ]}
        defaultValue="a"
      />,
    );
    const tab = screen.getByRole("tab", { name: "A" });
    expect(tab.className).toContain("after:h-[2px]");
    expect(tab.className).toContain("text-(--sys-color-on-surface)");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel A");
  });

  it("keeps the kern-secondary-tabs testID by default", () => {
    render(<SecondaryTabs tabs={[{ value: "a", label: "A" }]} />);
    expect(
      document.querySelector('[data-testid="kern-secondary-tabs"]'),
    ).toBeTruthy();
  });

  it("switches panels on click", async () => {
    const user = userEvent.setup();
    render(
      <SecondaryTabs
        tabs={[
          { value: "a", label: "A", content: "Panel A" },
          { value: "b", label: "B", content: "Panel B" },
        ]}
      />,
    );
    await user.click(screen.getByRole("tab", { name: "B" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel B");
  });
});
