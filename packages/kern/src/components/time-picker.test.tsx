import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { normaliseTime, TimePicker } from "./time-picker";

/**
 * P2-1 proof, item 7 of 7: the time picker.
 *
 * This component's value contract is the interesting part. kern ships M3's
 * listbox form rather than its clock face — a recorded deviation — and the whole
 * design rests on ONE normalised 24-hour value that a 12-hour face is a
 * presentation of. If that drifts, the picker is wrong in a way no screenshot
 * would show.
 */
/**
 * Options of ONE field.
 *
 * Scoping is necessary, not decorative: "15" is BOTH an hour and a minute in
 * 24-hour mode, so an unscoped `getByRole("option", { name: "15" })` finds two.
 *
 * The hour field is named "Hour (24 hour)" in 24h mode and "Hour" in 12h, and
 * the period field only exists in 12h — so the matcher is a prefix match.
 */
function field(name: string): HTMLElement {
  return screen.getByRole("listbox", { name: new RegExp(`^${name}`, "i") });
}

function optionsIn(fieldName: string, name: string | RegExp) {
  return within(field(fieldName)).getByRole("option", { name });
}

describe("normaliseTime", () => {
  it("wraps hours into 0-23 from either direction", () => {
    expect(normaliseTime({ hours: 24, minutes: 0 }).hours).toBe(0);
    expect(normaliseTime({ hours: 25, minutes: 0 }).hours).toBe(1);
    expect(normaliseTime({ hours: -1, minutes: 0 }).hours).toBe(23);
  });

  // A host must never receive 18:75 from its own arithmetic.
  it("clamps minutes into 0-59", () => {
    expect(normaliseTime({ hours: 18, minutes: 75 }).minutes).toBe(59);
    expect(normaliseTime({ hours: 18, minutes: -5 }).minutes).toBe(0);
  });

  it("rounds fractional values", () => {
    expect(normaliseTime({ hours: 9.6, minutes: 30.2 })).toEqual({
      hours: 10,
      minutes: 30,
    });
  });
});

