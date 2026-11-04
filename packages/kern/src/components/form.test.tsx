import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Field } from "./field";
import { Form } from "./form";

/**
 * WP9 Part D P1: Form behavior pins.
 *
 * The submit gate is the contract: an invalid form never reaches
 * `onSubmit`, and the Field.Error for the failing control appears.
 * (`forms.test.tsx` pins the onChange timing variant; this file pins
 * the default submit-time gate.)
 */
describe("Form submit gate", () => {
  it("blocks submit for an empty required field and surfaces its error", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <Form onSubmit={onSubmit}>
        <Field.Root>
          <Field.Label>Full name</Field.Label>
          <Field.Control aria-label="Full name" required />
          <Field.Error match="valueMissing">Please enter your name</Field.Error>
        </Field.Root>
        <button type="submit">Send</button>
      </Form>,
    );
    expect(screen.queryByText("Please enter your name")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Send" }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(
      await screen.findByText("Please enter your name"),
    ).toBeInTheDocument();
  });

  it("submits once the required field is filled", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <Form onSubmit={onSubmit}>
        <Field.Root>
          <Field.Label>Full name</Field.Label>
          <Field.Control aria-label="Full name" required />
          <Field.Error match="valueMissing">Please enter your name</Field.Error>
        </Field.Root>
        <button type="submit">Send</button>
      </Form>,
    );
    await user.type(screen.getByRole("textbox", { name: "Full name" }), "Ada");
    await user.click(screen.getByRole("button", { name: "Send" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("renders the form slot with the M3 grid treatment", () => {
    const { container } = render(
      <Form>
        <input aria-label="Email" />
      </Form>,
    );
    const form = container.querySelector('[data-slot="form"]');
    expect(form?.tagName).toBe("FORM");
    expect(form?.className).toContain("kern-form");
  });
});
