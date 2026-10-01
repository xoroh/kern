/**
 * Native behaviour suite for the M3 input family, tranche 1 (P2b-3).
 *
 * TWO kinds of test live here, deliberately separated:
 *
 * 1. `parity contract (tranche 3)` blocks read the SAME declaration as the web
 *    suite (`parity/contract.ts`, aliased `@kern-parity/contract`). They are
 *    cross-renderer: a failure means the renderers disagree, not that this
 *    component is broken.
 * 2. The rest assert behaviour the contract deliberately does NOT pin, because
 *    the two renderers legitimately differ there (each is documented inline).
 *
 * This file imports nothing from `@xoroh/kern` — ADR 002.
 */
import { assertParity, contractFor } from "@kern-parity/contract";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import {
  Autocomplete,
  type AutocompleteSuggestion,
  defaultAutocompleteFilter,
} from "../components/autocomplete";
import { InputOTP, toOTPPositions } from "../components/input-otp";
import { clampToRange, NumberField } from "../components/number-field";

const R = "native" as const;

const FRUIT: AutocompleteSuggestion[] = [
  { value: "alpha", label: "Alpha" },
  { value: "beta", label: "Beta" },
  { value: "gamma", label: "Gamma" },
];

describe("autocomplete (native)", () => {
  it("exposes a combobox field that starts collapsed", async () => {
    await render(
      <Autocomplete suggestions={FRUIT} accessibilityLabel="Fruit" />,
    );
    const field = screen.getByTestId("kern-autocomplete-input");
    expect(field.props.accessibilityRole).toBe("combobox");
    expect(field.props.accessibilityState.expanded).toBe(false);
  });

  it("opens only once the query matches something", async () => {
    await render(
      <Autocomplete suggestions={FRUIT} accessibilityLabel="Fruit" />,
    );
    const field = screen.getByTestId("kern-autocomplete-input");
    // Focus alone must not open it: an unopened field showing the whole list
    // is not M3 autocomplete, it is a dropdown.
    await act(async () => {
      field.props.onFocus();
    });
    expect(field.props.accessibilityState.expanded).toBe(false);

    await act(async () => {
      field.props.onChangeText("be");
    });
    expect(field.props.accessibilityState.expanded).toBe(true);
    expect(screen.getByLabelText("Beta")).toBeTruthy();
    // Alpha and Gamma do not match "be".
    expect(screen.queryByLabelText("Alpha")).toBeNull();
  });

  it("filters case-insensitively and ignores surrounding space", async () => {
    const match = defaultAutocompleteFilter;
    expect(match(FRUIT[0], "LPH")).toBe(true);
    expect(match(FRUIT[0], "  al ")).toBe(true);
    expect(match(FRUIT[0], "zzz")).toBe(false);
  });

  it("commits a suggestion and collapses", async () => {
    let selected: AutocompleteSuggestion | undefined;
    const expansions: boolean[] = [];
    await render(
      <Autocomplete
        suggestions={FRUIT}
        accessibilityLabel="Fruit"
        onSelect={(s) => {
          selected = s;
        }}
        onExpandedChange={(e) => expansions.push(e)}
      />,
    );
    const field = screen.getByTestId("kern-autocomplete-input");
    await act(async () => {
      field.props.onFocus();
      field.props.onChangeText("gam");
    });
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Gamma"));
    });
    expect(selected?.value).toBe("gamma");
    // The committed label lands in the field.
    expect(screen.getByTestId("kern-autocomplete-input").props.value).toBe(
      "Gamma",
    );
    expect(
      screen.getByTestId("kern-autocomplete-input").props.accessibilityState
        .expanded,
    ).toBe(false);
    expect(expansions).toEqual([false]);
  });

  it("dismisses on blur without committing", async () => {
    let selected: AutocompleteSuggestion | undefined;
    await render(
      <Autocomplete
        suggestions={FRUIT}
        accessibilityLabel="Fruit"
        onSelect={(s) => {
          selected = s;
        }}
      />,
    );
    const field = screen.getByTestId("kern-autocomplete-input");
    await act(async () => {
      field.props.onFocus();
      field.props.onChangeText("a");
    });
    expect(
      screen.getByTestId("kern-autocomplete-input").props.accessibilityState
        .expanded,
    ).toBe(true);
    await act(async () => {
      field.props.onBlur();
    });
    expect(
      screen.getByTestId("kern-autocomplete-input").props.accessibilityState
        .expanded,
    ).toBe(false);
    expect(selected).toBeUndefined();
    expect(screen.queryByLabelText("Alpha")).toBeNull();
  });

  it("announces the empty result instead of opening an empty popup", async () => {
    await render(
      <Autocomplete
        suggestions={FRUIT}
        accessibilityLabel="Fruit"
        emptyMessage="No matches"
      />,
    );
    const field = screen.getByTestId("kern-autocomplete-input");
    await act(async () => {
      field.props.onFocus();
      field.props.onChangeText("zzz");
    });
    expect(
      screen.getByTestId("kern-autocomplete-input").props.accessibilityState
        .expanded,
    ).toBe(false);
    expect(
      String(
        screen.getByTestId("kern-autocomplete-input").props.accessibilityHint,
      ),
    ).toContain("No matches");
  });

  it("a disabled field never opens and cannot be committed", async () => {
    let selected: AutocompleteSuggestion | undefined;
    await render(
      <Autocomplete
        suggestions={FRUIT}
        accessibilityLabel="Fruit"
        disabled
        onSelect={(s) => {
          selected = s;
        }}
      />,
    );
    const field = screen.getByTestId("kern-autocomplete-input");
    expect(field.props.editable).toBe(false);
    await act(async () => {
      field.props.onFocus();
      field.props.onChangeText("a");
    });
    expect(
      screen.getByTestId("kern-autocomplete-input").props.accessibilityState
        .expanded,
    ).toBe(false);
    expect(selected).toBeUndefined();
  });

  it("a disabled suggestion cannot be committed", async () => {
    let selected: AutocompleteSuggestion | undefined;
    await render(
      <Autocomplete
        suggestions={[FRUIT[0], { ...FRUIT[1], disabled: true }]}
        accessibilityLabel="Fruit"
        onSelect={(s) => {
          selected = s;
        }}
      />,
    );
    const field = screen.getByTestId("kern-autocomplete-input");
    await act(async () => {
      field.props.onFocus();
      field.props.onChangeText("e");
    });
    const beta = screen.getByLabelText("Beta");
    expect(beta.props.accessibilityState.disabled).toBe(true);
    expect(beta.props.accessibilityState.selected).toBe(true);
    await act(async () => {
      fireEvent.press(beta);
    });
    expect(selected).toBeUndefined();
  });

  it("reports exactly one active suggestion at a time", async () => {
    await render(
      <Autocomplete suggestions={FRUIT} accessibilityLabel="Fruit" />,
    );
    const field = screen.getByTestId("kern-autocomplete-input");
    await act(async () => {
      field.props.onFocus();
      field.props.onChangeText("a");
    });
    const active = ["Alpha", "Beta", "Gamma"].filter(
      (label) => screen.getByLabelText(label).props.accessibilityState.selected,
    );
    expect(active).toEqual(["Alpha"]);
  });

  it("host-controlled: the host owns the value", async () => {
    const seen: string[] = [];
    await render(
      <Autocomplete
        suggestions={FRUIT}
        accessibilityLabel="Fruit"
        value="be"
        onValueChange={(v) => seen.push(v)}
      />,
    );
    // Controlled: the field shows the HOST's value, not the typed one.
    expect(screen.getByTestId("kern-autocomplete-input").props.value).toBe(
      "be",
    );
    expect(seen).toEqual([]);
  });

  it("a host filter replaces the default matcher", async () => {
    await render(
      <Autocomplete
        suggestions={FRUIT}
        accessibilityLabel="Fruit"
        filter={(s) => s.label.startsWith("G")}
      />,
    );
    const field = screen.getByTestId("kern-autocomplete-input");
    await act(async () => {
      field.props.onFocus();
      field.props.onChangeText("zzz");
    });
    // The default matcher would reject "zzz"; the host's matcher ignores the
    // query entirely, so Gamma is offered.
    expect(screen.getByLabelText("Gamma")).toBeTruthy();
  });
});

