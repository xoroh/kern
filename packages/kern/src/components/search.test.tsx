import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Search } from "./search";

describe("Search", () => {
  it("renders the M3 docked bar: 56dp stadium in container-high", () => {
    render(<Search label="Search" />);
    const bar = screen.getByRole("search");
    expect(bar).toHaveClass(
      "h-14",
      "rounded-(--md-sys-shape-corner-full)",
      "bg-(--md-sys-color-surface-container-high)",
    );
  });
});
