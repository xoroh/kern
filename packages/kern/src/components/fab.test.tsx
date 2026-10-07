import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Fab } from "./fab";

describe("Fab", () => {
  it("renders children with the default 56dp geometry", () => {
    render(
      <Fab data-testid="fab" aria-label="Create">
        +
      </Fab>,
    );
    const fab = screen.getByTestId("fab");
    expect(fab).toHaveTextContent("+");
    expect(fab).toHaveClass("h-14");
  });

  // T2 edge: medium stretches to 96dp while default holds 56dp — the size
  // knob's painted-verify axis. Failing-first: asserts the geometries the
  // configurator teaches.
  it("separates medium geometry from the default", () => {
    const { unmount } = render(
      <Fab size="medium" data-testid="fab" aria-label="Create">
        +
      </Fab>,
    );
    expect(screen.getByTestId("fab")).toHaveClass("h-24");
    unmount();
    render(
      <Fab data-testid="fab2" aria-label="Create">
        +
      </Fab>,
    );
    expect(screen.getByTestId("fab2")).toHaveClass("h-14");
    expect(screen.getByTestId("fab2")).not.toHaveClass("h-24");
  });
});
