import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("renders a multiline field", () => {
    render(<Textarea aria-label="Body" />);
    expect(screen.getByRole("textbox", { name: "Body" })).toBeTruthy();
  });
});

/**
 * WP9 Part D P3: filled/outlined variant depth.
 *
 * Both treatments already exist on the component — no API change here,
 * only pins that the two branches stay distinct and each reports its
 * branch via `data-variant`.
 */
describe("Textarea variants", () => {
  it("defaults to outlined on surface", () => {
    render(<Textarea aria-label="Body" />);
    const control = screen.getByRole("textbox", { name: "Body" });
    expect(control).toHaveAttribute("data-variant", "outlined");
    expect(control.className).toContain("border-(--sys-color-outline)");
    expect(control.className).toContain("bg-(--sys-color-surface)");
  });

  it("renders filled with the tonal fill and bottom indicator", () => {
    render(<Textarea aria-label="Body" variant="filled" />);
    const control = screen.getByRole("textbox", { name: "Body" });
    expect(control).toHaveAttribute("data-variant", "filled");
    expect(control.className).toContain(
      "bg-(--sys-color-surface-container-highest)",
    );
    expect(control.className).toContain(
      "border-(--sys-color-on-surface-variant)",
    );
    expect(control.className).not.toContain("border-(--sys-color-outline)");
  });

  it("keeps the M3 disabled split on both branches", () => {
    const { rerender } = render(<Textarea aria-label="Body" disabled />);
    expect(screen.getByRole("textbox", { name: "Body" }).className).toContain(
      "disabled:border-(--sys-color-on-surface)/12",
    );
    rerender(<Textarea aria-label="Body" variant="filled" disabled />);
    expect(screen.getByRole("textbox", { name: "Body" }).className).toContain(
      "disabled:bg-(--sys-color-on-surface)/4",
    );
  });
});
