import { render, screen } from "@testing-library/react-native";
import { Text as RNText } from "react-native";
import { Snackbar } from "./snackbar";
import { Tooltip } from "./tooltip";
import { Command } from "./web-parity";

/**
 * K11: kern-chosen resting levels for components M3 does not tabulate.
 *
 * `snackbar` = 2, `command` = 3, `tooltip` = 2 (plain). Web ships all three via
 * `--md-sys-elevation-level{2,3,2}`; native shipped NONE — the elevation-parity
 * gate reported "native none" on all three, RULED both-renderers.
 *
 * Android reads `elevation` as dp (NOT a level: M3's scale is 0/1/3/6/8/12, so
 * level 2 = 3dp and level 3 = 6dp). iOS reads the shadow quartet. Both halves
 * are asserted, because one without the other is half a platform.
 */
function styleOf(testID: string) {
  const el = screen.getByTestId(testID);
  const style = el.props.style;
  return Array.isArray(style)
    ? Object.assign({}, ...style.filter(Boolean))
    : style;
}

describe("K11 native resting levels", () => {
  it("Snackbar rests at level 2 (3dp)", async () => {
    await render(<Snackbar visible message="Saved" testID="sb" />);
    const style = styleOf("sb");
    expect(style.elevation).toBe(3);
    expect(style.shadowOpacity).toBeDefined();
    expect(style.shadowRadius).toBeDefined();
  });

  it("Tooltip rests at level 2 (3dp)", async () => {
    await render(
      <Tooltip label="Help" hint="More info" testID="tt" open>
        <RNText>trigger</RNText>
      </Tooltip>,
    );
    // The surface, not the trigger, carries the elevation: the trigger is an
    // inline anchor and elevating it would lift surrounding content.
    const style = styleOf("kern-tooltip-content");
    expect(style.elevation).toBe(3);
    expect(style.shadowOpacity).toBeDefined();
    expect(style.shadowRadius).toBeDefined();
  });

  it("Command rests at level 3 (6dp) — the Dialog variant", async () => {
    // K-01 K11 + the settled command ruling: Command IS the Dialog variant, so
    // level 3 follows the surface's role (interrupting modal), not its plumbing.
    await render(
      <Command
        open
        title="Actions"
        actions={[{ key: "a", label: "Alpha" }]}
        testID="cmd"
      />,
    );
    const style = styleOf("cmd");
    expect(style.elevation).toBe(6);
    expect(style.shadowOpacity).toBeDefined();
    expect(style.shadowRadius).toBeDefined();
  });
});