describe("native parity contract (tranche 3): number-field", () => {
  it("steps by exactly `step`, per the shared contract", async () => {
    // Cross-renderer: the SAME row the web suite asserts. This is the test that
    // caught the snapping bug — an early native `clampToStep` re-snapped the
    // result to a multiple of `step`, turning 5 + 2 into 8 instead of 7.
    const row = contractFor("number-field");
    const seen: number[] = [];
    await render(
      <NumberField
        defaultValue={row.start}
        min={row.min}
        max={row.max}
        step={row.step}
        accessibilityLabel={row.name}
        onValueChange={(v) => seen.push(v)}
      />,
    );
    assertParity(
      row,
      R,
      Number(screen.getByTestId("kern-number-field-input").props.value),
      row.start,
      "the field must show the contract's starting value",
    );
    const [decLabel, incLabel] = row.stepperLabels ?? ["Decrease", "Increase"];
    await act(async () => {
      fireEvent.press(screen.getByLabelText(decLabel));
    });
    assertParity(
      row,
      R,
      Number(screen.getByTestId("kern-number-field-input").props.value),
      row.afterDecrement,
      `one ${decLabel} press must move the value by exactly ${row.step}`,
    );
    // Two SEPARATE acts, not two presses in one: each press must read the
    // value the previous one committed. Batching them reads one stale value
    // twice and would assert a behaviour the component does not have (and no
    // renderer has — two real taps are two ticks).
    await act(async () => {
      fireEvent.press(screen.getByLabelText(incLabel));
    });
    await act(async () => {
      fireEvent.press(screen.getByLabelText(incLabel));
    });
    assertParity(
      row,
      R,
      Number(screen.getByTestId("kern-number-field-input").props.value),
      row.afterIncrement,
      `two ${incLabel} presses must move the value by exactly ${row.step} each`,
    );
    assertParity(
      row,
      R,
      seen.length,
      3,
      "every step that moved the value reported it",
    );
  });
});

