import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { InputOTP, toOTPPositions } from "./input-otp";

/**
 * WP9 Part D P1: native InputOTP behavior pins.
 *
 * The segmented-value contract: one box per position, advance on fill,
 * retreat on empty backspace, paste distribution, completion exactly
 * when every position is filled.
 */
describe("toOTPPositions", () => {
  it("splits the value across positions and pads the rest", () => {
    expect(toOTPPositions("12", 4)).toEqual(["1", "2", "", ""]);
  });

  it("truncates overflow rather than reporting a code never entered", () => {
    expect(toOTPPositions("129876", 4)).toEqual(["1", "2", "9", "8"]);
  });
});

describe("InputOTP", () => {
  it("renders one named box per position inside the named group", async () => {
    await render(<InputOTP length={4} />);
    const group = screen.getByTestId("kern-input-otp");
    expect(group.props.accessibilityRole).toBe("group");
    expect(group.props.accessibilityLabel).toBe("One-time code");
    for (let index = 0; index < 4; index += 1) {
      expect(screen.getByLabelText(`Digit ${index + 1} of 4`)).toBeTruthy();
    }
  });

  it("distributes typed characters and reports the assembled value", async () => {
    const onValueChange = jest.fn();
    await render(<InputOTP length={4} onValueChange={onValueChange} />);
    await act(async () => {
      fireEvent.changeText(screen.getByTestId("kern-input-otp-0"), "12");
    });
    expect(onValueChange).toHaveBeenLastCalledWith("12");
    expect(screen.getByTestId("kern-input-otp-1")).toHaveProp("value", "2");
  });

  it("retreats on backspace in an empty box", async () => {
    const onValueChange = jest.fn();
    await render(
      <InputOTP length={4} defaultValue="1" onValueChange={onValueChange} />,
    );
    await act(async () => {
      fireEvent(screen.getByTestId("kern-input-otp-1"), "onKeyPress", {
        nativeEvent: { key: "Backspace" },
      });
    });
    expect(onValueChange).toHaveBeenLastCalledWith("");
  });

  it("fires onComplete exactly when every position fills", async () => {
    const onComplete = jest.fn();
    await render(<InputOTP length={2} onComplete={onComplete} />);
    await act(async () => {
      fireEvent.changeText(screen.getByTestId("kern-input-otp-0"), "9");
    });
    expect(onComplete).not.toHaveBeenCalled();
    await act(async () => {
      fireEvent.changeText(screen.getByTestId("kern-input-otp-1"), "8");
    });
    expect(onComplete).toHaveBeenCalledWith("98");
  });

  it("disables every position when disabled", async () => {
    await render(<InputOTP length={2} disabled />);
    expect(screen.getByTestId("kern-input-otp-0")).toHaveProp(
      "editable",
      false,
    );
    expect(screen.getByTestId("kern-input-otp-1")).toHaveProp(
      "editable",
      false,
    );
  });
});

/**
 * WP9 Part D P2: native InputOTP a11y pins.
 *
 * Every position names itself INCLUDING the first — the deliberate
 * divergence from web documented in the component header.
 */
describe("InputOTP accessibility", () => {
  it("names the first position, unlike the web side", async () => {
    await render(<InputOTP length={4} />);
    expect(screen.getByLabelText("Digit 1 of 4")).toBeTruthy();
  });

  it("keeps the group itself named for the code as a whole", async () => {
    await render(
      <InputOTP length={4} accessibilityLabel="Verification code" />,
    );
    expect(screen.getByLabelText("Verification code")).toBeTruthy();
  });
});
