import { fireEvent, render, screen } from "@testing-library/react-native";
import { ContrastToggle } from "./contrast-toggle";

describe("ContrastToggle", () => {
  it("names where the press goes, not where it is", async () => {
    await render(<ContrastToggle contrast="standard" onToggle={() => {}} />);
    expect(screen.getByLabelText("Use high contrast")).toBeTruthy();
    await screen.unmount();
    await render(<ContrastToggle contrast="high" onToggle={() => {}} />);
    expect(screen.getByLabelText("Use standard contrast")).toBeTruthy();
  });

  it("calls onToggle on press", async () => {
    let calls = 0;
    await render(
      <ContrastToggle contrast="standard" onToggle={() => calls++} />,
    );
    await fireEvent.press(screen.getByLabelText("Use high contrast"));
    expect(calls).toBe(1);
  });

  it("meets the 48dp touch target", async () => {
    await render(
      <ContrastToggle
        contrast="standard"
        onToggle={() => {}}
        testID="toggle"
      />,
    );
    const flat = JSON.stringify(screen.getByTestId("toggle").props.style);
    expect(flat).toContain('"width":48');
    expect(flat).toContain('"height":48');
  });

  it("reports disabled and ignores presses", async () => {
    let calls = 0;
    await render(
      <ContrastToggle
        contrast="standard"
        onToggle={() => calls++}
        disabled
        testID="toggle"
      />,
    );
    expect(
      screen.getByTestId("toggle").props.accessibilityState?.disabled,
    ).toBe(true);
    await fireEvent.press(screen.getByLabelText("Use high contrast"));
    expect(calls).toBe(0);
  });
});
