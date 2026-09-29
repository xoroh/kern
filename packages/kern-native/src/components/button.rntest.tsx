import { fireEvent, render, screen } from "@testing-library/react-native";
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
});
