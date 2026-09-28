import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("renders with error state", () => {
    render(<Textarea aria-label="Notes" error />);
    const field = screen.getByRole("textbox");
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field).toHaveClass("border-(--md-sys-color-error)");
  });
});
