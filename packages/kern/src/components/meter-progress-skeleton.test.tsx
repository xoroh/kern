import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Meter } from "./meter";
import { Progress } from "./progress";
import { Skeleton } from "./skeleton";

describe("Meter", () => {
  it("exposes the meter role with min/max/now", () => {
    render(
      <Meter.Root value={40} min={0} max={80} aria-label="Storage">
        <Meter.Label>Storage</Meter.Label>
      </Meter.Root>,
    );
    const meter = screen.getByRole("meter");
    expect(meter).toHaveAttribute("aria-valuenow", "40");
    expect(meter).toHaveAttribute("aria-valuemin", "0");
    expect(meter).toHaveAttribute("aria-valuemax", "80");
  });

  it("renders the secondary fill (a scalar, not task progress)", () => {
    render(<Meter.Root value={50} aria-label="Battery" />);
    expect(
      document.querySelector(".kern-meter-indicator")?.className,
    ).toContain("bg-(--sys-color-secondary)");
  });
});

describe("Progress", () => {
  it("exposes the progressbar role with the value", () => {
    render(<Progress.Root value={30} aria-label="Upload" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "30",
    );
  });

  it("renders the primary fill on the tonal track", () => {
    render(<Progress.Root value={30} aria-label="Upload" />);
    expect(
      document.querySelector(".kern-progress-indicator")?.className,
    ).toContain("bg-(--sys-color-primary)");
  });
});

describe("Skeleton", () => {
  it("is hidden from assistive tech (decorative placeholder)", () => {
    render(<Skeleton data-testid="sk" />);
    expect(screen.getByTestId("sk")).toHaveAttribute("aria-hidden", "true");
  });

  it("pulses on the tonal fill with reduced-motion opt-out", () => {
    render(<Skeleton data-testid="sk" />);
    const sk = screen.getByTestId("sk");
    expect(sk.className).toContain("animate-pulse");
    expect(sk.className).toContain("bg-(--sys-color-surface-tonal)");
    expect(sk.className).toContain("motion-reduce:animate-none");
  });
});
