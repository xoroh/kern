import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FieldMessage, fieldMessageVariants } from "./field-message";

/**
 * WP9 Part D P1: FieldMessage behavior pins.
 *
 * Two roles, one component: `description` is quiet helper text,
 * `error` is an assertive alert. The role split is the contract.
 */
describe("FieldMessage", () => {
  it("renders helper text with no alert role by default", () => {
    render(<FieldMessage>Work email address.</FieldMessage>);
    const message = screen.getByText("Work email address.");
    expect(message).toBeInTheDocument();
    expect(message).not.toHaveAttribute("role");
    expect(message.className).toContain(
      "text-(--sys-color-on-surface-variant)",
    );
  });

  it("announces errors as an alert in the error role", () => {
    render(<FieldMessage variant="error">Enter a valid email.</FieldMessage>);
    const message = screen.getByRole("alert");
    expect(message).toHaveTextContent("Enter a valid email.");
    expect(message.className).toContain("text-(--sys-color-error)");
  });

  it("exposes the field-message slot and variant branches", () => {
    const { container } = render(<FieldMessage>Helper</FieldMessage>);
    expect(
      container.querySelector('[data-slot="field-message"]'),
    ).toBeInTheDocument();
    expect(fieldMessageVariants({ variant: "description" })).toContain(
      "text-(--sys-color-on-surface-variant)",
    );
    expect(fieldMessageVariants({ variant: "error" })).toContain(
      "text-(--sys-color-error)",
    );
  });
});
