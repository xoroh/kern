import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoadingIndicator, LoadingRegion } from "./loading-indicator";

/**
 * P2-1 proof for the loading indicator. The ladder's stated proof for this row
 * is "component test per item"; the component shipped without one.
 *
 * These assert the behaviour the component's own doc comment claims, because a
 * doc comment stating an accessibility contract that nothing checks is the same
 * class of defect as the dead `overlayModality` unit: it reads as enforced.
 */
/**
 * The ring is the inner span: `data-testid` sits on the OUTER `role="status"`
 * region, and the ring carries `aria-hidden` plus the variant classes. Selecting
 * by class name would assert on the very thing under test, so select it by
 * structure instead.
 */
function ring(): HTMLElement {
  const region = screen.getByRole("status");
  const el = region.firstElementChild;
  if (!(el instanceof HTMLElement)) {
    throw new Error("no ring rendered");
  }
  return el;
}

describe("LoadingIndicator", () => {
  // role="status" is the only thing that makes "Loading" announced when the
  // indicator appears. Without it the spinner is a decorative animation.
  it("is a polite live region", () => {
    render(<LoadingIndicator />);
    const el = screen.getByRole("status");
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute("aria-label", "Loading");
  });

  // The inner ring is decorative — the name lives on the status region.
  it("hides the ring from assistive tech", () => {
    render(<LoadingIndicator />);
    expect(ring()).toHaveAttribute("aria-hidden", "true");
  });

  // With visible text there must be exactly ONE name, not two competing ones:
  // aria-label on the region plus the visible label would be announced twice.
  it("moves the name to visible text when showLabel is set", () => {
    render(<LoadingIndicator label="Fetching bookings" showLabel />);
    const region = screen.getByRole("status");
    expect(region).not.toHaveAttribute("aria-label");
    expect(screen.getByText("Fetching bookings")).toBeInTheDocument();
    expect(region).toHaveTextContent("Fetching bookings");
  });

  // Reduced motion must stop the movement but KEEP the element. "We removed the
  // feedback" is a worse outcome than "the feedback does not move".
  it("stops the animation under prefers-reduced-motion but stays rendered", () => {
    render(<LoadingIndicator />);
    expect(ring().className).toContain("motion-reduce:animate-none");
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  // Indeterminate progress has no value to report. A fabricated aria-valuenow —
  // or an animated 0 — is worse than none, and determinate stays in
  // LinearProgress.
  it("carries no aria-valuenow", () => {
    const { container } = render(<LoadingIndicator />);
    expect(container.querySelector("[aria-valuenow]")).toBeNull();
    expect(screen.queryByRole("progressbar")).toBeNull();
  });

  it("applies each size variant", () => {
    for (const [size, expected] of [
      ["sm", "size-4"],
      ["default", "size-6"],
      ["lg", "size-10"],
    ] as const) {
      const { unmount } = render(<LoadingIndicator size={size} />);
      expect(ring().className).toContain(expected);
      unmount();
    }
  });

  it("uses the primary colour role for the ring", () => {
    render(<LoadingIndicator />);
    expect(ring().className).toContain("border-(--md-sys-color-primary)");
  });
});

describe("LoadingRegion", () => {
  // aria-busy has to land on the REGION BEING LOADED, not on the spinner. That
  // is the entire reason this component is split out.
  it("puts aria-busy on the region, not on the spinner", () => {
    const { container } = render(
      <LoadingRegion loading>
        <p>Bookings</p>
      </LoadingRegion>,
    );
    const region = container.querySelector("[data-slot='loading-region']");
    expect(region).toHaveAttribute("aria-busy", "true");
    // The spinner itself is inside, and is not the busy carrier.
    expect(screen.getByRole("status")).not.toHaveAttribute("aria-busy");
  });

  // Content being replaced must not also be flagged busy, or a screen reader
  // announces "busy" over content the user is trying to read.
  it("omits aria-busy when not loading", () => {
    const { container } = render(
      <LoadingRegion loading={false}>
        <p>Bookings</p>
      </LoadingRegion>,
    );
    const region = container.querySelector("[data-slot='loading-region']");
    expect(region).not.toHaveAttribute("aria-busy");
    expect(screen.getByText("Bookings")).toBeInTheDocument();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("swaps content for the indicator while loading", () => {
    render(
      <LoadingRegion loading>
        <p>Bookings</p>
      </LoadingRegion>,
    );
    expect(screen.queryByText("Bookings")).toBeNull();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders a supplied fallback instead of the default indicator", () => {
    render(
      <LoadingRegion loading fallback={<span>Retry in 3s</span>}>
        <p>Bookings</p>
      </LoadingRegion>,
    );
    expect(screen.getByText("Retry in 3s")).toBeInTheDocument();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("passes the label through to the default indicator", () => {
    render(
      <LoadingRegion loading label="Loading bookings">
        <p>Bookings</p>
      </LoadingRegion>,
    );
    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-label",
      "Loading bookings",
    );
  });

  it("is a polite live region so the swap is announced", () => {
    const { container } = render(
      <LoadingRegion loading={false}>
        <p>Bookings</p>
      </LoadingRegion>,
    );
    const region = container.querySelector("[data-slot='loading-region']");
    expect(region).toHaveAttribute("aria-live", "polite");
  });
});