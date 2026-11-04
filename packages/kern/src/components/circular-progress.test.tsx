import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CircularProgress } from "./circular-progress";

describe("CircularProgress", () => {
  it("renders a determinate arc with real aria-valuenow", () => {
    render(<CircularProgress value={0.4} label="Upload" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(bar).toHaveAttribute("aria-label", "Upload");
  });

  it("renders the indeterminate spinner as a status with a name", () => {
    render(<CircularProgress label="Loading" />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Loading");
  });

  it("renders the dots style for motion-sensitive waits", () => {
    render(<CircularProgress loaderStyle="dots" label="Loading" />);
    expect(document.querySelector(".kern-circular-progress-dot")).toBeTruthy();
  });

  it("renders the bar style (waveform-adjacent equalizer)", () => {
    render(<CircularProgress loaderStyle="bar" label="Loading" />);
    expect(document.querySelector(".kern-circular-progress-bar")).toBeTruthy();
  });

  it("throws for reserved-but-unrendered styles (fail loud, never silent)", () => {
    expect(() =>
      render(<CircularProgress loaderStyle="orbit" label="Loading" />),
    ).toThrow(/reserved and not rendered/);
  });

  it("throws for unknown tenant variants (never the wrong brand)", () => {
    expect(() =>
      render(<CircularProgress tenantId="ghost" label="Loading" />),
    ).toThrow(/Unknown feedback variant/);
  });
});
