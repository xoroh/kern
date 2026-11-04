import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { describe, expect, it } from "vitest";
import { BottomAppBar } from "./bottom-app-bar";
import {
  flattenSections,
  KernNavigation,
  type KernNavSection,
  routeManifestToSections,
} from "./kern-navigation";
import { NavigationRail } from "./navigation-rail";

const SECTIONS: KernNavSection[] = [
  {
    key: "main",
    destinations: [
      { key: "/home", label: "Home" },
      { key: "/inbox", label: "Inbox" },
      { key: "/settings", label: "Settings" },
    ],
  },
  {
    key: "ops",
    title: "Operations",
    destinations: [
      { key: "/dispatch", label: "Dispatch" },
      { key: "/fleet", label: "Fleet", disabled: true },
    ],
  },
];

async function axeClean(container: HTMLElement) {
  const result = await axe.run(container, {
    runOnly: {
      type: "tag",
      values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
    },
  });
  expect(result.violations).toEqual([]);
}

describe("routeManifestToSections", () => {
  it("groups unsectioned routes under main and keeps order", () => {
    const sections = routeManifestToSections([
      { path: "/a", label: "A" },
      { path: "/b", label: "B", section: "Ops" },
      { path: "/c", label: "C", section: "Ops" },
    ]);
    expect(sections.map((s) => s.key)).toEqual(["main", "Ops"]);
    expect(sections[0]?.title).toBeUndefined();
    expect(sections[1]?.destinations.map((d) => d.key)).toEqual(["/b", "/c"]);
  });

  it("flattens sections for single-list surfaces", () => {
    expect(flattenSections(SECTIONS).map((d) => d.key)).toEqual([
      "/home",
      "/inbox",
      "/settings",
      "/dispatch",
      "/fleet",
    ]);
  });
});

describe("KernNavigation sidebar-pane", () => {
  it("renders section headings, selects with aria-current, skips disabled", async () => {
    const user = userEvent.setup();
    let active = "";
    render(
      <KernNavigation
        sections={SECTIONS}
        onValueChange={(key) => (active = key)}
        header={<span>Switcher</span>}
        footer={<span>User</span>}
      />,
    );
    expect(screen.getByText("Operations")).toBeInTheDocument();
    expect(screen.getByText("Switcher")).toBeInTheDocument();
    expect(screen.getByText("User")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Dispatch" }));
    expect(active).toBe("/dispatch");
    expect(screen.getByRole("button", { name: "Dispatch" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await user.click(screen.getByRole("button", { name: "Fleet" }));
    // Disabled: the click cannot move selection.
    expect(active).toBe("/dispatch");
  });

  it("renders the detail pane when given", () => {
    render(<KernNavigation sections={SECTIONS} detail={<p>Detail pane</p>} />);
    expect(screen.getByText("Detail pane")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <main>
        <KernNavigation sections={SECTIONS} defaultValue="/home" />
      </main>,
    );
    await axeClean(container);
  });
});

describe("KernNavigation drawer-modal", () => {
  it("opens, selects, then dismisses", async () => {
    const user = userEvent.setup();
    let active = "";
    render(
      <KernNavigation
        variant="drawer-modal"
        sections={SECTIONS}
        defaultOpen
        onValueChange={(key) => (active = key)}
      />,
    );
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Inbox" }));
    expect(active).toBe("/inbox");
    // Select-then-dismiss: the modal reason for being open is gone.
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("KernNavigation rail + bar", () => {
  it("rail keeps the label in the accessible name when collapsed", () => {
    render(<KernNavigation variant="rail" sections={SECTIONS} value="/home" />);
    const rail = screen.getByTestId("kern-navigation-rail");
    expect(rail).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Inbox" })).toBeInTheDocument();
  });

  it("rail moves with arrow keys, one tab stop", async () => {
    const user = userEvent.setup();
    render(<KernNavigation variant="rail" sections={SECTIONS} value="/home" />);
    const home = screen.getByRole("button", { name: "Home" });
    expect(home).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("button", { name: "Inbox" })).toHaveAttribute(
      "tabindex",
      "-1",
    );
    home.focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("button", { name: "Inbox" })).toHaveFocus();
  });

  it("rail expands to the sidebar width", () => {
    render(
      <KernNavigation
        variant="rail"
        sections={SECTIONS}
        value="/home"
        railMode="expanded"
      />,
    );
    expect(screen.getByTestId("kern-navigation-rail")).toHaveStyle({
      width: "240px",
    });
  });

  it("bar renders the flattened destinations with roving tabindex", async () => {
    const user = userEvent.setup();
    render(<KernNavigation variant="bar" sections={SECTIONS} value="/home" />);
    const bar = screen.getByTestId("kern-navigation-bar");
    expect(bar).toBeInTheDocument();
    // Flattened: sectioned destinations all appear in the single list.
    expect(
      screen.getByRole("button", { name: "Dispatch" }),
    ).toBeInTheDocument();
    const home = screen.getByRole("button", { name: "Home" });
    home.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Inbox" })).toHaveFocus();
  });
});

describe("NavigationRail twin", () => {
  it("is 80dp collapsed with the pill indicator contract", () => {
    render(
      <NavigationRail
        destinations={SECTIONS[0]?.destinations ?? []}
        value="/home"
      />,
    );
    const rail = screen.getByTestId("kern-navigation-rail");
    expect(rail).toHaveStyle({ width: "80px" });
    const active = screen
      .getByRole("button", { name: "Home" })
      .querySelector("[data-active]");
    expect(active?.className).toContain("bg-(--sys-color-secondary-container)");
  });
});

describe("BottomAppBar", () => {
  it("renders actions and the FAB dock as a toolbar", () => {
    render(
      <BottomAppBar
        actions={<button type="button">Menu</button>}
        fab={<button type="button">Compose</button>}
      />,
    );
    const bar = screen.getByTestId("kern-bottom-app-bar");
    expect(bar).toHaveAttribute("role", "toolbar");
    expect(screen.getByRole("button", { name: "Menu" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Compose" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <main>
        <BottomAppBar
          actions={<button type="button">Menu</button>}
          fab={<button type="button">Compose</button>}
        />
      </main>,
    );
    await axeClean(container);
  });
});
