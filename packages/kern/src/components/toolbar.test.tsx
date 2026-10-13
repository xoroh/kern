import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Toolbar } from "./toolbar";

describe("Toolbar (M3 floating)", () => {
  it("rests at the 64dp M3 height", () => {
    render(
      <Toolbar.Root data-testid="bar">
        <Toolbar.Button>Bold</Toolbar.Button>
      </Toolbar.Root>,
    );
    expect(screen.getByTestId("bar")).toHaveClass("min-h-16");
  });

  it("paints the vibrant style on the primary container", () => {
    render(
      <Toolbar.Root data-testid="bar" variant="vibrant">
        <Toolbar.Button>Bold</Toolbar.Button>
      </Toolbar.Root>,
    );
    const bar = screen.getByTestId("bar");
    expect(bar).toHaveAttribute("data-variant", "vibrant");
    expect(bar.className).toContain("bg-(--md-sys-color-primary-container)");
  });

  it("lays out vertically on request", () => {
    render(
      <Toolbar.Root data-testid="bar" orientation="vertical">
        <Toolbar.Button>Bold</Toolbar.Button>
      </Toolbar.Root>,
    );
    const bar = screen.getByTestId("bar");
    expect(bar).toHaveAttribute("data-orientation", "vertical");
    expect(bar.className).toContain("flex-col");
  });

  it("docks square and full-bleed with 16dp side padding", () => {
    render(
      <Toolbar.Root data-testid="bar" layout="docked">
        <Toolbar.Button>Bold</Toolbar.Button>
      </Toolbar.Root>,
    );
    const bar = screen.getByTestId("bar");
    expect(bar).toHaveAttribute("data-layout", "docked");
    expect(bar.className).toContain("rounded-none");
    expect(bar.className).toContain("px-4");
  });
});
