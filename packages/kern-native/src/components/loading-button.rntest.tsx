/**
 * Part A P1 — native LoadingButton states.
 *
 * Mirrors the web P1 contract: idle/disabled matrix, determinate handoff to
 * CircularProgress, loader-style passthrough. M3 on both renderers: the
 * button keeps its label and footprint while loading and blocks interaction.
 */
import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { LoadingButton } from "./loading-button";

describe("LoadingButton (native P1)", () => {
  it("is an ordinary button when idle: label, no spinner, not busy", async () => {
    await render(<LoadingButton>Send</LoadingButton>);
    expect(screen.getByText("Send")).toBeTruthy();
    expect(screen.queryByTestId("kern-circular-progress")).toBeNull();
    // Not busy: no element announces itself as a busy button.
    expect(screen.queryByRole("button", { busy: true })).toBeNull();
  });

  it("shows the indicator, announces busy and blocks the press while loading", async () => {
    let pressed = 0;
    await render(
      <LoadingButton
        loading
        onPress={() => {
          pressed += 1;
        }}
      >
        Send
      </LoadingButton>,
    );
    // Label survives loading — the wait never eats the action's name.
    expect(screen.getByText("Send")).toBeTruthy();
    expect(screen.getByTestId("kern-circular-progress")).toBeTruthy();
    // RNTL reads `aria-busy` through the role query (the raw prop is not
    // preserved on the host element here).
    expect(screen.queryByRole("button", { busy: true })).toBeTruthy();
    // Blocked at the platform boundary: a disabled Pressable has its
    // `onPress` stripped by RNTL.
    expect(
      screen.getByTestId("kern-loading-button").props.onPress,
    ).toBeUndefined();
    expect(pressed).toBe(0);
  });

  it("blocks without a spinner when only disabled is set", async () => {
    await render(<LoadingButton disabled>Send</LoadingButton>);
    const button = screen.getByTestId("kern-loading-button");
    expect(button.props.onPress).toBeUndefined();
    expect(screen.queryByTestId("kern-circular-progress")).toBeNull();
    expect(screen.queryByRole("button", { busy: true })).toBeNull();
  });

  it("renders the indeterminate ring when no value is given", async () => {
    await render(<LoadingButton loading>Send</LoadingButton>);
    expect(screen.getByTestId("kern-circular-progress-ring")).toBeTruthy();
    expect(screen.queryByTestId("kern-circular-progress-arc")).toBeNull();
  });

  it("hands a value through as the determinate arc", async () => {
    await render(
      <LoadingButton loading value={0.5}>
        Send
      </LoadingButton>,
    );
    // The arc renders one half per side — assert presence, not singularity.
    expect(
      screen.getAllByTestId("kern-circular-progress-arc").length,
    ).toBeGreaterThan(0);
  });

  it("passes the loader style through to the indicator", async () => {
    await render(
      <LoadingButton loading loaderStyle="dots">
        Send
      </LoadingButton>,
    );
    // One node per dot — assert presence, not singularity.
    expect(
      screen.getAllByTestId("kern-circular-progress-dot").length,
    ).toBeGreaterThan(0);
  });

  it("fires the host action when idle", async () => {
    let pressed = 0;
    await render(
      <LoadingButton
        onPress={() => {
          pressed += 1;
        }}
      >
        Send
      </LoadingButton>,
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId("kern-loading-button"));
    });
    expect(pressed).toBe(1);
  });

  it("renders the tonal treatment", async () => {
    await render(<LoadingButton variant="tonal">Send</LoadingButton>);
    expect(screen.getByText("Send")).toBeTruthy();
    expect(screen.getByTestId("kern-loading-button").props.role).toBe("button");
  });
});
