import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MenuItem, MenuRoot } from "./menu";
import { menuItemClass, menuPopupClass } from "./menu-classes";
import { MenubarRoot } from "./menubar";
import { NavigationBar } from "./navigation-bar";
import { NavigationDrawer } from "./navigation-drawer";
import { Pagination } from "./pagination";
import { SecondaryTabs } from "./secondary-tabs";
import { Tabs } from "./tabs";
import { ToolbarButton, ToolbarRoot } from "./toolbar";

/**
 * M3 navigation-family spec pins — every value from material-web v0.192
 * tokens and material-web.dev component pages.
 *
 * Sourced from:
 * - tokens/_md-comp-{primary,secondary}-navigation-tab.scss
 * - tokens/_md-comp-menu.scss + _md-comp-list.scss
 * - material-web.dev/components/{tabs,menu}/ (use cases, API, tokens)
 * - M3 nav bar/drawer/rail specs (80px bar, 360px drawer, 80px rail)
 *
 * If M3 changes a value, these tests fail first.
 */

const DESTINATIONS = [
  { key: "home", label: "Home" },
  { key: "search", label: "Search" },
  { key: "settings", label: "Settings" },
];

describe("NavigationBar — 80px bar, pill indicator, state layers", () => {
  it("renders the 80px M3 bar with surface-container fill", () => {
    render(<NavigationBar destinations={DESTINATIONS} />);
    const bar = screen.getByRole("navigation");
    expect(bar.className).toContain("h-20");
    expect(bar.className).toContain("bg-(--sys-color-surface-container)");
  });

  it("paints the selected icon pill in secondary-container with on-color", () => {
    render(<NavigationBar destinations={DESTINATIONS} value="home" />);
    const active = screen
      .getByRole("button", { name: "Home" })
      .querySelector("[data-active]");
    expect(active?.className).toContain(
      "data-[active]:bg-(--sys-color-secondary-container)",
    );
    expect(active?.className).toContain(
      "data-[active]:text-(--sys-color-on-secondary-container)",
    );
  });

  it("paints hover, focus, and pressed as layers — never fills", () => {
    render(<NavigationBar destinations={DESTINATIONS} />);
    const dest = screen.getByRole("button", { name: "Home" });
    expect(dest.className).toContain(
      "hover:before:opacity-[var(--sys-state-hover)]",
    );
    expect(dest.className).toContain(
      "focus-visible:before:opacity-[var(--sys-state-focus)]",
    );
    expect(dest.className).toContain(
      "active:before:opacity-[var(--sys-state-press)]",
    );
    expect(dest.className).not.toContain("hover:bg-(");
  });
});

describe("NavigationDrawer — 360px modal, large end rounding", () => {
  it("renders the M3 drawer geometry", () => {
    render(
      <NavigationDrawer
        open
        onOpenChange={() => {}}
        destinations={DESTINATIONS}
      />,
    );
    const drawer = screen.getByRole("dialog");
    expect(drawer.className).toContain("w-[min(22.5rem,80vw)]");
    expect(drawer.className).toContain(
      "rounded-e-(--sys-shape-corner-large)",
    );
    expect(drawer.className).toContain(
      "bg-(--sys-color-surface-container-low)",
    );
  });
});

describe("Tabs — primary 3px indicator, title-small, state layers", () => {
  it("renders the 3px primary indicator and title-small type", () => {
    render(
      <Tabs.Root value="a">
        <Tabs.List>
          <Tabs.Tab value="a">Alpha</Tabs.Tab>
          <Tabs.Tab value="b">Beta</Tabs.Tab>
        </Tabs.List>
      </Tabs.Root>,
    );
    const tab = screen.getByRole("tab", { name: "Alpha" });
    expect(tab.className).toContain("after:h-[3px]");
    expect(tab.className).toContain(
      "data-selected:after:bg-(--sys-color-primary)",
    );
    expect(tab.className).toContain("tracking-[0.00625rem]");
    // The selected tab actually shows the indicator (regression: the
    // after: layer stayed transparent on selection).
    expect(tab.getAttribute("aria-selected")).toBe("true");
  });

  it("paints selected primary with primary layer, inactive on-surface layers", () => {
    render(
      <Tabs.Root value="a">
        <Tabs.List>
          <Tabs.Tab value="a">Alpha</Tabs.Tab>
          <Tabs.Tab value="b">Beta</Tabs.Tab>
        </Tabs.List>
      </Tabs.Root>,
    );
    const tab = screen.getByRole("tab", { name: "Alpha" });
    expect(tab.className).toContain(
      "data-selected:text-(--sys-color-primary)",
    );
    expect(tab.className).toContain(
      "data-selected:before:bg-(--sys-color-primary)",
    );
  });
});

