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

  it("shows the M3 selection check on labelled segments", () => {
    const { container } = renderBar(["week"]);
    const week = screen.getByRole("button", { name: "Week" });
    expect(week.querySelector('[data-slot="segmented-check"]')).not.toBeNull();
    // One check per labelled segment (Day, Week, Month).
    expect(
      container.querySelectorAll('[data-slot="segmented-check"]'),
    ).toHaveLength(3);
  });

  it("omits the check on icon-only segments unless forced", () => {
    const { container, rerender } = render(
      <SegmentedButton.Root defaultValue={["grid"]} aria-label="View">
        <SegmentedButton.Item value="grid" aria-label="Grid">
          <svg />
        </SegmentedButton.Item>
      </SegmentedButton.Root>,
    );
    expect(container.querySelector('[data-slot="segmented-check"]')).toBeNull();
    rerender(
      <SegmentedButton.Root defaultValue={["grid"]} aria-label="View">
        <SegmentedButton.Item value="grid" aria-label="Grid" check>
          <svg />
        </SegmentedButton.Item>
      </SegmentedButton.Root>,
    );
    expect(
      container.querySelector('[data-slot="segmented-check"]'),
    ).not.toBeNull();
  });

  it("scales segments through the M3 density sizes (sm default)", () => {
    const { rerender } = render(
      <SegmentedButton.Root aria-label="Range">
        <SegmentedButton.Item value="day">Day</SegmentedButton.Item>
      </SegmentedButton.Root>,
    );
    const segment = () => screen.getByRole("button", { name: "Day" });
    expect(segment()).toHaveClass("h-10");
    rerender(
      <SegmentedButton.Root aria-label="Range">
        <SegmentedButton.Item value="day" size="xs">
          Day
        </SegmentedButton.Item>
      </SegmentedButton.Root>,
    );
    expect(segment()).toHaveClass("h-8");
    rerender(
      <SegmentedButton.Root aria-label="Range">
        <SegmentedButton.Item value="day" size="xl">
          Day
        </SegmentedButton.Item>
      </SegmentedButton.Root>,
    );
    expect(segment()).toHaveClass("h-16");
  });
});