describe("native parity contract (tranche 3): input-otp", () => {
  it("assembles one character per position, per the shared contract", async () => {
    const row = contractFor("input-otp");
    let completed: string | undefined;
    await render(
      <InputOTP
        length={row.positions}
        accessibilityLabel={row.name}
        onComplete={(v) => {
          completed = v;
        }}
      />,
    );
    assertParity(
      row,
      R,
      screen.getByTestId("kern-input-otp").props.accessibilityRole,
      row.role,
      "the OTP field must expose the group role",
    );
    for (const index of [0, 1, 2, 3]) {
      assertParity(
        row,
        R,
        Boolean(screen.queryByTestId(`kern-input-otp-${index}`)),
        true,
        `position ${index + 1} of ${row.positions} must exist`,
      );
    }
    // One character typed into each position, in order.
    for (const [index, char] of [...(row.completedValue ?? "")].entries()) {
      await act(async () => {
        screen.getByTestId(`kern-input-otp-${index}`).props.onChangeText(char);
      });
    }
    const assembled = [0, 1, 2, 3]
      .map((index) => screen.getByTestId(`kern-input-otp-${index}`).props.value)
      .join("");
    assertParity(
      row,
      R,
      assembled,
      row.completedValue,
      "the positions must assemble the contract's code",
    );
    assertParity(
      row,
      R,
      completed,
      row.completedValue,
      "the host must be told the completed code",
    );
  });
});

