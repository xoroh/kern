import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Input } from "./input";

describe("Input", () => {
  it("renders with placeholder and accepts typing", async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Email" />);
    const field = screen.getByPlaceholderText("Email");
    await user.type(field, "a@b.co");
    expect(field).toHaveValue("a@b.co");
  });

  it("marks aria-invalid when in error", () => {
    render(<Input aria-label="Email" error />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("does not let an explicit false aria-invalid suppress error styling", () => {
    render(<Input aria-label="Email" aria-invalid={false} error />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("textbox")).toHaveClass(
      "border-(--sys-color-error)",
    );
  });

  it("forwards its ref to the input element", () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input ref={ref} aria-label="Email" />);
    expect(ref.current).toBe(screen.getByRole("textbox"));
  });

  it("wires the container shape to --comp-text-field-container-shape with an extra-small fallback", () => {
    const { rerender } = render(<Input aria-label="Email" />);
    const control = screen.getByRole("textbox");
    expect(control.className).toContain(
      "rounded-[var(--comp-text-field-container-shape,var(--sys-shape-corner-extra-small))]",
    );
    expect(control.className).not.toContain("rounded-(--sys-shape-corner-extra-small)");
    // Filled keeps top-only rounding so bottom corners stay zero.
    rerender(<Input aria-label="Email" variant="filled" />);
    expect(screen.getByRole("textbox").className).toContain(
      "rounded-t-[var(--comp-text-field-container-shape,var(--sys-shape-corner-extra-small))]",
    );
    // The affix box carries the same top-only rounding when affixes render it.
    rerender(<Input aria-label="Email" variant="filled" prefix="$" />);
    expect(
      document.querySelector('[data-slot="input-affix-box"]')?.className,
    ).toContain(
      "rounded-t-[var(--comp-text-field-container-shape,var(--sys-shape-corner-extra-small))]",
    );
  });
});
