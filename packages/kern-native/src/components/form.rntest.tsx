import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { Field } from "./field";
import { Form } from "./form";

describe("Form native component", () => {
  it("renders form container and children", async () => {
    await render(
      <Form testID="test-form">
        <Text>Form Content</Text>
      </Form>,
    );
    expect(screen.getByTestId("test-form")).toBeTruthy();
    expect(screen.getByText("Form Content")).toBeTruthy();
  });

  it("applies the 16dp field gap", async () => {
    await render(
      <Form testID="test-form">
        <Text>Form Content</Text>
      </Form>,
    );
    expect(
      JSON.stringify(screen.getByTestId("test-form").props.style),
    ).toContain('"gap":16');
  });
});

/**
 * WP9 Part D P2: native Form a11y pins (no axe on native — the composed
 * Field wiring is the gate: named controls, hinted errors, live alerts).
 */
describe("Form accessibility", () => {
  it("keeps composed fields named with announced errors", async () => {
    await render(
      <Form testID="test-form">
        <Field.Root label="Email" error="Enter a valid email.">
          <Field.Control testID="email" />
        </Field.Root>
      </Form>,
    );
    expect(screen.getByTestId("email")).toHaveProp(
      "accessibilityLabel",
      "Email",
    );
    expect(screen.getByTestId("email")).toHaveProp(
      "accessibilityHint",
      "Enter a valid email.",
    );
    expect(
      screen.getByText("Enter a valid email.").props.accessibilityRole,
    ).toBe("alert");
  });
});
