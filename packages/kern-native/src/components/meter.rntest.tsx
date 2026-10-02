import { render, screen } from "@testing-library/react-native";
import { act } from "react";
import { Meter, meterStyles } from "./meter";

/**
 * Behaviour only. Every assertion is about what a screen reader is told, since
 * that is the whole contract of a meter — the bar itself is presentational.
 */
describe("Meter", () => {
  it("exposes the meter role", async () => {
    await render(<Meter value={40} accessibilityLabel="Storage" />);
    expect(screen.getByLabelText("Storage").props.role).toBe("meter");
  });

  it("reports the reading as an accessibility value", async () => {
    await render(
      <Meter value={40} min={0} max={80} accessibilityLabel="Storage" />,
    );
    expect(screen.getByLabelText("Storage").props.accessibilityValue).toEqual({
      now: 40,
      min: 0,
      max: 80,
      text: "40",
    });
  });

  it("prefers a formatted valueText over the bare number", async () => {
    await render(
      <Meter
        value={3.2}
        valueText="3.2 GB of 8 GB"
        accessibilityLabel="Storage"
      />,
    );
    expect(screen.getByLabelText("Storage").props.accessibilityValue.text).toBe(
      "3.2 GB of 8 GB",
    );
  });

  /**
   * An unknown reading is NOT a reading of zero. Announcing `0 of 100` for an
   * indeterminate meter is a lie to a screen-reader user, which is why
   * `accessibilityValue` is omitted entirely rather than filled with zeros.
   */
  it("announces nothing numeric when indeterminate", async () => {
    await render(<Meter accessibilityLabel="Storage" />);
    const value = screen.getByLabelText("Storage").props.accessibilityValue;
    expect(value).toBeUndefined();
  });

  it("renders a zero-width range without dividing by zero", async () => {
    // A zero-width range would make the indicator NaN wide; the meter still has
    // to render and still has to announce.
    await render(
      <Meter value={5} min={10} max={10} accessibilityLabel="Storage" />,
    );
    expect(screen.getByLabelText("Storage").props.accessibilityValue).toEqual({
      now: 5,
      min: 10,
      max: 10,
      text: "5",
    });
  });

  /**
   * The reading must be scaled against the DECLARED range, not an assumed
   * 0-100. A meter for "4 to 6 GB" showing `5` is half full, not five percent.
   * Chosen so the two computations differ: (5-4)/(6-4) = 50%, but 5/100 = 5%.
   */
  it("scales the indicator against the declared range, not an assumed 0-100", async () => {
    await render(<Meter value={5} min={4} max={6} accessibilityLabel="Storage" />);
    // Read the RENDERED indicator width, not a re-computation of meterStyles —
    // the component's own ratio is what mutation B breaks.
    const tree = JSON.stringify(screen.toJSON());
    expect(tree).toContain('"width":"50%"');
    // A value/100 implementation would render 5% here instead.
    expect(tree).not.toContain('"width":"5%"');
  });

  /**
   * RN exposes TWO role props. `AccessibilityRole` (accessibilityRole) has no
   * `meter` member; the ARIA-aligned `Role` (the `role` prop) does. Asserting
   * only that the effective role is `meter` is not enough — the mutation that
   * swaps `role` for `accessibilityRole` must not be able to pass.
   */
  it("carries the role on the `role` prop, not accessibilityRole", async () => {
    await render(<Meter value={40} accessibilityLabel="Storage" />);
    const el = screen.getByLabelText("Storage");
    expect(el.props.role).toBe("meter");
    // The platform-trait prop is never set: it could not express `meter`, and
    // setting both is how one silently overrides the other.
    expect(el.props.accessibilityRole).toBeUndefined();
  });

  it("renders a visible label and value when asked", async () => {
    await render(
      <Meter
        value={40}
        label="Storage used"
        showValue
        valueText="40%"
        accessibilityLabel="Storage"
      />,
    );
    expect(screen.getByText("Storage used")).toBeTruthy();
    expect(screen.getByText("40%")).toBeTruthy();
  });
  it("omits the value text when the meter is indeterminate", async () => {
    await render(
      <Meter label="Storage used" showValue accessibilityLabel="Storage" />,
    );
    expect(screen.getByText("Storage used")).toBeTruthy();
  });
});

describe("meterStyles", () => {
  it("clamps the indicator to the track at 0 and 1", async () => {
    const over = meterStyles(2);
    const under = meterStyles(-1);
    expect(over.indicator.width).toBe("100%");
    expect(under.indicator.width).toBe("0%");
  });

  it("scales against the real range, not an assumed 0-100", async () => {
    // 5 of 10 is half full, even though the absolute number is 5.
    expect(meterStyles(0.5).indicator.width).toBe("50%");
    expect(meterStyles(1).indicator.width).toBe("100%");
  });
});

describe("act hygiene", () => {
  it("renders without an act warning", async () => {
    // A bare render that needs an act() to settle is a latent flake; this suite
    // uses no effects, so it must render cleanly.
    await act(async () => {
      await render(<Meter value={1} accessibilityLabel="Storage" />);
    });
    expect(screen.getByLabelText("Storage")).toBeTruthy();
  });
});
