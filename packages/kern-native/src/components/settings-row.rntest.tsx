import { render, screen } from "@testing-library/react-native";
import { Text as RNText } from "react-native";
import { SettingsRow } from "./settings-row";

describe("SettingsRow", () => {
  it("names the row by its label", async () => {
    await render(<SettingsRow label="Notifications" />);
    expect(screen.getByLabelText("Notifications")).toBeTruthy();
    expect(screen.getByText("Notifications")).toBeTruthy();
  });

  it("renders supporting text when given", async () => {
    await render(
      <SettingsRow label="Notifications" supporting="Push and email" />,
    );
    expect(screen.getByText("Push and email")).toBeTruthy();
  });

  it("omits supporting text when absent", async () => {
    await render(<SettingsRow label="Notifications" testID="row" />);
    expect(screen.queryByText("Push and email")).toBeNull();
    expect(screen.getByTestId("row")).toBeTruthy();
  });

  it("renders the trailing control slot", async () => {
    await render(
      <SettingsRow label="Notifications" trailing={<RNText>Toggle</RNText>} />,
    );
    expect(screen.getByText("Toggle")).toBeTruthy();
  });
});
