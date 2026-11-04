import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { defaultScheme } from "../theme";
import {
  BUTTON_SPRING_TOKENS,
  buttonSpringConfig,
  PulseButton,
  pulseButtonStyles,
} from "./pulse-button";

describe("PulseButton (native)", () => {
  it("renders and fires onPress", async () => {
    const onPress = jest.fn();
    await render(<PulseButton onPress={onPress}>Confirm</PulseButton>);
    fireEvent.press(screen.getByRole("button", { name: "Confirm" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("locks borderRadius across resting, pressed, and toggled states", () => {
    const scheme = defaultScheme();
    const rest = pulseButtonStyles("filled", "default", false, scheme, {
      shape: "pill",
    });
    const pressed = pulseButtonStyles("filled", "default", false, scheme, {
      shape: "pill",
      pressed: true,
    });
    const toggled = pulseButtonStyles("filled", "default", false, scheme, {
      shape: "pill",
      toggle: true,
      selected: true,
    });
    expect(pressed.container.borderRadius).toBe(rest.container.borderRadius);
    expect(toggled.container.borderRadius).toBe(rest.container.borderRadius);
  });

  it("reads spring physics from @xoroh/kern-tokens", () => {
    const pressIn = buttonSpringConfig("pressIn");
    const pressOut = buttonSpringConfig("pressOut");
    expect(BUTTON_SPRING_TOKENS.pressIn).toBe("spatial-fast");
    expect(BUTTON_SPRING_TOKENS.pressOut).toBe("spatial-default");
    expect(pressIn.stiffness).toBe(1200);
    expect(pressOut.stiffness).toBeGreaterThan(0);
  });

  it("fires onHaptic on pressIn and pressOut", async () => {
    const onHaptic = jest.fn();
    await render(<PulseButton onHaptic={onHaptic}>Haptic</PulseButton>);
    const btn = screen.getByRole("button", { name: "Haptic" });
    fireEvent(btn, "pressIn");
    await new Promise<void>((r) => setTimeout(r, 0));
    fireEvent(btn, "pressOut");
    expect(onHaptic).toHaveBeenCalledWith("pressIn");
    expect(onHaptic).toHaveBeenCalledWith("pressOut");
  });

  it("supports toggle mode and icon slot tinting", async () => {
    const onPressedChange = jest.fn();
    await render(
      <PulseButton
        toggle
        onPressedChange={onPressedChange}
        icon={<Text testID="pb-icon">*</Text>}
      >
        Favorite
      </PulseButton>,
    );
    expect(screen.getByTestId("pb-icon").props.style).toMatchObject({
      color: expect.any(String),
    });
    fireEvent.press(screen.getByTestId("kern-pulse-button"));
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });
});
