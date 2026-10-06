import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renders label with shape variant", () => {
    render(<Badge variant="dot">New</Badge>);
    expect(screen.getByText("New")).toBeTruthy();
  });

  // Configurator edge: dot is a round marker, count is a pill — the variant
  // knob's painted-verify axis. Each shape carries its own geometry.
  it("separates dot geometry from count geometry", () => {
    const { unmount } = render(<Badge variant="dot">3</Badge>);
    const dot = screen.getByText("3");
    expect(dot).toHaveClass("size-1.5");
    expect(dot).not.toHaveClass("min-w-4");
    unmount();

    render(<Badge variant="count">3</Badge>);
    const count = screen.getByText("3");
    expect(count).toHaveClass("min-w-4");
    expect(count).not.toHaveClass("size-1.5");
  });
});
