import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Switch } from "./switch";

describe("Switch", () => {
  it("toggles through the switch control", () => {
    const onCheckedChange = vi.fn();
    render(<Switch checked={false} onCheckedChange={onCheckedChange} />);
    fireEvent.click(screen.getByRole("switch"));
    expect(onCheckedChange).toHaveBeenCalled();
  });

  it("shows the M3 thumb icons (close off, check on)", () => {
    const { rerender } = render(<Switch checked={false} />);
    const root = screen.getByRole("switch");
    expect(
      root.querySelector('[data-slot="switch-unchecked-icon"]'),
    ).not.toBeNull();
    expect(
      root.querySelector('[data-slot="switch-checked-icon"]'),
    ).not.toBeNull();
    rerender(<Switch checked />);
    expect(
      screen
        .getByRole("switch")
        .querySelector('[data-slot="switch-checked-icon"]'),
    ).toHaveClass("text-(--md-sys-color-on-primary-container)");
    expect(
      screen
        .getByRole("switch")
        .querySelector('[data-slot="switch-unchecked-icon"]'),
    ).toHaveClass("text-(--md-sys-color-surface-container-highest)");
  });
});
