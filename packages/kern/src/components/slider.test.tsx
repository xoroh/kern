import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SliderRoot, SliderThumb } from "./slider";

describe("Slider sizes (M3 expressive)", () => {
  it("keeps the baseline default (4px track, round thumb)", () => {
    render(
      <SliderRoot data-testid="root" defaultValue={[50]}>
        <SliderThumb data-testid="thumb" />
      </SliderRoot>,
    );
    expect(screen.getByTestId("root")).toHaveClass("h-12");
    expect(screen.getByTestId("thumb")).toHaveClass("size-5");
  });

  it.each([
    ["xs", "h-4"],
    ["sm", "h-6"],
    ["md", "h-10"],
    ["lg", "h-14"],
    ["xl", "h-24"],
  ] as const)("renders the %s track", (size, track) => {
    render(
      <SliderRoot data-testid="root" size={size} defaultValue={[50]}>
        <SliderThumb data-testid="thumb" />
      </SliderRoot>,
    );
    expect(screen.getByTestId("root")).toHaveAttribute("data-size", size);
    expect(
      screen.getByTestId("root").querySelector("[data-slot='slider-track']"),
    ).toHaveClass(track);
  });
});
