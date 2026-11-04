import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Fieldset } from "./fieldset";

/**
 * WP9 Part D P1: Fieldset behavior pins.
 *
 * The legend is the group's accessible name, and `disabled` on the root
 * is inherited by every descendant — the two browser behaviors this
 * wrapper must preserve.
 */
describe("Fieldset", () => {
  it("names the group with its legend", () => {
    render(
      <Fieldset.Root>
        <Fieldset.Legend>Billing address</Fieldset.Legend>
        <input aria-label="Street" />
      </Fieldset.Root>,
    );
    expect(
      screen.getByRole("group", { name: "Billing address" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Billing address")).toBeInTheDocument();
  });

  it("disables every descendant control", () => {
    render(
      <Fieldset.Root disabled>
        <Fieldset.Legend>Address</Fieldset.Legend>
        <input aria-label="Street" />
        <input aria-label="City" />
      </Fieldset.Root>,
    );
    expect(screen.getByLabelText("Street")).toBeDisabled();
    expect(screen.getByLabelText("City")).toBeDisabled();
  });

  it("leaves descendants enabled when not disabled", () => {
    render(
      <Fieldset.Root>
        <Fieldset.Legend>Address</Fieldset.Legend>
        <input aria-label="Street" />
      </Fieldset.Root>,
    );
    expect(screen.getByLabelText("Street")).toBeEnabled();
  });

  it("renders the M3 container treatment on surface tokens", () => {
    const { container } = render(
      <Fieldset.Root>
        <Fieldset.Legend>Address</Fieldset.Legend>
      </Fieldset.Root>,
    );
    const root = container.querySelector('[data-slot="fieldset"]');
    expect(root?.className).toContain("border-(--sys-color-outline-variant)");
    expect(root?.className).not.toMatch(/#[0-9a-fA-F]{3,8}/);
    expect(
      container.querySelector('[data-slot="fieldset-legend"]')?.className,
    ).toContain("text-(--sys-color-on-surface)");
  });
});
