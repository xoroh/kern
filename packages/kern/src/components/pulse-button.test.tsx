import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PulseButton } from "./pulse-button";

describe("PulseButton", () => {
  it("renders a shape-stable button with data-shape-stable=true and radial bloom", () => {
    render(<PulseButton testID="pb">Confirm</PulseButton>);
    const btn = screen.getByTestId("pb");
    expect(btn).toHaveAttribute("data-slot", "pulse-button");
    expect(btn).toHaveAttribute("data-shape-stable", "true");
    expect(btn.querySelector('[data-slot="pulse-bloom"]')).toBeTruthy();
  });

  it("keeps corner radius class invariant across press and toggle states", async () => {
    const user = userEvent.setup();
    render(
      <PulseButton toggle shape="pill" testID="pb-toggle">
        Pin
      </PulseButton>,
    );
    const btn = screen.getByTestId("pb-toggle");
    // Unlike Button, PulseButton has no active:rounded-* corner morph classes
    expect(btn.className).not.toContain("active:rounded-");
    expect(btn).toHaveAttribute("aria-pressed", "false");
    await user.click(btn);
    expect(btn).toHaveAttribute("aria-pressed", "true");
    // Corner radius class remains pill even when selected
    expect(btn.className).toContain(
      "rounded-[var(--comp-button-container-shape,var(--sys-shape-corner-full))]",
    );
  });

  it("uses M3 Expressive fast-spatial spring tokens for scale pulse and honors motion-reduce", () => {
    render(<PulseButton testID="pb-motion">Spring</PulseButton>);
    const btn = screen.getByTestId("pb-motion");
    expect(btn.className).toContain("--sys-motion-spring-spatial-fast");
    expect(btn.className).toContain("active:scale-[0.97]");
    expect(btn.className).toContain("motion-reduce:transform-none");
  });

  it("fires onHaptic on pointer down and pointer up when enabled", async () => {
    const user = userEvent.setup();
    const onHaptic = vi.fn();
    render(<PulseButton onHaptic={onHaptic}>Tap</PulseButton>);
    await user.click(screen.getByRole("button", { name: "Tap" }));
    expect(onHaptic).toHaveBeenCalledWith("pressIn");
    expect(onHaptic).toHaveBeenCalledWith("pressOut");
  });

  it("renders inline spinner and blocks interaction when loading", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <PulseButton loading onClick={onClick} testID="pb-loading">
        Saving
      </PulseButton>,
    );
    const btn = screen.getByTestId("pb-loading");
    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(btn.querySelector('[data-slot="pulse-spinner"]')).toBeTruthy();
    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders as a link when href is provided and drops href when disabled", () => {
    const { rerender } = render(
      <PulseButton href="/checkout" testID="pb-link">
        Checkout
      </PulseButton>,
    );
    expect(screen.getByTestId("pb-link")).toHaveAttribute("href", "/checkout");
    rerender(
      <PulseButton href="/checkout" disabled testID="pb-link">
        Checkout
      </PulseButton>,
    );
    expect(screen.getByTestId("pb-link")).not.toHaveAttribute("href");
  });
});
