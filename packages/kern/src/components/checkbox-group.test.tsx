import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CheckboxGroup } from "./checkbox-group";

/**
 * WP9 Part D P1: CheckboxGroup behavior pins.
 *
 * The additive contract is the whole reason this component exists apart
 * from RadioGroup: any number may be checked, and activating a checked
 * item unchecks it. Each test names the knob under test.
 */
describe("CheckboxGroup", () => {
  it("checks several items at once (additive, not exclusive)", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup.Root
        aria-label="Toppings"
        defaultValue={["cheese"]}
        onValueChange={onValueChange}
      >
        <CheckboxGroup.Item value="cheese" label="Cheese" />
        <CheckboxGroup.Item value="salami" label="Salami" />
      </CheckboxGroup.Root>,
    );
    expect(screen.getByRole("checkbox", { name: "Cheese" })).toBeChecked();
    await user.click(screen.getByRole("checkbox", { name: "Salami" }));
    expect(screen.getByRole("checkbox", { name: "Salami" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Cheese" })).toBeChecked();
    // Base UI reports (value, eventDetails) — the value list is the contract.
    expect(onValueChange.mock.lastCall?.[0]).toEqual(["cheese", "salami"]);
  });

  it("unchecks a checked item when it is activated again", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup.Root
        aria-label="Toppings"
        defaultValue={["cheese", "salami"]}
        onValueChange={onValueChange}
      >
        <CheckboxGroup.Item value="cheese" label="Cheese" />
        <CheckboxGroup.Item value="salami" label="Salami" />
      </CheckboxGroup.Root>,
    );
    await user.click(screen.getByRole("checkbox", { name: "Cheese" }));
    expect(screen.getByRole("checkbox", { name: "Cheese" })).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Salami" })).toBeChecked();
    expect(onValueChange.mock.lastCall?.[0]).toEqual(["salami"]);
  });

  it("names the group for assistive tech", () => {
    render(
      <CheckboxGroup.Root aria-label="Toppings">
        <CheckboxGroup.Item value="cheese" label="Cheese" />
      </CheckboxGroup.Root>,
    );
    expect(screen.getByRole("group", { name: "Toppings" })).toBeInTheDocument();
  });

  it("disables every item when the group is disabled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup.Root
        aria-label="Toppings"
        disabled
        onValueChange={onValueChange}
      >
        <CheckboxGroup.Item value="cheese" label="Cheese" />
        <CheckboxGroup.Item value="salami" label="Salami" />
      </CheckboxGroup.Root>,
    );
    await user.click(screen.getByRole("checkbox", { name: "Salami" }));
    expect(screen.getByRole("checkbox", { name: "Salami" })).not.toBeChecked();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("honours a per-item disabled override while siblings stay live", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup.Root aria-label="Toppings" onValueChange={onValueChange}>
        <CheckboxGroup.Item value="cheese" label="Cheese" disabled />
        <CheckboxGroup.Item value="salami" label="Salami" />
      </CheckboxGroup.Root>,
    );
    await user.click(screen.getByRole("checkbox", { name: "Cheese" }));
    expect(screen.getByRole("checkbox", { name: "Cheese" })).not.toBeChecked();
    await user.click(screen.getByRole("checkbox", { name: "Salami" }));
    expect(screen.getByRole("checkbox", { name: "Salami" })).toBeChecked();
    expect(onValueChange.mock.lastCall?.[0]).toEqual(["salami"]);
  });

  it("exposes the checkbox-group slot for the shape gate", () => {
    const { container } = render(
      <CheckboxGroup.Root aria-label="Toppings">
        <CheckboxGroup.Item value="cheese" label="Cheese" />
      </CheckboxGroup.Root>,
    );
    expect(
      container.querySelector('[data-slot="checkbox-group"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="checkbox-group-item"]'),
    ).toBeInTheDocument();
  });
});
