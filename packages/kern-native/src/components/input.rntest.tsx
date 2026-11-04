import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { defaultScheme } from "../theme";
import { Input, inputStyles } from "./input";

/**
 * WP9 Part D P1: native Input behavior pins.
 *
 * RN exposes no invalid state on text inputs, so the error contract is
 * the announced hint plus the error border — asserted here, not inferred.
 */
describe("Input", () => {
  it("renders with the kern-input testID and accepts text", async () => {
    const onChangeText = jest.fn();
    await render(
      <Input accessibilityLabel="Email" onChangeText={onChangeText} />,
    );
    const field = screen.getByLabelText("Email");
    expect(field).toBeTruthy();
    await act(async () => {
      fireEvent.changeText(field, "a@b.co");
    });
    expect(onChangeText).toHaveBeenCalledWith("a@b.co");
  });

  it("announces the error through the focused hint", async () => {
    await render(
      <Input
        testID="email"
        accessibilityLabel="Email"
        error
        errorMessage="Too short."
      />,
    );
    expect(screen.getByTestId("email")).toHaveProp(
      "accessibilityHint",
      "Too short.",
    );
  });

  it("marks itself disabled when not editable", async () => {
    await render(
      <Input testID="email" accessibilityLabel="Email" editable={false} />,
    );
    expect(screen.getByTestId("email")).toHaveProp("aria-disabled", true);
  });

  it("prefers an explicit label over the field label", async () => {
    await render(
      <Input
        testID="email"
        accessibilityLabel="Work email"
        placeholder="Email"
      />,
    );
    expect(screen.getByTestId("email")).toHaveProp(
      "accessibilityLabel",
      "Work email",
    );
  });
});

/**
 * WP9 Part D P3: filled/outlined variant depth (pure pins — both
 * branches already exist, no API change).
 */
describe("Input variants", () => {
  it("draws outlined with the full 1px outline on surface", () => {
    const scheme = defaultScheme();
    const outlined = inputStyles(false, false, scheme, false, "outlined");
    expect(outlined.borderWidth).toBe(1);
    expect(outlined.backgroundColor).toBe(scheme.color.surface);
    expect(outlined.borderColor).toBe(scheme.color.outline);
    expect(outlined.borderBottomLeftRadius).toBe(outlined.borderTopLeftRadius);
  });

  it("draws filled with the tonal fill and bottom-only indicator", () => {
    const scheme = defaultScheme();
    const filled = inputStyles(false, false, scheme, false, "filled");
    expect(filled.borderWidth).toBe(0);
    expect(filled.borderBottomWidth).toBe(1);
    expect(filled.backgroundColor).toBe(scheme.color.surfaceContainerHighest);
    expect(filled.borderBottomLeftRadius).toBe(0);
    expect(filled.borderBottomRightRadius).toBe(0);
  });

  it("paints error on the border of both branches", () => {
    const scheme = defaultScheme();
    expect(
      inputStyles(true, false, scheme, false, "outlined").borderColor,
    ).toBe(scheme.color.error);
    expect(inputStyles(true, false, scheme, false, "filled").borderColor).toBe(
      scheme.color.error,
    );
  });

  it("renders the filled branch end to end", async () => {
    const scheme = defaultScheme();
    await render(
      <Input testID="filled" accessibilityLabel="Name" variant="filled" />,
    );
    expect(JSON.stringify(screen.getByTestId("filled").props.style)).toContain(
      scheme.color.surfaceContainerHighest,
    );
  });
});
