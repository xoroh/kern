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
    expect(control.className).not.toContain(
      "rounded-(--sys-shape-corner-extra-small)",
    );
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

/**
 * WP9 Part D P3: filled/outlined variant depth.
 *
 * Both treatments already exist on the component — no API change here,
 * only pins that the two branches stay distinct: outlined draws the 1px
 * outline on surface, filled draws the tonal fill with the bottom active
 * indicator, and each reports its branch via `data-variant`.
 */
describe("Input variants", () => {
  it("defaults to outlined and reports the branch", () => {
    render(<Input aria-label="Email" />);
    const control = screen.getByRole("textbox");
    expect(control).toHaveAttribute("data-variant", "outlined");
    expect(control.className).toContain("border-(--sys-color-outline)");
    expect(control.className).toContain("bg-(--sys-color-surface)");
  });

  it("renders filled with the tonal fill and bottom indicator", () => {
    render(<Input aria-label="Email" variant="filled" />);
    const control = screen.getByRole("textbox");
    expect(control).toHaveAttribute("data-variant", "filled");
    expect(control.className).toContain(
      "bg-(--sys-color-surface-container-highest)",
    );
    expect(control.className).toContain(
      "border-(--sys-color-on-surface-variant)",
    );
    expect(control.className).not.toContain("border-(--sys-color-outline)");
  });

  it("keeps the M3 disabled split per variant, never a whole dim", () => {
    const { rerender } = render(<Input aria-label="Email" disabled />);
    expect(screen.getByRole("textbox").className).toContain(
      "disabled:border-(--sys-color-on-surface)/12",
    );
    rerender(<Input aria-label="Email" variant="filled" disabled />);
    expect(screen.getByRole("textbox").className).toContain(
      "disabled:bg-(--sys-color-on-surface)/4",
    );
    expect(screen.getByRole("textbox").className).not.toContain(
      "disabled:opacity-50",
    );
  });

  it("paints error on both branches", () => {
    const { rerender } = render(<Input aria-label="Email" error />);
    expect(screen.getByRole("textbox").className).toContain(
      "border-(--sys-color-error)",
    );
    rerender(<Input aria-label="Email" variant="filled" error />);
    expect(screen.getByRole("textbox").className).toContain(
      "border-(--sys-color-error)",
    );
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });
});
