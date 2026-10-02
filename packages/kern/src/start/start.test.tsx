import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  APP_SHELL_HEIGHTS,
  AppShell,
  AppTopBar,
  ContrastToggle,
  Inspector,
  Link,
  LinkProvider,
  ListDetail,
  NAVIGATION_RAIL_WIDTH,
  NavigationRail,
  NavigationRailButton,
  NotificationsMenu,
  Page,
  Pane,
  SearchBar,
  SectionDrawer,
  SettingsRow,
  SIDEBAR_WIDTHS,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarItem,
  SplitGrid,
  SplitPanel,
  StatusBar,
  ThemeToggle,
  TopAppBar,
  TopAppBarToggle,
} from "./index";

afterEach(cleanup);

describe("link seam", () => {
  it("renders a plain anchor by default", () => {
    render(<Link to="/docs">Docs</Link>);
    const anchor = screen.getByRole("link", { name: "Docs" });
    expect(anchor.getAttribute("href")).toBe("/docs");
  });

  it("uses the injected router link", () => {
    const RouterLink = ({
      to,
      href: _href,
      children,
      ...props
    }: {
      to?: string;
      href?: string;
      children?: React.ReactNode;
    }) => (
      <a data-router="1" href={`router:${to}`} {...props}>
        {children}
      </a>
    );
    render(
      <LinkProvider component={RouterLink}>
        <Link to="/home">Home</Link>
      </LinkProvider>,
    );
    const anchor = screen.getByRole("link", { name: "Home" });
    expect(anchor.getAttribute("href")).toBe("router:/home");
    expect(anchor.getAttribute("data-router")).toBe("1");
  });
});