describe("number-field (native)", () => {
  it("steps by step and reports the value", async () => {
    const seen: number[] = [];
    await render(
      <NumberField
        defaultValue={5}
        min={0}
        max={10}
        step={2}
        onValueChange={(v) => seen.push(v)}
      />,
    );
    expect(screen.getByTestId("kern-number-field-input").props.value).toBe("5");
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Increase"));
    });
    expect(seen).toEqual([7]);
    expect(screen.getByTestId("kern-number-field-input").props.value).toBe("7");
  });

  it("clamps at the bound and says so on the stepper", async () => {
    const seen: number[] = [];
    await render(
      <NumberField
        defaultValue={0}
        min={0}
        max={4}
        onValueChange={(v) => seen.push(v)}
      />,
    );
    const dec = screen.getByLabelText("Decrease");
    expect(dec.props.accessibilityState.disabled).toBe(true);
    await act(async () => {
      fireEvent.press(dec);
    });
    expect(seen).toEqual([]);
    expect(screen.getByTestId("kern-number-field-input").props.value).toBe("0");
  });

  it("clamps at max even if the press lands there", async () => {
    const seen: number[] = [];
    await render(
      <NumberField
        defaultValue={4}
        min={0}
        max={4}
        onValueChange={(v) => seen.push(v)}
      />,
    );
    const inc = screen.getByLabelText("Increase");
    expect(inc.props.accessibilityState.disabled).toBe(true);
    await act(async () => {
      fireEvent.press(inc);
    });
    expect(seen).toEqual([]);
    expect(screen.getByTestId("kern-number-field-input").props.value).toBe("4");
  });

  it("clamps a typed value that is out of range", async () => {
    const seen: number[] = [];
    await render(
      <NumberField
        defaultValue={0}
        min={0}
        max={10}
        onValueChange={(v) => seen.push(v)}
      />,
    );
    await act(async () => {
      screen.getByTestId("kern-number-field-input").props.onChangeText("99");
    });
    expect(seen).toEqual([10]);
  });

  it("a disabled field refuses both steppers", async () => {
    const seen: number[] = [];
    await render(
      <NumberField
        defaultValue={5}
        disabled
        onValueChange={(v) => seen.push(v)}
      />,
    );
    // Asserted on the announced axis, not on the `disabled` prop: RNTL's
    // host element does not carry it, and `accessibilityState.disabled` is
    // what a screen reader actually reads.
    expect(
      screen.getByLabelText("Increase").props.accessibilityState.disabled,
    ).toBe(true);
    expect(
      screen.getByLabelText("Decrease").props.accessibilityState.disabled,
    ).toBe(true);
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Increase"));
      fireEvent.press(screen.getByLabelText("Decrease"));
    });
    expect(seen).toEqual([]);
    expect(screen.getByTestId("kern-number-field-input").props.editable).toBe(
      false,
    );
  });

  it("announces the value and its range", async () => {
    await render(
      <NumberField
        defaultValue={5}
        min={0}
        max={10}
        accessibilityLabel="Count"
      />,
    );
    const field = screen.getByTestId("kern-number-field-input");
    expect(field.props.accessibilityLabel).toBe("Count");
    expect(field.props.accessibilityValue).toEqual({ now: 5, min: 0, max: 10 });
  });

  it("clamps to the range without snapping to a step grid", () => {
    // The stepper is arithmetic, not a grid: measured on web, 5 with step 2
    // decrements to 3, so `step` must not re-snap the result.
    expect(clampToRange(11, 0, 10)).toBe(10);
    expect(clampToRange(-5, 0, 10)).toBe(0);
    expect(clampToRange(7, 0, 10)).toBe(7);
    expect(clampToRange(Number.NaN, 2, 10)).toBe(2);
    // Non-finite bounds (the default) must not produce NaN.
    expect(
      clampToRange(5, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY),
    ).toBe(5);
  });
});

