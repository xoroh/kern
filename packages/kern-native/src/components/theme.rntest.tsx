import { render, screen } from "@testing-library/react-native";
import { themes } from "@xoroh/kern-tokens";
import { Text } from "react-native";
import { KernThemeProvider, useKernTheme } from "../theme";

function Probe() {
  const { scheme } = useKernTheme();
  return (
    <Text testID="scheme" style={{ color: scheme.color.onSurface }}>
      hi
    </Text>
  );
}

describe("native useKernTheme", () => {
  it("resolves the overridden scheme", async () => {
    await render(
      <KernThemeProvider mode="dark">
        <Probe />
      </KernThemeProvider>,
    );
    expect(screen.getByTestId("scheme")).toHaveStyle({
      color: themes.m3.color.dark.onSurface,
    });
  });
});
