import { render, screen } from "@testing-library/react-native";
import { Text as RNText } from "react-native";
import { Split } from "./split";

/**
 * Native `Split` — the N-column layout.
 *
 * The last genuine gap in the composition tranche. Native had `Pane` (a single
 * region) and `ListDetail` (a FIXED 3-slot arrangement: navigation / list /
 * detail), so nothing could split an arbitrary column count.
 *
 * The subtle part, and the reason this is not a `flexDirection: row` wrapper:
 * web draws the column dividers from a 1px GAP over an outline-variant
 * container background, not from borders on the children. Reproducing that needs
 * the same technique natively — a container background plus a small gap — and a
 * naive port that put `borderRightWidth` on each child would look right in a
 * screenshot and still be wrong for a first child (which must have no leading
 * border) and for a two-column case (which must not draw a trailing border).
 */

describe("Split", () => {
  it("renders every column", async () => {
    await render(
      <Split accessibilityLabel="Workspace">
        <RNText>One</RNText>
        <RNText>Two</RNText>
        <RNText>Three</RNText>
      </Split>,
    );
    expect(screen.getByText("One")).toBeTruthy();
    expect(screen.getByText("Two")).toBeTruthy();
    expect(screen.getByText("Three")).toBeTruthy();
  });

  it("names the split region", async () => {
    await render(
      <Split accessibilityLabel="Workspace">
        <RNText>One</RNText>
        <RNText>Two</RNText>
      </Split>,
    );
    // The region is a layout, and a screen-reader user needs to be able to say
    // "the workspace split" before moving into it.
    expect(screen.getByLabelText("Workspace")).toBeTruthy();
  });

  it("gives every column an equal share", async () => {
    await render(
      <Split accessibilityLabel="Workspace" testID="split">
        <RNText>One</RNText>
        <RNText>Two</RNText>
      </Split>,
    );
    // `repeat(n, minmax(0, 1fr))` is `flex: 1` on EACH COLUMN natively. Asserted
    // on the columns, not the container: a column that is not equally weighted
    // is the classic split-layout bug, and it is invisible until one child has
    // longer content. Asserting only the container's style cannot see it at all.
    for (let i = 0; i < 2; i++) {
      const col = JSON.stringify(
        screen.getByTestId(`split-column-${i}`).props.style,
      );
      expect(col).toContain('"flex":1');
      // minWidth 0 is the other half: without it a long child pushes its
      // sibling off screen instead of shrinking.
      expect(col).toContain("minWidth");
    }
    const root = screen.getByTestId("split");
    const flat = JSON.stringify(root.props.style);
    expect(flat).toContain("row");
    // The gap that produces the hairlines, not borders on the children.
    expect(flat).toContain("gap");
  });

  it("draws dividers from the container, not from the children", async () => {
    await render(
      <Split accessibilityLabel="Workspace" testID="split">
        <RNText>One</RNText>
        <RNText>Two</RNText>
      </Split>,
    );
    // Assert the PROPERTY, not the token name: the style resolves to a colour
    // value, so searching for "outlineVariant" was asserting on a variable name
    // that never reaches the rendered style at all.
    const root = screen.getByTestId("split");
    const flat = JSON.stringify(root.props.style);
    // The container carries a background for the gap to show through...
    expect(flat).toContain("backgroundColor");
    // ...and the children carry NO borders. Borders per child would give the
    // first column a leading border and the last a trailing one, at every
    // column count. Asserted on the COLUMNS: a container-only assertion passes
    // whether or not a border was moved onto them, which is exactly the naive
    // port this test exists to catch.
    for (let i = 0; i < 2; i++) {
      const col = JSON.stringify(
        screen.getByTestId(`split-column-${i}`).props.style,
      );
      expect(col).not.toContain("borderRightWidth");
    }
  });

  it("supports three columns", async () => {
    await render(
      <Split columns={3} accessibilityLabel="Workspace">
        <RNText>One</RNText>
        <RNText>Two</RNText>
        <RNText>Three</RNText>
      </Split>,
    );
    expect(screen.getByText("Three")).toBeTruthy();
  });
});
