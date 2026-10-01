/**
 * Web side of the cross-renderer parity contract, tranche 3 (P2b-3 tranche 1).
 *
 * The M3 input family. Reads the SAME declaration as the native suite
 * (`parity/contract.ts`, aliased `@kern-parity/contract`) and asserts the
 * observable semantics through the DOM — never a Base UI internal, never a
 * `data-*` attribute.
 *
 * **Two rows only.** The behaviour test was applied before this file was
 * written and it rejected more of the family than it accepted:
 *
 * - `autocomplete` — REJECTED as a contract row. Measured: with a query
 *   matching nothing, Base UI keeps `aria-expanded="true"` and emits no empty
 *   node, so the popup is an expanded box with zero options. Asserting the
 *   correct behaviour (close, or announce "no matches") would land a RED suite
 *   on web; asserting the measured behaviour would bless a defect as a
 *   contract. The native side implements the correct behaviour and the row is
 *   filed as a web fix owed by P2b-4.
 * - `combobox` / `combobox-clear` — CUT. `combobox-clear` is a sub-part of
 *   `combobox` and carries no behaviour a user perceives independently, and
 *   `combobox`'s distinguishing behaviour over native `Select` is the
 *   clearable trigger, which is a part rather than a component. Neither is a
 *   row; `combobox` is recorded as needing its own tranche.
 *
 * `number-field` and `input-otp` both survive the test: each owns real state
 * (a value that must move by exactly `step`; an assembled code that must reach
 * its host) and real a11y (named steppers; a grouped field of N positions).
 * Both rows' arithmetic was measured here first — see the comments in
 * `parity/contract.ts`.
 */

import { contractFor, divergenceMessage } from "@kern-parity/contract";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { InputOTP } from "../components/input-otp";
import { NumberField } from "../components/number-field";

const R = "web" as const;

/**
 * The two stepper names, and the code the OTP field must assemble, read from
 * the shared row. Throwing on a missing field is the point: a silently
 * defaulted label would let the suite pass against a component wired to the
 * wrong names.
 */
function steppers() {
  const row = contractFor("number-field");
  const labels = row.stepperLabels;
  if (!labels) {
    throw new Error("number-field row declares no stepperLabels");
  }
  return { row, dec: labels[0], inc: labels[1] };
}

function otp() {
  const row = contractFor("input-otp");
  if (!row.completedValue || !row.positions) {
    throw new Error("input-otp row declares no completedValue/positions");
  }
  return { row, code: row.completedValue, count: row.positions };
}

describe("web parity contract (tranche 3): number-field", () => {
  it("the field announces its value and both steppers are named", () => {
    const { row, dec, inc } = steppers();
    render(
      <NumberField.Root
        defaultValue={row.start}
        min={row.min}
        max={row.max}
        step={row.step}
      >
        <NumberField.Input aria-label={row.name} />
      </NumberField.Root>,
    );
    const field = screen.getByRole("textbox", { name: row.name });
    expect(
      (field as HTMLInputElement).value,
      divergenceMessage(row, R, "the field must show the starting value"),
    ).toBe(String(row.start));
    for (const label of [dec, inc]) {
      expect(
        screen.getByRole("button", { name: label }),
        divergenceMessage(
          row,
          R,
          `the stepper named ${JSON.stringify(label)} must exist and be findable by name`,
        ),
      ).toBeTruthy();
    }
  });

  it("one press moves the value by exactly `step`", async () => {
    const user = userEvent.setup();
    const { row, dec } = steppers();
    const seen: string[] = [];
    render(
      <NumberField.Root
        defaultValue={row.start}
        min={row.min}
        max={row.max}
        step={row.step}
        onValueChange={(value) => seen.push(String(value))}
      >
        <NumberField.Input aria-label={row.name} />
      </NumberField.Root>,
    );
    const field = screen.getByRole("textbox", { name: row.name });
    await user.click(screen.getByRole("button", { name: dec }));
    // The whole contract in one assertion: the stepper is ARITHMETIC. A value
    // snapped to the nearest multiple of `step` would read 4 here, not 3.
    expect(
      (field as HTMLInputElement).value,
      divergenceMessage(
        row,
        R,
        `after one ${dec} press the value must be ${row.afterDecrement}`,
      ),
    ).toBe(String(row.afterDecrement));
    expect(seen).toEqual([String(row.afterDecrement)]);
  });

  it("the other stepper moves the other way by `step`", async () => {
    const user = userEvent.setup();
    const { row, inc } = steppers();
    render(
      <NumberField.Root
        defaultValue={row.start}
        min={row.min}
        max={row.max}
        step={row.step}
      >
        <NumberField.Input aria-label={row.name} />
      </NumberField.Root>,
    );
    const field = screen.getByRole("textbox", { name: row.name });
    await user.click(screen.getByRole("button", { name: inc }));
    expect(
      (field as HTMLInputElement).value,
      divergenceMessage(
        row,
        R,
        `after one ${inc} press the value must be ${row.afterIncrement}`,
      ),
    ).toBe(String(row.afterIncrement));
  });
});

/** The positions, built from the contract's own count so the two cannot drift. */
const otpPositions = (count: number) =>
  Array.from({ length: count }, (_, index) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length list, position order is identity
    <InputOTP.Input key={index} aria-label={`Digit ${index + 1}`} />
  ));

describe("web parity contract (tranche 3): input-otp", () => {
  it("renders one position per character inside a group", () => {
    const { row, count } = otp();
    render(<InputOTP.Root length={count}>{otpPositions(count)}</InputOTP.Root>);
    expect(
      screen.getByRole("group"),
      divergenceMessage(row, R, "the OTP field must be a group"),
    ).toBeTruthy();
    const positions = screen.getAllByRole("textbox");
    expect(
      positions.length,
      divergenceMessage(
        row,
        R,
        `the field must have exactly ${count} positions`,
      ),
    ).toBe(count);
  });

  it("one character per position assembles the code", async () => {
    const user = userEvent.setup();
    const { row, code, count } = otp();
    const seen: string[] = [];
    render(
      <InputOTP.Root
        length={count}
        onValueChange={(value: string) => seen.push(value)}
      >
        {otpPositions(count)}
      </InputOTP.Root>,
    );
    const positions = screen.getAllByRole("textbox");
    await user.click(positions[0]);
    // Typing the whole code at the first position is the behaviour a user
    // actually performs, and it is what a paste produces too.
    await user.keyboard(code);
    const values = positions.map((input) => (input as HTMLInputElement).value);
    expect(
      values.join(""),
      divergenceMessage(
        row,
        R,
        `the assembled code must be ${row.completedValue}`,
      ),
    ).toBe(row.completedValue);
    expect(
      seen.at(-1),
      divergenceMessage(row, R, "the host must be told the assembled code"),
    ).toBe(row.completedValue);
  });

  it("a shorter code stays in its positions and does not complete", async () => {
    const user = userEvent.setup();
    const { row, count } = otp();
    render(<InputOTP.Root length={count}>{otpPositions(count)}</InputOTP.Root>);
    const positions = screen.getAllByRole("textbox");
    await user.click(positions[0]);
    await user.keyboard("12");
    const values = positions.map((input) => (input as HTMLInputElement).value);
    expect(
      values.join(""),
      divergenceMessage(
        row,
        R,
        "a partial code must not read as a complete one",
      ),
    ).toBe("12");
    // The unfilled positions must still be there — a field that collapses its
    // own trailing boxes reports a code the user never entered.
    expect(
      positions.length,
      divergenceMessage(
        row,
        R,
        "the field must not lose positions as it fills",
      ),
    ).toBe(count);
  });
});
