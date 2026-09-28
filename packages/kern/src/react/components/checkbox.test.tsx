import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("toggles on click", async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="Accept" />);
    const box = screen.getByRole("checkbox");
    expect(box).toHaveAttribute("aria-checked", "false");
    await user.click(box);
    expect(box).toHaveAttribute("aria-checked", "true");
  });
});
