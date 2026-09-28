import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { RadioGroup, RadioGroupItem } from "./radio-group";

describe("RadioGroup", () => {
  it("selects one option at a time", async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup aria-label="Plan" defaultValue="free">
        <RadioGroupItem value="free">Free</RadioGroupItem>
        <RadioGroupItem value="pro">Pro</RadioGroupItem>
      </RadioGroup>,
    );
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Free" })).toBeChecked();
    await user.click(screen.getByRole("radio", { name: "Pro" }));
    expect(screen.getByRole("radio", { name: "Pro" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Free" })).not.toBeChecked();
  });
});
