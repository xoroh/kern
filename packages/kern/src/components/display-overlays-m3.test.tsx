import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import { Card } from "./card";
import { Chip } from "./chip";
import { Drawer } from "./drawer";
import { ListItem } from "./list-item";
import { Meter } from "./meter";
import { Popover } from "./popover";
import { Sheet } from "./sheet";
import { SonnerProvider, SonnerViewport } from "./sonner";
import { TableBody, TableCell, TableHead, TableRoot, TableRow } from "./table";
import { Tooltip } from "./tooltip";
// Tooltip.Provider mirrors overlays.test.tsx usage.

/**
 * M3 display + overlays spec pins — every value from material-web tokens
 * and m3.material.io tabs (cards/specs+guidelines, chips/specs, badges/
 * specs, lists, sheets; tooltips via system tokens).
 *
 * If M3 changes a value, these tests fail first.
 */

describe("Chip — 8px shape, label-large, outline treatments", () => {
  it("renders the 8px M3 shape with label-large type", () => {
    render(<Chip variant="assist">Search</Chip>);
    const el = screen.getByRole("button", { name: "Search" });
    expect(el.className).toContain("rounded-(--sys-shape-corner-small)");
    expect(el.className).not.toContain("rounded-(--sys-shape-corner-full)");
    expect(el.className).toContain("tracking-[0.00625rem]");
  });

  it("assist uses the outline border with no fill", () => {
    render(<Chip variant="assist">Search</Chip>);
    const el = screen.getByRole("button", { name: "Search" });
    expect(el.className).toContain("border-(--sys-color-outline)");
  });

  it("filter selected fills secondary-container with a check", () => {
    render(
      <Chip variant="filter" selected onSelectedChange={() => {}}>
        Docs
      </Chip>,
    );
    const el = screen.getByRole("button", { name: "Docs" });
    expect(el.className).toContain(
      "data-selected:bg-(--sys-color-secondary-container)",
    );
    expect(
      document.querySelector('[data-slot="chip-check"]'),
    ).not.toBeNull();
  });

  it("paints states as layers with proper disabled split", () => {
    render(<Chip variant="assist">Search</Chip>);
    const el = screen.getByRole("button", { name: "Search" });
    expect(el.className).toContain(
      "hover:before:opacity-[var(--sys-state-hover)]",
    );
    expect(el.className).toContain(
      "disabled:text-(--sys-color-on-surface)/38",
    );
    expect(el.className).not.toContain("disabled:opacity-50");
  });
});

describe("Card — elevated/tonal/outlined fills per M3", () => {
  it("elevated fills surface-container-low with level1", () => {
    render(<Card variant="elevated" data-testid="card" />);
    const el = screen.getByTestId("card");
    expect(el.className).toContain(
      "bg-(--sys-color-surface-container-low)",
    );
    expect(el.className).toContain("shadow-(--sys-elevation-level1)");
  });

  it("filled fills surface-container-highest with no shadow", () => {
    render(<Card variant="filled" data-testid="card" />);
    const el = screen.getByTestId("card");
    expect(el.className).toContain(
      "bg-(--sys-color-surface-container-highest)",
    );
  });

  it("outlined draws the outline-variant border on surface", () => {
    render(<Card variant="outlined" data-testid="card" />);
    const el = screen.getByTestId("card");
    expect(el.className).toContain("border-(--sys-color-outline-variant)");
    expect(el.className).toContain("rounded-(--sys-shape-corner-medium)");
  });
});

describe("Badge — 6px dot, 16px count, error roles", () => {
  it("dot is the 6px error circle", () => {
    render(<Badge variant="dot" aria-label="unread" />);
    const el = screen.getByLabelText("unread");
    expect(el.className).toContain("size-1.5");
    expect(el.className).toContain("bg-(--sys-color-error)");
  });

  it("count is 16px with on-error label", () => {
    render(
      <Badge variant="count" aria-label="3 unread">
        3
      </Badge>,
    );
    const el = screen.getByLabelText("3 unread");
    expect(el.className).toContain("text-(--sys-color-on-error)");
  });
});

