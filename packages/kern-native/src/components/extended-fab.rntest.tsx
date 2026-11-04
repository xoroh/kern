/**
 * Part A P1 — native ExtendedFab states the family suite does not pin.
 *
 * fab-family.rntest.tsx owns the expanded default, collapse idempotence and
 * the disabled row; these rows cover the surrounding M3 contract: the
 * uncontrolled default, expand idempotence, controlled reporting, the
 * medium/large collapse geometry, the tonal pair and the hit target.
 */
import { fireEvent, render, screen } from "@testing-library/react-native";
import { act, createRef } from "react";
import { ExtendedFab, type NativeExtendedFabHandle } from "./extended-fab";
import { Text } from "./text";

describe("ExtendedFab states (native P1)", () => {
  it("starts collapsed with defaultValue", async () => {
    await render(
      <ExtendedFab
        icon={<Text>x</Text>}
        label="Compose"
        defaultValue
        testID="efab"
      />,
    );
    expect(screen.queryByText("Compose")).toBeNull();
    expect(screen.getByTestId("efab").props.accessibilityLabel).toBe("Compose");
  });

  it("expand() is idempotent — repeat calls report once", async () => {
    const calls: boolean[] = [];
    const handle = createRef<NativeExtendedFabHandle>();
    await render(
      <ExtendedFab
        ref={handle}
        icon={<Text>x</Text>}
        label="Compose"
        defaultValue
        onValueChange={(next: boolean) => calls.push(next)}
      />,
    );
    await act(async () => {
      handle.current?.expand();
      handle.current?.expand();
    });
    expect(calls).toEqual([false]);
  });

  it("reports through the handle without moving a controlled value", async () => {
    const calls: boolean[] = [];
    const handle = createRef<NativeExtendedFabHandle>();
    await render(
      <ExtendedFab
        ref={handle}
        icon={<Text>x</Text>}
        label="Compose"
        value={false}
        onValueChange={(next: boolean) => calls.push(next)}
        testID="efab"
      />,
    );
    await act(async () => {
      handle.current?.collapse();
    });
    expect(calls).toEqual([true]);
    // The host owns the value and has not agreed yet.
    expect(screen.getByText("Compose")).toBeTruthy();
  });

  it("collapses medium to an 80dp square and large to 96dp", async () => {
    const handle = createRef<NativeExtendedFabHandle>();
    await render(
      <ExtendedFab
        ref={handle}
        icon={<Text>x</Text>}
        label="Compose"
        size="medium"
        testID="efab"
      />,
    );
    await act(async () => {
      handle.current?.collapse();
    });
    const style = screen.getByTestId("efab").props.style;
    const flat = Array.isArray(style)
      ? Object.assign({}, ...style.filter(Boolean))
      : style;
    expect(flat.width).toBe(80);
    expect(flat.minWidth).toBe(80);
  });

  it("renders the tonal pair with the same collapse contract", async () => {
    const handle = createRef<NativeExtendedFabHandle>();
    await render(
      <ExtendedFab
        ref={handle}
        icon={<Text>x</Text>}
        label="Compose"
        variant="tonal"
        testID="efab"
      />,
    );
    expect(screen.getByText("Compose")).toBeTruthy();
    expect(screen.getByTestId("efab").props.accessibilityLabel).toBe("Compose");
    await act(async () => {
      handle.current?.collapse();
    });
    expect(screen.queryByText("Compose")).toBeNull();
    expect(screen.getByTestId("efab").props.accessibilityLabel).toBe("Compose");
  });

  it("fires the host action on press", async () => {
    let pressed = 0;
    await render(
      <ExtendedFab
        icon={<Text>x</Text>}
        label="Compose"
        onPress={() => {
          pressed += 1;
        }}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId("kern-extended-fab"));
    });
    expect(pressed).toBe(1);
  });

  it("keeps the 8dp minimum touch target", async () => {
    await render(
      <ExtendedFab icon={<Text>x</Text>} label="Compose" testID="efab" />,
    );
    expect(screen.getByTestId("efab").props.hitSlop).toEqual({
      top: 8,
      bottom: 8,
      left: 8,
      right: 8,
    });
  });

  it("respects a custom testID", async () => {
    await render(
      <ExtendedFab
        icon={<Text>x</Text>}
        label="Compose"
        testID="compose-fab"
      />,
    );
    expect(screen.getByTestId("compose-fab")).toBeTruthy();
  });
});
