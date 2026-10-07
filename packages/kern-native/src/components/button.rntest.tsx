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
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toBeDisabled();
    expect(button.props.accessibilityState).toMatchObject({
      disabled: true,
      busy: true,
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
