import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./card";

describe("Card", () => {
  it("renders children with the default filled style (M3: container-highest, medium corners)", () => {
    render(<Card data-testid="card">Hello</Card>);
    const card = screen.getByTestId("card");
    expect(card).toHaveTextContent("Hello");
    expect(card).toHaveClass("rounded-(--md-sys-shape-corner-medium)");
    expect(card).toHaveClass("bg-(--md-sys-color-surface-container-highest)");
  });

  it("applies the outlined variant", () => {
    render(
      <Card variant="outlined" data-testid="card">
        Hello
      </Card>,
    );
    expect(screen.getByTestId("card")).toHaveClass("border");
  });

  // Move-39 edge: elevated lifts via the level-1 token class while filled
  // carries no shadow — the variant knob's painted-verify axis.
  it("lifts only the elevated variant", () => {
    const { unmount } = render(
      <Card variant="elevated" data-testid="card">
        Hello
      </Card>,
    );
    expect(screen.getByTestId("card")).toHaveClass(
      "shadow-(--md-sys-elevation-level1)",
    );
    unmount();

    render(<Card data-testid="card">Hello</Card>);
    expect(screen.getByTestId("card")).not.toHaveClass(
      "shadow-(--md-sys-elevation-level1)",
    );
  });
});
