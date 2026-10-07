import { fireEvent, render, screen } from "@testing-library/react-native";
import { TopAppBarToggle } from "./top-app-bar-toggle";

describe("TopAppBarToggle", () => {
  it("names the action and reports expanded state", async () => {
    await render(<TopAppBarToggle open={false} onToggle={() => {}} />);
    const closed = screen.getByLabelText("Open navigation");
    expect(closed.props.accessibilityState?.expanded).toBe(false);
    await screen.unmount();
    await render(<TopAppBarToggle open onToggle={() => {}} />);
    const open = screen.getByLabelText("Close navigation");
    expect(open.props.accessibilityState?.expanded).toBe(true);
  });

  it("calls onToggle on press", async () => {
    let calls = 0;
    await render(<TopAppBarToggle open={false} onToggle={() => calls++} />);
    await fireEvent.press(screen.getByLabelText("Open navigation"));
    expect(calls).toBe(1);
  });

  it("meets the 48dp touch target", async () => {
    await render(
      <TopAppBarToggle open={false} onToggle={() => {}} testID="toggle" />,
    );
    const flat = JSON.stringify(screen.getByTestId("toggle").props.style);
    expect(flat).toContain('"width":48');
    expect(flat).toContain('"height":48');
  });

  it("reports disabled and ignores presses", async () => {
    let calls = 0;
    await render(
      <TopAppBarToggle
        open={false}
        onToggle={() => calls++}
        disabled
        testID="toggle"
      />,
    );
    expect(
      screen.getByTestId("toggle").props.accessibilityState?.disabled,
    ).toBe(true);
    await fireEvent.press(screen.getByLabelText("Open navigation"));
    expect(calls).toBe(0);
  });
});
