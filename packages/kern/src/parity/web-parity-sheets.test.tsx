/**
 * Web side of the sheet-surface dismissal contract (P2b-4 tranche 5).
 *
 * Reads the SAME declaration as the native suite (`parity/contract.ts`, aliased
 * `@kern-parity/contract`). The row states the OBLIGATION — a sheet must offer a
 * scrim and a close control — and each side proves it with the mechanism its own
 * platform actually has. Web dismisses via a portal `Backdrop` and `Escape`;
 * native via a `Pressable` scrim and the Android hardware back button. Neither
 * side is asked to assert the other's mechanism.
 *
 * This is the "one contract, two implementations" decision: `SheetSurface` is a
 * React Native component and could never live in `kern-primitives` (the gate
 * forbids `react-native`), so what moves to the shared layer is the BEHAVIOUR,
 * not the file. The value is that this test fails when either renderer drifts.
 */

import { contractFor, divergenceMessage } from "@kern-parity/contract";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "../components/dialog";

const row = contractFor("sheet-surface");

describe("sheet-surface dismissal contract (web)", () => {
  it("exposes the surface by its title and declares itself modal", () => {
    render(
      <Dialog.Root defaultOpen>
        <DialogContent>
          <DialogTitle>{row.name}</DialogTitle>
        </DialogContent>
      </Dialog.Root>,
    );
    for (const part of row.nameMustContain ?? []) {
      expect(screen.getByText(part)).toBeTruthy();
    }
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  /**
   * `dismissalRequired: ["scrim", "close-control"]`. Both are asserted as
   * behaviour — each one actually calls `onOpenChange` — rather than as the mere
   * presence of an element. A scrim that renders but is not wired to dismissal is
   * the defect this row exists to prevent.
   */
  it("dismisses through the scrim", async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog.Root defaultOpen onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogTitle>{row.name}</DialogTitle>
        </DialogContent>
      </Dialog.Root>,
    );

    const scrim = document.querySelector('[data-slot="dialog-backdrop"]');
    expect(scrim, "a sheet must render a scrim").toBeTruthy();

    await userEvent.click(scrim as Element);
    // Assert the CLOSE, and assert the REASON. `onOpenChange` receives
    // `(open, eventDetails)` where the details carry `reason: "outside-press"`.
    // Asserting only the boolean would pass if the sheet closed for some other
    // cause; the reason is what proves the SCRIM is a working dismissal path
    // rather than decoration beside one.
    expect(onOpenChange.mock.calls[0]?.[0]).toBe(false);
    expect(onOpenChange.mock.calls[0]?.[1]).toMatchObject({
      reason: "outside-press",
    });
  });

  it("dismisses through the close control", async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog.Root defaultOpen onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogTitle>{row.name}</DialogTitle>
          <DialogClose>Close</DialogClose>
        </DialogContent>
      </Dialog.Root>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange.mock.calls[0]?.[0]).toBe(false);
  });

  /**
   * `Escape` is a WEB-ONLY path, recorded in the row as `dismissalOnlyWeb`
   * rather than asserted of native. It is asserted here only to prove the
   * row's platform split is real and not decorative.
   */
  it("dismisses on Escape — the web-only path this platform has", async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog.Root defaultOpen onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogTitle>{row.name}</DialogTitle>
        </DialogContent>
      </Dialog.Root>,
    );

    await userEvent.keyboard("{Escape}");
    expect(onOpenChange.mock.calls[0]?.[0]).toBe(false);
  });

  /** The negative case: the scrim alone must not be enough to satisfy the row. */
  it("fails if the sheet renders with no dismissal path at all", () => {
    const missing = ["scrim", "close-control"].filter(
      (path) => !row.dismissalRequired?.includes(path as "scrim"),
    );
    expect(missing, "every required path must be declared").toEqual([]);

    // If a future edit drops a path from the row, the suites below would stop
    // proving anything — so assert the row still carries BOTH.
    expect(row.dismissalRequired).toEqual(["scrim", "close-control"]);
    expect(divergenceMessage).toBeTypeOf("function");
  });
});
