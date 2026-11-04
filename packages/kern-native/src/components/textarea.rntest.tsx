import { render, screen } from "@testing-library/react-native";
import { defaultScheme } from "../theme";
import { Field } from "./field";
import { Textarea } from "./textarea";

/**
 * WP9 Part D P1: native Textarea behavior pins.
 *
 * A multiline Input: taller minimum, top-aligned text, and the same
 * label/error wiring — plus the same filled/outlined variant depth.
 */
describe("Textarea", () => {
  it("renders multiline with the kern-input testID", async () => {
    await render(<Textarea accessibilityLabel="Notes" />);
    const field = screen.getByLabelText("Notes");
    expect(field).toBeTruthy();
    expect(field).toHaveProp("multiline", true);
    expect(field).toHaveProp("testID", "kern-input");
  });

  it("wires label and error through a Field", async () => {
    await render(
      <Field.Root label="Notes" error="Too long.">
        <Textarea testID="notes" />
      </Field.Root>,
    );
    expect(screen.getByTestId("notes")).toHaveProp(
      "accessibilityLabel",
      "Notes",
    );
    expect(screen.getByTestId("notes")).toHaveProp(
      "accessibilityHint",
      "Too long.",
    );
    expect(screen.getByText("Too long.")).toBeTruthy();
  });

  it("draws outlined by default (P3 depth)", async () => {
    const scheme = defaultScheme();
    await render(<Textarea testID="notes" accessibilityLabel="Notes" />);
    expect(JSON.stringify(screen.getByTestId("notes").props.style)).toContain(
      scheme.color.surface,
    );
  });

  it("draws filled on request (P3 depth)", async () => {
    const scheme = defaultScheme();
    await render(
      <Textarea testID="notes" accessibilityLabel="Notes" variant="filled" />,
    );
    expect(JSON.stringify(screen.getByTestId("notes").props.style)).toContain(
      scheme.color.surfaceContainerHighest,
    );
  });
});

/**
 * WP9 Part D P2: native Textarea a11y pins.
 */
describe("Textarea accessibility", () => {
  it("announces the error as a live alert next to the named field", async () => {
    await render(
      <Field.Root label="Notes" error="Too long.">
        <Textarea testID="notes" />
      </Field.Root>,
    );
    expect(screen.getByText("Too long.").props.accessibilityRole).toBe("alert");
    expect(screen.getByTestId("notes")).toHaveProp(
      "accessibilityLabel",
      "Notes",
    );
  });
});
