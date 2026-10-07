import { render, screen } from "@testing-library/react-native";
import { Text as RNText } from "react-native";
import { StatusBar } from "./status-bar";

describe("StatusBar", () => {
  it("announces as a status summary", async () => {
    await render(<StatusBar>Saved</StatusBar>);
    expect(screen.getByLabelText("Status")).toBeTruthy();
    expect(screen.getByText("Saved")).toBeTruthy();
  });

  it("renders leading and trailing slots", async () => {
    await render(
      <StatusBar leading={<RNText>L</RNText>} trailing={<RNText>R</RNText>}>
        Saved
      </StatusBar>,
    );
    expect(screen.getByText("L")).toBeTruthy();
    expect(screen.getByText("R")).toBeTruthy();
    expect(screen.getByText("Saved")).toBeTruthy();
  });

  it("accepts a custom accessible name", async () => {
    await render(
      <StatusBar accessibilityLabel="Sync status">Synced</StatusBar>,
    );
    expect(screen.getByLabelText("Sync status")).toBeTruthy();
  });
});
