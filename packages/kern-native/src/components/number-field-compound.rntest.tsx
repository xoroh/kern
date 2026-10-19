import { fireEvent, render, screen } from "@testing-library/react-native";
import { PortalHost } from "@xoroh/axis";
import { act } from "react";
import { NumberField } from "./number-field";

/**
 * NumberField compound adoption (Axis #88, vendored b65322e→637b959):
 * Kern's M3 stepped field builds on the Axis compound
 * (Root/Group/Input/Decrement/Increment) and the number model
 * (`clampNumberValue`, `parseNumberValue`, `formatNumberValue`,
 * `stepNumberValue`). No flat re-implementation, no shim.
 *
 * `ScrubArea` is deliberately NOT composed: its responder claims every
 * touch start (tap included), which would steal presses from the steppers
 * and focus from the input in this row layout. There is no M3 scrub
 * handle in this design; if one arrives, it needs its own region.
 */

function renderField(element: React.ReactElement) {
  return render(<PortalHost>{element}</PortalHost>);
}

describe("number-field compound adoption", () => {
  it("steps by the Axis model and reports committed values", async () => {
    const seen: Array<number | null> = [];
    await renderField(
      <NumberField
        defaultValue={5}
        min={0}
        max={10}
        step={2}
        onValueChange={(v) => seen.push(v)}
      />,
    );
    expect(screen.getByTestId("kern-number-field-input").props.value).toBe("5");
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Increase"));
    });
    expect(seen).toEqual([7]);
    expect(screen.getByTestId("kern-number-field-input").props.value).toBe("7");
  });

  it("stays disabled at the bound and fires nothing there", async () => {
    const seen: Array<number | null> = [];
    await renderField(
      <NumberField
        defaultValue={0}
        min={0}
        max={4}
        onValueChange={(v) => seen.push(v)}
      />,
    );
    const dec = screen.getByLabelText("Decrease");
    expect(dec.props.accessibilityState.disabled).toBe(true);
    await act(async () => {
      fireEvent.press(dec);
    });
    expect(seen).toEqual([]);
  });

  it("a disabled field refuses both steppers", async () => {
    const seen: Array<number | null> = [];
    await renderField(
      <NumberField
        defaultValue={5}
        disabled
        onValueChange={(v) => seen.push(v)}
      />,
    );
    expect(
      screen.getByLabelText("Increase").props.accessibilityState.disabled,
    ).toBe(true);
    expect(
      screen.getByLabelText("Decrease").props.accessibilityState.disabled,
    ).toBe(true);
  });

  it("readOnly is terminal like disabled (Axis #87)", async () => {
    const seen: Array<number | null> = [];
    await renderField(
      <NumberField
        defaultValue={5}
        readOnly
        onValueChange={(v) => seen.push(v)}
      />,
    );
    expect(
      screen.getByLabelText("Increase").props.accessibilityState.disabled,
    ).toBe(true);
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Increase"));
    });
    expect(seen).toEqual([]);
    expect(screen.getByTestId("kern-number-field-input").props.value).toBe("5");
  });

  it("clamps typed input on blur (Base UI order), not while typing", async () => {
    const seen: Array<number | null> = [];
    await renderField(
      <NumberField
        defaultValue={0}
        min={0}
        max={10}
        onValueChange={(v) => seen.push(v)}
      />,
    );
    await act(async () => {
      screen.getByTestId("kern-number-field-input").props.onChangeText("99");
    });
    // Base UI-exact: typing reports the parsed value; the clamp commits
    // on blur (the old Kern order clamped mid-keystroke).
    expect(seen).toEqual([99]);
    await act(async () => {
      screen.getByTestId("kern-number-field-input").props.onBlur();
    });
    expect(seen).toEqual([99, 10]);
  });
});
