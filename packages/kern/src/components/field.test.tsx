import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Field } from "./field";

describe("Field", () => {
  it("connects label, control, description, and error", () => {
    render(
      <Field.Root invalid>
        <Field.Label>Email</Field.Label>
        <Field.Control type="email" />
        <Field.Description>Use your work email.</Field.Description>
        <Field.Error match={true}>Enter a valid email.</Field.Error>
      </Field.Root>,
    );

    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription(
      "Use your work email. Enter a valid email.",
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email.");
  });
});
