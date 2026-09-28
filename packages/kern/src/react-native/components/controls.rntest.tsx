import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { Checkbox } from "./checkbox";
import { Switch } from "./switch";

describe("native Checkbox render", () => {
  it("toggles on press", async () => {
    await render(<Checkbox label="Accept" />);
    expect(screen.getByRole("checkbox", { name: "Accept" })).not.toBeChecked();
    await act(async () => {
      fireEvent.press(screen.getByRole("checkbox", { name: "Accept" }));
    });
    expect(screen.getByRole("checkbox", { name: "Accept" })).toBeChecked();
  });
});

describe("native Switch render", () => {
  it("toggles on press", async () => {
    await render(<Switch testID="power" />);
    expect(screen.getByTestId("power")).not.toBeChecked();
    await act(async () => {
      fireEvent.press(screen.getByTestId("power"));
    });
    expect(screen.getByTestId("power")).toBeChecked();
  });
});
