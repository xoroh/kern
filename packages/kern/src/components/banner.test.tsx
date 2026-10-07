import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Banner } from "./banner";

describe("Banner", () => {
  it("renders children with the default info treatment", () => {
    render(<Banner data-testid="banner">Saved.</Banner>);
    const banner = screen.getByTestId("banner");
    expect(banner).toHaveTextContent("Saved.");
    expect(banner).toHaveAttribute("data-variant", "info");
  });

  // T2 edge: error carries the error container while info holds its own —
  // the intent knob's painted-verify axis. Failing-first: asserts the
  // treatments the configurator teaches.
  it("separates error container treatment from info", () => {
    const { unmount } = render(
      <Banner variant="error" data-testid="banner">
        Failed.
      </Banner>,
    );
    expect(screen.getByTestId("banner")).toHaveClass(
      "bg-(--md-sys-color-error-container)",
    );
    unmount();
    render(<Banner data-testid="banner2">Saved.</Banner>);
    expect(screen.getByTestId("banner2")).not.toHaveClass(
      "bg-(--md-sys-color-error-container)",
    );
  });
});
