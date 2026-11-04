import { render, screen } from "@testing-library/react-native";
import { defaultScheme } from "../theme";
import { dividerStyles, Separator } from "./separator";

/**
 * WP9 Part D P1: native Separator behavior pins.
 *
 * One physical pixel on the outline-variant role, full-bleed by default,
 * 16dp insets on request — the M3 divider contract in both orientations.
 */
describe("dividerStyles", () => {
  it("draws a full-bleed 1px horizontal line by default", () => {
    const scheme = defaultScheme();
    const style = dividerStyles("horizontal", scheme);
    expect(style.height).toBe(1);
    expect(style.width).toBe("100%");
    expect(style.backgroundColor).toBe(scheme.color.outlineVariant);
  });

  it("draws a stretching 1px vertical line", () => {
    const style = dividerStyles("vertical");
    expect(style.width).toBe(1);
    expect(style.alignSelf).toBe("stretch");
  });

  it("insets 16dp on the leading edge, both edges for middle", () => {
    expect(dividerStyles("horizontal", undefined, "start").marginLeft).toBe(16);
    const middle = dividerStyles("horizontal", undefined, "middle");
    expect(middle.marginLeft).toBe(16);
    expect(middle.marginRight).toBe(16);
    const vertical = dividerStyles("vertical", undefined, "middle");
    expect(vertical.marginTop).toBe(16);
    expect(vertical.marginBottom).toBe(16);
  });
});

describe("Separator", () => {
  it("renders horizontal by default", async () => {
    await render(<Separator testID="rule" />);
    const rule = screen.getByTestId("rule");
    expect(rule.props.style).toBeTruthy();
    expect(JSON.stringify(rule.props.style)).toContain('"height":1');
  });

  it("renders the vertical orientation", async () => {
    await render(<Separator testID="rule" orientation="vertical" />);
    expect(JSON.stringify(screen.getByTestId("rule").props.style)).toContain(
      '"width":1',
    );
  });

  it("stays silent on the accessibility tree", async () => {
    await render(<Separator testID="rule" />);
    expect(screen.getByTestId("rule").props.accessibilityRole).toBe("none");
  });
});
