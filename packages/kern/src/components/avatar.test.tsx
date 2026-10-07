import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "./avatar";

describe("Avatar", () => {
  it("renders the caller fallback when there is no image", () => {
    render(
      <Avatar.Root>
        <Avatar.Fallback>XO</Avatar.Fallback>
      </Avatar.Root>,
    );
    expect(screen.getByText("XO")).toBeTruthy();
  });

  // Configurator edge: sm/default/lg are three fixed frame dimensions — the
  // size knob's painted-verify axis. Each step carries its own geometry.
  it("separates sm, default, and lg frame geometry", () => {
    const { unmount } = render(
      <Avatar.Root size="sm">
        <Avatar.Fallback>XO</Avatar.Fallback>
      </Avatar.Root>,
    );
    const sm = screen.getByText("XO").closest("[data-slot='avatar']");
    expect(sm).toHaveClass("size-8");
    expect(sm).not.toHaveClass("size-10");
    unmount();

    const second = render(
      <Avatar.Root size="default">
        <Avatar.Fallback>XO</Avatar.Fallback>
      </Avatar.Root>,
    );
    const def = screen.getByText("XO").closest("[data-slot='avatar']");
    expect(def).toHaveClass("size-10");
    expect(def).not.toHaveClass("size-8");
    expect(def).not.toHaveClass("size-14");
    second.unmount();

    render(
      <Avatar.Root size="lg">
        <Avatar.Fallback>XO</Avatar.Fallback>
      </Avatar.Root>,
    );
    const lg = screen.getByText("XO").closest("[data-slot='avatar']");
    expect(lg).toHaveClass("size-14");
    expect(lg).not.toHaveClass("size-10");
  });
});
