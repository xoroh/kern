import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { defaultScheme } from "../theme";
import { Slider, sliderStyles } from "./slider";
import { DISABLED_CONTENT_OPACITY } from "./state-layer";

/**
 * WP9 Part D P1: native Slider behavior pins.
 *
 * The adjustable contract: the value is announced, increment/decrement
 * actions step it, and the commit clamps to min/max on the step grid.
 */
describe("sliderStyles", () => {
  it("clamps the ratio into the track", () => {
    expect(sliderStyles(2, false).fill.width).toBe("100%");
    expect(sliderStyles(-1, false).fill.width).toBe("0%");
  });

  it("dims the track when disabled", () => {
    expect(sliderStyles(0.5, true).track.opacity).toBe(
      DISABLED_CONTENT_OPACITY,
    );
    expect(sliderStyles(0.5, false).track.opacity).toBe(1);
  });

  it("paints the fill and thumb in the primary role", () => {
    const scheme = defaultScheme();
    const styles = sliderStyles(0.5, false, scheme);
    expect(styles.fill.backgroundColor).toBe(scheme.color.primary);
    expect(styles.thumb.backgroundColor).toBe(scheme.color.primary);
  });
});

describe("Slider", () => {
  it("announces its value and range", async () => {
    await render(<Slider defaultValue={30} accessibilityLabel="Volume" />);
    const slider = screen.getByLabelText("Volume");
    expect(slider.props.accessibilityRole).toBe("adjustable");
    expect(slider.props.accessibilityValue).toMatchObject({
      now: 30,
      min: 0,
      max: 100,
    });
  });

  it("steps with accessibility actions", async () => {
    const onValueChange = jest.fn();
    await render(
      <Slider
        defaultValue={30}
        accessibilityLabel="Volume"
        onValueChange={onValueChange}
      />,
    );
    const slider = screen.getByLabelText("Volume");
    await act(async () => {
      fireEvent(slider, "onAccessibilityAction", {
        nativeEvent: { actionName: "increment" },
      });
    });
    expect(onValueChange).toHaveBeenCalledWith(31);
    await act(async () => {
      fireEvent(screen.getByLabelText("Volume"), "onAccessibilityAction", {
        nativeEvent: { actionName: "decrement" },
      });
    });
    expect(onValueChange).toHaveBeenLastCalledWith(30);
  });

  it("clamps at the bounds instead of wrapping", async () => {
    // Stepping past the bound reports nothing — the value is already at
    // the bound, so there is no change to report and no wrap-around.
    const onValueChange = jest.fn();
    await render(
      <Slider
        defaultValue={100}
        min={0}
        max={100}
        accessibilityLabel="Volume"
        onValueChange={onValueChange}
      />,
    );
    await act(async () => {
      fireEvent(screen.getByLabelText("Volume"), "onAccessibilityAction", {
        nativeEvent: { actionName: "increment" },
      });
    });
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Volume").props.accessibilityValue.now).toBe(
      100,
    );
  });

  it("ignores actions when disabled", async () => {
    const onValueChange = jest.fn();
    await render(
      <Slider
        defaultValue={30}
        disabled
        accessibilityLabel="Volume"
        onValueChange={onValueChange}
      />,
    );
    expect(screen.getByLabelText("Volume")).toBeDisabled();
    await act(async () => {
      fireEvent(screen.getByLabelText("Volume"), "onAccessibilityAction", {
        nativeEvent: { actionName: "increment" },
      });
    });
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
