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

  it("renders the mixed state with a dash, not a check", () => {
    const { container } = render(
      <Checkbox aria-label="Select all" indeterminate />,
    );
    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "mixed",
    );
    expect(container.querySelector("svg path")?.getAttribute("d")).toBe(
      "M2.5 6h7",
    );
  });

  it("exposes disabled state", () => {
    render(<Checkbox aria-label="Accept" disabled />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("data-disabled");
  });
});
