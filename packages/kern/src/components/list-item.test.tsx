import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ListItem } from "./list-item";

describe("ListItem selected (M3)", () => {
  it("paints the selected highlight with shape-scale corners", () => {
    render(
      <ListItem headline="Inbox" supporting="3 new" selected data-testid="row" />,
    );
    const row = screen.getByTestId("row");
    expect(row).toHaveAttribute("data-selected");
    expect(row.className).toContain(
      "data-selected:bg-(--md-sys-color-secondary-container)",
    );
    // The corner is the shape-scale token, not a raw px value: a hardcoded
    // radius is invisible to theme/contrast switching and to the shape gate.
    expect(row.className).toContain(
      "data-selected:rounded-(--md-sys-shape-corner-large)",
    );
  });

  it("reports aria-current on selected navigation rows", () => {
    render(<ListItem headline="Inbox" href="/inbox" selected />);
    expect(screen.getByRole("link", { name: "Inbox" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("leaves unselected rows unmarked", () => {
    render(<ListItem headline="Inbox" data-testid="row" />);
    expect(screen.getByTestId("row")).not.toHaveAttribute("data-selected");
  });
});