describe("blocks", () => {
  it("renders slots and labels", () => {
    render(
      <SearchBar leading={<span>Q</span>} trailing={<span>X</span>}>
        <input aria-label="Search" />
      </SearchBar>,
    );
    expect(screen.getByRole("textbox", { name: "Search" })).toBeTruthy();
  });

  it("renders settings and status rows", () => {
    render(
      <SettingsRow
        label="Theme"
        supporting="System"
        trailing={<span>A</span>}
      />,
    );
    expect(screen.getByText("Theme")).toBeTruthy();
    render(
      <StatusBar leading={<span>L</span>} trailing={<span>R</span>}>
        Ready
      </StatusBar>,
    );
    expect(screen.getByText("Ready")).toBeTruthy();
  });

  it("fires toggle callbacks with accessible names", () => {
    const onToggle = vi.fn();
    render(<ThemeToggle mode="dark" onToggle={onToggle} />);
    screen.getByRole("button", { name: "Switch to light" }).click();
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("fires contrast and app-bar toggles", () => {
    const onToggle = vi.fn();
    render(<ContrastToggle contrast="standard" onToggle={onToggle} />);
    screen.getByRole("button", { name: "Use high contrast" }).click();
    expect(onToggle).toHaveBeenCalledTimes(1);
    render(<TopAppBarToggle open={false} onToggle={onToggle} />);
    screen.getByRole("button", { name: "Open navigation" }).click();
    expect(onToggle).toHaveBeenCalledTimes(2);
  });
});

describe("top app bar", () => {
  it("renders title and slots", () => {
    render(
      <TopAppBar
        size="small"
        leading={<span>L</span>}
        trailing={<span>T</span>}
      >
        Title
      </TopAppBar>,
    );
    expect(screen.getByText("Title")).toBeTruthy();
    render(
      <AppTopBar wordmark="Acme" context="Ops" actions={<span>A</span>} />,
    );
    expect(screen.getByText("Acme")).toBeTruthy();
    expect(screen.getByText("Ops")).toBeTruthy();
  });

  it("renders slot-driven menus", () => {
    render(
      <NotificationsMenu
        items={[{ id: "1", label: "Item one", href: "/n/1" }]}
        empty="Nothing"
      />,
    );
    expect(screen.getByRole("menu", { name: "Notifications" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Item one" })).toBeTruthy();
    cleanup();
    render(<NotificationsMenu items={[]} empty="Nothing new" />);
    expect(screen.getByText("Nothing new")).toBeTruthy();
  });
});

describe("navigation", () => {
  it("renders sidebar family and items with active state", () => {
    render(
      <Sidebar width="default">
        <SidebarHeader>Brand</SidebarHeader>
        <SidebarContent>
          <SidebarItem label="Home" active badge="3" href="/home" />
          <SidebarItem label="Tasks" onSelect={() => {}} />
        </SidebarContent>
      </Sidebar>,
    );
    expect(
      screen.getByRole("link", { name: /Home/ }).getAttribute("aria-current"),
    ).toBe("page");
    expect(screen.getByRole("button", { name: /Tasks/ })).toBeTruthy();
    expect(SIDEBAR_WIDTHS.default).toBe(256);
  });

  it("renders the rail at rail width", () => {
    render(
      <NavigationRail header={<span>H</span>}>
        <NavigationRailButton icon="◆" label="Mail" active href="/mail" />
      </NavigationRail>,
    );
    expect(screen.getByRole("link", { name: /Mail/ })).toBeTruthy();
    expect(NAVIGATION_RAIL_WIDTH).toBe(80);
  });

  it("opens and closes the section drawer", () => {
    const onClose = vi.fn();
    render(
      <SectionDrawer
        title="Sections"
        sections={<span>S</span>}
        open
        onClose={onClose}
      />,
    );
    expect(screen.getByRole("button", { name: "Close" })).toBeTruthy();
    screen.getByRole("button", { name: "Close drawer" }).click();
    expect(onClose).toHaveBeenCalled();
    cleanup();
    render(
      <SectionDrawer
        title="Sections"
        sections={<span>S</span>}
        open={false}
        onClose={onClose}
      />,
    );
    expect(
      document
        .querySelector('[data-slot="section-drawer"]')
        ?.getAttribute("aria-hidden"),
    ).toBe("true");
  });
});

describe("panes", () => {
  it("composes the split mechanism", () => {
    render(
      <SplitGrid columns={3}>
        <SplitPanel>A</SplitPanel>
        <SplitPanel>B</SplitPanel>
        <SplitPanel>C</SplitPanel>
      </SplitGrid>,
    );
    expect(screen.getByText("B")).toBeTruthy();
  });

  it("composes recipes and page panes", () => {
    render(
      <ListDetail
        navigation={<span>N</span>}
        list={<span>L</span>}
        detail={<span>D</span>}
      />,
    );
    expect(screen.getByText("D")).toBeTruthy();
    cleanup();
    render(
      <Inspector
        content={<span>C</span>}
        info={<span>I</span>}
        tabs={[{ id: "info", label: "Info" }]}
        activeTab="info"
        onTabChange={() => {}}
      />,
    );
    expect(
      screen.getByRole("tab", { name: "Info" }).getAttribute("aria-selected"),
    ).toBe("true");
    cleanup();
    render(
      <Page>
        <Pane width="narrow">P</Pane>
      </Page>,
    );
    expect(screen.getByText("P")).toBeTruthy();
  });
});

describe("scaffolds", () => {
  it("renders every AppShell region", () => {
    render(
      <AppShell
        topBar={<div>top</div>}
        rail={<div>rail</div>}
        drawer={<div>drawer</div>}
        statusBar={<div>status</div>}
      >
        content
      </AppShell>,
    );
    for (const text of ["top", "rail", "drawer", "status", "content"]) {
      expect(screen.getByText(text)).toBeTruthy();
    }
    expect(APP_SHELL_HEIGHTS.topBar).toBe(56);
  });

  it("renders region permutations without missing regions", () => {
    render(<AppShell topBar={<div>t2</div>}>c2</AppShell>);
    expect(screen.getByText("t2")).toBeTruthy();
    expect(screen.queryByText("drawer")).toBeNull();
    cleanup();
    render(<AppShell>rail-only-shell</AppShell>);
    expect(screen.getByText("rail-only-shell")).toBeTruthy();
  });
});