describe("TimePicker", () => {
  it("shows the current value", () => {
    render(<TimePicker defaultValue={{ hours: 9, minutes: 30 }} />);
    expect(screen.getByText("09:30")).toBeInTheDocument();
  });

  it("renders 24h by default and 12h on request", () => {
    const { unmount } = render(
      <TimePicker defaultValue={{ hours: 15, minutes: 0 }} />,
    );
    expect(screen.getByText("15:00")).toBeInTheDocument();
    unmount();

    render(
      <TimePicker defaultValue={{ hours: 15, minutes: 0 }} format="12h" />,
    );
    expect(screen.getByText("3:00 PM")).toBeInTheDocument();
  });

  // Midnight and noon are the classic 12-hour bugs: `hours % 12` makes 0 render
  // as "00" instead of "12 AM".
  it("renders midnight and noon correctly in 12-hour mode", () => {
    const { unmount } = render(
      <TimePicker defaultValue={{ hours: 0, minutes: 0 }} format="12h" />,
    );
    expect(screen.getByText("12:00 AM")).toBeInTheDocument();
    unmount();

    render(
      <TimePicker defaultValue={{ hours: 12, minutes: 0 }} format="12h" />,
    );
    expect(screen.getByText("12:00 PM")).toBeInTheDocument();
  });

  // ---------------------------------------------------------------
  // The load-bearing claim: 12-hour is a PRESENTATION of 24-hour state
  // ---------------------------------------------------------------

  // "Choosing '3 PM' reports hours: 15, and re-opening in 24-hour mode shows
  // 15 — a picker that kept 12-hour state would drift the moment a consumer
  // persisted it." The drift is the defect, so the test asserts the REPORTED
  // value, not what is displayed.
  it("reports 24-hour state when a 12-hour face shows PM", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    // Start at 15:00 so the period is ALREADY pm — otherwise "03" means 03:00.
    render(
      <TimePicker
        defaultValue={{ hours: 15, minutes: 0 }}
        format="12h"
        onValueChange={onValueChange}
      />,
    );
    await user.click(optionsIn("hour", "03"));
    expect(onValueChange).toHaveBeenCalledWith(
      expect.objectContaining({ hours: 15 }),
    );
  });

  it("reports 24-hour state when AM is chosen", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    // Start at 03:00 (am), so choosing "09" means 09:00 and NOT 21:00.
    render(
      <TimePicker
        defaultValue={{ hours: 3, minutes: 0 }}
        format="12h"
        onValueChange={onValueChange}
      />,
    );
    await user.click(optionsIn("hour", "09"));
    expect(onValueChange).toHaveBeenCalledWith(
      expect.objectContaining({ hours: 9 }),
    );
  });

  // The period is part of the value, not a display toggle: choosing 09 while
  // the period is pm reports 21. This is the claim that a picker keeping
  // 12-hour state would fail, stated as arithmetic rather than prose.
  it("adds 12 when the period is pm", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <TimePicker
        defaultValue={{ hours: 15, minutes: 0 }}
        format="12h"
        onValueChange={onValueChange}
      />,
    );
    await user.click(optionsIn("hour", "09"));
    expect(onValueChange).toHaveBeenCalledWith(
      expect.objectContaining({ hours: 21 }),
    );
  });

  it("reports 24-hour state when switching am to pm", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <TimePicker
        defaultValue={{ hours: 9, minutes: 0 }}
        format="12h"
        onValueChange={onValueChange}
      />,
    );
    await user.click(optionsIn("am or pm", "PM"));
    expect(onValueChange).toHaveBeenCalledWith(
      expect.objectContaining({ hours: 21 }),
    );
  });

  // ---------------------------------------------------------------
  // Minutes are clamped to the step
  // ---------------------------------------------------------------

  it("offers minutes on the step", () => {
    render(<TimePicker defaultValue={{ hours: 9, minutes: 0 }} step={15} />);
    expect(optionsIn("minute", "15")).toBeInTheDocument();
    expect(optionsIn("minute", "45")).toBeInTheDocument();
    // 10 is not on a step-15 grid.
    expect(screen.getByRole("listbox", { name: /^minute$/i }).textContent).not.toContain("10");
  });

  // "A step that does not divide 60 falls back to 1 and says so via the
  // reported value being minute-accurate." A step of 7 would produce a grid that
  // never reaches the end of the hour.
  it("falls back to minute-accurate when step does not divide 60", () => {
    render(<TimePicker defaultValue={{ hours: 9, minutes: 0 }} step={7} />);
    expect(optionsIn("minute", "07")).toBeInTheDocument();
    expect(optionsIn("minute", "59")).toBeInTheDocument();
  });

  // The reported value is always normalised, even when the pick does not change
  // the number — this is M3's listbox auto-activation, so a click on the
  // selected option still reports. What matters is that what is REPORTED is in
  // range, not that a redundant click is silent.
  it("reports a normalised value even for a redundant pick", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <TimePicker
        defaultValue={{ hours: 9, minutes: 30 }}
        onValueChange={onValueChange}
      />,
    );
    await user.click(optionsIn("minute", "30"));
    expect(onValueChange).toHaveBeenCalledWith({ hours: 9, minutes: 30 });
  });

  // ---------------------------------------------------------------
  // Controlled / uncontrolled
  // ---------------------------------------------------------------

  it("reports but does not move a controlled value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <TimePicker
        value={{ hours: 9, minutes: 0 }}
        onValueChange={onValueChange}
      />,
    );
    await user.click(optionsIn("minute", "45"));
    expect(onValueChange).toHaveBeenCalledWith(
      expect.objectContaining({ minutes: 45 }),
    );
    // Still 09:00: the host owns it.
    expect(screen.getByText("09:00")).toBeInTheDocument();
  });

  it("normalises an out-of-range controlled value on read", () => {
    render(<TimePicker value={{ hours: 30, minutes: 90 }} />);
    // 30 -> 6, 90 -> 59. A host that persisted bad arithmetic must not see it
    // rendered as-is.
    expect(screen.getByText("06:59")).toBeInTheDocument();
  });

  // ---------------------------------------------------------------
  // Keyboard: three fields, three tab stops
  // ---------------------------------------------------------------

  // "three tab stops for three fields, not one per option" — a picker with 24 +
  // 12 + 2 tab stops would be unusable without a mouse.
  it("has one tab stop per field, not per option", () => {
    render(<TimePicker defaultValue={{ hours: 9, minutes: 0 }} format="12h" />);
    // Exactly one option per field is tabbable (roving tabindex).
    const selectable = screen
      .getAllByRole("option")
      .filter((o) => o.getAttribute("tabindex") === "0");
    expect(selectable).toHaveLength(3);
  });

  it("moves within a field with the arrow keys and reports the change", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <TimePicker
        defaultValue={{ hours: 9, minutes: 0 }}
        onValueChange={onValueChange}
      />,
    );
    // The keydown handler is on each OPTION (roving tabindex), so the selected
    // option is what receives focus and the keys — not the listbox container.
    optionsIn("hour", "09").focus();
    await user.keyboard("{ArrowDown}");
    expect(onValueChange).toHaveBeenCalledWith(
      expect.objectContaining({ hours: 10 }),
    );
  });

  it("wraps from the first hour to the last with Home/End", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <TimePicker
        defaultValue={{ hours: 0, minutes: 0 }}
        onValueChange={onValueChange}
      />,
    );
    optionsIn("hour", "00").focus();
    await user.keyboard("{End}");
    expect(onValueChange).toHaveBeenCalledWith(
      expect.objectContaining({ hours: 23 }),
    );
  });

  it("labels its three fields", () => {
    render(<TimePicker defaultValue={{ hours: 9, minutes: 0 }} format="12h" />);
    expect(screen.getByRole("listbox", { name: /hour/i })).toBeInTheDocument();
    expect(screen.getByRole("listbox", { name: /minute/i })).toBeInTheDocument();
    expect(screen.getByRole("listbox", { name: /am or pm/i })).toBeInTheDocument();
  });

  it("marks the selected option in each field", () => {
    render(
      <TimePicker defaultValue={{ hours: 9, minutes: 30 }} format="12h" />,
    );
    expect(screen.getByRole("option", { name: "09", selected: true })).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "30", selected: true }),
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "AM", selected: true })).toBeInTheDocument();
  });

  it("uses a custom display formatter when given one", () => {
    render(
      <TimePicker
        defaultValue={{ hours: 9, minutes: 5 }}
        formatValue={(v) => `${v.hours}h${v.minutes}m`}
      />,
    );
    expect(screen.getByText("9h5m")).toBeInTheDocument();
  });
});