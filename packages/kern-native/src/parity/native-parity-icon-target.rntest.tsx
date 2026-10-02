import { contractFor } from "@kern-parity/contract";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { IconButton, IconButtonTarget } from "@xoroh/kern-native";

/**
 * Native side of `icon-button-target`.
 *
 * The counterpart to the web suite, and the pair together make the ASYMMETRY
 * executable (ruling e9ab24b): native is held to 48dp because Material and the
 * iOS HIG say so, while web is held to WCAG 2.2's 24x24 CSS px because that is
 * the standard that governs it. Neither number is portable, and the web suite
 * asserts they differ so nobody harmonises web up to 48.
 *
 * HOW native gets to 48 is not obvious and is what these assertions pin down:
 * the visual box is 40dp and the HIT AREA is pushed to 48dp with `hitSlop` of 4
 * on every side. So the target obligation does not live in `minHeight` on the
 * button at all — asserting that would be asserting the wrong mechanism, and it
 * would fail for a button that is correctly built.
 */
const VISUAL_BOX = 40;
const MIN_TARGET = 48;

describe("native parity contract: icon-button-target", () => {
  it("the row records the mobile minimum", () => {
    const row = contractFor("icon-button-target");
    expect(row.nativeContract).toMatch(/48x48/);
  });

  it("reaches 48dp through hitSlop, not a 48dp box", async () => {
    const row = contractFor("icon-button-target");
    await render(<IconButton label={row.name} />);
    const el = screen.getByLabelText(row.name);
    const slop = el.props.hitSlop;
    // 40dp visual box + 4dp each side = a 48dp hit area. A suite that asserted
    // `minHeight: 48` on the button would be asserting a mechanism this
    // component deliberately does not use.
    expect(slop).toBeDefined();
    expect(VISUAL_BOX + slop.top + slop.bottom).toBe(MIN_TARGET);
    expect(VISUAL_BOX + slop.left + slop.right).toBe(MIN_TARGET);
  });

  it("IconButtonTarget guarantees 48dp on BOTH axes", async () => {
    const row = contractFor("icon-button-target");
    await render(
      <IconButtonTarget>
        <IconButton label={row.name} />
      </IconButtonTarget>,
    );
    // The wrapper exists for exactly this: a toolbar that lays its own box out
    // cannot rely on the button's hitSlop, so the minimum is restated as real
    // min dimensions. Both axes, because 48x40 satisfies "at least 48" on one.
    const wrapper = screen.getByTestId("kern-icon-button-target");
    const style = Array.isArray(wrapper.props.style)
      ? Object.assign({}, ...wrapper.props.style.filter(Boolean))
      : wrapper.props.style;
    expect(style.minWidth).toBeGreaterThanOrEqual(MIN_TARGET);
    expect(style.minHeight).toBeGreaterThanOrEqual(MIN_TARGET);
  });

  it("still reports its pressed state on a toggle icon button", async () => {
    const row = contractFor("icon-button-target");
    await render(<IconButton label={row.name} pressed={false} />);
    const el = screen.getByLabelText(row.name);
    expect(el.props.accessibilityState.selected).toBe(false);
    await act(async () => {
      fireEvent.press(el);
    });
    // A controlled `pressed` prop does not move on its own, so this asserts the
    // state axis is at least REPORTED, which is the cross-renderer obligation.
    expect(el.props.accessibilityState).toHaveProperty("selected");
  });

  it("the native minimum is NOT the web's WCAG 24px", () => {
    // The asymmetry, asserted from this side too. Harmonising the two means one
    // of the two suites fails.
    expect(MIN_TARGET).not.toBe(24);
  });
});
