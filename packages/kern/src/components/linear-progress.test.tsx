import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LinearProgress } from "./linear-progress";

describe("LinearProgress stop (M3)", () => {
  it("renders the 4dp stop circle at the track end", () => {
    render(<LinearProgress value={0.4} label="Sync" stop />);
    const stop = document.querySelector(
      "[data-slot='linear-progress-stop']",
    ) as HTMLElement | null;
    expect(stop).toBeTruthy();
    expect(stop?.className).toContain("size-1");
    expect(stop?.className).toContain("bg-(--md-sys-color-primary)");
  });

  it("renders no stop by default", () => {
    render(<LinearProgress value={0.4} label="Sync" />);
    expect(
      document.querySelector("[data-slot='linear-progress-stop']"),
    ).toBeNull();
  });

  it("renders the wavy indicator at the platform wave geometry", () => {
    render(<LinearProgress value={0.5} label="Sync" wavy />);
    const wave = document.querySelector(
      "[data-slot='linear-progress-wave']",
    ) as SVGSVGElement | null;
    expect(wave).toBeTruthy();
    expect(wave?.getAttribute("viewBox")).toBe("0 0 40 12");
    const path = wave?.querySelector("path");
    expect(path?.getAttribute("stroke-width")).toBe("4");
  });
});
