import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { useKernTheme } from "../theme";

function Probe({ mode }: { mode?: "light" | "dark" }) {
  const { scheme } = useKernTheme({ mode });
  return (
    <Text testID="scheme" style={{ color: scheme.onSurface }}>
      hi
    </Text>
  );
}

describe("native useKernTheme", () => {
  it("resolves the overridden scheme", async () => {
    await render(<Probe mode="dark" />);
    expect(screen.getByTestId("scheme")).toHaveStyle({ color: "#ffffff" });
  });
});
