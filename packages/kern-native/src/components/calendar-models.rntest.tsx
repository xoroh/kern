import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { Calendar } from "./calendar";

/**
 * Calendar model adoption (Axis #90, vendored 637b959): the grid, month
 * names, first-day order, disabled bounds and selection resolve through
 * `@xoroh/axis/models` (`buildCalendarGrid`, `resolveCalendarMonthNames`,
 * `resolveLocaleFirstDay`, `resolveCalendarSelection`, `shiftCalendarMonth`,
 * …). Weekday headers come from the model in locale order — `Sun`, not the
 * old hardcoded two-letter set. State stays Kern-held (`useControllableState`
 * for the value, local cursor for the viewed month).
 */

describe("calendar model adoption", () => {
  it("heads the grid with model weekday names", async () => {
    await render(<Calendar defaultValue={new Date(2026, 1, 17)} />);
    // Fail-before: the hardcoded header read Su/Mo — the model resolves
    // the locale short names (Sun/Mon/… for en-US).
    expect(screen.getByText("Sun")).toBeTruthy();
    expect(screen.queryByText("Su")).toBeNull();
  });

  it("titles the month from the model", async () => {
    await render(<Calendar defaultValue={new Date(2026, 1, 17)} />);
    expect(screen.getByText("February 2026")).toBeTruthy();
  });

  it("picks a day and reports a Date", async () => {
    const seen: Array<Date> = [];
    await render(
      <Calendar
        defaultValue={new Date(2026, 7, 4)}
        onValueChange={(d) => seen.push(d)}
      />,
    );
    await act(async () => {
      fireEvent.press(
        screen.getByLabelText(new Date(2026, 7, 15).toDateString()),
      );
    });
    expect(seen).toHaveLength(1);
    expect(seen[0]?.getFullYear()).toBe(2026);
    expect(seen[0]?.getMonth()).toBe(7);
    expect(seen[0]?.getDate()).toBe(15);
  });

  it("disables out-of-range days without removing them", async () => {
    const seen: Array<Date> = [];
    await render(
      <Calendar
        defaultValue={new Date(2026, 7, 10)}
        min={new Date(2026, 7, 5)}
        max={new Date(2026, 7, 20)}
        onValueChange={(d) => seen.push(d)}
      />,
    );
    const early = screen.getByLabelText(new Date(2026, 7, 1).toDateString());
    expect(
      screen.queryByRole("button", {
        name: new Date(2026, 7, 1).toDateString(),
        disabled: true,
      }),
    ).toBeTruthy();
    await act(async () => {
      fireEvent.press(early);
    });
    expect(seen).toHaveLength(0);
  });

  it("moves months with the nav buttons", async () => {
    await render(<Calendar defaultValue={new Date(2026, 0, 15)} />);
    expect(screen.getByText("January 2026")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Next month"));
    });
    expect(screen.getByText("February 2026")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Previous month"));
    });
    expect(screen.getByText("January 2026")).toBeTruthy();
  });
});
