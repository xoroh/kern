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
    expect(node.props.accessibilityState?.disabled).toBe(true);
    await fireEvent.press(screen.getByLabelText("Switch to light"));
    expect(calls).toBe(0);
  });
});
