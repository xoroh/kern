import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Fab } from "./fab";

describe("Fab", () => {
  it("renders children with the default 56dp geometry", () => {
    render(
      <Fab data-testid="fab" aria-label="Create">
        +
      </Fab>,
    );
    const fab = screen.getByTestId("fab");
    expect(fab).toHaveTextContent("+");
    expect(fab).toHaveClass("h-14");
  });

  // T2 edge: medium stretches to 96dp while default holds 56dp — the size
  // knob's painted-verify axis. Failing-first: asserts the geometries the
  // configurator teaches.
  it("separates medium geometry from the default", () => {
    const { unmount } = render(
      <Fab size="medium" data-testid="fab" aria-label="Create">
        +
      </Fab>,
    );
    expect(screen.getByTestId("fab")).toHaveClass("h-24");
    unmount();
    render(
      <Fab data-testid="fab2" aria-label="Create">
        +
      </Fab>,
    );
    expect(screen.getByTestId("fab2")).toHaveClass("h-14");
    expect(screen.getByTestId("fab2")).not.toHaveClass("h-24");
  });

  it("resolves icon-only content to the square icon geometry (M3 FAB, not pill)", () => {
    render(
      <Fab data-testid="fab" aria-label="Create">
        <svg />
      </Fab>,
    );
    const fab = screen.getByTestId("fab");
    expect(fab).toHaveClass("h-14", "w-14", "px-0");
  });

  it("lets an explicit size win over icon-only content", () => {
    render(
      <Fab data-testid="fab" aria-label="Create" size="medium">
        <svg />
      </Fab>,
    );
    expect(screen.getByTestId("fab")).toHaveClass("h-24");
  });

  it("keeps labelled content on the pill geometry", () => {
    render(
      <Fab data-testid="fab">
        <svg />
        Create
      </Fab>,
    );
    const fab = screen.getByTestId("fab");
    expect(fab).toHaveClass("px-5");
    expect(fab).not.toHaveClass("w-14");
  });

  it("renders the expressive medium at 80dp", () => {
    render(
      <Fab data-testid="fab" aria-label="Create" size="md">
        <svg />
      </Fab>,
    );
    expect(screen.getByTestId("fab")).toHaveClass("h-20", "w-20");
  });

  it.each([
    ["primary-fill", "bg-(--sys-color-primary)", "text-(--sys-color-on-primary)"],
    ["secondary-fill", "bg-(--sys-color-secondary)", "text-(--sys-color-on-secondary)"],
    ["tertiary-fill", "bg-(--sys-color-tertiary)", "text-(--sys-color-on-tertiary)"],
  ] as const)("paints the expressive %s fill with its on-color", (color, bg, ink) => {
    render(
      <Fab data-testid="fab" aria-label="Create" color={color}>
        <svg />
      </Fab>,
    );
    expect(screen.getByTestId("fab")).toHaveClass(bg, ink);
  });

  it("warns when disabled — M3 hides the FAB instead", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <Fab data-testid="fab" aria-label="Create" disabled>
        <svg />
      </Fab>,
    );
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
