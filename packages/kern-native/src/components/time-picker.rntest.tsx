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
    const hourSelected = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].filter((h) =>
      Boolean(
        screen.queryByRole("option", {
          name: `Hour ${String(h).padStart(2, "0")}`,
          selected: true,
        }),
      ),
    );
    expect(hourSelected).toEqual([9]);
    const minuteSelected = ["30"].filter((m) =>
      Boolean(
        screen.queryByRole("option", { name: `Minute ${m}`, selected: true }),
      ),
    );
    expect(minuteSelected).toEqual(["30"]);
  });

  it("selects exactly one option per field, across all three fields", async () => {
    await render(
      <TimePicker defaultValue={{ hours: 9, minutes: 30 }} format="12h" />,
    );
    // Three separate axes means three separate single selections, NOT one
    // across the whole picker and not many per field.
    expect(
      screen.queryByRole("option", { name: "Hour 9", selected: true }),
    ).toBeTruthy();
    expect(
      screen.queryByRole("option", { name: "Minute 30", selected: true }),
    ).toBeTruthy();
    expect(
      screen.queryByRole("option", { name: "Period AM", selected: true }),
    ).toBeTruthy();
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
    expect(
      screen.queryByRole("option", { name: "Hour 03", selected: true }),
    ).toBeTruthy();
  });

  it("falls back to minute accuracy for an invalid step", async () => {
    // step 7 cannot produce whole minutes; 45 must survive rather than snap.
    await render(
      <TimePicker defaultValue={{ hours: 3, minutes: 45 }} step={7} />,
    );
    expect(
      screen.queryByRole("option", { name: "Minute 45", selected: true }),
    ).toBeTruthy();
  });

  it("exposes each field as a list of options", async () => {
    await render(<TimePicker defaultValue={{ hours: 9, minutes: 0 }} />);
    expect(selectedIn("Hour").props.role).toBe("list");
    expect(opt("Hour 09").props.accessibilityRole).toBe("option");
  });

  it("starts at midnight with no value", async () => {
    await render(<TimePicker />);
    expect(
      screen.queryByRole("option", { name: "Hour 00", selected: true }),
    ).toBeTruthy();
  });
});

describe("timeFieldStyles", () => {
  it("highlights the selected option", async () => {
    const selected = timeFieldStyles(true).option;
    const unselected = timeFieldStyles(false).option;
    expect(unselected.backgroundColor).not.toBe(selected.backgroundColor);
  });
});

