import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { TimePicker, timeFieldStyles } from "./time-picker";

const opt = (label: string) => screen.getByLabelText(label);
const selectedIn = (field: string) =>
  screen.getByTestId(`kern-time-field-${field}`);

describe("TimePicker", () => {
  it("is a named group", async () => {
    await render(<TimePicker accessibilityLabel="Departure" />);
    expect(screen.getByLabelText("Departure").props.role).toBe("group");
  });

  /**
   * THE requirement, and the opposite of a carousel: three fields are THREE tab
   * stops. One roving model per field is what produces that — a shared axis
   * would make the whole picker one stop and a keyboard user could never reach
   * the minutes.
   */
  it("gives each field its own single selected option", async () => {
    await render(<TimePicker defaultValue={{ hours: 9, minutes: 30 }} />);
    const hourSelected = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].filter(
      (h) =>
        opt(`Hour ${String(h).padStart(2, "0")}`).props.accessibilityState
          .selected,
    );
    expect(hourSelected).toEqual([9]);
    const minuteSelected = ["30"].filter(
      (m) => opt(`Minute ${m}`).props.accessibilityState.selected,
    );
    expect(minuteSelected).toEqual(["30"]);
  });

  it("selects exactly one option per field, across all three fields", async () => {
    await render(
      <TimePicker defaultValue={{ hours: 9, minutes: 30 }} format="12h" />,
    );
    // Three separate axes means three separate single selections, NOT one
    // across the whole picker and not many per field.
    expect(opt("Hour 9").props.accessibilityState.selected).toBe(true);
    expect(opt("Minute 30").props.accessibilityState.selected).toBe(true);
    expect(opt("Period AM").props.accessibilityState.selected).toBe(true);
  });

  /**
   * 12-hour is presentation of 24-hour STATE. 9 AM rendered as "9", read back
   * as hour 9; switching to PM is 21, not 22 — the state never held "9 PM".
   */
  it("reports 24-hour state in 12-hour mode", async () => {
    const onValueChange = jest.fn();
    await render(
      <TimePicker
        defaultValue={{ hours: 9, minutes: 0 }}
        format="12h"
        onValueChange={onValueChange}
      />,
    );
    await act(async () => {
      fireEvent.press(opt("Period PM"));
    });
    expect(onValueChange).toHaveBeenCalledWith({ hours: 21, minutes: 0 });
  });

  it("adds the period field only in 12-hour mode", async () => {
    await render(<TimePicker defaultValue={{ hours: 9, minutes: 0 }} />);
    expect(screen.queryByTestId("kern-time-field-Period")).toBeNull();
    await render(
      <TimePicker defaultValue={{ hours: 9, minutes: 0 }} format="12h" />,
    );
    expect(screen.getByTestId("kern-time-field-Period")).toBeTruthy();
  });

  it("reports a normalised value when a minute is chosen", async () => {
    const onValueChange = jest.fn();
    await render(
      <TimePicker
        defaultValue={{ hours: 9, minutes: 0 }}
        step={15}
        onValueChange={onValueChange}
      />,
    );
    await act(async () => {
      fireEvent.press(opt("Minute 45"));
    });
    expect(onValueChange).toHaveBeenCalledWith({ hours: 9, minutes: 45 });
  });

  /** The consumer must never be handed 18:75. */
  it("never reports an out-of-range value from a bad default", async () => {
    const onValueChange = jest.fn();
    await render(
      <TimePicker
        defaultValue={{ hours: 99, minutes: 99 }}
        onValueChange={onValueChange}
      />,
    );
    await act(async () => {
      fireEvent.press(opt("Hour 01"));
    });
    expect(onValueChange).toHaveBeenCalledWith({ hours: 1, minutes: 59 });
  });

  it("honours a controlled value", async () => {
    await render(<TimePicker value={{ hours: 3, minutes: 0 }} />);
    expect(opt("Hour 03").props.accessibilityState.selected).toBe(true);
  });

  it("falls back to minute accuracy for an invalid step", async () => {
    // step 7 cannot produce whole minutes; 45 must survive rather than snap.
    await render(
      <TimePicker defaultValue={{ hours: 3, minutes: 45 }} step={7} />,
    );
    expect(opt("Minute 45").props.accessibilityState.selected).toBe(true);
  });

  it("exposes each field as a list of options", async () => {
    await render(<TimePicker defaultValue={{ hours: 9, minutes: 0 }} />);
    expect(selectedIn("Hour").props.role).toBe("list");
    expect(opt("Hour 09").props.accessibilityRole).toBe("option");
  });

  it("starts at midnight with no value", async () => {
    await render(<TimePicker />);
    expect(opt("Hour 00").props.accessibilityState.selected).toBe(true);
  });
});

describe("timeFieldStyles", () => {
  it("highlights the selected option", async () => {
    const selected = timeFieldStyles(true).option;
    const unselected = timeFieldStyles(false).option;
    expect(unselected.backgroundColor).not.toBe(selected.backgroundColor);
  });
});
