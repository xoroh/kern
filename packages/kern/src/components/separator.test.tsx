import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Separator } from "./separator";

describe("Separator", () => {
  it("renders a full-width hairline by default", () => {
    render(<Separator data-testid="sep" />);
    const sep = screen.getByTestId("sep");
    expect(sep).toHaveClass("h-px");
    expect(sep).toHaveClass("w-full");
  });

  // T2 edge: vertical stands full-height 1px wide while horizontal spans
  // full width 1px tall — the orientation knob's painted-verify axis.
  // Failing-first: asserts the geometries the configurator teaches.
  it("separates vertical geometry from horizontal", () => {
    const { unmount } = render(
      <Separator orientation="vertical" data-testid="sep" />,
    );
    expect(screen.getByTestId("sep")).toHaveClass("h-full");
    expect(screen.getByTestId("sep")).toHaveClass("w-px");
    unmount();
    render(<Separator data-testid="sep2" />);
    expect(screen.getByTestId("sep2")).toHaveClass("h-px");
    expect(screen.getByTestId("sep2")).not.toHaveClass("w-px");
  });
});
