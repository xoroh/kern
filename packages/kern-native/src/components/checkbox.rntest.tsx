import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { Checkbox, CheckboxIndicator, CheckboxRoot } from "./checkbox";

describe("Checkbox on Axis", () => {
  it("renders uncontrolled unchecked by default and toggles on press", async () => {
    const onCheckedChange = jest.fn();
    await render(
      <Checkbox
        label="Accept terms"
        testID="terms"
        onCheckedChange={onCheckedChange}
      />,
    );

    const checkbox = screen.getByRole("checkbox", {
      name: "Accept terms",
      checked: false,
    });
    expect(checkbox).toBeTruthy();

    await act(async () => {
      fireEvent.press(checkbox);
    });

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("renders indeterminate state with aria-checked=mixed", async () => {
    await render(
      <Checkbox label="Select all" indeterminate testID="select-all" />,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Select all" });
    expect(checkbox.props.accessibilityState.checked).toBe("mixed");
    expect(checkbox).toBeTruthy();
    expect(screen.getByText("−")).toBeTruthy();
  });

  it("respects disabled prop", async () => {
    const onCheckedChange = jest.fn();
    await render(
      <Checkbox
        label="Disabled option"
        disabled
        testID="dis"
        onCheckedChange={onCheckedChange}
      />,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Disabled option" });
    expect(checkbox).toBeDisabled();

    await act(async () => {
      fireEvent.press(checkbox);
    });

    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("exposes compound parts Checkbox.Root and Checkbox.Indicator", () => {
    expect(Checkbox.Root).toBeDefined();
    expect(Checkbox.Indicator).toBeDefined();
    expect(CheckboxRoot).toBe(Checkbox.Root);
    expect(CheckboxIndicator).toBe(Checkbox.Indicator);
  });
});
