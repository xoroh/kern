import { fireEvent, render, screen } from "@testing-library/react-native";
import { ThemeToggle } from "./theme-toggle";

describe("ThemeToggle", () => {
  it("names where the press goes, not where it is", async () => {
    await render(<ThemeToggle mode="dark" onToggle={() => {}} />);
    expect(screen.getByLabelText("Switch to light")).toBeTruthy();
    await screen.unmount();
    await render(<ThemeToggle mode="light" onToggle={() => {}} />);
    expect(screen.getByLabelText("Switch to dark")).toBeTruthy();
  });

  it("calls onToggle on press", async () => {
    let calls = 0;
    await render(<ThemeToggle mode="dark" onToggle={() => calls++} />);
    await fireEvent.press(screen.getByLabelText("Switch to light"));
    expect(calls).toBe(1);
  });

  it("meets the 48dp touch target", async () => {
    await render(
      <ThemeToggle mode="dark" onToggle={() => {}} testID="toggle" />,
    );
    const flat = JSON.stringify(screen.getByTestId("toggle").props.style);
    expect(flat).toContain('"width":48');
    expect(flat).toContain('"height":48');
  });

  it("reports disabled and ignores presses", async () => {
    let calls = 0;
    await render(
      <ThemeToggle
        mode="dark"
        onToggle={() => calls++}
        disabled
        testID="toggle"
      />,
    );
    const node = screen.getByTestId("toggle");
    expect(node.props.testID).toBe("toggle");
    expect(
      screen.queryByRole("button", {
        name: "Switch to light",
        disabled: true,
      }),
    ).toBeTruthy();
    await fireEvent.press(screen.getByLabelText("Switch to light"));
    expect(calls).toBe(0);
  });
});

import { KernThemeProvider, useColorScheme } from "../theme";
import { Text } from "./text";

function SchemeConsumer() {
  const { mode, resolved } = useColorScheme();
  return (
    <>
      <Text testID="mode-val">{mode}</Text>
      <Text testID="resolved-val">{resolved}</Text>
      <ThemeToggle testID="scheme-toggle" />
    </>
  );
}

describe("ThemeToggle + useColorScheme native provider integration", () => {
  it("renders uncontrolled inside KernThemeProvider and toggles theme", async () => {
    await render(
      <KernThemeProvider defaultMode="light">
        <SchemeConsumer />
      </KernThemeProvider>,
    );
    expect(screen.getByTestId("mode-val").props.children).toBe("light");
    expect(screen.getByTestId("resolved-val").props.children).toBe("light");
    expect(screen.getByLabelText("Switch to dark")).toBeTruthy();

    await fireEvent.press(screen.getByTestId("scheme-toggle"));
    expect(screen.getByTestId("mode-val").props.children).toBe("dark");
    expect(screen.getByTestId("resolved-val").props.children).toBe("dark");
    expect(screen.getByLabelText("Switch to light")).toBeTruthy();
  });
});
