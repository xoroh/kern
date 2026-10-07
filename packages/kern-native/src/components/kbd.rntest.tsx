import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text as RNText } from "react-native";
import { Kbd } from "./kbd";

describe("Kbd", () => {
  it("renders the shortcut text", async () => {
    await render(<Kbd>Ctrl</Kbd>);
    expect(screen.getByText("Ctrl")).toBeTruthy();
  });

  it("is announced as static text, never a control", async () => {
    await render(<Kbd testID="kbd">Ctrl</Kbd>);
    const node = screen.getByTestId("kbd");
    expect(node.props.accessibilityRole).toBe("text");
    expect(node.props.accessibilityLabel ?? "Ctrl").toBe("Ctrl");
  });

  it("keeps the hint on one line in a monospace face", async () => {
    await render(<Kbd testID="kbd">Ctrl</Kbd>);
    const node = screen.getByTestId("kbd");
    expect(node.props.numberOfLines).toBe(1);
    expect(JSON.stringify(node.props.style)).toContain("monospace");
  });

  it("composes chords with a space between parts", async () => {
    await render(
      <>
        <RNText>
          <Kbd>Ctrl</Kbd> <Kbd>K</Kbd>
        </RNText>
      </>,
    );
    expect(screen.getByText("Ctrl")).toBeTruthy();
    expect(screen.getByText("K")).toBeTruthy();
  });
});
