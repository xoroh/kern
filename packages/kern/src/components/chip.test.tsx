import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Chip } from "./chip";

describe("Chip", () => {
  it("fires clicks and marks selected filters", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Chip variant="filter" value onClick={onClick}>
        Active
      </Chip>,
    );
    const chip = screen.getByRole("button", { name: "Active" });
    expect(chip).toHaveAttribute("aria-pressed", "true");
    await user.click(chip);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("toggles an uncontrolled filter and reports the next state", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Chip variant="filter" defaultValue={false} onValueChange={onValueChange}>
        Available
      </Chip>,
    );
    const chip = screen.getByRole("button", { name: "Available" });
    await user.click(chip);
    expect(chip).toHaveAttribute("aria-pressed", "true");
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it("does not expose toggle semantics for action chips", () => {
    render(<Chip variant="assist">Search</Chip>);
    expect(screen.getByRole("button", { name: "Search" })).not.toHaveAttribute(
      "aria-pressed",
    );
  });

  it("ignores clicks when disabled", async () => {
    // Edge composition, carried from the move-5 Group lesson: the disabled
    // knob kills the chip, so the test pins the dead toggle.
    // Sensitivity-proven: the same assertions on an enabled chip fail
    // (scratch probe, RED confirmed, deleted).
    const user = userEvent.setup();
    render(
      <Chip variant="filter" disabled>
        Deployments
      </Chip>,
    );
    const chip = screen.getByRole("button", { name: "Deployments" });
    await user.click(chip);
    expect(chip).toHaveAttribute("aria-pressed", "false");
  });

  it("paints a selected filter chip in secondary-container (M3, not primary)", () => {
    render(
      <Chip variant="filter" value>
        Active
      </Chip>,
    );
    expect(screen.getByRole("button", { name: "Active" })).toHaveClass(
      "data-selected:bg-(--sys-color-secondary-container)",
      "data-selected:text-(--sys-color-on-secondary-container)",
    );
  });

  it("renders assist flat with an outline border (M3, not tonal fill)", () => {
    render(<Chip variant="assist">Search</Chip>);
    expect(screen.getByRole("button", { name: "Search" })).toHaveClass(
      "border-(--sys-color-outline)",
    );
    expect(
      screen.getByRole("button", { name: "Search" }).className,
    ).not.toContain("bg-(--sys-color-surface)");
  });
});

describe("Chip elevated (M3)", () => {
  it("raises assist to level1 on the container-low fill", () => {
    render(<Chip elevated>Search</Chip>);
    expect(screen.getByRole("button", { name: "Search" })).toHaveClass(
      "bg-(--sys-color-surface-container-low)",
      "shadow-(--sys-elevation-level1)",
    );
  });

  it("ignores elevated on input and suggestion (no M3 treatment)", () => {
    render(
      <Chip variant="input" elevated>
        file.pdf
      </Chip>,
    );
    expect(
      screen.getByRole("button", { name: "file.pdf" }).className,
    ).not.toContain("shadow-(--sys-elevation-level1)");
  });

  it("wires the container shape to --comp-chip-container-shape with a small-corner fallback", () => {
    render(<Chip>Label</Chip>);
    const chip = screen.getByRole("button", { name: "Label" });
    expect(chip).toHaveClass(
      "rounded-[var(--comp-chip-container-shape,var(--sys-shape-corner-small))]",
    );
    expect(chip.className).not.toContain("rounded-(--sys-shape-corner-small)");
  });
});
