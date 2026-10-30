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

  it("stays silent when valid", () => {
    // Edge composition, carried from the move-5 Group lesson: the error's
    // match is wired to the root state, so a valid field shows no alert and
    // the description stands alone. Sensitivity-proven: the same assertions
    // on an invalid root fail (scratch probe, RED confirmed, deleted).
    render(
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Field.Control type="email" />
        <Field.Description>Use your work email.</Field.Description>
        <Field.Error match={false}>Enter a valid email.</Field.Error>
      </Field.Root>,
    );

    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).not.toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Use your work email.");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("surfaces the error as soon as match is true, before root validation", () => {
    // `match` is the visibility switch, not root validity: backup-code steps
    // that pre-render error copy with match={true} show it on first paint —
    // gate `match` on actual validation state, not on copy readiness.
    render(
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Field.Control type="email" />
        <Field.Description>Use your work email.</Field.Description>
        <Field.Error match={true}>Enter a valid email.</Field.Error>
      </Field.Root>,
    );

    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).not.toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email.");
  });

  it("disabled root disables the control without suppressing a matched error", () => {
    // `disabled` reaches the control; it does not clear `match` — a step
    // that disables the field must also reset match, or stale error copy
    // keeps announcing.
    render(
      <Field.Root disabled>
        <Field.Label>Email</Field.Label>
        <Field.Control type="email" />
        <Field.Description>Use your work email.</Field.Description>
        <Field.Error match={true}>Enter a valid email.</Field.Error>
      </Field.Root>,
    );

    expect(screen.getByRole("textbox", { name: "Email" })).toBeDisabled();
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email.");
  });
});
