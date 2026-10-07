import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Loader } from "./loader";

describe("Loader", () => {
  it("renders with the default 24px geometry and a status role", () => {
    render(<Loader data-testid="loader" label="Loading results" />);
    const loader = screen.getByTestId("loader");
    expect(loader).toHaveClass("size-6");
    expect(loader).toHaveAttribute("role", "status");
    expect(loader).toHaveAttribute("aria-label", "Loading results");
  });

  // T2 edge: lg spans 40px while default holds 24px — the size knob's
  // painted-verify axis. Failing-first: asserts the geometries the
  // configurator teaches.
  it("separates lg geometry from the default", () => {
    const { unmount } = render(
      <Loader size="lg" data-testid="loader" label="Loading results" />,
    );
    expect(screen.getByTestId("loader")).toHaveClass("size-10");
    unmount();
    render(<Loader data-testid="loader2" label="Loading results" />);
    expect(screen.getByTestId("loader2")).toHaveClass("size-6");
    expect(screen.getByTestId("loader2")).not.toHaveClass("size-10");
  });
});
