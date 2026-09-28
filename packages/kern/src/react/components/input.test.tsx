import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Input } from "./input";

describe("Input", () => {
  it("renders with placeholder and accepts typing", async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Email" />);
    const field = screen.getByPlaceholderText("Email");
    await user.type(field, "a@b.co");
    expect(field).toHaveValue("a@b.co");
  });

  it("marks aria-invalid when in error", () => {
    render(<Input aria-label="Email" error />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });
});
