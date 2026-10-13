import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FOCUS_RING_CLASS, FocusRing } from "./focus-ring";

describe("FocusRing", () => {
  it("is the canonical ring-3px secondary pair (M3 resting outline)", () => {
    expect(FOCUS_RING_CLASS).toBe(
      "focus-visible:ring-[3px] focus-visible:ring-(--md-sys-color-secondary)",
    );
  });

  it("wraps host content in the ring without owning the tab stop", () => {
    render(
      <FocusRing data-testid="ring" className="extra">
        content
      </FocusRing>,
    );
    const ring = screen.getByTestId("ring");
    expect(ring).toHaveAttribute("data-slot", "focus-ring");
    expect(ring).toHaveClass("focus-visible:ring-[3px]", "extra");
    expect(ring).not.toHaveAttribute("tabIndex");
    expect(screen.getByText("content")).toBe(ring);
  });
});
