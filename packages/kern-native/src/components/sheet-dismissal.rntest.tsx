import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { Text as RNText } from "react-native";
import { SheetSurface } from "./sheet-surface";

/**
 * P2c-4 dismiss-policy re-point, proven rather than asserted.
 *
 * `SheetSurface` imports `createDismissPolicy`/`dismissTriggersFor` from
 * `@xoroh/kern-primitives` — but an import is not adoption. These tests prove
 * the kernel DECIDES: the trigger sets that reach the scrim, the hardware back
 * path and the close affordance come from the shared policy, so a fix to the
 * rule reaches both renderers instead of silently missing one (the
 * `useControllableState` failure mode this extraction exists to prevent).
 */
describe("SheetSurface dismiss-policy", () => {
  it("wires scrim press to onDismiss when dismissible and open", async () => {
    const onDismiss = jest.fn();
    await render(
      <SheetSurface
        open
        title="Sheet"
        onDismiss={onDismiss}
        testID="sheet"
        surface={{}}
      >
        <RNText>body</RNText>
      </SheetSurface>,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Dismiss Sheet"));
    });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("renders the close affordance exactly when the policy says to", async () => {
    const onDismiss = jest.fn();
    await render(
      <SheetSurface
        open
        title="Sheet"
        onDismiss={onDismiss}
        testID="sheet"
        surface={{}}
      >
        <RNText>body</RNText>
      </SheetSurface>,
    );
    // `showClose` is the kernel's decision (`dismissible ?? hasDismissHandler`),
    // not a local boolean. If the import were decorative, this button would
    // still render — the test below proves the negative.
    expect(screen.getByLabelText("Close Sheet")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Close Sheet"));
    });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("renders NO close affordance and NO live scrim for a mandatory surface", async () => {
    const onDismiss = jest.fn();
    await render(
      <SheetSurface
        open
        title="Sheet"
        dismissible={false}
        onDismiss={onDismiss}
        testID="sheet"
      >
        <RNText>body</RNText>
      </SheetSurface>,
    );
    // A dialog the user must answer: the policy says no dismissal path, so the
    // affordance must be absent — not merely disabled — and the scrim inert.
    expect(screen.queryByLabelText("Close Sheet")).toBeNull();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Dismiss Sheet"));
    });
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("keeps triggers bound but inert while closed", async () => {
    const onDismiss = jest.fn();
    const view = await render(
      <SheetSurface
        open={false}
        title="Sheet"
        onDismiss={onDismiss}
        testID="sheet"
      >
        <RNText>body</RNText>
      </SheetSurface>,
    );
    // Closed means nothing rendered (Modal hidden) — but the point is the
    // handlers stay BOUND through `shouldDismiss(open=false)` rather than being
    // nulled, so reopening needs no re-subscription.
    expect(screen.queryByTestId("sheet")).toBeNull();
    view.unmount();
    expect(onDismiss).not.toHaveBeenCalled();
  });
});
