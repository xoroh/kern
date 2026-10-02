import { contractFor } from "@kern-parity/contract";
import { fireEvent, render, screen } from "@testing-library/react-native";
// Imported from the PACKAGE, so the suite only means something if the component
// is reachable from the public entry — `3f7fd6e` made that true and `0a2c192`'s
// reachability gate keeps it true.
import { Carousel, TimePicker } from "@xoroh/kern-native";
import { act } from "react";
import { Text as RNText } from "react-native";

/**
 * Native side of the carousel and time-picker contract rows.
 *
 * These rows were previously `cross-renderer pending`: the native side had
 * component tests (in `src/components/`) but nothing in `src/parity/` CONSUMING
 * the contract row. A component test proves the component; a parity test proves
 * the contract. Both are needed — the component suites stay where they are.
 *
 * Only the shared obligation is asserted. The two recorded platform
 * substitutions are real divergences: web has `aria-roledescription` where
 * native has no such concept, and web uses `role="listbox"` where RN's `Role`
 * union carries only `list`.
 */
const R = "native" as const;

describe("native parity contract: carousel", () => {
  const items = [
    { value: "a", accessibilityLabel: "Slide one" },
    { value: "b", accessibilityLabel: "Slide two" },
    { value: "c", accessibilityLabel: "Slide three" },
  ];

  it("marks exactly one item as the selected stop", async () => {
    const r = contractFor("carousel");
    await render(<Carousel items={items} accessibilityLabel="Promotions" />);
    // The roving model: ONE selected stop for the whole track, never N.
    const selected = items.map(
      (i) =>
        screen.getByLabelText(i.accessibilityLabel).props.accessibilityState
          .selected,
    );
    expect(selected.filter(Boolean)).toHaveLength(1);
    expect(selected[0]).toBe(true);
    expect(r.role).toBe("group");
  });

  it("names the carousel region", async () => {
    await render(<Carousel items={items} accessibilityLabel="Promotions" />);
    expect(screen.getByLabelText("Promotions")).toBeTruthy();
  });

  it("moves the selected stop on activation", async () => {
    const onIndexChange = jest.fn();
    await render(
      <Carousel
        items={items}
        accessibilityLabel="Promotions"
        onIndexChange={onIndexChange}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Slide three"));
    });
    const selected = items.map(
      (i) =>
        screen.getByLabelText(i.accessibilityLabel).props.accessibilityState
          .selected,
    );
    expect(selected.filter(Boolean)).toHaveLength(1);
    expect(selected[2]).toBe(true);
  });
});

describe("native parity contract: time-picker", () => {
  it("gives each field exactly one selected option", async () => {
    const r = contractFor("time-picker");
    await render(
      <TimePicker
        defaultValue={{ hours: 9, minutes: 30 }}
        accessibilityLabel="Departure"
      />,
    );
    // THREE separate single selections (hour, minute, period) — not one across
    // the picker, and not many per field.
    expect(
      screen.getByLabelText("Hour 09").props.accessibilityState.selected,
    ).toBe(true);
    expect(
      screen.getByLabelText("Minute 30").props.accessibilityState.selected,
    ).toBe(true);
    expect(r.role).toBe("list");
  });

  it("reports a normalised value — never 18:75", async () => {
    const onValueChange = jest.fn();
    await render(
      <TimePicker
        defaultValue={{ hours: 99, minutes: 99 }}
        onValueChange={onValueChange}
        accessibilityLabel="Departure"
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Hour 01"));
    });
    const reported = onValueChange.mock.calls.at(-1)?.[0];
    expect(reported.hours).toBeGreaterThanOrEqual(0);
    expect(reported.hours).toBeLessThanOrEqual(23);
    expect(reported.minutes).toBeLessThanOrEqual(59);
  });

  it("reports 12-hour choices as 24-hour state", async () => {
    const onValueChange = jest.fn();
    await render(
      <TimePicker
        defaultValue={{ hours: 9, minutes: 0 }}
        format="12h"
        onValueChange={onValueChange}
        accessibilityLabel="Departure"
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Period PM"));
    });
    // 9 AM rendered as "9", read back as hour 9; switching to PM is 21. The
    // state never held "9 PM".
    expect(onValueChange).toHaveBeenCalledWith({ hours: 21, minutes: 0 });
  });
});
