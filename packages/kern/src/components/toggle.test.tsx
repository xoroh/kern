import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Toggle } from "./toggle";
import { ToggleGroup } from "./toggle-group";

describe("Toggle", () => {
  it("renders a two-state button", () => {
    render(<Toggle aria-label="Bold">B</Toggle>);
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("toggles uncontrolled state and reports it", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <Toggle aria-label="Bold" onPressedChange={onPressedChange}>
        B
      </Toggle>,
    );
    await user.click(screen.getByRole("button", { name: "Bold" }));
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(onPressedChange).toHaveBeenCalled();
  });

  it("paints pressed state in secondary-container (M3)", () => {
    render(
      <Toggle aria-label="Bold" defaultPressed>
        B
      </Toggle>,
    );
    expect(screen.getByRole("button", { name: "Bold" }).className).toContain(
      "data-pressed:bg-(--sys-color-secondary-container)",
    );
  });
});

describe("ToggleGroup", () => {
  it("selects one item exclusively and reports it", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ToggleGroup.Root onValueChange={onValueChange}>
        <ToggleGroup.Item value="day">Day</ToggleGroup.Item>
        <ToggleGroup.Item value="week">Week</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Week" }));
    expect(onValueChange).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Week" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Day" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("honours a controlled value", () => {
    render(
      <ToggleGroup.Root value={["week"]}>
        <ToggleGroup.Item value="day">Day</ToggleGroup.Item>
        <ToggleGroup.Item value="week">Week</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    expect(screen.getByRole("button", { name: "Week" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
