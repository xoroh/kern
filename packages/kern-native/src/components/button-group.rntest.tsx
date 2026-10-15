/**
 * Native behaviour suite for ButtonGroup — the expressive
 * standard/connected join axis.
 */
import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { ButtonGroup } from "./button-group";

describe("ButtonGroup (native)", () => {
  it("connects by default — one joined row", async () => {
    await render(
      <ButtonGroup testID="group">
        <Text>A</Text>
      </ButtonGroup>,
    );
    const group = screen.getByTestId("group");
    expect(group.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ flexDirection: "row", gap: 0 }),
      ]),
    );
  });

  it("spaces as individuals in the standard variant", async () => {
    await render(
      <ButtonGroup testID="group" variant="standard">
        <Text>A</Text>
      </ButtonGroup>,
    );
    const group = screen.getByTestId("group");
    expect(group.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ flexDirection: "row", gap: 8 }),
      ]),
    );
  });

  it("lays out vertically", async () => {
    await render(
      <ButtonGroup testID="group" orientation="vertical">
        <Text>A</Text>
      </ButtonGroup>,
    );
    const group = screen.getByTestId("group");
    expect(group.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ flexDirection: "column", gap: 0 }),
      ]),
    );
  });

  it("announces nothing itself", async () => {
    await render(
      <ButtonGroup testID="group">
        <Text>A</Text>
      </ButtonGroup>,
    );
    expect(screen.getByTestId("group").props.accessibilityRole).toBe("none");
  });
});
