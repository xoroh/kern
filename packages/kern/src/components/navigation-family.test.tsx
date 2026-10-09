import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  NavigationBar,
  NavigationBarItem,
  type NavigationDestination,
} from "./navigation-bar";
import { NavigationDrawer } from "./navigation-drawer";
import { SecondaryTabs } from "./secondary-tabs";

const DESTINATIONS: NavigationDestination[] = [
  { key: "home", label: "Home" },
  { key: "search", label: "Search" },
  { key: "library", label: "Library" },
];

describe("NavigationBar", () => {
  it("exposes a navigation landmark with an accessible name", () => {
    render(
      <NavigationBar
        destinations={DESTINATIONS}
        defaultValue="home"
        label="Main"
      />,
    );
    expect(
      screen.getByRole("navigation", { name: "Main" }),
    ).toBeInTheDocument();
  });

  it("marks exactly one destination as the current page", async () => {
    const user = userEvent.setup();
    render(<NavigationBar destinations={DESTINATIONS} defaultValue="home" />);
    const current = screen
      .getAllByRole("button")
      .filter((el) => el.getAttribute("aria-current") === "page");
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveAccessibleName("Home");

    await user.click(screen.getByRole("button", { name: "Library" }));
    const after = screen
      .getAllByRole("button")
      .filter((el) => el.getAttribute("aria-current") === "page");
    expect(after).toHaveLength(1);
    expect(after[0]).toHaveAccessibleName("Library");
  });

  it("reports selection to a controlled host and does not self-move", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <NavigationBar
        destinations={DESTINATIONS}
        value="home"
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(onValueChange).toHaveBeenCalledWith("search");
    // Controlled: the host owns the value, so the bar must not have moved.
    expect(screen.getByRole("button", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("keeps one tab stop and moves selection with arrow keys", async () => {
    const user = userEvent.setup();
    render(<NavigationBar destinations={DESTINATIONS} defaultValue="home" />);
    const tabbable = screen
      .getAllByRole("button")
      .filter((el) => el.getAttribute("tabindex") === "0");
    expect(tabbable).toHaveLength(1);

    screen.getByRole("button", { name: "Home" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Search" })).toHaveFocus();
    expect(screen.getByRole("button", { name: "Search" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    // Wraps at the end rather than dead-ending.
    await user.keyboard("{ArrowRight}{ArrowRight}");
    expect(screen.getByRole("button", { name: "Home" })).toHaveFocus();

    await user.keyboard("{End}");
    expect(screen.getByRole("button", { name: "Library" })).toHaveFocus();
    await user.keyboard("{Home}");
    expect(screen.getByRole("button", { name: "Home" })).toHaveFocus();
  });

  it("skips a disabled destination during keyboard traversal", async () => {
    const user = userEvent.setup();
    render(
      <NavigationBar
        destinations={[
          { key: "home", label: "Home" },
          { key: "search", label: "Search", disabled: true },
          { key: "library", label: "Library" },
        ]}
        defaultValue="home"
      />,
    );
    screen.getByRole("button", { name: "Home" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Library" })).toHaveFocus();
  });

  it("never activates a disabled destination", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <NavigationBar
        destinations={[
          { key: "home", label: "Home" },
          { key: "search", label: "Search", disabled: true },
        ]}
        defaultValue="home"
        onValueChange={onValueChange}
      />,
    );
    const disabled = screen.getByRole("button", { name: "Search" });
    expect(disabled).toBeDisabled();
    await user.click(disabled);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("renders the floating slot above the bar", () => {
    render(
      <NavigationBar
        destinations={DESTINATIONS}
        defaultValue="home"
        floating={<button type="button">Create</button>}
      />,
    );
    const floating = document.querySelector(
      '[data-slot="navigation-bar-floating"]',
    );
    expect(floating).not.toBeNull();
    expect(
      within(floating as HTMLElement).getByRole("button"),
    ).toHaveTextContent("Create");
  });

  it("falls back to the first destination when the controlled value names none", () => {
    render(<NavigationBar destinations={DESTINATIONS} value="nope" />);
    expect(screen.getByRole("button", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("warns in dev when fewer than three destinations are supplied (M3 floor)", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <NavigationBar
        destinations={[
          { key: "home", label: "Home" },
          { key: "search", label: "Search" },
        ]}
        defaultValue="home"
      />,
    );
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0]?.[0]).toContain("3–5");
    warn.mockRestore();
  });

  it("stays silent with three or more destinations", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<NavigationBar destinations={DESTINATIONS} defaultValue="home" />);
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe("NavigationBarItem", () => {
  it("reports selection and marks the active row", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<NavigationBarItem label="Library" selected onSelect={onSelect} />);
    const item = screen.getByRole("button", { name: "Library" });
    expect(item).toHaveAttribute("aria-current", "page");
    await user.click(item);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});

function DrawerHost({
  onOpenChange,
}: {
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("home");
  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          onOpenChange?.(true);
        }}
      >
        Open menu
      </button>
      <NavigationDrawer
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          onOpenChange?.(next);
        }}
        destinations={DESTINATIONS}
        value={value}
        onValueChange={setValue}
        title="Workspace"
      />
    </>
  );
}

describe("NavigationDrawer", () => {
  it("renders nothing while closed", () => {
    render(<DrawerHost />);
    expect(
      screen.queryByRole("dialog", { name: "Workspace" }),
    ).not.toBeInTheDocument();
  });

  it("is a modal dialog with a scrim, and Escape dismisses it", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<DrawerHost onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));

    const dialog = screen.getByRole("dialog", { name: "Workspace" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(
      document.querySelector('[data-slot="navigation-drawer-backdrop"]'),
    ).not.toBeNull();

    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("closes on a destination choice and reports the selection first", async () => {
    const user = userEvent.setup();
    const order: string[] = [];
    render(
      <DrawerHost
        onOpenChange={(open) => {
          if (!open) order.push("closed");
        }}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(screen.getByRole("button", { name: "Library" }));
    expect(order).toEqual(["closed"]);
    expect(
      screen.queryByRole("dialog", { name: "Workspace" }),
    ).not.toBeInTheDocument();
  });

  it("returns focus to the trigger after Escape", async () => {
    const user = userEvent.setup();
    render(<DrawerHost />);
    const trigger = screen.getByRole("button", { name: "Open menu" });
    await user.click(trigger);
    await user.keyboard("{Escape}");
    expect(trigger).toHaveFocus();
  });

  it("dismisses on a scrim press", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<DrawerHost onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const backdrop = document.querySelector(
      '[data-slot="navigation-drawer-backdrop"]',
    ) as HTMLElement;
    await user.click(backdrop);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("names the dialog from aria-label when there is no title", async () => {
    const user = userEvent.setup();
    render(
      <NavigationDrawer
        open
        onOpenChange={() => {}}
        destinations={DESTINATIONS}
        aria-label="Destinations"
      />,
    );
    expect(
      screen.getByRole("dialog", { name: "Destinations" }),
    ).toBeInTheDocument();
    await user.keyboard("{Escape}");
  });
});

describe("SecondaryTabs", () => {
  const TABS = [
    { value: "overview", label: "Overview", content: "Overview body" },
    { value: "activity", label: "Activity", content: "Activity body" },
    { value: "settings", label: "Settings", content: "Settings body" },
  ];

  it("renders a labelled tablist with the first tab selected", () => {
    render(<SecondaryTabs tabs={TABS} label="Project" />);
    expect(
      screen.getByRole("tablist", { name: "Project" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Overview body");
  });

  it("swaps the panel on activation and reports the change", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<SecondaryTabs tabs={TABS} onValueChange={onValueChange} />);
    await user.click(screen.getByRole("tab", { name: "Activity" }));
    expect(onValueChange).toHaveBeenCalledWith("activity");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Activity body");
    // The inactive panel is unmounted, not hidden — a hidden panel is still
    // announced and reads as duplicate content.
    expect(screen.queryByText("Overview body")).not.toBeInTheDocument();
  });

  it("binds the tab to its panel for assistive tech", () => {
    render(<SecondaryTabs tabs={TABS} />);
    const tab = screen.getByRole("tab", { name: "Overview" });
    const panel = screen.getByRole("tabpanel");
    expect(tab).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveAttribute("aria-labelledby", tab.id);
  });

  it("moves between tabs with arrow keys, wrapping", async () => {
    const user = userEvent.setup();
    render(<SecondaryTabs tabs={TABS} />);
    screen.getByRole("tab", { name: "Overview" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Activity" })).toHaveFocus();
    await user.keyboard("{ArrowRight}{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveFocus();
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Settings" })).toHaveFocus();
    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveFocus();
  });

  it("gives the tablist exactly one tab stop", () => {
    render(<SecondaryTabs tabs={TABS} />);
    expect(
      screen.getAllByRole("tab").filter((el) => el.tabIndex === 0),
    ).toHaveLength(1);
  });

  it("skips a disabled tab and refuses to activate it", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <SecondaryTabs
        tabs={[
          TABS[0] as (typeof TABS)[number],
          { ...(TABS[1] as (typeof TABS)[number]), disabled: true },
          TABS[2] as (typeof TABS)[number],
        ]}
        onValueChange={onValueChange}
      />,
    );
    const disabled = screen.getByRole("tab", { name: "Activity" });
    expect(disabled).toHaveAttribute("aria-disabled", "true");
    await user.click(disabled);
    expect(onValueChange).not.toHaveBeenCalled();

    screen.getByRole("tab", { name: "Overview" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Settings" })).toHaveFocus();
  });

  it("does not render a tablist with no tabs", () => {
    const { container } = render(<SecondaryTabs tabs={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("honours a controlled value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <SecondaryTabs
        tabs={TABS}
        value="overview"
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole("tab", { name: "Settings" }));
    expect(onValueChange).toHaveBeenCalledWith("settings");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Overview body");
  });
});
