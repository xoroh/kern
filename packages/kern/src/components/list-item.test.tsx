import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ListItem } from "./list-item";

describe("ListItem selected (M3)", () => {
  it("paints the selected highlight with 16dp corners", () => {
    render(
      <ListItem headline="Inbox" supporting="3 new" selected data-testid="row" />,
    );
    const row = screen.getByTestId("row");
    expect(row).toHaveAttribute("data-selected");
    expect(row.className).toContain(
      "data-selected:bg-(--md-sys-color-secondary-container)",
    );
    expect(row.className).toContain("data-selected:rounded-[16px]");
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
