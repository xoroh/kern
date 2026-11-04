import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Kbd } from "./kbd";

/**
 * WP9 Part D P1: Kbd behavior pins.
 *
 * A static hint, never a control: the `<kbd>` element carries the text,
 * the M3 container treatment, and nothing else.
 */
describe("Kbd", () => {
  it("renders the shortcut text in a kbd element", () => {
    render(<Kbd>Ctrl</Kbd>);
    const hint = screen.getByText("Ctrl");
    expect(hint.tagName).toBe("KBD");
    expect(hint).toHaveAttribute("data-slot", "kbd");
  });

  it("paints the M3 hint treatment on surface tokens", () => {
    render(<Kbd>Esc</Kbd>);
    const hint = screen.getByText("Esc");
    expect(hint.className).toContain("border-(--sys-color-outline-variant)");
    expect(hint.className).toContain("bg-(--sys-color-surface-tonal)");
    expect(hint.className).toContain("font-mono");
    expect(hint.className).not.toMatch(/#[0-9a-fA-F]{3,8}/);
  });

  it("merges a caller className without dropping the treatment", () => {
    render(<Kbd className="ml-2">K</Kbd>);
    const hint = screen.getByText("K");
    expect(hint.className).toContain("ml-2");
    expect(hint.className).toContain("kern-kbd");
  });
});
