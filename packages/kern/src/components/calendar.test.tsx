import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Calendar } from "./calendar";

const FEB_17_2026 = new Date(2026, 1, 17);

function day(name: string) {
  return screen.getByRole("gridcell", { name });
}

describe("Calendar", () => {
  it("marks the defaultValue day selected", () => {
    render(<Calendar defaultValue={FEB_17_2026} aria-label="Release" />);
    expect(day("Tue Feb 17 2026")).toHaveAttribute("aria-selected", "true");
    expect(day("Wed Feb 18 2026")).toHaveAttribute("aria-selected", "false");
  });

  it("disables days outside min/max without removing them", async () => {
    // move-19 guard for the Bounds knob: the doc promises out-of-range days
    // are unselectable rather than hidden, so the month shape never misleads.
    // Sensitivity-proven (mutation: drop min/max below and Feb 5 enables — RED).
    const user = userEvent.setup();
    render(
      <Calendar
        defaultValue={FEB_17_2026}
        min={new Date(2026, 1, 10)}
        max={new Date(2026, 1, 20)}
        aria-label="Release"
      />,
    );
    expect(day("Thu Feb 05 2026")).toBeDisabled();
    expect(day("Sat Feb 21 2026")).toBeDisabled();
    expect(day("Thu Feb 12 2026")).toBeEnabled();
    // Shape preserved: all 28 February days still rendered.
    expect(
      document.querySelectorAll("[data-slot='calendar-day']"),
    ).toHaveLength(28);
    // And a disabled day cannot be picked.
    await user.click(day("Thu Feb 05 2026"));
    expect(day("Tue Feb 17 2026")).toHaveAttribute("aria-selected", "true");
  });

  it("moves the cursor with arrow keys", async () => {
    const user = userEvent.setup();
    render(<Calendar defaultValue={FEB_17_2026} aria-label="Release" />);
    day("Tue Feb 17 2026").focus();
    await user.keyboard("{ArrowRight}");
    expect(day("Wed Feb 18 2026")).toHaveFocus();
  });
});

describe("Calendar targets (M3)", () => {
  it("widens day boxes to the 48dp minimum via inset", () => {
    render(
      <Calendar defaultValue={new Date(2026, 1, 17)} aria-label="Release" />,
    );
    const days = document.querySelectorAll("[data-slot='calendar-day']");
    expect(days.length).toBeGreaterThan(0);
    for (const d of Array.from(days)) {
      expect((d as HTMLElement).className).toContain("after:-inset-1");
    }
  });
});
