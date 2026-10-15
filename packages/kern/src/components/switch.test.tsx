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
    ).toHaveClass("text-(--sys-color-on-primary-container)");
    expect(
      screen
        .getByRole("switch")
        .querySelector('[data-slot="switch-unchecked-icon"]'),
    ).toHaveClass("text-(--sys-color-surface-container-highest)");
  });

  it("wires the track shape to --comp-switch-track-shape with a full-corner fallback", () => {
    render(<Switch aria-label="Notifications" />);
    const track = screen.getByRole("switch");
    expect(track).toHaveClass(
      "rounded-[var(--comp-switch-track-shape,var(--sys-shape-corner-full))]",
    );
    expect(track.className).not.toContain("rounded-(--sys-shape-corner-full)");
  });
});
