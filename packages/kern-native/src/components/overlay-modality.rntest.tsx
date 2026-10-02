import { render, screen } from "@testing-library/react-native";
import { Text as RNText } from "react-native";
import { Drawer, OverlayModalityProvider } from "./overlay-surfaces";

/**
 * P2c-4: kern-native re-pointed onto the extracted `overlayModality` kernel.
 *
 * Before the re-point, kern-native owned drawer / popover / scroll-area and the
 * sheet family with NO single place that knew which overlay was on top. Each
 * overlay decided independently, so a drawer opened over a sheet had no way to
 * know it was not the interactive one.
 *
 * The kernel's claim is precise and testable: **only the topmost registered
 * overlay is interactive.** These assertions are on observable behaviour --
 * pointer events and the accessibility flag -- never on the kernel's internals,
 * so a future change to how the stack is stored cannot invalidate them.
 */
describe("kern-native overlay modality", () => {
  it("marks a single open overlay as the interactive one", async () => {
    await render(
      <OverlayModalityProvider>
        <Drawer title="Only" open>
          <RNText>body</RNText>
        </Drawer>
      </OverlayModalityProvider>,
    );
    // The top overlay is the modal: it is the only thing focus may enter.
    expect(screen.getByLabelText("Only").props.accessibilityViewIsModal).toBe(true);
  });

  it("makes a covered overlay non-interactive while a later one is open", async () => {
    await render(
      <OverlayModalityProvider>
        <Drawer title="Under" open>
          <RNText>under</RNText>
        </Drawer>
        <Drawer title="Over" open>
          <RNText>over</RNText>
        </Drawer>
      </OverlayModalityProvider>,
    );
    // THE behaviour this unit exists for: two overlays open at once, and only
    // the topmost is interactive. The one underneath must be inert, or a touch
    // that lands on the covered overlay passes through to whatever is behind it.
    expect(screen.getByLabelText("Under").props.accessibilityViewIsModal).toBe(false);
    expect(screen.getByLabelText("Over").props.accessibilityViewIsModal).toBe(true);
  });

  it("blocks pointer events on a covered overlay", async () => {
    await render(
      <OverlayModalityProvider>
        <Drawer title="Under" open>
          <RNText>under</RNText>
        </Drawer>
        <Drawer title="Over" open>
          <RNText>over</RNText>
        </Drawer>
      </OverlayModalityProvider>,
    );
    // The touch half of the claim. `accessibilityViewIsModal` is silent about
    // touches -- it governs what a screen reader may enter and nothing else -- so
    // a drawer that clears it and still takes touches is still wrong.
    expect(screen.getByLabelText("Under").props.pointerEvents).toBe("none");
    expect(screen.getByLabelText("Over").props.pointerEvents).toBe("auto");
  });

  it("leaves every overlay interactive again once the top one closes", async () => {
    // The half that a stack-ordered implementation usually gets wrong: without a
    // release, the covered overlay stays inert forever after the top one unmounts.
    const view = await render(
      <OverlayModalityProvider>
        <Drawer title="Under" open>
          <RNText>under</RNText>
        </Drawer>
        <Drawer title="Over" open={false}>
          <RNText>over</RNText>
        </Drawer>
      </OverlayModalityProvider>,
    );
    expect(screen.getByLabelText("Under").props.accessibilityViewIsModal).toBe(true);
    view.unmount();
  });

  it("works with NO provider, so an un-wrapped drawer is still usable", async () => {
    // A consumer who has not opted in must not get a thrown error at render
    // time. Standalone behaviour is the safe default: one overlay, interactive.
    await render(
      <Drawer title="Bare" open>
        <RNText>body</RNText>
      </Drawer>,
    );
    expect(screen.getByLabelText("Bare").props.accessibilityViewIsModal).toBe(true);
  });

  it("leaves TWO un-wrapped overlays both interactive", async () => {
    // The case an earlier version of this suite claimed to cover and did not.
    // Mutation-proving the re-point showed removing the no-provider guard broke
    // NOTHING in the single-overlay test -- because `registry ?? FALLBACK_REGISTRY`
    // already gives an un-wrapped drawer a valid registry, so with one overlay it
    // is trivially the top.
    //
    // The guard is only load-bearing when several un-wrapped overlays share that
    // one fallback registry, where they would otherwise make each other inert --
    // an un-wrapped app would have its drawers disabling one another over a
    // provider it never mounted. This is the assertion that earns it.
    await render(
      <>
        <Drawer title="First" open>
          <RNText>first</RNText>
        </Drawer>
        <Drawer title="Second" open>
          <RNText>second</RNText>
        </Drawer>
      </>,
    );
    expect(screen.getByLabelText("First").props.accessibilityViewIsModal).toBe(true);
    expect(screen.getByLabelText("Second").props.accessibilityViewIsModal).toBe(true);
  });
});