describe("SecondaryTabs — 2px indicator, on-surface active", () => {
  it("renders the 2px indicator (not primary 3px) with on-surface active", () => {
    render(
      <SecondaryTabs
        tabs={[
          { value: "a", label: "Alpha" },
          { value: "b", label: "Beta" },
        ]}
        value="a"
      />,
    );
    const tab = screen.getByRole("tab", { name: "Alpha" });
    expect(tab.className).toContain("after:h-[2px]");
    expect(tab.className).not.toContain("after:h-[3px]");
    expect(tab.className).toContain("text-(--sys-color-on-surface)");
    expect(tab.className).not.toContain("text-(--sys-color-primary)");
  });
});

describe("Menu — surface-container popup, 4px shape, layer items", () => {
  it("popup uses surface-container, 4px shape, level2, no border", () => {
    expect(menuPopupClass).toContain("bg-(--sys-color-surface-container)");
    expect(menuPopupClass).toContain(
      "rounded-(--sys-shape-corner-extra-small)",
    );
    expect(menuPopupClass).toContain("shadow-(--sys-elevation-level2)");
    expect(menuPopupClass).not.toContain("border");
    expect(menuPopupClass).not.toContain("bg-(--sys-color-surface)");
  });

  it("items paint highlighted as a layer with proper disabled split", () => {
    expect(menuItemClass).toContain(
      "data-highlighted:before:opacity-[var(--sys-state-hover)]",
    );
    expect(menuItemClass).not.toContain("data-highlighted:bg-(");
    expect(menuItemClass).toContain(
      "data-disabled:text-(--sys-color-on-surface)/38",
    );
    expect(menuItemClass).not.toContain("data-disabled:opacity-50");
  });

  it("MenuItem renders with menuitem role", () => {
    render(
      <MenuRoot>
        <MenuItem>Test</MenuItem>
      </MenuRoot>,
    );
    expect(screen.getByRole("menuitem", { name: "Test" })).toBeInTheDocument();
  });
});

describe("Toolbar — pill bar with layered buttons", () => {
  it("buttons paint layers and select secondary-container", () => {
    render(
      <ToolbarRoot aria-label="format">
        <ToolbarButton aria-label="bold">B</ToolbarButton>
      </ToolbarRoot>,
    );
    const btn = screen.getByRole("button", { name: "bold" });
    expect(btn.className).toContain(
      "hover:before:opacity-[var(--sys-state-hover)]",
    );
    expect(btn.className).toContain(
      "data-pressed:bg-(--sys-color-secondary-container)",
    );
    expect(btn.className).not.toContain(
      "data-pressed:bg-(--sys-color-primary)",
    );
  });
});

describe("Pagination — pill buttons with proper states", () => {
  it("current page fills primary, disabled splits", () => {
    render(
      <Pagination
        page={1}
        count={5}
        onPageChange={() => {}}
        aria-label="Pages"
      />,
    );
    const current = screen.getByRole("button", { name: "Page 1" });
    expect(current).toBeInTheDocument();
    expect(current.className).toContain("data-current:bg-(--sys-color-primary)");
    expect(current.className).toContain(
      "disabled:text-(--sys-color-on-surface)/38",
    );
  });

  it("widens 40dp buttons to the 48dp target via inset", () => {
    render(
      <Pagination
        page={1}
        count={5}
        onPageChange={() => {}}
        aria-label="Pages"
      />,
    );
    expect(screen.getByRole("button", { name: "Page 1" }).className).toContain(
      "after:-inset-1",
    );
  });
});
