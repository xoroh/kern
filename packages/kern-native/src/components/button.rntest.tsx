import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { Button } from "./button";

describe("native Button render", () => {
  it("fires onPress with the label", async () => {
    const onPress = jest.fn();
    await render(<Button onPress={onPress}>Save</Button>);
    fireEvent.press(screen.getByRole("button", { name: "Save" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("marks disabled state", async () => {
    await render(<Button disabled>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("reports busy and disabled while loading", async () => {
    await render(<Button loading>Save</Button>);
    // No accessible-name filter: RNTL v14 concatenates the nested progressbar
    // label into the button name ("Loading Save"); on-device the button keeps
    // its label with busy state. Assert the label text separately.
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button.props.accessibilityState).toMatchObject({
      disabled: true,
      busy: true,
    });
    expect(screen.getByText("Save")).toBeOnTheScreen();
  });

  it("reports nothing on press-out without press (kernel cancel)", async () => {
    const onPress = jest.fn();
    await render(<Button onPress={onPress}>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    fireEvent(button, "pressIn");
    // A macrotask between the gesture halves: React 19 reports overlapping
    // act() scopes for two back-to-back state-changing gesture events, which
    // corrupts the next async render in this file. The tick drains the scope.
    await new Promise<void>((r) => setTimeout(r, 0));
    fireEvent(button, "pressOut");
    expect(onPress).not.toHaveBeenCalled();
  });

  it("tints a bare icon with the label color via the slot merge", async () => {
    await render(
      <Button icon={<Text testID="kern-icon">*</Text>}>
        Save
      </Button>,
    );
    expect(screen.getByTestId("kern-icon").props.style).toMatchObject({
      color: expect.any(String),
    });
  });

  it("renders the icon beside the label", async () => {
    await render(
      <Button icon={<Text>*</Text>}>
        Save
      </Button>,
    );
    expect(screen.getByText("Save")).toBeOnTheScreen();
    expect(screen.getByText("*")).toBeOnTheScreen();
  });
});
