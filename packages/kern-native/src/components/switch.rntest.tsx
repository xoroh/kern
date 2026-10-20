import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { Switch, SwitchRoot, SwitchThumb } from "./switch";

describe("Switch on Axis", () => {
  it("renders unchecked by default and toggles on press", async () => {
    const onCheckedChange = jest.fn();
    await render(
      <Switch testID="my-switch" onCheckedChange={onCheckedChange} />,
    );

    const toggle = screen.getByTestId("my-switch");
    expect(toggle.props.accessibilityRole).toBe("switch");
    expect(
      toggle.props.accessibilityState?.checked ?? toggle.props["aria-checked"],
    ).toBe(false);

    await act(async () => {
      fireEvent.press(toggle);
    });

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("respects checked prop (controlled)", async () => {
    const onCheckedChange = jest.fn();
    await render(
      <Switch
        checked={true}
        testID="controlled-switch"
        onCheckedChange={onCheckedChange}
      />,
    );

    const toggle = screen.getByTestId("controlled-switch");
    expect(
      toggle.props.accessibilityState?.checked ?? toggle.props["aria-checked"],
    ).toBe(true);

    await act(async () => {
      fireEvent.press(toggle);
    });

    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it("respects disabled prop", async () => {
    const onCheckedChange = jest.fn();
    await render(
      <Switch disabled testID="dis-switch" onCheckedChange={onCheckedChange} />,
    );

    const toggle = screen.getByTestId("dis-switch");
    expect(toggle).toBeDisabled();

    await act(async () => {
      fireEvent.press(toggle);
    });

    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("exposes compound parts Switch.Root and Switch.Thumb", () => {
    expect(Switch.Root).toBeDefined();
    expect(Switch.Thumb).toBeDefined();
    expect(SwitchRoot).toBe(Switch.Root);
    expect(SwitchThumb).toBe(Switch.Thumb);
  });
});
