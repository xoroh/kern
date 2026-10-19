import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Select, selectTriggerVariants } from "./select";

describe("Select trigger variants", () => {
  it("renders the outlined treatment by default", () => {
    render(
      <Select.Root>
        <Select.Trigger aria-label="Plan">
          <Select.Value placeholder="Pick" />
        </Select.Trigger>
      </Select.Root>,
    );
    const trigger = screen.getByRole("combobox", { name: "Plan" });
    expect(trigger).toHaveAttribute("data-variant", "outlined");
    expect(trigger).toHaveClass("border-(--sys-color-outline)");
    expect(trigger.className).not.toContain("surface-container-highest");
  });

  it("renders the filled treatment on request", () => {
    render(
      <Select.Root>
        <Select.Trigger aria-label="Plan" variant="filled">
          <Select.Value placeholder="Pick" />
        </Select.Trigger>
      </Select.Root>,
    );
    const trigger = screen.getByRole("combobox", { name: "Plan" });
    expect(trigger).toHaveAttribute("data-variant", "filled");
    expect(trigger).toHaveClass("bg-(--sys-color-surface-container-highest)");
  });

  it("exposes the trigger variants as cva", () => {
    expect(selectTriggerVariants({ variant: "outlined" })).toContain(
      "border-(--sys-color-outline)",
    );
    expect(selectTriggerVariants({ variant: "filled" })).toContain(
      "bg-(--sys-color-surface-container-highest)",
    );
    expect(selectTriggerVariants({})).toContain("kern-select-trigger");
  });
});

describe("Select.ItemIndicator", () => {
  it("is exported on the compound and marks only the selected option", async () => {
    expect(Select.ItemIndicator).toBeDefined();
    const user = userEvent.setup();
    render(
      <Select.Root
        items={[
          { value: "free", label: "Free" },
          { value: "pro", label: "Pro" },
        ]}
      >
        <Select.Trigger aria-label="Plan">
          <Select.Value placeholder="Pick" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="free">
            <Select.ItemText>Free</Select.ItemText>
            <Select.ItemIndicator>
              <span data-testid="ind-free">✓</span>
            </Select.ItemIndicator>
          </Select.Item>
          <Select.Item value="pro">
            <Select.ItemText>Pro</Select.ItemText>
            <Select.ItemIndicator>
              <span data-testid="ind-pro">✓</span>
            </Select.ItemIndicator>
          </Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    await user.click(screen.getByRole("combobox", { name: "Plan" }));
    await user.click(await screen.findByRole("option", { name: "Pro" }));
    expect(screen.getByTestId("ind-pro")).toBeInTheDocument();
    expect(screen.queryByTestId("ind-free")).toBeNull();
  });
});
