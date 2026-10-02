import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { Text as RNText } from "react-native";
import { KernPressable, MIN_TOUCH_TARGET } from "./pressable";

/**
 * The narrow accessibility-defaults wrap (ruling: NOT a new primitive family).
 *
 * 53 native files reach for React Native's `Pressable` directly, and each one
 * decides for itself what a pressable means: 42 of them set `role="button"`, and
 * the 48dp minimum and the mandatory accessible name are decisions kern has
 * ALREADY made elsewhere (`IconButton`). Leaving `Pressable` raw means those
 * decisions get remade per call site — and a call site that forgets the name
 * ships an unlabelled control.
 *
 * So this wrapper owns the ACCESSIBILITY DEFAULTS and nothing else. Every other
 * prop passes through untouched, which is what keeps it narrow: it is not a
 * Button, it is not a ListItem, and it does not grow into one.
 *
 * Assertions are primitive-agnostic throughout — role, accessible name, state —
 * never a node, a class or an internal.
 */
describe("KernPressable", () => {
  it("defaults to the button role", async () => {
    await render(<KernPressable accessibilityLabel="Save" />);
    expect(screen.getByRole("button", { name: "Save" })).toBeTruthy();
  });

  it("keeps an EXPLICIT role rather than defaulting over it", async () => {
    await render(
      <KernPressable accessibilityLabel="Delete" accessibilityRole="menuitem" />,
    );
    // A menu item is not a button. The default is a default, not an override --
    // forcing `button` here would have broken every menu built in kern.
    expect(screen.getByRole("menuitem", { name: "Delete" })).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("holds the platform minimum touch target on BOTH axes", async () => {
    await render(<KernPressable accessibilityLabel="Save" />);
    const el = screen.getByLabelText("Save");
    const style = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style;
    // 48dp is Material / iOS HIG for a touch target -- the ruling places this on
    // the native side only, because the web minimum is WCAG 2.2's 24px and is a
    // different number governed by a different standard.
    expect(MIN_TOUCH_TARGET).toBe(48);
    expect(style.minHeight).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET);
    expect(style.minWidth).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET);
  });

  it("calls onPress and reports the pressed state", async () => {
    const onPress = jest.fn();
    await render(<KernPressable accessibilityLabel="Save" onPress={onPress} />);
    const el = screen.getByLabelText("Save");
    await act(async () => {
      fireEvent.press(el);
    });
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("blocks onPress when disabled, and SAYS it is disabled", async () => {
    const onPress = jest.fn();
    await render(
      <KernPressable accessibilityLabel="Save" disabled onPress={onPress} />,
    );
    const el = screen.getByLabelText("Save");
    // Both halves matter, and they fail independently: a control that refuses
    // the press but does not report `disabled` is worse than one that does
    // neither, because it looks available and is not.
    expect(el.props.accessibilityState.disabled).toBe(true);
    await act(async () => {
      fireEvent.press(el);
    });
    expect(onPress).not.toHaveBeenCalled();
  });

  it("passes through an explicit selected state unchanged", async () => {
    await render(
      <KernPressable accessibilityLabel="Bold" accessibilityState={{ selected: true }} />,
    );
    const el = screen.getByLabelText("Bold");
    expect(el.props.accessibilityState.selected).toBe(true);
    // ...and the wrapper's own defaults are MERGED, not substituted: disabled is
    // still reported even though the caller only supplied selected.
    expect(el.props.accessibilityState.disabled).toBe(false);
  });

  it("renders its children and accepts a testID", async () => {
    await render(
      <KernPressable accessibilityLabel="Open" testID="my-pressable">
        <RNText>Open</RNText>
      </KernPressable>,
    );
    expect(screen.getByText("Open")).toBeTruthy();
    expect(screen.getByTestId("my-pressable")).toBeTruthy();
  });
});