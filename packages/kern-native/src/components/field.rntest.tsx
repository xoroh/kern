import { render, screen } from "@testing-library/react-native";
import { Field } from "./field";

/**
 * WP9 Part D P1: native Field behavior pins.
 *
 * The context wiring is the contract: the label names the control, the
 * description hints it, and the error replaces the description while
 * announcing itself as an alert.
 */
describe("Field", () => {
  it("names its control with the label", async () => {
    await render(
      <Field.Root label="Email">
        <Field.Control testID="email" />
      </Field.Root>,
    );
    expect(screen.getByText("Email")).toBeTruthy();
    expect(screen.getByTestId("email")).toHaveProp(
      "accessibilityLabel",
      "Email",
    );
  });

  it("hints the control with its description", async () => {
    await render(
      <Field.Root label="Email" description="Work email address.">
        <Field.Control testID="email" />
      </Field.Root>,
    );
    expect(screen.getByText("Work email address.")).toBeTruthy();
    expect(screen.getByTestId("email")).toHaveProp(
      "accessibilityHint",
      "Work email address.",
    );
  });

  it("replaces the description with the error", async () => {
    await render(
      <Field.Root
        label="Email"
        description="Work email address."
        error="Enter a valid email."
      >
        <Field.Control testID="email" />
      </Field.Root>,
    );
    expect(screen.queryByText("Work email address.")).toBeNull();
    expect(screen.getByText("Enter a valid email.")).toBeTruthy();
    // The visible description is replaced, but the announced hint still
    // carries the description alongside the error (Input joins every hint
    // source). Pinned as-is — the error must at least be announced.
    expect(screen.getByTestId("email").props.accessibilityHint).toContain(
      "Enter a valid email.",
    );
  });

  it("renders the Field parts standalone", async () => {
    await render(
      <>
        <Field.Label>Name</Field.Label>
        <Field.Description>As on your ID.</Field.Description>
        <Field.Error>Required.</Field.Error>
      </>,
    );
    expect(screen.getByText("Name")).toBeTruthy();
    expect(screen.getByText("As on your ID.")).toBeTruthy();
    expect(screen.getByText("Required.")).toBeTruthy();
  });
});

/**
 * WP9 Part D P2: native Field a11y pins (no axe on native — RNTL role,
 * label and live-region assertions are the gate).
 */
describe("Field accessibility", () => {
  it("announces the error as a live alert", async () => {
    await render(
      <Field.Root label="Email" error="Enter a valid email.">
        <Field.Control testID="email" />
      </Field.Root>,
    );
    expect(
      screen.getByText("Enter a valid email.").props.accessibilityRole,
    ).toBe("alert");
  });

  it("leaves the description silent while the label names the field", async () => {
    await render(
      <Field.Root label="Email" description="Work email address.">
        <Field.Control testID="email" />
      </Field.Root>,
    );
    // The description rides the control hint (asserted above); it must not
    // also claim the alert role.
    expect(
      screen.getByText("Work email address.").props.accessibilityRole,
    ).not.toBe("alert");
    expect(screen.getByTestId("email")).toHaveProp(
      "accessibilityLabel",
      "Email",
    );
  });
});
