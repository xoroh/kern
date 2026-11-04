import { render, screen } from "@testing-library/react-native";
import { Label } from "./label";
import { textStyles } from "./text";

/**
 * WP9 Part D P1: native Label behavior pins.
 *
 * A label is text in the label rank — the rank, not a restyle, is the
 * contract, so the suite pins the shared typescale entry.
 */
describe("Label", () => {
  it("renders its text", async () => {
    await render(<Label>Email</Label>);
    expect(screen.getByText("Email")).toBeTruthy();
  });

  it("uses the label typescale rank", async () => {
    await render(<Label testID="name-label">Email</Label>);
    expect(
      JSON.stringify(screen.getByTestId("name-label").props.style),
    ).toContain(String(textStyles("label").fontSize));
  });

  it("forwards accessibility props to the text", async () => {
    await render(
      <Label testID="name-label" accessibilityLabel="Email address">
        Email
      </Label>,
    );
    expect(screen.getByTestId("name-label")).toHaveProp(
      "accessibilityLabel",
      "Email address",
    );
  });
});
