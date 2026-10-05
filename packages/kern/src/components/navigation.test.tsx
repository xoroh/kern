import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button } from "./button";
import { ButtonGroup } from "./button-group";
import { Fab } from "./fab";
import { NavigationMenu } from "./navigation-menu";
import { Pagination } from "./pagination";
import { Tabs } from "./tabs";
import { Toggle } from "./toggle";
import { ToggleGroup } from "./toggle-group";
import { Toolbar } from "./toolbar";

describe("Tabs", () => {
  it("switches panels on tab activation", async () => {
    const user = userEvent.setup();
    render(
      <Tabs.Root defaultValue="one">
        <Tabs.List aria-label="Sections">
          <Tabs.Tab value="one">One</Tabs.Tab>
          <Tabs.Tab value="two">Two</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="one">First panel</Tabs.Panel>
        <Tabs.Panel value="two">Second panel</Tabs.Panel>
      </Tabs.Root>,
    );
    expect(screen.getByText("First panel")).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Two" }));
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("Second panel")).toBeInTheDocument();
  });

  it("moves between tabs with arrow keys", async () => {
    const user = userEvent.setup();
    render(
      <Tabs.Root defaultValue="one">
        <Tabs.List aria-label="Sections">
          <Tabs.Tab value="one">One</Tabs.Tab>
          <Tabs.Tab value="two">Two</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="one">First panel</Tabs.Panel>
        <Tabs.Panel value="two">Second panel</Tabs.Panel>
      </Tabs.Root>,
    );
    screen.getByRole("tab", { name: "One" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveFocus();
  });

  it("starts on the configured initial tab", () => {
    render(
      <Tabs.Root defaultValue="two">
        <Tabs.List aria-label="Sections">
          <Tabs.Tab value="one">One</Tabs.Tab>
          <Tabs.Tab value="two">Two</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="one">First panel</Tabs.Panel>
        <Tabs.Panel value="two">Second panel</Tabs.Panel>
      </Tabs.Root>,
    );
    // The initial knob pins first paint — no click needed.
    expect(screen.getByText("Second panel")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("never activates a disabled tab", async () => {
    const user = userEvent.setup();
    render(
      <Tabs.Root defaultValue="one">
        <Tabs.List aria-label="Sections">
          <Tabs.Tab value="one">One</Tabs.Tab>
          <Tabs.Tab value="two" disabled>
            Two
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="one">First panel</Tabs.Panel>
        <Tabs.Panel value="two">Second panel</Tabs.Panel>
      </Tabs.Root>,
    );
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await user.click(screen.getByRole("tab", { name: "Two" }));
    expect(screen.getByText("First panel")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});

describe("NavigationMenu", () => {
  it("renders links and opens dropdown content", async () => {
    const user = userEvent.setup();
    render(
      <NavigationMenu.Root>
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="/docs">Docs</NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>More</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <NavigationMenu.Link href="/blog">Blog</NavigationMenu.Link>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>,
    );
    expect(screen.getByRole("link", { name: "Docs" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "More" }));
    expect(
      await screen.findByRole("link", { name: "Blog" }),
    ).toBeInTheDocument();
  });

  it("opens the default panel at mount", () => {
    // Edge composition, carried from the move-5 Group lesson: the
    // openPanel knob is the whole reason defaultValue exists here, so the
    // test pins content visible with zero interaction.
    // Sensitivity-proven: the same assertions with no defaultValue fail
    // (scratch probe, RED confirmed, deleted).
    render(
      <NavigationMenu.Root defaultValue="products" aria-label="Site">
        <NavigationMenu.List>
          <NavigationMenu.Item value="products">
            <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <NavigationMenu.Link href="/components/web">
                Web components
              </NavigationMenu.Link>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>,
    );
    expect(
      screen.getByRole("link", { name: "Web components" }),
    ).toBeInTheDocument();
  });
});

describe("Pagination", () => {
  it("navigates pages and reports changes", async () => {
    const user = userEvent.setup();
    const seen: number[] = [];
    render(<Pagination count={10} onPageChange={(p) => seen.push(p)} />);
    expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(screen.getByRole("button", { name: "Page 2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(seen).toEqual([2]);
  });

  it("disables prev on the first page", () => {
    render(<Pagination count={5} defaultPage={1} />);
    expect(
      screen.getByRole("button", { name: "Previous page" }),
    ).toBeDisabled();
  });

  it("collapses the middle into gaps on large counts", () => {
    // Edge composition, carried from the move-5 Group lesson: the window is
    // the whole reason the count knob matters, so the test pins the gaps.
    // Sensitivity-proven: the same assertions on a small count fail
    // (scratch probe, RED confirmed, deleted).
    render(<Pagination count={24} defaultPage={12} />);
    expect(screen.getAllByText("…")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Page 12" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.queryByRole("button", { name: "Page 8" }),
    ).not.toBeInTheDocument();
  });
});

describe("Toolbar", () => {
  it("activates toolbar buttons", async () => {
    const user = userEvent.setup();
    let pressed = 0;
    render(
      <Toolbar.Root aria-label="Editor">
        <Toolbar.Button aria-label="Bold" onClick={() => pressed++}>
          B
        </Toolbar.Button>
        <Toolbar.Separator />
        <Toolbar.Button aria-label="Italic">I</Toolbar.Button>
      </Toolbar.Root>,
    );
    expect(screen.getByRole("toolbar")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Bold" }));
    expect(pressed).toBe(1);
  });
});

describe("Toggle", () => {
  it("toggles pressed state", async () => {
    const user = userEvent.setup();
    render(<Toggle aria-label="Mute">M</Toggle>);
    const toggle = screen.getByRole("button", { name: "Mute" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
  });
});

describe("ToggleGroup", () => {
  it("selects a single value exclusively", async () => {
    const user = userEvent.setup();
    render(
      <ToggleGroup.Root aria-label="Align" defaultValue={["left"]}>
        <ToggleGroup.Item value="left" aria-label="Left">
          L
        </ToggleGroup.Item>
        <ToggleGroup.Item value="right" aria-label="Right">
          R
        </ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Right" }));
    expect(screen.getByRole("button", { name: "Right" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Left" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("keeps both pressed when multiple", async () => {
    // Edge composition, carried from the move-5 Group lesson: `multiple`
    // changes the contract from exclusive to additive. Sensitivity-proven:
    // the same assertions in single mode fail (scratch probe, RED confirmed,
    // deleted).
    const user = userEvent.setup();
    render(
      <ToggleGroup.Root multiple aria-label="Format">
        <ToggleGroup.Item value="bold" aria-label="Bold">
          B
        </ToggleGroup.Item>
        <ToggleGroup.Item value="italic" aria-label="Italic">
          I
        </ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Bold" }));
    await user.click(screen.getByRole("button", { name: "Italic" }));
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Italic" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});

describe("ButtonGroup", () => {
  it("groups buttons under one role", () => {
    render(
      <ButtonGroup>
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole("group")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "One" })).toBeInTheDocument();
  });
});

describe("Fab", () => {
  it("renders the primary action", async () => {
    const user = userEvent.setup();
    let clicked = 0;
    render(<Fab onClick={() => clicked++}>Create</Fab>);
    await user.click(screen.getByRole("button", { name: "Create" }));
    expect(clicked).toBe(1);
  });

  it("supports an icon size with an accessible name", () => {
    render(
      <Fab size="icon" aria-label="Add">
        +
      </Fab>,
    );
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });
});