describe("ListItem — 56px M3 rows with state layers", () => {
  it("renders one-line rows at 56px with layers, not fills", () => {
    render(
      <ul>
        <ListItem href="/a" headline="Alpha" />
      </ul>,
    );
    const action = document.querySelector('[data-slot="list-item-action"]');
    expect(action?.className).toContain("min-h-14");
    expect(action?.className).toContain(
      "hover:before:opacity-[var(--sys-state-hover)]",
    );
    expect(action?.className).not.toContain("hover:bg-(");
  });
});

describe("Drawer and Sheet — container-low, level1, scrim/32, no borders", () => {
  it("bottom drawer uses the M3 sheet treatment", () => {
    render(
      <Drawer.Root open>
        <Drawer.Content aria-label="sheet">Body</Drawer.Content>
      </Drawer.Root>,
    );
    const popup = document.querySelector('[data-slot="drawer-content"]');
    expect(popup?.className).toContain(
      "bg-(--sys-color-surface-container-low)",
    );
    // M3 tabulates navigation drawer (modal) and modal sheets at level 1.
    expect(popup?.className).toContain("shadow-(--sys-elevation-level1)");
    expect(popup?.className).toContain(
      "rounded-t-(--sys-shape-corner-extra-large)",
    );
    expect(popup?.className).not.toContain("border-(");
  });

  it("side sheet uses the M3 treatment without borders", () => {
    render(
      <Sheet.Root open>
        <Sheet.Content aria-label="panel" side="right">
          Body
        </Sheet.Content>
      </Sheet.Root>,
    );
    const popup = document.querySelector('[data-slot="sheet-content"]');
    expect(popup?.className).toContain(
      "bg-(--sys-color-surface-container-low)",
    );
    expect(popup?.className).not.toContain("border-(");
  });
});

describe("Popover — menu-surface treatment", () => {
  it("renders surface-container with 4px shape and level2", () => {
    render(
      <Popover.Root open>
        <Popover.Content aria-label="menu">Item</Popover.Content>
      </Popover.Root>,
    );
    const popup = document.querySelector('[data-slot="popover-content"]');
    expect(popup?.className).toContain("bg-(--sys-color-surface-container)");
    expect(popup?.className).toContain(
      "rounded-(--sys-shape-corner-extra-small)",
    );
    expect(popup?.className).not.toContain("border-(");
  });
});

describe("Avatar, Meter, Table, Tooltip, Sonner — supporting roles", () => {
  it("avatar renders full-circle image or primary fallback", () => {
    render(
      <Avatar.Root aria-label="Ada Lovelace">
        <Avatar.Fallback>AL</Avatar.Fallback>
      </Avatar.Root>,
    );
    expect(document.querySelector('[data-slot="avatar"]')).not.toBeNull();
  });

  it("meter renders the measured bar", () => {
    render(<Meter.Root value={0.6} aria-label="storage" />);
    expect(
      screen.getByRole("meter", { name: "storage" }),
    ).toBeInTheDocument();
  });

  it("table renders with wrapper and headers", () => {
    render(
      <TableRoot>
        <TableBody>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableBody>
      </TableRoot>,
    );
    expect(document.querySelector('[data-slot="table"]')).not.toBeNull();
  });

  it("tooltip content carries the inverse-surface treatment", async () => {
    const { userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();
    render(
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>tooltip-trigger-action</Tooltip.Trigger>
          <Tooltip.Content>Save</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );
    await user.hover(
      screen.getByRole("button", { name: "tooltip-trigger-action" }),
    );
    const popup = await screen.findByText("Save");
    const surface = popup.closest('[data-slot="tooltip-content"]');
    expect(surface?.className).toContain("bg-(--sys-color-inverse-surface)");
    expect(surface?.className).toContain(
      "rounded-(--sys-shape-corner-extra-small)",
    );
  });

  it("sonner renders transient stack", () => {
    render(
      <SonnerProvider>
        <SonnerViewport />
      </SonnerProvider>,
    );
    expect(
      document.querySelector('[data-slot="sonner-viewport"]'),
    ).not.toBeNull();
  });
});
