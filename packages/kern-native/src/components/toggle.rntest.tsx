import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { Text } from "react-native";
import { defaultScheme } from "../theme";
import { Toggle, toggleStyles } from "./toggle";
import { ToggleGroup, toggleGroupStyles } from "./toggle-group";

describe("Toggle", () => {
  it("renders a two-state button", async () => {
    await render(
      <Toggle>
        <Text>Bold</Text>
      </Toggle>,
    );
    expect(screen.getByTestId("kern-toggle")).toBeTruthy();
  });

  it("toggles uncontrolled state and reports it", async () => {
    const onPressedChange = jest.fn();
    await render(
      <Toggle defaultPressed={false} onPressedChange={onPressedChange}>
        <Text>Bold</Text>
      </Toggle>,
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId("kern-toggle"));
    });
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it("paints pressed state in the primary fill", async () => {
    const scheme = defaultScheme();
    expect(toggleStyles(true, false, scheme).backgroundColor).toBe(
      scheme.color.primary,
    );
    expect(toggleStyles(false, false, scheme).backgroundColor).toBe(
      "transparent",
    );
  });
});

describe("ToggleGroup", () => {
  const OPTIONS = [
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
  ];

  it("selects one option exclusively and reports it", async () => {
    const onValueChange = jest.fn();
    await render(
      <ToggleGroup options={OPTIONS} onValueChange={onValueChange} />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Week"));
    });
    expect(onValueChange).toHaveBeenCalled();
  });

  it("honours a controlled value", async () => {
    await render(<ToggleGroup options={OPTIONS} value="week" />);
    // RN maps `aria-selected` onto `accessibilityState.selected`.
    expect(
      screen.getByLabelText("Week").props.accessibilityState,
    ).toMatchObject({ selected: true });
    expect(screen.getByLabelText("Day").props.accessibilityState).toMatchObject(
      { selected: false },
    );
  });

  it("renders the tonal pill container", async () => {
    const scheme = defaultScheme();
    expect(toggleGroupStyles(scheme).container.backgroundColor).toBe(
      scheme.color.surfaceTonal,
    );
  });
});
