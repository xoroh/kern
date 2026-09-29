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

  it("does not let an explicit false aria-invalid suppress error styling", () => {
    render(<Input aria-label="Email" aria-invalid={false} error />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("textbox")).toHaveClass(
      "border-(--md-sys-color-error)",
    );
  });

  it("forwards its ref to the input element", () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input ref={ref} aria-label="Email" />);
    expect(ref.current).toBe(screen.getByRole("textbox"));
  });
});
