/**
 * Native side of the sheet-surface dismissal contract (P2b-4 tranche 5).
 *
 * Reads the SAME declaration as the web suite (`parity/contract.ts`, aliased
 * `@kern-parity/contract`). The row states the OBLIGATION; each side proves it
 * with the mechanism its platform has. Native dismisses through a `Pressable`
 * scrim and the Android hardware back button (`onRequestClose` on `Modal`); web
 * through a portal `Backdrop` and `Escape`. Neither is asked to assert the
 * other's mechanism — that asymmetry is declared in the row's
 * `dismissalOnlyWeb` / `dismissalOnlyNative` fields.
 *
 * `SheetSurface` is a React Native component and could never live in
 * `kern-primitives` — `check:primitives` forbids `react-native`, and rightly so.
 * What is shared is the behaviour, and this is what makes the two implementations
 * checkable against each other.
 *
 * Jest, not vitest: `describe`/`it`/`expect` come from Jest globals and mocks are
 * `jest.fn()`. Importing vitest here fails the whole suite to run.
 */

import { contractFor } from "@kern-parity/contract";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { SheetSurface } from "../components/sheet-surface";
import { Text } from "../components/text";

const row = contractFor("sheet-surface");

const surface = { backgroundColor: "white", padding: 16 };

/**
 * `SheetSurface` takes `title` to build ACCESSIBLE NAMES; it does not render the
 * title as text — the caller supplies the heading as a child. So the contract is
 * asserted through those names rather than through `getByText`, which is what
 * "findable by its title" actually means on a component shaped like this.
 */
describe("sheet-surface dismissal contract (native)", () => {
  it("is findable by its title through the names it announces", async () => {
    await render(
      <SheetSurface
        open
        title={row.name}
        onDismiss={jest.fn()}
        surface={surface}
        testID="sheet-contract"
      >
        <Text variant="body">Body</Text>
      </SheetSurface>,
    );

    // Both announced names carry the title, which is how a sheet is identified
    // to assistive tech when it carries no visible heading of its own.
    expect(screen.getByLabelText(`Dismiss ${row.name}`)).toBeTruthy();
    expect(screen.getByLabelText(`Close ${row.name}`)).toBeTruthy();
  });

  /**
   * `dismissalRequired: ["scrim", "close-control"]`. Both asserted as BEHAVIOUR —
   * each actually calls `onDismiss`. A scrim that renders but is not wired is the
   * defect the row exists to prevent, and `SheetSurface`'s own header records four
   * sheets that shipped an `onDismiss` prop they never used.
   */
  it("dismisses through the scrim", async () => {
    const onDismiss = jest.fn();
    await render(
      <SheetSurface
        open
        title={row.name}
        onDismiss={onDismiss}
        surface={surface}
        testID="sheet-scrim"
      >
        <Text variant="body">Body</Text>
      </SheetSurface>,
    );

    fireEvent.press(screen.getByLabelText(`Dismiss ${row.name}`));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("dismisses through the close control", async () => {
    const onDismiss = jest.fn();
    await render(
      <SheetSurface
        open
        title={row.name}
        onDismiss={onDismiss}
        surface={surface}
        testID="sheet-close"
      >
        <Text variant="body">Body</Text>
      </SheetSurface>,
    );

    // The close affordance is a control distinct from the scrim: it must be
    // reachable without knowing that tapping outside the card dismisses.
    fireEvent.press(screen.getByLabelText(`Close ${row.name}`));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("keeps the two dismissal paths independent", async () => {
    await render(
      <SheetSurface
        open
        title={row.name}
        onDismiss={jest.fn()}
        surface={surface}
        testID="sheet-both"
      >
        <Text variant="body">Body</Text>
      </SheetSurface>,
    );

    // Two controls, two labels. If the scrim and the close button collapsed into
    // one node, the sheet would have a single dismissal path — which is the
    // defect the scrim-only shell shipped.
    expect(screen.getByLabelText(`Dismiss ${row.name}`)).not.toBe(
      screen.getByLabelText(`Close ${row.name}`),
    );
  });

  it("suppresses the close affordance when a sheet is not dismissible", async () => {
    await render(
      <SheetSurface
        open
        title={row.name}
        surface={surface}
        testID="sheet-sticky"
        dismissible={false}
      >
        <Text variant="body">Body</Text>
      </SheetSurface>,
    );

    // `showClose = dismissible ?? Boolean(onDismiss)`, so an explicit `false`
    // renders no close control. Pins the opt-out is deliberate.
    expect(screen.queryByLabelText(`Close ${row.name}`)).toBeNull();
  });

  /**
   * The platform split, asserted as data so it cannot rot into decorative.
   *
   * `hardware-back` is NOT runtime-asserted here: RNTL 14 removed
   * `UNSAFE_getByType`, so there is no supported query for a host `Modal`'s
   * props, and `SheetSurface` binds `onRequestClose={onDismiss}` as a plain prop
   * pass-through. Inventing an escape hatch to assert one line of pass-through
   * would cost more than it proves. The row still declares the path, so the
   * obligation is recorded — it is the one thing here that cannot be executed.
   */
  it("declares the shared obligation and both platform extras", () => {
    expect(row.dismissalRequired).toEqual(["scrim", "close-control"]);
    expect(row.dismissalOnlyNative).toEqual(["hardware-back"]);
    expect(row.dismissalOnlyWeb).toEqual(["escape"]);
    expect(row.modal).toBe(true);
  });
});
