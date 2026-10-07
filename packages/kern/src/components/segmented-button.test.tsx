import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SegmentedButton } from "./segmented-button";

function renderBar(defaultValue?: string[]) {
  return render(
    <SegmentedButton.Root defaultValue={defaultValue} aria-label="Range">
      <SegmentedButton.Item value="day">Day</SegmentedButton.Item>
      <SegmentedButton.Item value="week">Week</SegmentedButton.Item>
      <SegmentedButton.Item value="month">Month</SegmentedButton.Item>
    </SegmentedButton.Root>,
  );
}

describe("SegmentedButton", () => {
  it("marks exactly the chosen segment pressed", () => {
    renderBar(["week"]);
    expect(screen.getByRole("button", { name: "Week" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Day" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("button", { name: "Month" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("starts with nothing chosen when uncontrolled without defaultValue", () => {
    renderBar();
    for (const name of ["Day", "Week", "Month"]) {
      expect(screen.getByRole("button", { name })).toHaveAttribute(
        "aria-pressed",
        "false",
      );
    }
  });

  // Configurator edge: the chosen segment fills with the secondary container
  // role while the rest stay quiet — the `chosen` knob's painted-verify axis.
  // The fill lives in the item's own classes, so the knob's promise is pinned
  // here, not in prose.
  it("carries the chosen-fill geometry on every segment", () => {
    renderBar(["week"]);
    for (const name of ["Day", "Week", "Month"]) {
      const segment = screen.getByRole("button", { name });
      expect(segment.className).toContain(
        "data-pressed:bg-(--md-sys-color-secondary-container)",
      );
      expect(segment.className).toContain(
        "data-pressed:text-(--md-sys-color-on-secondary-container)",
      );
    }
  });
});
