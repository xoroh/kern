/**
 * Native side of the cross-renderer parity contract (P2b-4 tranche 1).
 *
 * Reads the SAME contract declaration as the web suite (`parity/contract.ts`,
 * aliased `@kern-parity/contract`) and asserts the same observable semantics:
 * role, checked state, disabled behaviour, toggle-vs-select.
 *
 * This file imports nothing from `@xoroh/kern`. A cross-renderer contract that
 * reached into the other package would violate ADR 002 and would break the
 * moment either package moved. The contract is the shared artefact; the two
 * components never meet.
 *
 * Assertions go through `assertParity` rather than `expect(value, message)`:
 * Jest's expect takes no message argument, so a bare `false !== true` here would
 * be far harder to act on than the web suite's failure. Same report, both sides.
 */

import {
  assertParity,
  contractFor,
  type ParityRow,
} from "@kern-parity/contract";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { Button } from "../components/button";
import { Checkbox } from "../components/checkbox";
import { Switch } from "../components/switch";

const R = "native" as const;

/** Mount one contract row's native component. Per-component wiring is native's
 *  business; the contract itself stays import-free. */
async function mount(row: ParityRow) {
  switch (row.component) {
    case "switch":
      return await render(
        <Switch testID={row.name} defaultValue={row.expects.initial} />,
      );
    case "checkbox":
      return await render(<Checkbox testID={row.name} label={row.name} />);
    case "button":
      return await render(<Button testID={row.name}>{row.name}</Button>);
    default:
      throw new Error(`no native harness for "${row.component}"`);
  }
}

/** Read the control's state on the axis the contract names, via accessibility
 *  semantics only — never a Base UI or DOM internal. */
function readAxis(row: ParityRow): boolean {
  const state = screen.getByTestId(row.name).props.accessibilityState ?? {};
  if (row.axis === "checked") return Boolean(state.checked);
  return Boolean(state.selected);
}

function roleOf(row: ParityRow): string | undefined {
  return screen.getByTestId(row.name).props.accessibilityRole;
}

describe("native parity contract (tranche 1)", () => {
  it.each(["switch", "checkbox"])(
    "declares the role the contract names: %s",
    async (name) => {
      const row = contractFor(name);
      await mount(row);
      assertParity(
        row,
        R,
        roleOf(row),
        row.role,
        "accessible role must match the contract on both renderers",
      );
    },
  );

  it("switch: initial state matches the contract", async () => {
    const row = contractFor("switch");
    await mount(row);
    assertParity(row, R, readAxis(row), row.expects.initial, "initial state");
  });

  it("switch: one activation flips checked to true", async () => {
    const row = contractFor("switch");
    await mount(row);
    await act(async () => {
      fireEvent.press(screen.getByTestId(row.name));
    });
    assertParity(
      row,
      R,
      readAxis(row),
      row.expects.afterActivate,
      "one activation must toggle the state",
    );
  });

  it("switch: a disabled switch does not change state on press", async () => {
    const row = contractFor("switch");
    await render(<Switch testID={row.name} disabled />);
    await act(async () => {
      fireEvent.press(screen.getByTestId(row.name));
    });
    assertParity(
      row,
      R,
      readAxis(row),
      row.expects.afterDisabledActivate,
      "a disabled control must not change state",
    );
  });

  it("switch: reports the new value on activation", async () => {
    const seen: boolean[] = [];
    const row = contractFor("switch");
    await render(
      <Switch
        testID={row.name}
        onValueChange={(next: boolean) => seen.push(next)}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId(row.name));
    });
    assertParity(
      row,
      R,
      seen.at(0),
      row.expects.afterActivate,
      "activation must report the new state",
    );
  });

  it("checkbox: one activation flips checked to true", async () => {
    const row = contractFor("checkbox");
    await mount(row);
    await act(async () => {
      fireEvent.press(screen.getByTestId(row.name));
    });
    assertParity(
      row,
      R,
      readAxis(row),
      row.expects.afterActivate,
      "one activation must toggle the state",
    );
  });

  it("checkbox: activating twice returns to the initial state (toggle, not select)", async () => {
    const row = contractFor("checkbox");
    await mount(row);
    await act(async () => {
      fireEvent.press(screen.getByTestId(row.name));
    });
    await act(async () => {
      fireEvent.press(screen.getByTestId(row.name));
    });
    assertParity(
      row,
      R,
      readAxis(row),
      row.expects.initial,
      "a toggle returns to false on the second activation — if it stays true this behaves like a select",
    );
  });

  it("checkbox: a disabled checkbox does not change state", async () => {
    const row = contractFor("checkbox");
    await render(<Checkbox testID={row.name} label={row.name} disabled />);
    await act(async () => {
      fireEvent.press(screen.getByTestId(row.name));
    });
    assertParity(
      row,
      R,
      readAxis(row),
      row.expects.afterDisabledActivate,
      "a disabled control must not change state",
    );
  });

  it("button: exposes role=button and carries no persistent pressed state", async () => {
    const row = contractFor("button");
    await mount(row);
    await act(async () => {
      fireEvent.press(screen.getByTestId(row.name));
    });
    assertParity(row, R, roleOf(row), row.role, "accessible role");
    assertParity(
      row,
      R,
      readAxis(row),
      row.expects.afterActivate,
      "a button must not report a checked/selected state after activation",
    );
  });
});
