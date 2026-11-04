import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoadingButton } from "./loading-button";

/**
 * Part A P1 — LoadingButton states the shared feedback suite does not pin.
 *
 * feedback.test.tsx owns the core "keeps label + blocks interaction" row;
 * these rows cover the surrounding M3 contract: the idle/disabled matrix,
 * the determinate handoff to CircularProgress, the loader-style passthrough,
 * and the footprint guarantee (variant/size classes survive loading).
 */
describe("LoadingButton states (P1)", () => {
  it("is an ordinary button when idle: no loading markers, no spinner", () => {
    render(<LoadingButton>Send</LoadingButton>);
    const button = screen.getByTestId("loading-button");
    expect(button).toHaveTextContent("Send");
    expect(button).not.toHaveAttribute("data-loading");
    expect(button).not.toHaveAttribute("aria-busy");
    expect(button).not.toBeDisabled();
    expect(
      button.querySelector("[data-testid='circular-progress']"),
    ).toBeNull();
  });

  it("disables without loading markers when only disabled is set", () => {
    render(<LoadingButton disabled>Send</LoadingButton>);
    const button = screen.getByTestId("loading-button");
    expect(button).toBeDisabled();
    expect(button).not.toHaveAttribute("data-loading");
    expect(button).not.toHaveAttribute("aria-busy");
    expect(
      button.querySelector("[data-testid='circular-progress']"),
    ).toBeNull();
  });

  it("stays blocked when both loading and disabled are set", () => {
    render(
      <LoadingButton loading disabled>
        Send
      </LoadingButton>,
    );
    const button = screen.getByTestId("loading-button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("data-loading", "");
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("hides the spinner from assistive tech so the name stays the label", () => {
    render(<LoadingButton loading>Send</LoadingButton>);
    const button = screen.getByRole("button", { name: "Send" });
    const spinner = button.querySelector("[data-testid='circular-progress']");
    expect(spinner).not.toBeNull();
    expect(spinner).toHaveAttribute("aria-hidden", "true");
  });

  it("renders the indeterminate ring when no value is given", () => {
    render(<LoadingButton loading>Send</LoadingButton>);
    const spinner = screen
      .getByTestId("loading-button")
      .querySelector("[data-testid='circular-progress']");
    expect(spinner).not.toBeNull();
    // Indeterminate: no value semantics. The default `spinner` style is a
    // decorative ring (no role); the wait is announced by the button's
    // aria-busy, not by the indicator.
    expect(spinner).not.toHaveAttribute("aria-valuenow");
    expect(spinner?.querySelector("svg")).not.toBeNull();
  });

  it("hands a value through as determinate progress", () => {
    render(
      <LoadingButton loading value={0.5}>
        Send
      </LoadingButton>,
    );
    const spinner = screen
      .getByTestId("loading-button")
      .querySelector("[data-testid='circular-progress']");
    expect(spinner).not.toBeNull();
    expect(spinner?.querySelector('[role="progressbar"]')).not.toBeNull();
    expect(spinner?.querySelector('[aria-valuenow="50"]')).not.toBeNull();
  });

  it("passes the loader style through to the indicator", () => {
    render(
      <LoadingButton loading loaderStyle="dots">
        Send
      </LoadingButton>,
    );
    const spinner = screen
      .getByTestId("loading-button")
      .querySelector("[data-testid='circular-progress']");
    expect(
      spinner?.querySelectorAll(".kern-circular-progress-dot").length,
    ).toBeGreaterThan(0);
  });

  it("keeps its variant and size footprint while loading (M3: no chrome resize)", () => {
    const { rerender } = render(
      <LoadingButton variant="outlined" size="sm">
        Send
      </LoadingButton>,
    );
    const idleClass = screen.getByTestId("loading-button").className;
    rerender(
      <LoadingButton loading variant="outlined" size="sm">
        Send
      </LoadingButton>,
    );
    const busyClass = screen.getByTestId("loading-button").className;
    // Same paint, plus the loading marker — the footprint must not change.
    expect(busyClass).toContain("kern-button");
    for (const token of idleClass.split(" ").filter(Boolean)) {
      expect(busyClass).toContain(token);
    }
  });

  it("defaults type to button so it never submits a form by accident", () => {
    render(<LoadingButton>Send</LoadingButton>);
    expect(screen.getByTestId("loading-button")).toHaveAttribute(
      "type",
      "button",
    );
  });
  it("forwards color, shape, block, softDisabled, and iconPosition to Button", () => {
    render(
      <LoadingButton
        color="danger"
        shape="square"
        block
        softDisabled
        iconPosition="end"
        icon={<span data-testid="end-ic" />}
      >
        Delete
      </LoadingButton>,
    );
    const button = screen.getByTestId("loading-button");
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button.className).toContain("w-full");
    expect(screen.getByTestId("end-ic")).toBeInTheDocument();
  });
});
