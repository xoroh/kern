import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./card";

describe("Card", () => {
  it("renders children with the default filled style", () => {
    render(<Card data-testid="card">Hello</Card>);
    const card = screen.getByTestId("card");
    expect(card).toHaveTextContent("Hello");
    expect(card).toHaveClass("rounded-(--md-sys-shape-corner-small)");
  });

  it("applies the outlined variant", () => {
    render(
      <Card variant="outlined" data-testid="card">
        Hello
      </Card>,
    );
    expect(screen.getByTestId("card")).toHaveClass("border");
  });
});
