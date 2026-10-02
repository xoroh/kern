/**
 * Web side of the cross-renderer parity contract (P2b-4 tranche 1).
 *
 * Reads the shared contract from `parity/contract.ts` — a data-only module that
 * imports neither package, so this file does not create a dependency between
 * renderers either. It only reads semantics: role, checked state, disabled.
 *
 * Nothing here asserts a Base UI internal. If the primitive changes, these
 * assertions should still be the right ones; that is the property being tested.
 */

import {
  contractFor,
  divergenceMessage,
  type ParityRow,
} from "@kern-parity/contract";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../components/button";
import { Checkbox } from "../components/checkbox";
import { Switch } from "../components/switch";

/** Render one contract row's component. Per-component wiring lives here, so the
 *  contract itself stays free of imports. */
function mount(row: ParityRow) {
  switch (row.component) {
    case "switch":
      return render(
        <Switch aria-label={row.name} defaultChecked={row.expects.initial} />,
      );
    case "checkbox":
      return render(<Checkbox aria-label={row.name} />);
    case "button":
      return render(<Button aria-label={row.name} />);
    default:
      throw new Error(`no web harness for "${row.component}"`);
  }
}

/** Read the control's state on the axis the contract names. */
function readAxis(row: ParityRow): boolean {
  const el = screen.getByRole(row.role, { name: row.name });
  const tag = el.tagName.toLowerCase();
  // A switch/checkbox exposes aria-checked; a button has no checked state at
  // all, and reporting `false` for it is correct — the contract says a button
  // carries no persistent pressed state.
  const checked = el.getAttribute("aria-checked");
  if (checked !== null) return checked === "true";
  return tag === "button" ? false : Boolean(checked);
}

describe("web parity contract (tranche 1)", () => {
  it.each(["switch", "checkbox"])(
    "declares the role the contract names: %s",
    (name) => {
      const row = contractFor(name);
      mount(row);
      const el = screen.getByRole(row.role, { name: row.name });
      expect(
        el,
        divergenceMessage(
          row,
          "web",
          `expected role "${row.role}", found "${el.getAttribute("role") ?? el.tagName.toLowerCase()}"`,
        ),
      ).toBeTruthy();
    },
  );

  it("switch: initial state matches the contract", () => {
    const row = contractFor("switch");
    mount(row);
    expect(
      readAxis(row),
      divergenceMessage(
        row,
        "web",
        `initial state should be ${row.expects.initial}`,
      ),
    ).toBe(row.expects.initial);
  });

  it("switch: one activation flips checked to true", async () => {
    const user = userEvent.setup();
    const row = contractFor("switch");
    mount(row);
    await user.click(screen.getByRole(row.role, { name: row.name }));
    expect(
      readAxis(row),
      divergenceMessage(
        row,
        "web",
        `after one activation should be ${row.expects.afterActivate}`,
      ),
    ).toBe(row.expects.afterActivate);
  });

  it("switch: a disabled switch does not change state on activation", async () => {
    const user = userEvent.setup();
    const row = contractFor("switch");
    render(<Switch aria-label={row.name} disabled />);
    const el = screen.getByRole(row.role, { name: row.name });
    await user.click(el);
    expect(
      readAxis(row),
      divergenceMessage(
        row,
        "web",
        `disabled control must stay ${row.expects.afterDisabledActivate}`,
      ),
    ).toBe(row.expects.afterDisabledActivate);
  });

  it("switch: reports a change to onCheckedChange", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const row = contractFor("switch");
    render(<Switch aria-label={row.name} onCheckedChange={onCheckedChange} />);
    await user.click(screen.getByRole(row.role, { name: row.name }));
    // Assert the FIRST argument only. A renderer is free to pass extra event
    // detail as a second argument — that is API shape, not parity. Asserting
    // the whole call would encode one renderer's callback signature into a
    // cross-renderer contract, which is exactly what this file must not do.
    const firstArg = onCheckedChange.mock.calls.at(0)?.[0];
    expect(
      firstArg,
      divergenceMessage(
        row,
        "web",
        `activation must report the new state (${row.expects.afterActivate}), got ${JSON.stringify(firstArg)}`,
      ),
    ).toBe(row.expects.afterActivate);
    expect(onCheckedChange).toHaveBeenCalled();
  });

  it("checkbox: one activation flips checked to true", async () => {
    const user = userEvent.setup();
    const row = contractFor("checkbox");
    mount(row);
    await user.click(screen.getByRole(row.role, { name: row.name }));
    expect(
      readAxis(row),
      divergenceMessage(
        row,
        "web",
        `after one activation should be ${row.expects.afterActivate}`,
      ),
    ).toBe(row.expects.afterActivate);
  });

  it("checkbox: activating twice returns to the initial state (toggle, not select)", async () => {
    const user = userEvent.setup();
    const row = contractFor("checkbox");
    mount(row);
    const el = screen.getByRole(row.role, { name: row.name });
    await user.click(el);
    await user.click(el);
    expect(
      readAxis(row),
      divergenceMessage(
        row,
        "web",
        "a toggle must return to false on the second activation — if it stays true this is behaving like a select",
      ),
    ).toBe(row.expects.initial);
  });

  it("checkbox: a disabled checkbox does not change state", async () => {
    const user = userEvent.setup();
    const row = contractFor("checkbox");
    render(<Checkbox aria-label={row.name} disabled />);
    const el = screen.getByRole(row.role, { name: row.name });
    await user.click(el);
    expect(
      readAxis(row),
      divergenceMessage(
        row,
        "web",
        `disabled control must stay ${row.expects.afterDisabledActivate}`,
      ),
    ).toBe(row.expects.afterDisabledActivate);
  });

  it("button: exposes role=button and carries no persistent pressed state", async () => {
    const user = userEvent.setup();
    const row = contractFor("button");
    render(<Button aria-label={row.name} />);
    const el = screen.getByRole(row.role, { name: row.name });
    await user.click(el);
    expect(
      readAxis(row),
      divergenceMessage(
        row,
        "web",
        "a button must not report a checked/pressed state after activation",
      ),
    ).toBe(row.expects.afterActivate);
  });
});
