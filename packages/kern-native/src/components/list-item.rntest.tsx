/**
 * Part A P1 — native ListItem behaviour (tests only).
 *
 * Boundary: the WP1a 10-way list-variant redesign is G1 — these rows assert
 * the CURRENT row contract only (name, role split, selected paint, slots)
 * and add no variant.
 */
import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { ListItem } from "./list-item";
import { Text } from "./text";

function rowStyle(testID = "kern-list-item"): string {
  const style = screen.getByTestId(testID).props.style;
  const resolved =
    typeof style === "function" ? style({ pressed: false }) : style;
  return JSON.stringify(resolved);
}

describe("ListItem (native P1)", () => {
  it("names itself from title and supporting text", async () => {
    await render(<ListItem title="Inbox" supporting="3 new" testID="row" />);
    expect(screen.getByTestId("row").props.accessibilityLabel).toBe(
      "Inbox, 3 new",
    );
  });

  it("lets an explicit label win", async () => {
    await render(
      <ListItem
        title="Inbox"
        supporting="3 new"
        accessibilityLabel="Mailbox"
        testID="row"
      />,
    );
    expect(screen.getByTestId("row").props.accessibilityLabel).toBe("Mailbox");
  });

  it("is static (role none) without onPress", async () => {
    await render(<ListItem title="Inbox" testID="row" />);
    expect(screen.getByTestId("row").props.accessibilityRole).toBe("none");
  });

  it("becomes a button with onPress and fires it", async () => {
    let pressed = 0;
    await render(
      <ListItem
        title="Inbox"
        onPress={() => {
          pressed += 1;
        }}
      />,
    );
    expect(screen.queryByRole("button", { name: "Inbox" })).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByTestId("kern-list-item"));
    });
    expect(pressed).toBe(1);
  });

  it("refuses the press at the platform boundary when disabled", async () => {
    let pressed = 0;
    await render(
      <ListItem
        title="Inbox"
        disabled
        onPress={() => {
          pressed += 1;
        }}
      />,
    );
    // A disabled Pressable has its `onPress` stripped by RNTL — refused by
    // the platform, not by a kern guard.
    expect(screen.getByTestId("kern-list-item").props.onPress).toBeUndefined();
    expect(pressed).toBe(0);
  });

  it("paints the M3 selected row: secondary-container fill, large corners", async () => {
    await render(<ListItem title="Inbox" selected testID="row" />);
    const flat = rowStyle("row");
    expect(flat).toContain("backgroundColor");
    expect(flat).toContain("borderRadius");
  });

  it("leaves an unselected row without a fill", async () => {
    await render(<ListItem title="Inbox" testID="row" />);
    expect(rowStyle("row")).not.toContain("backgroundColor");
  });

  it("renders leading and trailing slots beside the title", async () => {
    await render(
      <ListItem
        title="Inbox"
        leading={<Text>lead</Text>}
        trailing={<Text>trail</Text>}
      />,
    );
    expect(screen.getByText("Inbox")).toBeTruthy();
    expect(screen.getByText("lead")).toBeTruthy();
    expect(screen.getByText("trail")).toBeTruthy();
  });

  it("renders title alone when no supporting text is given", async () => {
    await render(<ListItem title="Inbox" testID="row" />);
    expect(screen.getByText("Inbox")).toBeTruthy();
    expect(screen.getByTestId("row").props.accessibilityLabel).toBe("Inbox");
  });
});
