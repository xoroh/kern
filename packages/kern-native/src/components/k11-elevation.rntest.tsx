import { render, screen } from "@testing-library/react-native";
import { PortalHost } from "@xoroh/axis";
import { Text as RNText } from "react-native";
import { snackbarStyles } from "./snackbar";
import { Tooltip } from "./tooltip";
import { Command } from "./web-parity";

/**
 * K11: kern-chosen resting levels for components M3 does not tabulate.
 *
 * `snackbar` = 2, `command` = 3, `tooltip` = 2 (plain). Web ships all three via
 * `--sys-elevation-level{2,3,2}`; native shipped NONE — the elevation-parity
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


/** Axis #73: compound portals paint at a root PortalHost — with no mounted
 * host they warn and render nothing. Every render in this suite goes
 * through the host so open-state assertions see the painted layers. */
function renderWithHost(element: ReactElement) {
  return render(<PortalHost>{element}</PortalHost>);
}

describe("K11 native resting levels", () => {
  it("Snackbar rests at level 3 (6dp) — matching web's elevation-level3", async () => {
    // The single-shot `visible`/`message` Snackbar was removed per ADR-020
    // (one current API: the Axis-backed queue). The resting level now pins
    // the style function the viewport clones onto every queued toast.
    const style = snackbarStyles();
    // 6dp, NOT 3dp. M3's scale is unevenly spaced (0/1/3/6/8/12), so
    // `elevation: 3` is 3dp = LEVEL 2 — which is what this pinned until
    // `check:elevation-parity` mapped dp into level space and found native one
    // level below web's `--sys-elevation-level3`. A dp value read as a level
    // index is the defect this row now guards against.
    expect(style.elevation).toBe(6);
    expect(style.shadowOpacity).toBeDefined();
    expect(style.shadowRadius).toBeDefined();
  });

  it("Tooltip rests at level 2 (3dp)", async () => {
    await renderWithHost(
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
    await renderWithHost(
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
