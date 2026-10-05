import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Chip } from "./chip";

describe("Chip", () => {
  it("fires clicks and marks selected filters", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Chip variant="filter" selected onClick={onClick}>
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
    const onSelectedChange = vi.fn();
    render(
      <Chip
        variant="filter"
        defaultSelected={false}
        onSelectedChange={onSelectedChange}
      >
        Available
      </Chip>,
    );
    const chip = screen.getByRole("button", { name: "Available" });
    await user.click(chip);
    expect(chip).toHaveAttribute("aria-pressed", "true");
    expect(onSelectedChange).toHaveBeenCalledWith(true);
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
});