describe("input-otp (native)", () => {
  it("renders one boxed position per character", async () => {
    await render(<InputOTP length={4} />);
    expect(screen.getByTestId("kern-input-otp").props.accessibilityRole).toBe(
      "group",
    );
    for (const index of [0, 1, 2, 3]) {
      expect(screen.getByTestId(`kern-input-otp-${index}`)).toBeTruthy();
    }
  });

  it("advances as each position fills, and reports completion once", async () => {
    const seen: string[] = [];
    let completed: string | undefined;
    await render(
      <InputOTP
        length={4}
        onValueChange={(v) => seen.push(v)}
        onComplete={(v) => {
          completed = v;
        }}
      />,
    );
    await act(async () => {
      screen.getByTestId("kern-input-otp-0").props.onChangeText("1");
    });
    await act(async () => {
      screen.getByTestId("kern-input-otp-1").props.onChangeText("2");
    });
    await act(async () => {
      screen.getByTestId("kern-input-otp-2").props.onChangeText("3");
    });
    expect(completed).toBeUndefined();
    await act(async () => {
      screen.getByTestId("kern-input-otp-3").props.onChangeText("4");
    });
    expect(seen).toEqual(["1", "12", "123", "1234"]);
    expect(completed).toBe("1234");
    expect(screen.getByTestId("kern-input-otp-3").props.value).toBe("4");
  });

  it("distributes a pasted code across the positions", async () => {
    const seen: string[] = [];
    let completed: string | undefined;
    await render(
      <InputOTP
        length={4}
        onValueChange={(v) => seen.push(v)}
        onComplete={(v) => {
          completed = v;
        }}
      />,
    );
    await act(async () => {
      screen.getByTestId("kern-input-otp-0").props.onChangeText("9876");
    });
    expect(screen.getByTestId("kern-input-otp-0").props.value).toBe("9");
    expect(screen.getByTestId("kern-input-otp-1").props.value).toBe("8");
    expect(screen.getByTestId("kern-input-otp-2").props.value).toBe("7");
    expect(screen.getByTestId("kern-input-otp-3").props.value).toBe("6");
    expect(seen).toEqual(["9876"]);
    expect(completed).toBe("9876");
  });

  it("a paste starting mid-field overwrites from that position, not from the top", async () => {
    // The case that distinguishes an overwriting paste from an appending one.
    // Positions 1 and 2 hold "12"; pasting "9876" at position 3 must overwrite
    // positions 3 and 4 only. An implementation that prepends instead — or
    // that slices the tail at the wrong offset — silently produces "1298".
    const seen: string[] = [];
    await render(
      <InputOTP
        length={4}
        defaultValue="12"
        onValueChange={(v) => seen.push(v)}
      />,
    );
    await act(async () => {
      screen.getByTestId("kern-input-otp-2").props.onChangeText("9876");
    });
    expect(screen.getByTestId("kern-input-otp-0").props.value).toBe("1");
    expect(screen.getByTestId("kern-input-otp-1").props.value).toBe("2");
    expect(screen.getByTestId("kern-input-otp-2").props.value).toBe("9");
    expect(screen.getByTestId("kern-input-otp-3").props.value).toBe("8");
    expect(seen).toEqual(["1298"]);
  });

  it("backspace on an empty box steps back and clears the previous position", async () => {
    // The retreat rule. Backspace on an already-empty box fires no change
    // event, so this is wired to `onKeyPress` — and a user who has walked past
    // the last digit needs it, or they are stuck at position 5 of 4.
    await render(<InputOTP length={4} defaultValue="123" />);
    await act(async () => {
      screen.getByTestId("kern-input-otp-3").props.onKeyPress({
        nativeEvent: { key: "Backspace" },
      });
    });
    expect(screen.getByTestId("kern-input-otp-2").props.value).toBe("");
    expect(screen.getByTestId("kern-input-otp-0").props.value).toBe("1");
    expect(screen.getByTestId("kern-input-otp-1").props.value).toBe("2");
  });

  it("a non-Backspace key press does not disturb the positions", async () => {
    await render(<InputOTP length={4} defaultValue="123" />);
    await act(async () => {
      screen.getByTestId("kern-input-otp-3").props.onKeyPress({
        nativeEvent: { key: "Enter" },
      });
    });
    expect(
      [0, 1, 2, 3]
        .map((i) => screen.getByTestId(`kern-input-otp-${i}`).props.value)
        .join(""),
    ).toBe("123");
  });

  it("clears only the last position when backspacing a filled one", async () => {
    await render(<InputOTP length={4} defaultValue="1234" />);
    await act(async () => {
      screen.getByTestId("kern-input-otp-3").props.onChangeText("");
    });
    expect(screen.getByTestId("kern-input-otp-3").props.value).toBe("");
    expect(screen.getByTestId("kern-input-otp-2").props.value).toBe("3");
  });

  it("every position names itself, including the first", async () => {
    await render(<InputOTP length={3} />);
    // Web cannot do this on position 1 (Base UI ignores aria-label there and
    // logs a warning); recording it here as a native improvement.
    expect(screen.getByLabelText("Digit 1 of 3")).toBeTruthy();
    expect(screen.getByLabelText("Digit 2 of 3")).toBeTruthy();
    expect(screen.getByLabelText("Digit 3 of 3")).toBeTruthy();
  });

  it("uses a numeric keyboard by default and refuses when disabled", async () => {
    await render(<InputOTP length={2} disabled />);
    const box = screen.getByTestId("kern-input-otp-0");
    expect(box.props.keyboardType).toBe("numeric");
    expect(box.props.editable).toBe(false);
    expect(box.props.accessibilityState.disabled).toBe(true);
  });

  it("splits a value into exactly `length` positions", () => {
    expect(toOTPPositions("12", 4)).toEqual(["1", "2", "", ""]);
    expect(toOTPPositions("123456", 4)).toEqual(["1", "2", "3", "4"]);
    expect(toOTPPositions("", 3)).toEqual(["", "", ""]);
  });

  it("host-controlled: the host owns the assembled value", async () => {
    const seen: string[] = [];
    await render(
      <InputOTP length={3} value="12" onValueChange={(v) => seen.push(v)} />,
    );
    expect(screen.getByTestId("kern-input-otp-0").props.value).toBe("1");
    expect(screen.getByTestId("kern-input-otp-1").props.value).toBe("2");
    expect(screen.getByTestId("kern-input-otp-2").props.value).toBe("");
  });
});
