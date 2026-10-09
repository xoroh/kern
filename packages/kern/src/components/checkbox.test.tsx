import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("toggles on click", async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="Accept" />);
    const box = screen.getByRole("checkbox");
    expect(box).toHaveAttribute("aria-checked", "false");
    await user.click(box);
    expect(box).toHaveAttribute("aria-checked", "true");
  });

  it("renders the mixed state with a dash, not a check", () => {
    const { container } = render(
      <Checkbox aria-label="Select all" indeterminate />,
    );
    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "mixed",
    );
    expect(container.querySelector("svg path")?.getAttribute("d")).toBe(
      "M2.5 6h7",
    );
  });

  it("exposes disabled state", () => {
    render(<Checkbox aria-label="Accept" disabled />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("data-disabled");
  });

  it("paints hover/focus as a 40dp state layer (M3, not a dim)", () => {
    render(<Checkbox aria-label="Accept" />);
    const box = screen.getByRole("checkbox");
    expect(box).toHaveClass(
      "before:-inset-[11px]",
      "before:rounded-full",
      "hover:before:opacity-[var(--md-sys-state-hover)]",
      "focus-visible:before:opacity-[var(--md-sys-state-focus)]",
      "before:bg-(--md-sys-color-on-surface)",
      "data-checked:before:bg-(--md-sys-color-primary)",
    );
    expect(box.className).not.toContain("hover:opacity-");
  });
});