describe("TimePicker dial presentation", () => {
  const dialOpt = (label: string) =>
    screen.getByTestId(`kern-time-dial-option-${label}`);

  it("renders the dial face instead of fields when presentation is dial", async () => {
    await render(
      <TimePicker
        defaultValue={{ hours: 9, minutes: 30 }}
        presentation="dial"
      />,
    );
    expect(screen.getByTestId("kern-time-dial")).toBeTruthy();
    expect(screen.getByTestId("kern-time-dial-face")).toBeTruthy();
    expect(screen.queryByTestId("kern-time-field-Hour")).toBeNull();
  });

  it("defaults to the listbox presentation", async () => {
    await render(<TimePicker defaultValue={{ hours: 9, minutes: 30 }} />);
    expect(screen.queryByTestId("kern-time-dial")).toBeNull();
    expect(screen.getByTestId("kern-time-field-Hour")).toBeTruthy();
  });

  it("keeps the listbox presentation when asked for it explicitly", async () => {
    await render(
      <TimePicker
        defaultValue={{ hours: 9, minutes: 30 }}
        presentation="listbox"
      />,
    );
    expect(screen.queryByTestId("kern-time-dial")).toBeNull();
    expect(screen.getByTestId("kern-time-field-Hour")).toBeTruthy();
  });

  /**
   * Same load-bearing claim as the listbox: 12-hour is presentation of
   * 24-hour STATE. "Hour 3" on a PM face reports 15, not 3.
   */
  it("reports 24-hour state in 12-hour dial mode", async () => {
    const onValueChange = jest.fn();
    await render(
      <TimePicker
        defaultValue={{ hours: 15, minutes: 0 }}
        format="12h"
        presentation="dial"
        onValueChange={onValueChange}
      />,
    );
    await act(async () => {
      fireEvent.press(dialOpt("Hour 3"));
    });
    expect(onValueChange).toHaveBeenCalledWith({ hours: 15, minutes: 0 });
  });

  // A press confirms the hour (M3 advances to minutes).
  it("advances to the minute ring after an hour is pressed", async () => {
    await render(
      <TimePicker
        defaultValue={{ hours: 15, minutes: 0 }}
        format="12h"
        presentation="dial"
        onValueChange={() => {}}
      />,
    );
    await act(async () => {
      fireEvent.press(dialOpt("Hour 3"));
    });
    expect(
      screen.getByTestId("kern-time-dial-face").props.accessibilityLabel,
    ).toBe("Minute");
    expect(screen.queryByTestId("kern-time-dial-option-Hour 3")).toBeNull();
  });

  it("honours step granularity on the minute ring", async () => {
    await render(
      <TimePicker
        defaultValue={{ hours: 9, minutes: 0 }}
        step={15}
        presentation="dial"
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Show minutes"));
    });
    expect(dialOpt("Minute 15")).toBeTruthy();
    expect(dialOpt("Minute 45")).toBeTruthy();
    // 10 is not on a step-15 grid.
    expect(screen.queryByLabelText("Minute 10")).toBeNull();
  });

  it("falls back to minute accuracy for an invalid step on the dial", async () => {
    // step 7 cannot produce whole minutes; 45 must survive rather than snap.
    await render(
      <TimePicker
        defaultValue={{ hours: 3, minutes: 45 }}
        step={7}
        presentation="dial"
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Show minutes"));
    });
    expect(
      screen.queryByRole("option", { name: "Minute 45", selected: true }),
    ).toBeTruthy();
  });

  it("reports a normalised value when a minute is pressed on the dial", async () => {
    const onValueChange = jest.fn();
    await render(
      <TimePicker
        defaultValue={{ hours: 9, minutes: 0 }}
        step={15}
        presentation="dial"
        onValueChange={onValueChange}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Show minutes"));
    });
    await act(async () => {
      fireEvent.press(dialOpt("Minute 45"));
    });
    expect(onValueChange).toHaveBeenCalledWith({ hours: 9, minutes: 45 });
  });

  // Midnight is the classic 12-hour bug ("Hour 12", not "Hour 0"); the period
  // is part of the value (00:00 AM -> PM is hours 12).
  it("shows 12 for midnight and reports 24-hour state when PM is pressed", async () => {
    const onValueChange = jest.fn();
    await render(
      <TimePicker
        defaultValue={{ hours: 0, minutes: 0 }}
        format="12h"
        presentation="dial"
        onValueChange={onValueChange}
      />,
    );
    expect(
      screen.queryByRole("option", { name: "Hour 12", selected: true }),
    ).toBeTruthy();
    await act(async () => {
      fireEvent.press(opt("Period PM"));
    });
    expect(onValueChange).toHaveBeenCalledWith({ hours: 12, minutes: 0 });
  });

  // M3 dial geometry: 24 hours on two rings — outer 00,13–23, inner 12,1–11.
  it("shows all 24 hours on two rings in 24-hour dial mode", async () => {
    await render(
      <TimePicker
        defaultValue={{ hours: 15, minutes: 0 }}
        presentation="dial"
      />,
    );
    const hourDots = screen.getAllByTestId(/kern-time-dial-option-Hour /);
    expect(hourDots).toHaveLength(24);
    expect(dialOpt("Hour 00")).toBeTruthy();
    expect(dialOpt("Hour 23")).toBeTruthy();
    expect(
      screen.queryByRole("option", { name: "Hour 15", selected: true }),
    ).toBeTruthy();
  });

  it("gives the dial ring a single selected option", async () => {
    await render(
      <TimePicker
        defaultValue={{ hours: 9, minutes: 30 }}
        step={15}
        presentation="dial"
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Show minutes"));
    });
    const selected = ["00", "15", "30", "45"].filter((m) =>
      Boolean(
        screen.queryByRole("option", { name: `Minute ${m}`, selected: true }),
      ),
    );
    expect(selected).toEqual(["30"]);
  });

  it("honours a controlled dial value", async () => {
    await render(
      <TimePicker value={{ hours: 3, minutes: 0 }} presentation="dial" />,
    );
    expect(
      screen.queryByRole("option", { name: "Hour 03", selected: true }),
    ).toBeTruthy();
  });
});
