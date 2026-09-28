import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renders count content", () => {
    render(<Badge>3</Badge>);
    expect(screen.getByText("3")).toHaveClass("bg-(--md-sys-color-error)");
  });

  it("renders the dot variant", () => {
    const { container } = render(<Badge variant="dot" />);
    expect(container.firstChild).toHaveClass("size-1.5");
  });
});
