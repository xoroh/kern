import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { RadioGroup, RadioGroupItem } from "./radio-group";

/**
 * WP9 Part D P1: native RadioGroup behavior pins.
 *
 * The exclusive contract is the mirror of CheckboxGroup's additive one:
 * one selection, activating another replaces it. Each test names the
 * knob under test.
 */
describe("RadioGroup", () => {
  it("starts from defaultValue", async () => {
    await render(
      <RadioGroup accessibilityLabel="Plan" defaultValue="free">
        <RadioGroupItem value="free">Free</RadioGroupItem>
        <RadioGroupItem value="pro">Pro</RadioGroupItem>
      </RadioGroup>,
    );
    expect(
      screen.queryByRole("radio", { name: "Free", checked: true }),
    ).toBeTruthy();
    expect(
      screen.queryByRole("radio", { name: "Pro", checked: true }),
    ).toBeNull();
  });

  it("replaces the selection, never adding a second", async () => {
    const onValueChange = jest.fn();
    await render(
      <RadioGroup
        accessibilityLabel="Plan"
        defaultValue="free"
        onValueChange={onValueChange}
      >
        <RadioGroupItem value="free">Free</RadioGroupItem>
        <RadioGroupItem value="pro">Pro</RadioGroupItem>
      </RadioGroup>,
    );
    await act(async () => {
      fireEvent.press(screen.getByRole("radio", { name: "Pro" }));
    });
    expect(onValueChange).toHaveBeenCalledWith("pro");
    expect(
      screen.queryByRole("radio", { name: "Pro", checked: true }),
    ).toBeTruthy();
    expect(
      screen.queryByRole("radio", { name: "Free", checked: true }),
    ).toBeNull();
  });

  it("reports to a controlled host", async () => {
    const onValueChange = jest.fn();
    await render(
      <RadioGroup
        accessibilityLabel="Plan"
        value="free"
        onValueChange={onValueChange}
      >
        <RadioGroupItem value="free">Free</RadioGroupItem>
        <RadioGroupItem value="pro">Pro</RadioGroupItem>
      </RadioGroup>,
    );
    await act(async () => {
      fireEvent.press(screen.getByRole("radio", { name: "Pro" }));
    });
    expect(onValueChange).toHaveBeenCalledWith("pro");
  });

  it("exposes the radiogroup to assistive tech", async () => {
    await render(
      <RadioGroup accessibilityLabel="Plan">
        <RadioGroupItem value="free">Free</RadioGroupItem>
      </RadioGroup>,
    );
    const group = screen.getByLabelText("Plan");
    expect(group.props.accessibilityRole).toBe("radiogroup");
  });

  it("disables every item when the group is disabled", async () => {
    const onValueChange = jest.fn();
    await render(
      <RadioGroup
        accessibilityLabel="Plan"
        disabled
        onValueChange={onValueChange}
      >
        <RadioGroupItem value="free">Free</RadioGroupItem>
        <RadioGroupItem value="pro">Pro</RadioGroupItem>
      </RadioGroup>,
    );
    expect(
      screen.queryByRole("radio", { name: "Pro", disabled: true }),
    ).toBeTruthy();
    await act(async () => {
      // Items carry no explicit accessibilityLabel (they rely on nested
      // text for their name — see the out-of-scope note in the lane
      // report), so presses target the stable per-value testID.
      fireEvent.press(screen.getByTestId("kern-radio-pro"));
    });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("honours a per-item disabled override", async () => {
    const onValueChange = jest.fn();
    await render(
      <RadioGroup accessibilityLabel="Plan" onValueChange={onValueChange}>
        <RadioGroupItem value="free" disabled>
          Free
        </RadioGroupItem>
        <RadioGroupItem value="pro">Pro</RadioGroupItem>
      </RadioGroup>,
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId("kern-radio-free"));
    });
    expect(onValueChange).not.toHaveBeenCalled();
    await act(async () => {
      fireEvent.press(screen.getByTestId("kern-radio-pro"));
    });
    expect(onValueChange).toHaveBeenCalledWith("pro");
  });

  it("refuses to render an item outside a group", async () => {
    // A missing provider would otherwise be a null-dereference deep in the
    // item. `render` is async here, so the throw surfaces as a rejection.
    await expect(
      render(<RadioGroupItem value="free">Free</RadioGroupItem>),
    ).rejects.toThrow(/must be rendered inside RadioGroup/);
  });
});
